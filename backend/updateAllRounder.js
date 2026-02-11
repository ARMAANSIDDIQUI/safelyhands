const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const updateAllRounder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const allRounder = await Service.findOne({ title: { $regex: /All Rounder/i } });

        if (!allRounder) {
            console.log('All Rounder service not found');
            process.exit(1);
        }

        console.log(`Found service: ${allRounder.title}`);

        // 1. Update Subcategories
        allRounder.subcategories = [
            {
                name: "5 hours per day",
                price: "₹10000/month",
                description: "Complete household management, taking care of your daily needs.",
                image: "https://broomees.com/assets/img/services/all-rounder.jpg", // Placeholder or generic
                features: ["All services inclusive"]
            },
            {
                name: "6 hours per day",
                price: "₹12000/month",
                description: "Complete household management, taking care of your daily needs.",
                image: "https://broomees.com/assets/img/services/all-rounder.jpg",
                features: ["All services inclusive"]
            },
            {
                name: "8 hours per day",
                price: "₹16000/month",
                description: "Complete household management, taking care of your daily needs.",
                image: "https://broomees.com/assets/img/services/all-rounder.jpg",
                features: ["All services inclusive"]
            },
            {
                name: "10 hours per day",
                price: "₹18000/month",
                description: "Complete household management, taking care of your daily needs.",
                image: "https://broomees.com/assets/img/services/all-rounder.jpg",
                features: ["All services inclusive"]
            }
        ];

        // 2. Update Questions
        allRounder.questions = [
            {
                stepTitle: "Requirement Details",
                fields: [
                    {
                        name: "cleaningWork",
                        label: "Cleaning work",
                        type: "radio",
                        options: [
                            { label: "Brooming/Mopping", value: "brooming_mopping" },
                            { label: "Brooming/Mopping/Dusting", value: "brooming_mopping_dusting" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "dishwashing",
                        label: "Dishwashing",
                        type: "radio",
                        options: [
                            { label: "Required", value: "required" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "cookingWork",
                        label: "Cooking work",
                        type: "radio",
                        options: [
                            { label: "1 meal only", value: "1_meal" },
                            { label: "2 meals", value: "2_meals" },
                            { label: "All 3 meals", value: "3_meals" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "foodType",
                        label: "Food type (if cooking selected)",
                        type: "radio",
                        options: [
                            { label: "Veg", value: "veg" },
                            { label: "Non-veg", value: "non_veg" },
                            { label: "Both Veg & Non-veg", value: "both" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "laundry",
                        label: "Laundry",
                        type: "radio",
                        options: [
                            { label: "Laundry using washing machine", value: "washing_machine" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "houseSize",
                        label: "Select house size (Please describe the area of ONLY 1 floor)",
                        type: "radio",
                        options: [
                            { label: "1 BHK", value: "1bhk" },
                            { label: "2 BHK", value: "2bhk" },
                            { label: "3 BHK", value: "3bhk" },
                            { label: "4 BHK", value: "4bhk" },
                            { label: "5 BHK", value: "5bhk" },
                            { label: "6 BHK", value: "6bhk" }
                        ],
                        required: true
                    },
                    {
                        name: "floors",
                        label: "How many such floors?",
                        type: "radio",
                        options: [
                            { label: "1 floor only", value: "1" },
                            { label: "2 floors", value: "2" },
                            { label: "3 floors", value: "3" },
                            { label: "4 floors", value: "4" },
                            { label: "5 floors", value: "5" }
                        ],
                        required: true
                    },
                    {
                        name: "bathroomCleaning",
                        label: "Bathroom cleaning (Pots will NOT be cleaned by Broomees)",
                        type: "radio",
                        options: [
                            { label: "1-2 bathrooms", value: "1-2" },
                            { label: "3-4 bathrooms", value: "3-4" },
                            { label: "5-6 bathrooms", value: "5-6" },
                            { label: "Not required", value: "not_required" }
                        ],
                        required: true
                    },
                    {
                        name: "peopleCount",
                        label: "How many people are there at home?",
                        type: "radio",
                        options: [
                            { label: "1 person", value: "1" },
                            { label: "2 people", value: "2" },
                            { label: "3 people", value: "3" },
                            { label: "4 people", value: "4" },
                            { label: "5-6 people", value: "5-6" },
                            { label: "7-8 people", value: "7-8" }
                        ],
                        required: true
                    },
                    {
                        name: "pets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: [
                            { label: "No", value: "no" },
                            { label: "Dog(s)", value: "dogs" },
                            { label: "Cat(s)", value: "cats" }
                        ],
                        required: true
                    },
                    {
                        name: "shiftTime",
                        label: "Preferred Shift Time",
                        type: "radio",
                        options: [
                            { label: "Morning", value: "morning" },
                            { label: "Evening", value: "evening" },
                            { label: "Any", value: "any" }
                        ],
                        required: true
                    }
                ]
            }
        ];

        await allRounder.save();
        console.log('All Rounder updated successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateAllRounder();
