const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const checkServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected");

        const services = await Service.find({ title: { $regex: /Babysitter|Elderly|All Rounder|Cook/i } });

        services.forEach(s => {
            console.log(`\nService: ${s.title} (Slug: ${s.slug})`);
            console.log(`Questions: ${s.questions?.length || 0}`);
            if (s.questions?.length > 0) {
                console.log(JSON.stringify(s.questions[0].fields.map(f => f.name), null, 2));
            }
            console.log(`Subcategories: ${s.subcategories?.length || 0}`);
            if (s.subcategories?.length > 0) {
                console.log(JSON.stringify(s.subcategories.map(sc => sc.name), null, 2));
            }
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkServices();
