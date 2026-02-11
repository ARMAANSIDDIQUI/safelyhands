require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

async function checkDomesticHelp() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const services = await Service.find({ shift: 'Domestic Help' });
        console.log(`Found ${services.length} services for 'Domestic Help' shift`);

        services.forEach(s => {
            console.log(`- Slug: ${s.slug} | Category: "${s.category}" | Subcategories: ${JSON.stringify(s.subcategories)}`);
        });

        // Also check if there's any field like subCategory
        const raw = await mongoose.connection.db.collection('services').find({ shift: 'Domestic Help' }).toArray();
        raw.forEach(r => {
            console.log(`- RAW Slug: ${r.slug} | Keys: ${Object.keys(r).join(', ')}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDomesticHelp();
