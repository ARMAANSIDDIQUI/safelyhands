const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const peonService = {
    title: "Peon",
    slug: "peon",
    description: "Professional office boy and general support staff for your daily office needs. Services include pantry management, document handling, and general assistance.",
    imageUrl: "https://placehold.co/600x400?text=Peon+Service",
    icon: "Briefcase", // Lucide icon name placeholder
    basePrice: 15000,
    priceRange: {
        min: 12000,
        max: 18000
    },
    features: [
        "Pantry Management",
        "Document Filing & Handling",
        "Office Maintenance",
        "Bank & Post Office Visits",
        "Guest Hospitality"
    ],
    rating: 4.8,
    reviewCount: 0,
    category: "Corporate Support",
    shift: "Day Shift",
    gender: "Male",
    availability: "Available",
    verificationStatus: "Verified",
    isActive: true
};

const run = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const exists = await Service.findOne({ slug: peonService.slug });
        if (exists) {
            console.log("⚠️ Peon service already exists. Skipping.");
        } else {
            await Service.create(peonService);
            console.log("✅ Peon service added successfully.");
        }
        process.exit(0);
    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
};

run();
