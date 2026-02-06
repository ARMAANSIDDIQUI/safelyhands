const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'Customer' }, // e.g. "Home Maker", "Business Owner"
    message: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    imageUrl: { type: String }, // Optional avatar
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
