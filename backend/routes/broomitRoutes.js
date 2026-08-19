const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getAdminBookings,
    assignWorker,
    updateStatus
} = require('../controllers/broomitController');
const { protect, admin } = require('../middleware/authMiddleware');

// User endpoints
router.route('/bookings')
    .post(protect, createBooking);

router.route('/my-bookings')
    .get(protect, getMyBookings);

// Admin management endpoints
router.route('/admin/bookings')
    .get(protect, admin, getAdminBookings);

router.route('/admin/bookings/:id/assign-worker')
    .patch(protect, admin, assignWorker);

router.route('/admin/bookings/:id/status')
    .patch(protect, admin, updateStatus);

module.exports = router;
