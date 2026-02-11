const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const updateCookingServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // 1. Home-style food
        const homeStyle = await Service.findOne({ title: { $regex: /Home-style food/i } });
        if (homeStyle) {
            console.log(`Updating ${homeStyle.title}`);
            homeStyle.questions = [
                {
                    stepTitle: "Requirement Details",
                    fields: [
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
                                { label: "7-9 people", value: "7-9" }
                            ],
                            required: true
                        },
                        {
                            name: "mealsPerDay",
                            label: "How many meals per day?",
                            type: "radio",
                            options: [
                                { label: "Breakfast & Lunch", value: "breakfast_lunch" },
                                { label: "Dinner", value: "dinner" },
                                { label: "All 3 meals (breakfast+lunch+dinner)", value: "all_3" }
                            ],
                            required: true
                        },
                        {
                            name: "dietType",
                            label: "Veg/Non Veg?",
                            type: "radio",
                            options: [
                                { label: "Veg food only", value: "veg" },
                                { label: "Veg + Non Veg", value: "veg_nonveg" }
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
                        }
                    ]
                }
            ];
            await homeStyle.save();
            console.log('Home-style food updated');
        } else {
            console.log('Home-style food service not found');
        }

        // 2. Dish-washing
        const dishWashing = await Service.findOne({ title: { $regex: /Dish-washing/i } });
        if (dishWashing) {
            console.log(`Updating ${dishWashing.title}`);
            dishWashing.questions = [
                {
                    stepTitle: "Requirement Details",
                    fields: [
                        {
                            name: "dishWashingRequired",
                            label: "Dish-washing?",
                            type: "radio",
                            options: [
                                { label: "Required", value: "required" },
                                { label: "Not Required", value: "not_required" }
                            ],
                            required: true
                        }
                    ]
                }
            ];
            await dishWashing.save();
            console.log('Dish-washing updated');
        } else {
            console.log('Dish-washing service not found');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateCookingServices();
