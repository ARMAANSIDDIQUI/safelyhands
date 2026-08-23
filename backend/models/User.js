const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    tag: { type: String, default: "" },
    houseNo: { type: String, default: "" },
    landmark: { type: String, default: "" },
    fullAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: { type: String, enum: ['customer', 'admin', 'worker'], default: 'customer' },
    googleId: { type: String }, // For OAuth
    profilePicture: { type: String }, // User profile image URL
    phone: { type: String },
    address: { type: String, default: "" }, // Default Saved Home Address
    addresses: [addressSchema], // Swiggy/Zomato style saved address book
    otp: { type: String },
    otpExpires: { type: Date },
    otpRequestsToday: { type: Number, default: 0 },
    lastOtpRequestDate: { type: Date },
    isVerified: { type: Boolean, default: false }, // Email verification status
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
