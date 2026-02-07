const mongoose = require('mongoose');
const Service = require('../models/Service');
const TeamMember = require('../models/TeamMember');
const Investor = require('../models/Investor');
const CarouselItem = require('../models/CarouselItem');
const fs = require('fs');
const path = require('path');

// @desc    Seed database with default data
// @route   POST /api/maintenance/seed
// @access  Private/Admin
const seedDatabase = async (req, res) => {
    try {
        console.log('📦 Starting database seeding...');

        // Read services from JSON
        const servicesPath = path.join(__dirname, '..', 'data', 'services.json');
        if (!fs.existsSync(servicesPath)) {
            return res.status(404).json({ message: 'Services data file not found' });
        }

        const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
        const services = servicesData.map(s => ({ ...s, isActive: true }));

        // Hardcoded Team Data (from seedServices.js)
        const teamData = [
            { name: 'Vaibhav Agrawal', title: 'Founder & CEO', category: 'Leadership' },
            { name: 'Saurav Kumar', title: 'Co-founder & COO', category: 'Leadership' },
            { name: 'Nishi Agrawal', title: 'Co-founder & CTO', category: 'Leadership' }
        ];

        // Clear existing
        await Promise.all([
            Service.deleteMany({}),
            TeamMember.deleteMany({}),
            Investor.deleteMany({}),
            CarouselItem.deleteMany({})
        ]);

        // Insert new
        const seededServices = await Service.insertMany(services);
        await TeamMember.insertMany(teamData);

        res.json({
            message: 'Database seeded successfully',
            servicesCount: seededServices.length
        });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

// @desc    Migrate local data to MongoDB Atlas
// @route   POST /api/maintenance/migrate
// @access  Private/Admin
const migrateToAtlas = async (req, res) => {
    const SOURCE_URI = process.env.MONGODB_LOCAL;
    const DEST_URI = process.env.MONGODB_ATLAS;

    if (!SOURCE_URI || !DEST_URI) {
        return res.status(400).json({ message: 'Migration URIs not configured in .env' });
    }

    let sourceConn, destConn;
    const COLLECTIONS = ['users', 'services', 'bookings', 'workers', 'attendance'];

    try {
        sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        destConn = await mongoose.createConnection(DEST_URI).asPromise();

        const results = [];

        for (const colName of COLLECTIONS) {
            const sourceCol = sourceConn.db.collection(colName);
            const docs = await sourceCol.find({}).toArray();

            if (docs.length > 0) {
                const destCol = destConn.db.collection(colName);
                await destCol.deleteMany({});
                await destCol.insertMany(docs);
                results.push({ collection: colName, count: docs.length });
            } else {
                results.push({ collection: colName, count: 0, status: 'empty' });
            }
        }

        res.json({ message: 'Migration completed', results });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ message: 'Migration failed', error: error.message });
    } finally {
        if (sourceConn) await sourceConn.close();
        if (destConn) await destConn.close();
    }
};

module.exports = {
    seedDatabase,
    migrateToAtlas
};
