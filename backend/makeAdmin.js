require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = 'armaansiddiqui.pms@gmail.com';

async function makeAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to database\n');

        console.log(`Looking for user: ${ADMIN_EMAIL}`);
        const user = await User.findOne({ email: ADMIN_EMAIL });

        if (!user) {
            console.log('❌ User not found!');
            console.log('\nThe user needs to sign up first before being made an admin.');
            console.log('Please visit the website and create an account with this email.');
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log('ℹ️  User is already an admin!');
            console.log(`\nUser Details:`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            process.exit(0);
        }

        // Update user role to admin
        user.role = 'admin';
        await user.save();

        console.log('✅ Successfully updated user to admin!\n');
        console.log(`User Details:`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`\n${user.name} is now an administrator!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    }
}

console.log('Make User Admin Script\n');
console.log(`Target Email: ${ADMIN_EMAIL}\n`);

makeAdmin();
