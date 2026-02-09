const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');

// Helper: Get all valid attendance dates for a booking
const getValidAttendanceDates = (booking) => {
    const validDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(booking.startDate || booking.date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = booking.endDate ? new Date(booking.endDate) : new Date(booking.date);
    endDate.setHours(23, 59, 59, 999);

    switch (booking.frequency) {
        case 'One-time':
            // Only the exact booking date
            validDates.push(new Date(booking.date));
            break;

        case 'Daily':
        case 'Live-in':
            // Every day from start to end
            let current = new Date(startDate);
            while (current <= endDate) {
                validDates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            break;

        case 'Weekly':
            // Only on specified weeklyDays
            if (booking.weeklyDays && booking.weeklyDays.length > 0) {
                let weekCurrent = new Date(startDate);
                while (weekCurrent <= endDate) {
                    if (booking.weeklyDays.includes(weekCurrent.getDay())) {
                        validDates.push(new Date(weekCurrent));
                    }
                    weekCurrent.setDate(weekCurrent.getDate() + 1);
                }
            }
            break;
    }

    return validDates;
};

// Helper: Check if a date is valid for attendance
const isValidAttendanceDate = (booking, dateToCheck) => {
    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);

    const validDates = getValidAttendanceDates(booking);

    return validDates.some(vd => {
        const valid = new Date(vd);
        valid.setHours(0, 0, 0, 0);
        return valid.getTime() === checkDate.getTime();
    });
};

// Helper: Check if service is still active
const isServiceActive = (booking) => {
    if (booking.serviceStatus !== 'active') return false;
    if (booking.status === 'completed' || booking.status === 'rejected') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = booking.endDate ? new Date(booking.endDate) : new Date(booking.date);
    endDate.setHours(23, 59, 59, 999);

    // For one-time, check if the date has passed
    if (booking.frequency === 'One-time') {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(23, 59, 59, 999);
        return today <= bookingDate;
    }

    return today <= endDate;
};

const Attendance = require('../models/Attendance'); // Ensure Attendance model is imported (at top usually)

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    try {
        const { booking: bookingId, status, date } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Validate service is still active
        if (!isServiceActive(booking)) {
            return res.status(400).json({
                message: 'Service has ended. Attendance cannot be marked.'
            });
        }

        const attendanceDate = date ? new Date(date) : new Date();
        attendanceDate.setHours(0, 0, 0, 0); // Normalize date

        // Validate the date is valid for this booking's frequency
        if (!isValidAttendanceDate(booking, attendanceDate)) {
            return res.status(400).json({
                message: `Attendance cannot be marked for this date. This is a ${booking.frequency} service.`
            });
        }

        // 1. Create or Update in Attendance Collection (Primary source for history)
        const attendanceRecord = await Attendance.findOneAndUpdate(
            {
                booking: bookingId,
                date: attendanceDate
            },
            {
                status,
                markedBy: req.user._id,
                worker: booking.assignedWorker,
                user: booking.user
            },
            { upsert: true, new: true }
        );

        // 2. Sync with Booking.attendanceLogs (For redundancy/stats)
        const attendanceDateString = attendanceDate.toISOString().split('T')[0];
        const existingLogIndex = booking.attendanceLogs.findIndex(
            log => new Date(log.date).toISOString().split('T')[0] === attendanceDateString
        );

        if (existingLogIndex !== -1) {
            booking.attendanceLogs[existingLogIndex].status = status;
            booking.attendanceLogs[existingLogIndex].markedBy = req.user.role;
        } else {
            booking.attendanceLogs.push({
                date: attendanceDate,
                status,
                markedBy: req.user.role
            });
        }

        await booking.save();

        res.json({
            message: 'Attendance marked',
            record: attendanceRecord,
            attendanceLogs: booking.attendanceLogs
        });
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

// @desc    Get valid attendance dates for a booking
// @route   GET /api/attendance/valid-dates/:bookingId
// @access  Private
const getValidDates = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const validDates = getValidAttendanceDates(booking);
        const isActive = isServiceActive(booking);

        // Get existing attendance records
        const attendanceRecords = await Attendance.find({ booking: req.params.bookingId });
        const markedDates = attendanceRecords.map(a => ({
            date: a.date,
            status: a.status
        }));

        res.json({
            frequency: booking.frequency,
            weeklyDays: booking.weeklyDays || [],
            validDates,
            markedDates,
            isActive,
            startDate: booking.startDate || booking.date,
            endDate: booking.endDate || booking.date
        });
    } catch (error) {
        console.error('Error fetching valid dates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's bookings with attendance info
// @route   GET /api/attendance/my-bookings
// @access  Private
const getMyBookingsWithAttendance = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id,
            status: 'approved'
        }).populate('assignedWorker', 'name');

        const result = await Promise.all(bookings.map(async (booking) => {
            const isActive = isServiceActive(booking);
            const validDates = getValidAttendanceDates(booking);
            const attendanceRecords = await Attendance.find({ booking: booking._id });

            // Check if today is a valid attendance day
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const canMarkToday = isActive && isValidAttendanceDate(booking, today);

            // Check if already marked today
            const todayAttendance = attendanceRecords.find(a => {
                const aDate = new Date(a.date);
                aDate.setHours(0, 0, 0, 0);
                return aDate.getTime() === today.getTime();
            });

            return {
                _id: booking._id,
                serviceType: booking.serviceType,
                frequency: booking.frequency,
                weeklyDays: booking.weeklyDays,
                startDate: booking.startDate || booking.date,
                endDate: booking.endDate || booking.date,
                assignedWorker: booking.assignedWorker,
                isActive,
                canMarkToday,
                todayStatus: todayAttendance?.status || null,
                totalValidDays: validDates.length,
                markedDays: attendanceRecords.length,
                presentDays: attendanceRecords.filter(a => a.status === 'present').length,
                absentDays: attendanceRecords.filter(a => a.status === 'absent').length
            };
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching bookings with attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    markAttendance,
    getBookingAttendance,
    getWorkerAttendance,
    getValidDates,
    getMyBookingsWithAttendance
};
