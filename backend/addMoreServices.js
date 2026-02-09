require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const MONGODB_URI = process.env.MONGODB_URI;

async function addMoreServices() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Fetch a random service to get an image URL
        const randomService = await Service.findOne();
        const placeholderImg = randomService ? randomService.imageUrl : 'https://placehold.co/800x800/e0f2fe/0ea5e9?text=Service';

        const newServices = [
            {
                slug: 'patient-care',
                title: 'Patient Care',
                description: 'Professional care and assistance for patients in the comfort of their homes. Our trained caregivers provide support with medication, monitoring, and daily activities.',
                imageUrl: placeholderImg,
                features: ['Trained Caregivers', 'Medication Support', '24/7 Availability', 'Compassionate Care'],
                basePrice: 15000,
                priceRange: { min: 12000, max: 25000 },
                rating: 4.9,
                reviewCount: 150,
                badge: 'Highly Rated',
                category: 'healthcare',
                availability: 'Full-time',
                verificationStatus: 'Fully verified with medical training background',
                isActive: true
            },
            {
                slug: 'peon-service',
                title: 'Peon Service',
                description: 'Reliable peon and office assistance services for your workplace. We provide professional help with document handling, errands, and general office maintenance.',
                imageUrl: placeholderImg,
                features: ['Office Assistance', 'Document Handling', 'Errand Services', 'Professional Conduct'],
                basePrice: 12000,
                priceRange: { min: 10000, max: 20000 },
                rating: 4.7,
                reviewCount: 85,
                badge: 'Corporate Choice',
                category: 'office',
                availability: 'Part-time and Full-time',
                verificationStatus: 'Fully verified with background checks',
                isActive: true
            }
        ];

        for (const service of newServices) {
            // Check if service already exists
            const existing = await Service.findOne({ slug: service.slug });
            if (existing) {
                console.log(`⚠️  Service "${service.title}" already exists. Skipping.`);
            } else {
                await Service.create(service);
                console.log(`✅ Added service: ${service.title}`);
            }
        }

        console.log('\n🎉 Task completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding services:', error);
        process.exit(1);
    }
}

addMoreServices();
