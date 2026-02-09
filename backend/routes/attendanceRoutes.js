const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getBookingAttendance,
    getWorkerAttendance,
    getValidDates,
    getMyBookingsWithAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/booking/:bookingId', protect, getBookingAttendance);
router.get('/worker', protect, getWorkerAttendance);
router.get('/valid-dates/:bookingId', protect, getValidDates);
router.get('/my-bookings', protect, getMyBookingsWithAttendance);

module.exports = router;
