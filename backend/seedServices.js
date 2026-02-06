require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

// Read services from the JSON file
const servicesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'services.json'), 'utf8')
);

// Transform services to match MongoDB schema
const services = servicesData.map(service => ({
    slug: service.slug,
    title: service.title,
    description: service.description,
    imageUrl: service.imageUrl,
    features: service.features,
    basePrice: service.basePrice,
    priceRange: service.priceRange,
    rating: service.rating,
    reviewCount: service.reviewCount,
    badge: service.badge || null,
    category: service.category,
    availability: service.availability,
    verificationStatus: service.verificationStatus,
    isActive: true
}));

const TeamMember = require('./models/TeamMember');
const Investor = require('./models/Investor');
const CarouselItem = require('./models/CarouselItem');

const teamData = [
    {
        name: 'Vaibhav Agrawal',
        title: 'Founder & CEO',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_2.png',
        linkedin: 'https://linkedin.com',
        category: 'Leadership'
    },
    {
        name: 'Saurav Kumar',
        title: 'Co-founder & COO',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_3.png',
        linkedin: 'https://linkedin.com',
        category: 'Leadership'
    },
    {
        name: 'Nishi Agrawal',
        title: 'Co-founder & CTO',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_4.png',
        linkedin: 'https://linkedin.com',
        category: 'Leadership'
    },
    {
        name: 'Anjali Sharma',
        title: 'Growth & Strategy',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_5.png',
        linkedin: 'https://linkedin.com',
        category: 'Business'
    },
    {
        name: 'Rahul Vats',
        title: 'Operations Manager',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_2.png',
        linkedin: 'https://linkedin.com',
        category: 'Operations'
    },
    {
        name: 'Priyanka Das',
        title: 'Human Resources',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_5.png',
        linkedin: 'https://linkedin.com',
        category: 'Human Resources'
    },
    {
        name: 'Vikram Singh',
        title: 'Lead Product Design',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/images_3.png',
        linkedin: 'https://linkedin.com',
        category: 'Tech & Product'
    }
];

const investorData = [
    { name: 'Magic Fund', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/MagicFund-5.svg', width: 130, height: 48 },
    { name: '2am VC', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/2amVC-6.svg', width: 55, height: 48 },
    { name: 'SAT', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/SAT-7.svg', width: 100, height: 48 },
    { name: '100x', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/100x-8.svg', width: 130, height: 48 },
    { name: 'Dholakia Ventures', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/svgs/Dholakia-9.svg', width: 130, height: 48 },
];

const carouselData = [
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg01-2.jpg", order: 1 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg02-3.jpg", order: 2 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg03-4.jpg", order: 3 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg04-5.jpg", order: 4 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg05-6.jpg", order: 5 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg06-7.jpg", order: 6 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg07-8.jpg", order: 7 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg10-9.jpg", order: 9 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg11-10.jpg", order: 10 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg12-11.jpg", order: 11 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg13-12.jpg", order: 12 },
    { imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/Sliderimg14-13.jpg", order: 13 }
];

async function seedServices() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Service.deleteMany({}),
            TeamMember.deleteMany({}),
            Investor.deleteMany({}),
            CarouselItem.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing data');

        // Insert new data
        const [servicesResult, teamResult, investorsResult, carouselResult] = await Promise.all([
            Service.insertMany(services),
            TeamMember.insertMany(teamData),
            Investor.insertMany(investorData),
            CarouselItem.insertMany(carouselData)
        ]);

        console.log(`✅ Seeded ${servicesResult.length} services from broomees.com`);
        console.log(`✅ Seeded ${teamResult.length} team members`);
        console.log(`✅ Seeded ${investorsResult.length} investors`);
        console.log(`✅ Seeded ${carouselResult.length} carousel items`);

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\nServices seeded:');
        servicesResult.forEach(s => console.log(`  - ${s.title} (${s.slug})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedServices();
