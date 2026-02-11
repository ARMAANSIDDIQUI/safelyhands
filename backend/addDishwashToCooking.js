const mongoose = require('mongoose');
const Service = require('./models/Service');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const addDishwashToCooking = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find the cooking-homestyle service
        const cooking = await Service.findOne({ slug: 'cooking-homestyle' });

        if (!cooking) {
            console.log('cooking-homestyle service not found');
            process.exit(1);
        }

        console.log(`Found service: ${cooking.title}`);
        console.log(`Current questions steps: ${cooking.questions?.length || 0}`);

        // Add dish-washing question to the existing questions
        if (cooking.questions && cooking.questions.length > 0) {
            // Add to the first step's fields
            const existingFields = cooking.questions[0].fields || [];

            // Check if dishWashingRequired already exists
            const alreadyExists = existingFields.some(f => f.name === 'dishWashingRequired');
            if (alreadyExists) {
                console.log('dishWashingRequired question already exists, skipping');
                process.exit(0);
            }

            cooking.questions[0].fields.push({
                name: "dishWashingRequired",
                label: "Do you need dish-washing service?",
                type: "radio",
                options: [
                    { label: "Yes, required", value: "required" },
                    { label: "Not required", value: "not_required" }
                ],
                required: true
            });
        } else {
            // Create questions array if it doesn't exist
            cooking.questions = [
                {
                    stepTitle: "Requirement Details",
                    fields: [
                        {
                            name: "dishWashingRequired",
                            label: "Do you need dish-washing service?",
                            type: "radio",
                            options: [
                                { label: "Yes, required", value: "required" },
                                { label: "Not required", value: "not_required" }
                            ],
                            required: true
                        }
                    ]
                }
            ];
        }

        await cooking.save();
        console.log('Dish-washing question added to cooking-homestyle service');
        console.log(`Total fields now: ${cooking.questions[0].fields.length}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

addDishwashToCooking();
