const mongoose = require('mongoose');
require('dotenv').config();

const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/broomees';

const clearData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Clearing Attendance collection...');
        await Attendance.deleteMany({});
        console.log('Attendance collection cleared.');

        console.log('Resetting attendanceLogs in Bookings...');
        await Booking.updateMany({}, { $set: { attendanceLogs: [] } });
        console.log('Booking attendanceLogs reset.');

        console.log('Data cleanup completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
