const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const updateJapa = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find exact service
        const japa = await Service.findOne({ title: "24 Hrs Live In Japa" });

        if (!japa) {
            console.log('Japa service not found');
            process.exit(1);
        }

        console.log(`Found service: ${japa.title}`);

        // 1. Update Subcategories (Single Japa subcategory)
        japa.subcategories = [
            {
                name: "Japa",
                price: "₹33000/month",
                description: "Professional child care service, ensuring the safety & well-being of both mother and child",
                image: "https://broomees.com/assets/img/services/japa.jpg", // Placeholder
                features: ["All services inclusive"]
            }
        ];

        // 2. Update Questions (Exact match to user images)
        japa.questions = [
            {
                stepTitle: "Requirement Details",
                fields: [
                    {
                        name: "babyAge",
                        label: "Please select your baby's age",
                        type: "radio",
                        options: [
                            { label: "0-2 months", value: "0-2_months" }
                        ],
                        required: true
                    },
                    {
                        name: "numberOfKids",
                        label: "No of kids",
                        type: "radio",
                        options: [
                            { label: "Single", value: "single" },
                            { label: "Twins", value: "twins" }
                        ],
                        required: true
                    },
                    {
                        name: "servantQuarter",
                        label: "Servant quarter available ?",
                        type: "radio",
                        options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                        ],
                        required: true
                    },
                    {
                        name: "pets",
                        label: "Do you have pets at home ?",
                        type: "radio",
                        options: [
                            { label: "No", value: "no" },
                            { label: "Dog(s)", value: "dogs" },
                            { label: "Cat(s)", value: "cats" }
                        ],
                        required: true
                    }
                ]
            }
        ];

        await japa.save();
        console.log('Japa service updated successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateJapa();
