const BroomitBooking = require('../models/BroomitBooking');
const Worker = require('../models/Worker');

// Helper: Sanitize String Input
const sanitizeString = (str) => typeof str === 'string' ? str.trim().substring(0, 500) : '';

// @desc    Create new 15-min instant BroomIT booking
// @route   POST /api/broomit/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const {
            bookingType,
            region,
            address,
            phone,
            tasks,
            hours,
            bookingDate,
            specialRequest,
            preferences,
            pricingBreakdown,
            paymentProofUrl
        } = req.body;

        // 1. Field Presence Check
        if (!region || !address || !phone || !tasks || !Array.isArray(tasks) || !tasks.length || !hours || !pricingBreakdown) {
            return res.status(400).json({ message: 'Missing required booking fields' });
        }

        // 2. Security & Type Validation
        const validHours = [1, 2, 4, 6, 8];
        const numHours = Number(hours);
        if (!validHours.includes(numHours)) {
            return res.status(400).json({ message: 'Invalid hours selection. Allowed: 1, 2, 4, 6, 8 hours' });
        }

        const sanitizedPhone = String(phone).replace(/\D/g, '').slice(0, 10);
        if (sanitizedPhone.length !== 10) {
            return res.status(400).json({ message: 'Valid 10-digit phone number is required' });
        }

        const sanitizedRegion = sanitizeString(region);
        const sanitizedAddress = sanitizeString(address);
        const sanitizedSpecialRequest = sanitizeString(specialRequest);
        const sanitizedTasks = tasks.map(t => sanitizeString(t)).filter(Boolean);

        if (!sanitizedTasks.length) {
            return res.status(400).json({ message: 'At least one valid task must be selected' });
        }

        // 3. Pricing Validation
        const serviceFee = Number(pricingBreakdown.serviceFee) || 0;
        const platformFee = Number(pricingBreakdown.platformFee) || 20;
        const discount = Number(pricingBreakdown.discount) || 0;
        const gst = Number(pricingBreakdown.gst) || 0;
        const amountToBePaid = Number(pricingBreakdown.amountToBePaid) || 0;

        if (amountToBePaid < 0 || serviceFee < 0) {
            return res.status(400).json({ message: 'Invalid pricing breakdown amounts' });
        }

        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const bookingNumber = `BRM15-${randomNumber}`;

        const booking = await BroomitBooking.create({
            user: req.user._id,
            bookingNumber,
            serviceType: 'Help in 15 Mins (BroomIT)',
            bookingType: bookingType === 'schedule' ? 'schedule' : 'instant',
            region: sanitizedRegion,
            address: sanitizedAddress,
            phone: sanitizedPhone,
            tasks: sanitizedTasks,
            hours: numHours,
            bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
            specialRequest: sanitizedSpecialRequest,
            preferences: {
                petAtHome: Boolean(preferences?.petAtHome),
                avoidCalling: Boolean(preferences?.avoidCalling),
                femaleWorkerPreferred: Boolean(preferences?.femaleWorkerPreferred)
            },
            pricingBreakdown: {
                serviceFee,
                platformFee,
                discount,
                gst,
                amountToBePaid
            },
            paymentProofUrl: typeof paymentProofUrl === 'string' ? paymentProofUrl.trim() : '',
            status: 'pending_dispatch',
            paymentStatus: paymentProofUrl ? 'paid' : 'pending',
            etaMinutes: 15
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Create BroomitBooking Error:', error);
        res.status(500).json({ message: error.message || 'Server error creating BroomIT booking' });
    }
};

// @desc    Get user's BroomIT 15-min bookings
// @route   GET /api/broomit/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await BroomitBooking.find({ user: req.user._id })
            .populate('assignedWorker', 'name phone profilePicture rating experience')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get My BroomIT Bookings Error:', error);
        res.status(500).json({ message: 'Server error fetching BroomIT bookings' });
    }
};

// @desc    Get all BroomIT bookings (Admin)
// @route   GET /api/broomit/admin/bookings
// @access  Private/Admin
const getAdminBookings = async (req, res) => {
    try {
        const bookings = await BroomitBooking.find({})
            .populate('user', 'name email phone')
            .populate('assignedWorker', 'name phone profilePicture rating experience')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get Admin BroomIT Bookings Error:', error);
        res.status(500).json({ message: 'Server error fetching admin BroomIT queue' });
    }
};

// @desc    Assign worker to 15-min booking (Admin)
// @route   PATCH /api/broomit/admin/bookings/:id/assign-worker
// @access  Private/Admin
const assignWorker = async (req, res) => {
    try {
        const { workerId } = req.body;
        const booking = await BroomitBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'BroomIT booking not found' });
        }

        if (workerId) {
            const worker = await Worker.findById(workerId);
            if (!worker) {
                return res.status(404).json({ message: 'Worker not found' });
            }
            booking.assignedWorker = workerId;
            booking.status = 'worker_assigned';
            booking.dispatchedAt = new Date();
        } else {
            booking.assignedWorker = undefined;
            booking.status = 'pending_dispatch';
        }

        await booking.save();
        const updated = await BroomitBooking.findById(booking._id)
            .populate('user', 'name email phone')
            .populate('assignedWorker', 'name phone profilePicture rating');

        res.json(updated);
    } catch (error) {
        console.error('Assign Worker BroomIT Error:', error);
        res.status(500).json({ message: 'Server error assigning worker' });
    }
};

// @desc    Update BroomIT booking status (Admin)
// @route   PATCH /api/broomit/admin/bookings/:id/status
// @access  Private/Admin
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending_dispatch', 'worker_assigned', 'dispatched', 'arrived', 'in_progress', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const booking = await BroomitBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'BroomIT booking not found' });
        }

        booking.status = status;
        if (status === 'dispatched' && !booking.dispatchedAt) booking.dispatchedAt = new Date();
        if (status === 'arrived' && !booking.arrivedAt) booking.arrivedAt = new Date();
        if (status === 'completed' && !booking.completedAt) booking.completedAt = new Date();

        await booking.save();
        const updated = await BroomitBooking.findById(booking._id)
            .populate('user', 'name email phone')
            .populate('assignedWorker', 'name phone profilePicture rating');

        res.json(updated);
    } catch (error) {
        console.error('Update BroomIT Status Error:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAdminBookings,
    assignWorker,
    updateStatus
};
