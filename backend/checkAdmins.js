require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkAdminStatus() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database\n');

        console.log('📋 Listing all users and their roles:\n');
        const users = await User.find({}).select('name email role');

        if (users.length === 0) {
            console.log('❌ No users found in database!');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log('');
            });
        }

        const adminCount = users.filter(u => u.role === 'admin').length;
        console.log(`\n👑 Total admins: ${adminCount}`);
        console.log(`👥 Total users: ${users.length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

console.log('👥 User Status Check\n');
checkAdminStatus();
