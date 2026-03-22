const express = require('express');
const router = express.Router();
const { submitReview, getBusinessReviews } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/submit', authenticate, submitReview);
router.get('/:registration_number', getBusinessReviews);

module.exports = router;