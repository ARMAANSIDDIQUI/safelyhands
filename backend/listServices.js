require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

async function listAll() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const services = await Service.find({});
        console.log('Total services:', services.length);
        services.forEach(s => {
            console.log(`- Slug: ${s.slug} | Shift: ${s.shift} | Category: ${s.category}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAll();
