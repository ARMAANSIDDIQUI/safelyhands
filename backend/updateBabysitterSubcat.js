const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const update = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const babysitter = await Service.findOne({ slug: 'babysitter' });
        if (babysitter) {
            babysitter.subcategories = [{
                name: "2-12 months",
                image: "https://placehold.co/400x400?text=Baby+2-12m", // Placeholder
                price: "₹25000/month starting", // Assuming 25k is more realistic than 2.5k for full month
                description: "Babycare services for the well-being of your little one",
                features: ["+All services inclusive"]
            }];
            await babysitter.save();
            console.log("✅ Updated Babysitter subcategories");
        } else {
            console.log("❌ Babysitter service not found");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

update();
