const Review = require('../models/review');
const User = require('../models/User');

// Leave a review
const submitReview = async (req, res) => {
  try {
    const { business_name, registration_number, rating, comment } = req.body;
    const reviewer_id = req.user.id;

    if (!business_name || !registration_number || !rating) {
      return res.status(400).json({
        message: 'Business name, registration number and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      reviewer_id,
      business_name,
      registration_number: registration_number.toUpperCase(),
      rating,
      comment
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews for a business
const getBusinessReviews = async (req, res) => {
  try {
    const { registration_number } = req.params;

    const reviews = await Review.findAll({
      where: { registration_number: registration_number.toUpperCase() },
      include: [{
        model: User,
        attributes: ['name']
      }],
      order: [['createdAt', 'DESC']]
    });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.status(200).json({
      message: 'Reviews retrieved successfully',
      count: reviews.length,
      average_rating: avgRating,
      reviews
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitReview, getBusinessReviews };