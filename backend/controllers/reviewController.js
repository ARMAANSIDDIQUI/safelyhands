const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { bookingId, workerId, rating, comment } = req.body;

        // Verify booking exists and belongs to user
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review this booking' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already submitted for this booking' });
        }

        // Create review
        const review = await Review.create({
            booking: bookingId,
            user: req.user._id,
            worker: workerId,
            service: booking.serviceType,
            rating,
            comment
        });

        // Update worker's average rating
        const workerReviews = await Review.find({ worker: workerId });
        const avgRating = workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length;
        await Worker.findByIdAndUpdate(workerId, { rating: avgRating });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reviews for a worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ worker: req.params.workerId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching worker reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get review for a booking
// @route   GET /api/reviews/booking/:bookingId
// @access  Private
const getBookingReview = async (req, res) => {
    try {
        const review = await Review.findOne({ booking: req.params.bookingId })
            .populate('worker', 'name profession');

        res.json(review);
    } catch (error) {
        console.error('Error fetching booking review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createReview,
    getWorkerReviews,
    getBookingReview
};
