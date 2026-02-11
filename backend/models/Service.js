const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String }, // For Revolver Hero
    description: { type: String, required: true },
    imageUrl: { type: String },
    icon: { type: String }, // For Revolver Hero (Lucide icon name or URL)
    gradientFrom: { type: String, default: 'blue-100' }, // For Revolver Hero
    gradientTo: { type: String, default: 'blue-200' },   // For Revolver Hero
    features: [{ type: String }],
    basePrice: { type: Number },
    priceRange: {
        min: { type: Number },
        max: { type: Number }
    },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String },
    category: { type: String },
    shift: { type: String },
    selectionMode: { type: String, enum: ['single', 'multiple'], default: 'single' }, // single = select 1, multiple = select one or more
    gender: { type: String, enum: ['Male', 'Female', 'Both'], default: 'Both' },
    availability: { type: String },
    verificationStatus: { type: String },
    isActive: { type: Boolean, default: true },
    subcategories: [{
        name: { type: String },
        image: { type: String },
        price: { type: String }, // e.g. "₹15000/month starting"
        description: { type: String }, // e.g. "Complete floor cleaning..."
        features: [{ type: String }]  // e.g. "+All services inclusive"
    }],
    subcategoryImage: { type: String }, // New: visual representation for subcategory
    questions: [{ // New: Dynamic Question Schema
        stepTitle: { type: String, default: "Details" },
        fields: [{
            name: { type: String, required: true }, // Key for formData
            label: { type: String, required: true }, // Display label
            type: { type: String, enum: ['radio', 'select', 'checkbox', 'text', 'date'], default: 'radio' },
            options: [{
                label: String,
                value: String,
                priceChange: { type: Number, default: 0 } // Additional cost
            }],
            required: { type: Boolean, default: true },
            condition: { // Conditional visibility logic
                key: String,
                value: String
            }
        }]
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
