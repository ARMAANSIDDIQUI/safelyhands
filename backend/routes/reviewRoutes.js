const express = require('express');
const router = express.Router();
const { createReview, getWorkerReviews, getBookingReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/worker/:workerId', getWorkerReviews);
router.get('/booking/:bookingId', protect, getBookingReview);

module.exports = router;
