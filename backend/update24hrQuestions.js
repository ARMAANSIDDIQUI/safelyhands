require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

async function update24hrQuestions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // ─────── 24hr-housekeeper ───────
        const housekeeper = await Service.findOne({ slug: '24hr-housekeeper' });
        if (housekeeper) {
            housekeeper.questions = [
                {
                    stepTitle: "Housekeeper",
                    fields: [
                        {
                            name: "houseSize",
                            label: "Select house size (Please describe the area of ONLY 1 floor)",
                            type: "radio",
                            options: [
                                { label: "1 BHK", value: "1 BHK" },
                                { label: "2 BHK", value: "2 BHK" },
                                { label: "3 BHK", value: "3 BHK" },
                                { label: "4 BHK", value: "4 BHK" },
                                { label: "5 BHK", value: "5 BHK" },
                                { label: "6 BHK", value: "6 BHK" }
                            ],
                            required: true
                        },
                        {
                            name: "noOfFloors",
                            label: "How many such floors?",
                            type: "radio",
                            options: [
                                { label: "1 floor only", value: "1 floor only" },
                                { label: "2 floors", value: "2 floors" },
                                { label: "3 floors", value: "3 floors" },
                                { label: "4 floors", value: "4 floors" }
                            ],
                            required: true
                        },
                        {
                            name: "cleaningServices",
                            label: "Cleaning services?",
                            type: "radio",
                            options: [
                                { label: "Brooming", value: "Brooming" },
                                { label: "Mopping", value: "Mopping" },
                                { label: "Brooming + Mopping", value: "Brooming + Mopping" },
                                { label: "Not required", value: "Not required" }
                            ],
                            required: true
                        },
                        {
                            name: "additionalServices",
                            label: "Do you wish to include these services?",
                            type: "radio",
                            options: [
                                { label: "Bathroom cleaning", value: "Bathroom cleaning" },
                                { label: "Dusting", value: "Dusting" },
                                { label: "Dish Washing", value: "Dish Washing" },
                                { label: "Bathroom cleaning + Dusting", value: "Bathroom cleaning + Dusting" },
                                { label: "Bathroom cleaning + Dish Washing", value: "Bathroom cleaning + Dish Washing" },
                                { label: "Dusting + Dish Washing", value: "Dusting + Dish Washing" },
                                { label: "Bathroom cleaning + Dusting + Dish Washing", value: "Bathroom cleaning + Dusting + Dish Washing" },
                                { label: "Not required", value: "Not required" }
                            ],
                            required: true
                        },
                        {
                            name: "bathroomCleaning",
                            label: "Bathroom cleaning (Pots will NOT be cleaned by Broomees)",
                            type: "radio",
                            options: [
                                { label: "1-2 bathrooms", value: "1-2 bathrooms" },
                                { label: "3-4 bathrooms", value: "3-4 bathrooms" },
                                { label: "5-6 bathrooms", value: "5-6 bathrooms" },
                                { label: "Not required", value: "Not required" }
                            ],
                            required: true
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter available?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" }
                            ],
                            required: true
                        },
                        {
                            name: "workerReligion",
                            label: "Worker Religion?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "Hindu Only" },
                                { label: "Any Religion (Rs 500/- Off)", value: "Any Religion" }
                            ],
                            required: true
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home?",
                            helpText: "This would help us search for a pet friendly worker (if needed)",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" }
                            ],
                            required: true
                        }
                    ]
                }
            ];
            housekeeper.selectionMode = 'single';
            housekeeper.shift = '24 Hrs Live In';
            await housekeeper.save();
            console.log('Updated 24hr-housekeeper with 8 questions and selectionMode');
        } else {
            console.log('24hr-housekeeper not found!');
        }

        // ─────── 24hr-cook ───────
        const cook = await Service.findOne({ slug: '24hr-cook' });
        if (cook) {
            cook.questions = [
                {
                    stepTitle: "Cook",
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
                                { label: "7-8 people", value: "7-8" }
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
                            helpText: "For eggs, please select 'Veg + Non Veg'",
                            type: "radio",
                            options: [
                                { label: "Veg food only", value: "veg" },
                                { label: "Veg + Non Veg", value: "veg_nonveg" }
                            ],
                            required: true
                        },
                        {
                            name: "dishWashingRequired",
                            label: "Is dish-washing to be included?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" }
                            ],
                            required: true
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter available?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" }
                            ],
                            required: true
                        },
                        {
                            name: "workerReligion",
                            label: "Worker Religion?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "Hindu Only" },
                                { label: "Any Religion (Rs 500/- Off)", value: "Any Religion" }
                            ],
                            required: true
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home?",
                            helpText: "This would help us search for a pet friendly worker (if needed)",
                            type: "radio",
                            options: [
                                { label: "No", value: "No" },
                                { label: "Dog(s)", value: "Dogs" },
                                { label: "Cat(s)", value: "Cats" }
                            ],
                            required: true
                        }
                    ]
                }
            ];
            cook.selectionMode = 'single';
            cook.shift = '24 Hrs Live In';
            await cook.save();
            console.log('Updated 24hr-cook with 7 questions and selectionMode');
        } else {
            console.log('24hr-cook not found!');
        }

        // ─────── 24hr-babysitter ───────
        const babysitter = await Service.findOne({ slug: '24hr-babysitter' });
        if (babysitter) {
            babysitter.questions = [
                {
                    stepTitle: "Babysitter",
                    fields: [
                        {
                            name: "babyAge",
                            label: "Please select your baby's age",
                            type: "radio",
                            options: [
                                { label: "2-12 months", value: "2-12 months" },
                                { label: "1-2 years", value: "1-2 years" },
                                { label: "2-4 years", value: "2-4 years" },
                                { label: "More than 4 years", value: "More than 4 years" }
                            ],
                            required: true
                        },
                        {
                            name: "noOfKids",
                            label: "No of kids",
                            type: "radio",
                            options: [
                                { label: "Single", value: "Single" },
                                { label: "Twins", value: "Twins" }
                            ],
                            required: true
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter available?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" }
                            ],
                            required: true
                        },
                        {
                            name: "workerReligion",
                            label: "Worker Religion?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "Hindu Only" },
                                { label: "Any Religion (Rs 500/- Off)", value: "Any Religion" }
                            ],
                            required: true
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home?",
                            helpText: "This would help us search for a pet friendly worker (if needed)",
                            type: "radio",
                            options: [
                                { label: "No", value: "No" },
                                { label: "Dog(s)", value: "Dogs" },
                                { label: "Cat(s)", value: "Cats" }
                            ],
                            required: true
                        }
                    ]
                }
            ];
            babysitter.selectionMode = 'single';
            babysitter.shift = '24 Hrs Live In';
            await babysitter.save();
            console.log('Updated 24hr-babysitter with 5 questions and selectionMode');
        } else {
            console.log('24hr-babysitter not found!');
        }

        // ─────── Elderly Care ───────
        const elderly = await Service.findOne({ slug: 'elderly-care' });
        if (elderly) {
            elderly.shift = '24 Hrs Live In Japa';
            elderly.selectionMode = 'single';
            await elderly.save();
            console.log('Updated elderly-care shift and selectionMode');
        }

        // ─────── Domestic Help (Multi-select) ───────
        await Service.updateMany(
            { slug: { $in: ['brooming-mopping', 'dish-washing', 'laundry', 'bathroom-cleaning', 'dusting'] } },
            { $set: { shift: 'Domestic Help', selectionMode: 'multiple' } }
        );
        console.log('Updated Domestic Help services to multiple selectionMode');

        console.log('\nAll done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

update24hrQuestions();
