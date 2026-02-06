require('dotenv').config();
const mongoose = require('mongoose');

// Source: Local MongoDB
const SOURCE_URI = process.env.MONGODB_LOCAL;
// Destination: MongoDB Atlas
const DEST_URI = process.env.MONGODB_URI;

// Collection names to migrate
const COLLECTIONS = [
    'users',
    'services',
    'bookings',
    'workers',
    'reviews',
    'attendance',
    'notifications',
    'teammembers',
    'investors',
    'carouselitems'
];

async function migrateData() {
    let sourceConn, destConn;

    try {
        console.log('🔌 Connecting to source (Local MongoDB)...');
        sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        console.log('✅ Connected to source database');

        console.log('🔌 Connecting to destination (MongoDB Atlas)...');
        destConn = await mongoose.createConnection(DEST_URI).asPromise();
        console.log('✅ Connected to destination database');

        console.log('\n📦 Starting data migration...\n');

        for (const collectionName of COLLECTIONS) {
            try {
                console.log(`📋 Migrating collection: ${collectionName}`);

                // Check if collection exists in source
                const collections = await sourceConn.db.listCollections({ name: collectionName }).toArray();

                if (collections.length === 0) {
                    console.log(`   ⚠️  Collection '${collectionName}' not found in source, skipping...`);
                    continue;
                }

                // Get data from source
                const sourceCollection = sourceConn.db.collection(collectionName);
                const documents = await sourceCollection.find({}).toArray();

                if (documents.length === 0) {
                    console.log(`   ℹ️  Collection '${collectionName}' is empty, skipping...`);
                    continue;
                }

                // Clear destination collection (optional - comment out if you want to merge)
                const destCollection = destConn.db.collection(collectionName);
                await destCollection.deleteMany({});
                console.log(`   🗑️  Cleared destination collection`);

                // Insert into destination
                await destCollection.insertMany(documents);
                console.log(`   ✅ Migrated ${documents.length} documents\n`);

            } catch (error) {
                console.error(`   ❌ Error migrating ${collectionName}:`, error.message);
            }
        }

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        // Close connections
        if (sourceConn) {
            await sourceConn.close();
            console.log('\n🔌 Closed source connection');
        }
        if (destConn) {
            await destConn.close();
            console.log('🔌 Closed destination connection');
        }
        process.exit(0);
    }
}

// Run migration
console.log('🚀 MongoDB Data Migration Tool\n');
console.log('Source:', SOURCE_URI);
console.log('Destination:', DEST_URI ? DEST_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') : 'NOT SET');
console.log('');

if (!DEST_URI || !DEST_URI.includes('mongodb')) {
    console.error('❌ Error: MONGODB_URI not set properly in .env file');
    console.log('\nPlease ensure MONGODB_URI points to your MongoDB Atlas cluster');
    process.exit(1);
}

migrateData();
