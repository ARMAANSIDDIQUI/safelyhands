const mongoose = require("mongoose");
const Service = require("./models/Service"); // Backend path
require("dotenv").config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected for Verification");

        const service = await Service.findOne({ title: { $regex: /Housekeeper/i } });

        if (service) {
            console.log(`Service: ${service.title}`);
            console.log(`Subcategories Count: ${service.subcategories?.length}`);
            if (service.subcategories?.length > 0) {
                console.log("Subcategory[0]:", JSON.stringify(service.subcategories[0], null, 2));
            } else {
                console.log("ERROR: No subcategories found!");
            }
        } else {
            console.log("ERROR: Service 'Housekeeper' not found!");
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

verify();
