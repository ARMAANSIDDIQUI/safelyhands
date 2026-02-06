const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String }, // Icon class name or URL
    imageUrl: { type: String }, // Cloudinary URL
    description: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
