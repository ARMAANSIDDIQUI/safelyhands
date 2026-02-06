const express = require('express');
const router = express.Router();
const { markAttendance, getBookingAttendance, getWorkerAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/booking/:bookingId', protect, getBookingAttendance);
router.get('/worker', protect, getWorkerAttendance);

module.exports = router;
