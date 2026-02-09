require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const MONGODB_URI = process.env.MONGODB_URI;

async function update24hrServices() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const servicesData = [
            {
                slug: '24hr-housekeeper',
                title: 'Housekeeper',
                description: 'Complete floor cleaning and sanitization for a sparkling clean home. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff9e6/e67e22?text=Housekeeper',
                shift: '24 Hrs Live In',
                gender: 'Female',
                basePrice: 15000,
                rating: 4.9,
                category: 'Domestic Help',
                verificationStatus: 'Fully verified'
            },
            {
                slug: '24hr-cook',
                title: 'Cook',
                description: 'Authentic Indian home-style cooking service for delicious meals. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/e0f2fe/0ea5e9?text=Cook',
                shift: '24 Hrs Live In',
                gender: 'Both',
                basePrice: 17000,
                rating: 4.9,
                category: 'Domestic Help',
                verificationStatus: 'Fully verified'
            },
            {
                slug: '24hr-babysitter',
                title: 'Babysitter',
                description: 'Professional child care service, ensuring their safety & well-being. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff1f2/e11d48?text=Babysitter',
                shift: '24 Hrs Live In',
                gender: 'Female',
                basePrice: 20000,
                rating: 4.7,
                category: 'Domestic Help',
                verificationStatus: 'Fully verified'
            },
            {
                slug: '24hr-allrounder',
                title: 'All-Rounder',
                description: 'Complete household management, taking care of your complex needs. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=All-Rounder',
                shift: '24 Hrs Live In',
                gender: 'Both',
                basePrice: 16000,
                rating: 4.8,
                category: 'Domestic Help',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'elderly-care-basic',
                title: 'Basic Care',
                description: 'General assistance, medicine reminders, companionship and mobility support. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/e0f2fe/0ea5e9?text=Elderly+Basic',
                shift: 'Elderly Care',
                gender: 'Both',
                basePrice: 25000,
                rating: 4.9,
                category: 'Elderly Support',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'elderly-care-medical',
                title: 'Medical Support',
                description: 'Basic health monitoring, medicine management, and specialized exercise assistance. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/e0f2fe/0ea5e9?text=Elderly+Medical',
                shift: 'Elderly Care',
                gender: 'Both',
                basePrice: 30000,
                rating: 4.9,
                category: 'Elderly Support',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'peon-office',
                title: 'Office Help',
                description: 'Maintaining office cleanliness, serving tea/water, and general assistance. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f8fafc/64748b?text=Peon+Office',
                shift: 'Peon',
                gender: 'Male',
                basePrice: 14000,
                rating: 4.8,
                category: 'Office Support',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'peon-pantry',
                title: 'Pantry Help',
                description: 'Managing office pantry, preparing snacks and beverages for staff. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f8fafc/64748b?text=Peon+Pantry',
                shift: 'Peon',
                gender: 'Male',
                basePrice: 15000,
                rating: 4.9,
                category: 'Office Support',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'peon-outdoor',
                title: 'Outdoor Help',
                description: 'Delivery, bank work, and outdoor administrative tasks. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f8fafc/64748b?text=Peon+Outdoor',
                shift: 'Peon',
                gender: 'Male',
                basePrice: 16000,
                rating: 4.8,
                category: 'Office Support',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'babycare-2-12m',
                title: '2-12 months',
                description: 'Babycare services for the well-being of your little one. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff1f2/e11d48?text=Babycare+2-12m',
                shift: 'Babysitter',
                gender: 'Female',
                basePrice: 2500,
                rating: 4.8,
                category: 'Childcare',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'allrounder-5h',
                title: '5 hours per day',
                description: 'Complete household management, taking care of your complex needs. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=All-Rounder+5h',
                shift: 'Hourly',
                gender: 'Female',
                basePrice: 10000,
                rating: 4.9,
                category: 'All-Rounder',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'allrounder-6h',
                title: '6 hours per day',
                description: 'Complete household management, taking care of your complex needs. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=All-Rounder+6h',
                shift: 'Hourly',
                gender: 'Female',
                basePrice: 12000,
                rating: 4.9,
                category: 'All-Rounder',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'allrounder-8h',
                title: '8 hours per day',
                description: 'Complete household management, taking care of your complex needs. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=All-Rounder+8h',
                shift: 'Hourly',
                gender: 'Female',
                basePrice: 16000,
                rating: 4.8,
                category: 'All-Rounder',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'allrounder-10h',
                title: '10 hours per day',
                description: 'Complete household management, taking care of your complex needs. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=All-Rounder+10h',
                shift: 'Hourly',
                gender: 'Female',
                basePrice: 18000,
                rating: 4.9,
                category: 'All-Rounder',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'japa-24h',
                title: 'Japa',
                description: 'Professional child care service, ensuring the safety & well-being of both mother and child. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff1f2/e11d48?text=Japa+Care',
                shift: '24 Hrs Live In Japa',
                gender: 'Female',
                basePrice: 33000,
                rating: 4.7,
                category: 'Japa Care',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'cooking-homestyle',
                title: 'Home-style food',
                description: 'Authentic Indian home-style cooking service for delicious meals. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff9e6/e67e22?text=Home-style+Food',
                shift: 'Cooking',
                gender: 'Female',
                basePrice: 3000,
                rating: 4.9,
                category: 'Cooking',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'cooking-dishwashing',
                title: 'Dish-washing',
                description: 'Expert dishwashing service ensuring spotless and sanitized dishes. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/e0f2fe/0ea5e9?text=Dish-washing',
                shift: 'Cooking',
                gender: 'Female',
                basePrice: 550,
                rating: 4.9,
                category: 'Dish-washing',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'domestic-brooming',
                title: 'Brooming, Mopping',
                description: 'Complete floor cleaning and sanitization for a sparkling clean space. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/f0fdf4/16a34a?text=Brooming+Mopping',
                shift: 'Domestic Help',
                gender: 'Female',
                basePrice: 3500,
                rating: 4.9,
                category: 'Cleaning',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'domestic-bathroom',
                title: 'Bathroom cleaning',
                description: 'Thorough bathroom cleaning for a hygienic space. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/ecfeff/0891b2?text=Bathroom+Cleaning',
                shift: 'Domestic Help',
                gender: 'Female',
                basePrice: 500,
                rating: 4.8,
                category: 'Add-ons',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'domestic-dusting',
                title: 'Dusting',
                description: 'Professional dusting service for a spotless dust-free home. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/fff7ed/ea580c?text=Dusting',
                shift: 'Domestic Help',
                gender: 'Female',
                basePrice: 800,
                rating: 4.9,
                category: 'Add-ons',
                verificationStatus: 'Fully verified'
            },
            {
                slug: 'domestic-dishwashing',
                title: 'Dish-washing',
                description: 'Expert dishwashing service ensuring spotless and sanitized dishes. All services inclusive.',
                imageUrl: 'https://placehold.co/600x400/e0f2fe/0ea5e9?text=Dish-washing',
                shift: 'Domestic Help',
                gender: 'Female',
                basePrice: 500,
                rating: 4.7,
                category: 'Add-ons',
                verificationStatus: 'Fully verified'
            }
        ];

        for (const data of servicesData) {
            await Service.findOneAndUpdate(
                { slug: data.slug },
                data,
                { upsert: true, new: true }
            );
            console.log(`✅ Updated/Created service: ${data.title}`);
        }

        console.log('\n🎉 24h Services updated!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating services:', error);
        process.exit(1);
    }
}

update24hrServices();
