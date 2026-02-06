const mongoose = require('mongoose');

const carouselItemSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CarouselItem', carouselItemSchema);
