const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { serviceType, frequency, date, address, notes, paymentProofUrl } = req.body;

        const booking = await Booking.create({
            user: req.user._id,
            serviceType,
            frequency,
            date,
            address,
            notes,
            paymentProofUrl, // Optional initially
            status: 'pending'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = req.body.status || booking.status;

            // Only update paymentStatus if it's explicitly provided in the request
            if (req.body.paymentStatus !== undefined) {
                booking.paymentStatus = req.body.paymentStatus;
            }

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('assignedWorker')
            .populate('user', 'name email phone');

        if (booking) {
            // Verify ownership or admin
            if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const Notification = require('../models/Notification'); // Import Notification

// ... (existing code)

// @desc    Assign worker to booking
// @route   PUT /api/bookings/:id/assign
// @access  Private/Admin
const assignWorker = async (req, res) => {
    try {
        const { workerId } = req.body;
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name'); // Populate user to get name if needed, mainly need ID

        if (booking) {
            booking.assignedWorker = workerId;
            booking.status = 'approved';
            const updatedBooking = await booking.save();

            // Create Notification for User
            await Notification.create({
                user: booking.user._id,
                title: 'Booking Approved & Worker Assigned',
                message: `Your booking for ${booking.serviceType} has been approved. A worker has been assigned.`,
                type: 'booking',
                link: `/dashboard/bookings/${booking._id}`
            });

            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get tasks assigned to logged-in worker
// @route   GET /api/bookings/worker/tasks
// @access  Private
const getWorkerBookings = async (req, res) => {
    try {
        // Find worker profile associated with user
        const Worker = require('../models/Worker');
        const workerProfile = await Worker.findOne({ userId: req.user._id }); // Assuming Worker has userId link

        // If no worker profile linked, maybe they are just a user? 
        // Or if we don't store userId in Worker, we need another way.
        // Looking at Worker.js, it DOES have userId field.

        if (!workerProfile) {
            // Alternatively, maybe searching by name/email if userId isn't populated? 
            // But let's assume userId is key.
            return res.status(404).json({ message: 'Worker profile not found for this user' });
        }

        const bookings = await Booking.find({ assignedWorker: workerProfile._id })
            .populate('user', 'name phone address')
            .sort({ date: 1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership or admin
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update booking (User/Admin)
// @route   PUT /api/bookings/:id/edit
// @access  Private
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership or admin
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields
        booking.serviceType = req.body.serviceType || booking.serviceType;
        booking.frequency = req.body.frequency || booking.frequency;
        booking.date = req.body.date || booking.date;
        booking.address = req.body.address || booking.address;
        booking.notes = req.body.notes || booking.notes;

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const markAttendance = async (req, res) => {
    try {
        const { attendanceStatus } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if admin or the user who created the booking
        if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        booking.attendanceStatus = attendanceStatus || booking.attendanceStatus;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
    updateBookingStatus,
    getBookingById,
    assignWorker,
    getWorkerBookings,
    deleteBooking,
    updateBooking,
    markAttendance
};
