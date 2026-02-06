const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    try {
        const { booking: bookingId, status, date } = req.body;
        const Booking = require('../models/Booking');
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const attendance = await Attendance.create({
            booking: bookingId,
            worker: booking.assignedWorker,
            user: booking.user,
            date: date || new Date(),
            status,
            markedBy: req.user._id
        });

        res.status(201).json(attendance);
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get attendance for a booking
// @route   GET /api/attendance/booking/:bookingId
// @access  Private
const getBookingAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ booking: req.params.bookingId })
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get worker's attendance history
// @route   GET /api/attendance/worker
// @access  Private
const getWorkerAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ worker: req.user._id })
            .populate('booking', 'serviceType date')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error('Error fetching worker attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    markAttendance,
    getBookingAttendance,
    getWorkerAttendance
};
