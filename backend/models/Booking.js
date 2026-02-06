const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceType: { type: String, required: true },
    frequency: { type: String, enum: ['One-time', 'Daily', 'Live-in'], required: true },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    paymentProofUrl: { type: String }, // Cloudinary URL
    paymentStatus: { type: String, enum: ['unpaid', 'pending_approval', 'paid'], default: 'unpaid' },
    time: { type: String }, // e.g., "10:00 AM"
    attendanceLogs: [{
        date: { type: Date, required: true },
        status: { type: String, enum: ['present', 'absent', 'not_marked'], default: 'not_marked' },
        markedBy: { type: String, enum: ['admin', 'user'], default: 'admin' }
    }],
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    startDate: { type: Date },
    endDate: { type: Date }, // For subscription duration
    totalAmount: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
