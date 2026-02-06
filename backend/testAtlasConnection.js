require('dotenv').config();
const mongoose = require('mongoose');

const ATLAS_URI = process.env.MONGODB_URI;

console.log('🔍 MongoDB Atlas Connection Test\n');
console.log('Testing connection to:', ATLAS_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('');

async function testConnection() {
    try {
        console.log('⏳ Attempting to connect...');

        const conn = await mongoose.connect(ATLAS_URI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });

        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('📊 Database:', conn.connection.db.databaseName);
        console.log('🌐 Host:', conn.connection.host);

        // List collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('\n📁 Collections found:', collections.length);
        collections.forEach(col => {
            console.log('   -', col.name);
        });

        await conn.connection.close();
        console.log('\n✅ Connection test successful!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('\nError:', error.message);

        if (error.message.includes('IP')) {
            console.log('\n💡 Possible solutions:');
            console.log('1. Check MongoDB Atlas Network Access settings');
            console.log('2. Ensure 0.0.0.0/0 is in the IP whitelist');
            console.log('3. Wait 1-2 minutes after adding IP');
        } else if (error.message.includes('authentication')) {
            console.log('\n💡 Check your username and password in MONGODB_URI');
        } else if (error.message.includes('Could not connect')) {
            console.log('\n💡 Possible solutions:');
            console.log('1. Check if your cluster is paused (free tier clusters pause after inactivity)');
            console.log('2. Go to MongoDB Atlas and click "Resume" on your cluster');
            console.log('3. Check your internet connection');
            console.log('4. Verify the cluster URL is correct');
        }

        process.exit(1);
    }
}

testConnection();
