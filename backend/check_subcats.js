const mongoose = require('mongoose');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logFile = path.resolve(__dirname, 'subcats.txt');
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const services = await Service.find({ title: { $regex: /Babysitter|Elderly/i } });

        log("--- Services ---");
        services.forEach(s => {
            log(`\nService: ${s.title}`);
            if (s.subcategories && s.subcategories.length > 0) {
                s.subcategories.forEach(sub => {
                    log(`  - ${sub.name}: ${sub.description} (${sub.price})`);
                });
            } else {
                log("  No subcategories found.");
            }
        });

        process.exit(0);
    } catch (e) {
        log(e.toString());
        process.exit(1);
    }
};

check();
