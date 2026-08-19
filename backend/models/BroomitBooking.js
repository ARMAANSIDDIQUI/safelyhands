const mongoose = require('mongoose');

const broomitBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingNumber: { type: String, required: true, unique: true },
    serviceType: { type: String, default: 'Help in 15 Mins (BroomIT)' },
    bookingType: { type: String, enum: ['instant', 'schedule'], default: 'instant' },
    region: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    tasks: [{ type: String, required: true }],
    hours: { type: Number, required: true, enum: [1, 2, 4, 6, 8] },
    bookingDate: { type: Date, required: true },
    specialRequest: { type: String },
    preferences: {
        petAtHome: { type: Boolean, default: false },
        avoidCalling: { type: Boolean, default: false },
        femaleWorkerPreferred: { type: Boolean, default: false }
    },
    pricingBreakdown: {
        serviceFee: { type: Number, required: true },
        platformFee: { type: Number, default: 20 },
        discount: { type: Number, default: 0 },
        gst: { type: Number, required: true },
        amountToBePaid: { type: Number, required: true }
    },
    paymentProofUrl: { type: String },
    status: {
        type: String,
        enum: ['pending_dispatch', 'worker_assigned', 'dispatched', 'arrived', 'in_progress', 'completed', 'cancelled'],
        default: 'pending_dispatch'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    etaMinutes: { type: Number, default: 15 },
    dispatchedAt: { type: Date },
    arrivedAt: { type: Date },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.BroomitBooking || mongoose.model('BroomitBooking', broomitBookingSchema);
