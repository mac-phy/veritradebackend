const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authenticate = require('../middleware/authenticate');
const { extractTextFromImage } = require('../services/ocrService');

// POST /api/documents/scan
router.post('/scan', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    console.log('📄 Processing document:', imagePath);

    // Extract text using OCR
    const extracted = await extractTextFromImage(imagePath);

    res.json({
      message: 'Document scanned successfully',
      data: extracted
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      message: 'Failed to scan document',
      error: error.message 
    });
  }
});

module.exports = router;
