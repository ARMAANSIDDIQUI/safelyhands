try {
    require('dotenv').config({ path: __dirname + '/.env' });
} catch (e) {
    // dotenv optional
}
const mongoose = require('mongoose');
const Service = require('./models/Service');
const SubCategory = require('./models/SubCategory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/broomees';

const seedBroomitService = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB successfully.");

        // Check if service already exists
        let service = await Service.findOne({ slug: 'help-in-15-mins' });

        if (!service) {
            console.log("Creating Service 'Help in 15 Mins'...");
            service = await Service.create({
                slug: 'help-in-15-mins',
                title: 'Help in 15 Mins',
                subtitle: 'On-Demand Household Support',
                description: 'Get on-demand, trusted household help delivered to your doorstep in 15 minutes.',
                imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
                features: ['15-Min Doorstep ETA', 'Verified Helpers', 'Flexible Hourly Booking', 'No Hidden Charges'],
                basePrice: 200,
                minPrice: 200,
                maxPrice: 1200,
                badge: '⚡ 15 MIN ETA',
                category: 'On-Demand',
                selectionMode: 'multiple',
                gender: 'Both',
                availability: 'Available Now',
                verificationStatus: '100% Verified',
                isActive: true
            });
            console.log("Service created with ID:", service._id);
        } else {
            console.log("Service 'Help in 15 Mins' already exists. ID:", service._id);
        }

        // Check subcategory
        let subCategory = await SubCategory.findOne({ service: service._id, name: 'BroomIT Instant Help' });

        const subCategoryData = {
            service: service._id,
            name: 'BroomIT Instant Help',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
            price: 200,
            description: 'On-demand domestic help for brooming, mopping, dusting, dish washing, kitchen help, and more.',
            features: ['ETA ~15 mins', 'Verified Staff', 'Hourly Rate Pricing'],
            inclusions: '<p>Hourly domestic worker assistance including cleaning, dusting, dish washing, kitchen help, serving, and organization.</p>',
            isActive: true,
            questions: [
                {
                    stepTitle: 'Hours & Requirements',
                    fields: [
                        {
                            name: 'noOfHours',
                            label: 'No. of Hours',
                            type: 'radio',
                            isPricingReference: true,
                            required: true,
                            options: [
                                { label: '1 Hour', value: '1 Hour', priceChange: 200 },
                                { label: '2 Hours', value: '2 Hours', priceChange: 350 },
                                { label: '4 Hours', value: '4 Hours', priceChange: 650 },
                                { label: '6 Hours', value: '6 Hours', priceChange: 950 },
                                { label: '8 Hours', value: '8 Hours', priceChange: 1200 }
                            ]
                        },
                        {
                            name: 'tasks',
                            label: 'What can we do for you?',
                            type: 'checkbox',
                            isPricingReference: false,
                            required: true,
                            options: [
                                { label: 'Brooming + Mopping', value: 'Brooming + Mopping', priceChange: 0 },
                                { label: 'Dusting', value: 'Dusting', priceChange: 0 },
                                { label: 'Dish Washing', value: 'Dish Washing', priceChange: 0 },
                                { label: 'Kitchen Help (No Cooking)', value: 'Kitchen Help (No Cooking)', priceChange: 0 },
                                { label: 'Watering plants', value: 'Watering plants', priceChange: 0 },
                                { label: 'Packing help', value: 'Packing help', priceChange: 0 },
                                { label: 'Serving Food', value: 'Serving Food', priceChange: 0 },
                                { label: 'Wardrobe Arrangement Help', value: 'Wardrobe Arrangement Help', priceChange: 0 }
                            ]
                        }
                    ]
                }
            ]
        };

        if (!subCategory) {
            subCategory = await SubCategory.create(subCategoryData);
            console.log("SubCategory created:", subCategory._id);
        } else {
            await SubCategory.findByIdAndUpdate(subCategory._id, subCategoryData);
            console.log("SubCategory updated:", subCategory._id);
        }

        console.log("BroomIT Seeding Completed Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
};

seedBroomitService();
