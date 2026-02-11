const mongoose = require('mongoose');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logFile = path.resolve(__dirname, 'slugs.txt');
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const services = await Service.find({});

        log("--- Services ---");
        services.forEach(s => {
            log(`Title: ${s.title}`);
            log(`Slug: ${s.slug}`);
            log(`Has Questions: ${s.questions && s.questions.length > 0}`);
            log(`Subcategories: ${s.subcategories ? s.subcategories.length : 0}`);
            if (s.subcategories && s.subcategories.length > 0) {
                log(JSON.stringify(s.subcategories.map(sc => sc.name), null, 2));
            }
            log("----------------");
        });

        process.exit(0);
    } catch (e) {
        log(e.toString());
        process.exit(1);
    }
};

check();
