const mongoose = require('mongoose');
const City = require('./models/City');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const seedCities = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const cities = [
            { name: "Moradabad", slug: "moradabad", isActive: true },
            { name: "Rampur", slug: "rampur", isActive: true },
            { name: "Amroha", slug: "amroha", isActive: true },
            { name: "Bareilly", slug: "bareilly", isActive: true },
            { name: "Regions near Moradabad", slug: "near-moradabad", isActive: true, isOther: true } // Marking as 'Other' for frontend logic
        ];

        for (const cityData of cities) {
            const exists = await City.findOne({ slug: cityData.slug });
            if (exists) {
                console.log(`City ${cityData.name} already exists`);
                // Update if needed
                exists.name = cityData.name;
                exists.isActive = cityData.isActive;
                exists.isOther = cityData.isOther;
                await exists.save();
            } else {
                await City.create(cityData);
                console.log(`Created city: ${cityData.name}`);
            }
        }

        console.log('Cities seeded successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedCities();
