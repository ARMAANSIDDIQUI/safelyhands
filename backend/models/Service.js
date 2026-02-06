const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // e.g. 'cooks'
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Image URL from broomees.com
    features: [{ type: String }],
    basePrice: { type: Number },
    priceRange: {
        min: { type: Number },
        max: { type: Number }
    },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String }, // e.g. 'Popular', 'Trending', 'Most Popular'
    category: { type: String }, // e.g. 'cooking', 'cleaning', 'childcare'
    availability: { type: String }, // e.g. 'Part-time and Full-time'
    verificationStatus: { type: String }, // e.g. 'Fully verified with background checks'
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
