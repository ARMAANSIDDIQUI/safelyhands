const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const listAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const services = await Service.find({}, 'title category slug');
        console.log(JSON.stringify(services, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

listAll();
