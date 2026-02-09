require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

async function updateServicesSurgically() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const servicesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'data', 'services.json'), 'utf8')
        );

        console.log(`ℹ️  Found ${servicesData.length} services in services.json. Updating...`);

        for (const service of servicesData) {
            const updated = await Service.findOneAndUpdate(
                { slug: service.slug },
                {
                    $set: {
                        description: service.description,
                        features: service.features,
                        availability: service.availability,
                        // Add other fields you want to sync but NOT reset
                        // For example, badge, verificationStatus, title
                        title: service.title,
                        imageUrl: service.imageUrl,
                        basePrice: service.basePrice,
                        priceRange: service.priceRange,
                        category: service.category,
                        badge: service.badge || null,
                        verificationStatus: service.verificationStatus
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`   - Updated/Upserted: ${updated.title} (${updated.slug})`);
        }

        console.log('\n🎉 Surgical service update completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating services:', error);
        process.exit(1);
    }
}

updateServicesSurgically();
