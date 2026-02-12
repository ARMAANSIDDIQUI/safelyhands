const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // 1. Elderly Care
        const elderly = await Service.findOne({ title: { $regex: /Elderly Care/i } });
        if (elderly) {
            elderly.questions = [{
                stepTitle: "Elderly Care Details",
                fields: [
                    {
                        name: "elderlyAge",
                        label: "Elderly's Age",
                        type: "radio",
                        options: [
                            { label: "50-59", value: "50-59" },
                            { label: "60-69", value: "60-69" },
                            { label: "70-74", value: "70-74" },
                            { label: "75-79", value: "75-79" },
                            { label: "80+", value: "80+" }
                        ]
                    },
                    {
                        name: "diaperRequired",
                        label: "Diaper changing required?",
                        type: "radio",
                        options: [
                            { label: "Yes", value: "Yes", priceChange: 3000 },
                            { label: "No", value: "No" }
                        ]
                    }
                ]
            }];
            await elderly.save();
            console.log("✅ Updated Elderly Care with dynamic questions");
        }

        // 2. Babysitter
        const baby = await Service.findOne({ title: { $regex: /Babysitter/i } });
        if (baby) {
            baby.questions = [{
                stepTitle: "Babysitter Details",
                fields: [
                    {
                        name: "babysitterHours",
                        label: "How many hours per day?",
                        type: "radio", // Using radio/buttons for selection
                        options: ['4 hours', '5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours'].map(h => ({ label: h, value: h }))
                    },
                    {
                        name: "noOfKids",
                        label: "No of kids",
                        type: "radio",
                        options: [
                            { label: "Single", value: "Single" },
                            { label: "Twins", value: "Twins", priceChange: 3000 }
                        ]
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: [
                            { label: "No", value: "No" },
                            { label: "Dog(s)", value: "Dog(s)" },
                            { label: "Cat(s)", value: "Cat(s)" }
                        ]
                    }
                ]
            }];
            await baby.save();
            console.log("✅ Updated Babysitter with dynamic questions");
        }

        // 3. Japa (Assuming title contains Japa)
        const japa = await Service.findOne({ title: { $regex: /Japa/i } });
        if (japa) {
            japa.questions = [{
                stepTitle: "Japa Details",
                fields: [
                    {
                        name: "babyAge",
                        label: "Please select your baby's age",
                        type: "radio",
                        options: [{ label: "0-2 months", value: "0-2 months" }]
                    },
                    {
                        name: "noOfKids",
                        label: "No of kids",
                        type: "radio",
                        options: [
                            { label: "Single", value: "Single" },
                            { label: "Twins", value: "Twins", priceChange: 5000 }
                        ]
                    },
                    {
                        name: "servantQuarter",
                        label: "Servant quarter available?",
                        type: "radio",
                        options: [
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" }
                        ]
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: [
                            { label: "No", value: "No" },
                            { label: "Dog(s)", value: "Dog(s)" },
                            { label: "Cat(s)", value: "Cat(s)" }
                        ]
                    }
                ]
            }];
            await japa.save();
            console.log("✅ Updated Japa with dynamic questions");
        }

        // 4. Peon
        const peon = await Service.findOne({ slug: "peon" });
        if (peon) {
            peon.questions = [{
                stepTitle: "Peon / Office Help Details",
                fields: [
                    {
                        name: "officeType",
                        label: "Office type",
                        type: "radio",
                        options: [
                            { label: "Small", value: "Small", priceChange: 0 },
                            { label: "Medium", value: "Medium", priceChange: 2000 },
                            { label: "Large", value: "Large", priceChange: 4000 }
                        ]
                    },
                    {
                        name: "officeTasks",
                        label: "Primary Tasks (Select all that apply)",
                        type: "checkbox",
                        options: [
                            { label: "Pantry", value: "Pantry" },
                            { label: "Cleaning", value: "Cleaning" },
                            { label: "Field Work", value: "Field Work" }
                        ]
                    }
                ]
            }];
            await peon.save();
            console.log("✅ Updated Peon with dynamic questions");
        }

        // 5. Patient Care
        const patient = await Service.findOne({ slug: { $regex: /patient-care/i } });
        if (patient) {
            patient.questions = [{
                stepTitle: "Patient Care Details",
                fields: [
                    {
                        name: "patientCondition",
                        label: "Patient's condition",
                        type: "radio",
                        options: [
                            { label: "Stable", value: "Stable" },
                            { label: "Recovery", value: "Recovery" },
                            { label: "Critical", value: "Critical", priceChange: 5000 },
                            { label: "Bedridden", value: "Bedridden", priceChange: 3000 }
                        ]
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: [
                            { label: "No", value: "No" },
                            { label: "Dog(s)", value: "Dog(s)" },
                            { label: "Cat(s)", value: "Cat(s)" }
                        ]
                    }
                ]
            }];
            await patient.save();
            console.log("✅ Updated Patient Care with dynamic questions");
        }

        // 6. All Rounder
        const allRounder = await Service.findOne({ title: { $regex: /All Rounder/i } });
        if (allRounder) {
            allRounder.questions = [{
                stepTitle: "All Rounder Details",
                fields: [
                    {
                        name: "cookingWork",
                        label: "Cooking work",
                        type: "radio",
                        options: ['1 meal only', '2 meals', 'All 3 meals', 'Not required'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "foodType",
                        label: "Food type (if cooking selected)",
                        type: "radio",
                        options: ['Veg', 'Non-veg', 'Both Veg & Non-veg', 'Not required'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "laundry",
                        label: "Laundry",
                        type: "radio",
                        options: ['Laundry using washing machine', 'Not required'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "houseSize",
                        label: "Select house size (Area of ONLY 1 floor)",
                        type: "radio",
                        options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'].map(o => {
                            let priceChange = 0;
                            if (o === '4 BHK' || o === '5 BHK') priceChange = 2000;
                            return { label: o, value: o, priceChange };
                        })
                    },
                    {
                        name: "noOfFloors",
                        label: "How many such floors?",
                        type: "radio",
                        options: ['1 floor only', '2 floors', '3 floors', '4 floors', '5 floors'].map(o => {
                            let priceChange = 0;
                            if (o !== '1 floor only') priceChange = 3000;
                            return { label: o, value: o, priceChange };
                        })
                    },
                    {
                        name: "bathroomCleaning",
                        label: "Bathroom cleaning",
                        type: "radio",
                        options: ['1-2 bathrooms', '3-4 bathrooms', '5-6 bathrooms', 'Not required'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "noOfPeople",
                        label: "How many people are there at home?",
                        type: "radio",
                        options: ['1 person', '2 people', '3 people', '4 people', '5-6 people', '7-8 people'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: ['No', 'Dog(s)', 'Cat(s)'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await allRounder.save();
            console.log("✅ Updated All Rounder with dynamic questions");
        }

        // 7. Cooking
        const cooking = await Service.findOne({ title: { $regex: /Cook|Home-style food/i } });
        if (cooking) {
            cooking.questions = [{
                stepTitle: "Cooking Details",
                fields: [
                    {
                        name: "noOfPeople",
                        label: "How many people are there at home?",
                        type: "radio",
                        options: ['1 person', '2 people', '3 people', '4 people', '5-6 people', '7-8 people'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "mealsPerDay",
                        label: "How many meals per day?",
                        type: "radio",
                        options: [
                            { label: 'Breakfast & Lunch', value: 'Breakfast & Lunch' },
                            { label: 'Dinner', value: 'Dinner' },
                            { label: 'All 3 meals (breakfast+lunch+dinner)', value: 'All 3 meals (breakfast+lunch+dinner)', priceChange: 3000 }
                        ]
                    },
                    {
                        name: "vegNonVeg",
                        label: "Veg/Non Veg?",
                        type: "radio",
                        options: [
                            { label: 'Veg food only', value: 'Veg food only' },
                            { label: 'Veg + Non Veg', value: 'Veg + Non Veg', priceChange: 2000 }
                        ]
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: ['No', 'Dog(s)', 'Cat(s)'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await cooking.save();
            console.log("✅ Updated Cooking with dynamic questions");
        }

        // 8. Brooming
        const brooming = await Service.findOne({ title: { $regex: /Brooming/i } });
        if (brooming) {
            brooming.questions = [{
                stepTitle: "Brooming Details",
                fields: [
                    {
                        name: "houseSize",
                        label: "Select house size (Area of ONLY 1 floor)",
                        type: "radio",
                        options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "noOfFloors",
                        label: "How many such floors?",
                        type: "radio",
                        options: ['1 floor only', '2 floors', '3 floors', '4 floors', '5 floors'].map(o => ({ label: o, value: o }))
                    },
                    {
                        name: "hasPets",
                        label: "Do you have pets at home?",
                        type: "radio",
                        options: ['No', 'Dog(s)', 'Cat(s)'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await brooming.save();
            console.log("✅ Updated Brooming with dynamic questions");
        }

        // 9. Dusting
        const dusting = await Service.findOne({ title: { $regex: /Dusting/i } });
        if (dusting) {
            dusting.questions = [{
                stepTitle: "Dusting Details",
                fields: [
                    {
                        name: "dustingDuration",
                        label: "For how long?",
                        type: "radio",
                        options: ['30 mins', '1 hour', '1.5 hrs', '2 hours'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await dusting.save();
            console.log("✅ Updated Dusting with dynamic questions");
        }

        // 10. Bathroom
        const bathroom = await Service.findOne({ title: { $regex: /Bathroom/i } });
        if (bathroom) {
            bathroom.questions = [{
                stepTitle: "Bathroom Cleaning Details",
                fields: [
                    {
                        name: "bathroomCleaning",
                        label: "For how many bathrooms?",
                        type: "radio",
                        options: ['1-2 bathrooms', '3-4 bathrooms', '5-6 bathrooms'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await bathroom.save();
            console.log("✅ Updated Bathroom with dynamic questions");
        }

        // 11. Dishwashing
        const dishwashing = await Service.findOne({ title: { $regex: /Dish( |-)?washing/i } });
        if (dishwashing) {
            dishwashing.questions = [{
                stepTitle: "Dishwashing Details",
                fields: [
                    {
                        name: "noOfPeople",
                        label: "How many people are there at home?",
                        type: "radio",
                        options: ['1 person only', '2 people', '3 people', '4 people', '5 people', '6 people', '7+ people'].map(o => ({ label: o, value: o }))
                    }
                ]
            }];
            await dishwashing.save();
            console.log("✅ Updated Dishwashing with dynamic questions");
        }

        console.log("🏁 Migration Complete");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error:", e);
        process.exit(1);
    }
};

migrate();
