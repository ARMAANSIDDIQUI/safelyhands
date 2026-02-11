const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logFile = path.resolve(__dirname, 'db_debug.log');
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const testDB = async () => {
    try {
        log("Attempting to connect...");
        await mongoose.connect(process.env.MONGODB_URI);
        log("✅ Connected to MongoDB");

        const count = await mongoose.connection.db.collection('services').countDocuments();
        log(`Services count: ${count}`);

        process.exit(0);
    } catch (e) {
        log(`❌ Error: ${e.message}`);
        process.exit(1);
    }
};

testDB();
