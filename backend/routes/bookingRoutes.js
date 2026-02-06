const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookings,
    updateBookingStatus,
    getBookingById,
    assignWorker,
    getWorkerBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getBookings);

router.route('/mybookings').get(protect, getMyBookings);

router.route('/worker/tasks').get(protect, getWorkerBookings); // New route

router.route('/:id')
    .get(protect, getBookingById)
    .put(protect, admin, updateBookingStatus);

router.route('/:id/assign').put(protect, admin, assignWorker);

module.exports = router;
