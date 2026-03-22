const VerificationRequest = require('../models/VerificationRequest');
const Supplier = require('../models/Supplier');
const { Op } = require('sequelize');

// Submit verification request
const submitVerification = async (req, res) => {
  try {
    const { business_name, registration_number } = req.body;
    const buyer_id = req.user.id;

    if (!business_name || !registration_number) {
      return res.status(400).json({
        message: 'Business name and registration number are required'
      });
    }

    // Check dataset for matching business
    const match = await Supplier.findOne({
      where: {
        business_name: { [Op.iLike]: business_name.trim() },
        registration_number: registration_number.trim().toUpperCase()
      }
    });

    let auto_status = 'pending';
    let auto_notes = null;

    if (match) {
      if (match.verification_status === 'VERIFIED') {
        auto_status = 'verified';
        auto_notes = `✅ VERIFIED — Safe to trade with this business.\n\nReason: ${match.verification_reason}.\n\nDetails:\n• Business Type: ${match.business_type}\n• Industry: ${match.industry_category}\n• State: ${match.state}\n• Registered: ${match.registration_date || 'On record'}\n\n💡 Recommendation: This business has passed our verification checks. You can proceed to trade with confidence.`;
      } else if (match.verification_status === 'REJECTED') {
        auto_status = 'rejected';
        auto_notes = `❌ REJECTED — Do not trade with this business.\n\nReason: ${match.verification_reason}.\n\nDetails:\n• Business Type: ${match.business_type}\n• Industry: ${match.industry_category}\n• State: ${match.state}\n\n⚠️ Recommendation: This business failed verification. We strongly advise against trading with them until they provide valid documentation.`;
      } else if (match.verification_status === 'FLAGGED') {
        auto_status = 'flagged';
        auto_notes = `⚠️ FLAGGED — Trade with caution.\n\nReason: ${match.verification_reason}.\n\nDetails:\n• Business Type: ${match.business_type}\n• Industry: ${match.industry_category}\n• State: ${match.state}\n• Registered: ${match.registration_date || 'Recent'}\n\n💡 Recommendation: This business is recently registered. Consider requesting additional documentation before trading.`;
      }
    } else {
      auto_status = 'pending';
      auto_notes = `🔍 PENDING — Awaiting manual review.\n\nThis business was not found in our registry of 3,500 verified businesses.\n\n⚠️ Recommendation: Do not trade until our admin team completes the manual review. You will be notified once a decision is made.`;
    }

    const verification = await VerificationRequest.create({
      buyer_id,
      business_name,
      registration_number,
      status: auto_status,
      admin_notes: auto_notes
    });

    res.status(201).json({
      message: 'Verification request submitted successfully',
      verification: {
        id: verification.id,
        business_name: verification.business_name,
        registration_number: verification.registration_number,
        status: verification.status,
        admin_notes: verification.admin_notes,
        created_at: verification.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all verification requests for logged-in buyer
const getMyVerifications = async (req, res) => {
  try {
    const buyer_id = req.user.id;

    const verifications = await VerificationRequest.findAll({
      where: { buyer_id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: 'Verification requests retrieved successfully',
      count: verifications.length,
      verifications
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single verification request by ID
const getVerificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const verification = await VerificationRequest.findByPk(id);

    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    res.status(200).json({
      message: 'Verification request retrieved successfully',
      verification
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel verification request
const cancelVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer_id = req.user.id;

    const verification = await VerificationRequest.findOne({
      where: { id, buyer_id }
    });

    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (!['draft', 'pending'].includes(verification.status)) {
      return res.status(400).json({
        message: 'Cannot cancel verification in current status'
      });
    }

    verification.status = 'cancelled';
    await verification.save();

    res.status(200).json({
      message: 'Verification request cancelled successfully',
      verification
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitVerification,
  getMyVerifications,
  getVerificationById,
  cancelVerification
};