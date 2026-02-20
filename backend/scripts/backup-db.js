const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/broomees';

// Import Models
const Service = require('../models/Service');
const SubCategory = require('../models/SubCategory');
const City = require('../models/City');
const Testimonial = require('../models/Testimonial');
const CredibilityLogo = require('../models/CredibilityLogo');
const TeamMember = require('../models/TeamMember');
const TeamCategory = require('../models/TeamCategory');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Worker = require('../models/Worker');

const exportData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const backup = {};

        const collections = [
            { name: 'services', model: Service },
            { name: 'subcategories', model: SubCategory },
            { name: 'cities', model: City },
            { name: 'testimonials', model: Testimonial },
            { name: 'credibilityLogos', model: CredibilityLogo },
            { name: 'teamMembers', model: TeamMember },
            { name: 'teamCategories', model: TeamCategory },
            { name: 'categories', model: Category },
            { name: 'reviews', model: Review },
            { name: 'workers', model: Worker }
        ];

        for (const col of collections) {
            console.log(`Fetching ${col.name}...`);
            backup[col.name] = await col.model.find({});
        }

        const outputPath = path.join(__dirname, '../data-backup.json');
        fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));

        console.log(`\nSuccess! Data exported to: ${outputPath}`);
        console.log(`Total Services: ${backup.services.length}`);
        console.log(`Total SubCategories: ${backup.subcategories.length}`);

        process.exit(0);
    } catch (err) {
        console.error('Export failed:', err);
        process.exit(1);
    }
};

exportData();
