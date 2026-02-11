const mongoose = require("mongoose");
const Service = require("../models/Service");
const SubCategory = require("../models/SubCategory");
const Booking = require("../models/Booking");
require("dotenv").config({ path: "./backend/.env" });


function getAllRounderQuestions() {
    return [
        {
            stepTitle: "Cleaning & Cooking",
            fields: [
                {
                    name: "cleaningWork",
                    label: "Cleaning work",
                    type: "radio",
                    options: [
                        { label: "Brooming/Mopping", value: "brooming_mopping" },
                        { label: "Brooming/Mopping/Dusting", value: "brooming_mopping_dusting", priceChange: 500 },
                        { label: "Not required", value: "none" }
                    ]
                },
                {
                    name: "dishwashing",
                    label: "Dishwashing",
                    type: "radio",
                    options: [
                        { label: "Required", value: "yes" },
                        { label: "Not required", value: "no" }
                    ]
                },
                {
                    name: "cookingWork",
                    label: "Cooking work",
                    type: "radio",
                    options: [
                        { label: "1 meal only", value: "1_meal" },
                        { label: "2 meals", value: "2_meals", priceChange: 1000 },
                        { label: "All 3 meals", value: "3_meals", priceChange: 2000 },
                        { label: "Not required", value: "none" }
                    ]
                },
                {
                    name: "foodType",
                    label: "Food type (if cooking selected)",
                    type: "radio",
                    condition: { key: "cookingWork", value: "!none" }, // Logic handled in frontend usually found by existence
                    options: [
                        { label: "Veg", value: "veg" },
                        { label: "Non-veg", value: "non_veg" },
                        { label: "Both Veg & Non-veg", value: "both", priceChange: 500 },
                        { label: "Not required", value: "none" }
                    ]
                }
            ]
        },
        {
            stepTitle: "Household Details",
            fields: [
                {
                    name: "laundry",
                    label: "Laundry",
                    type: "radio",
                    options: [
                        { label: "Machine Wash", value: "machine" },
                        { label: "Not required", value: "none" }
                    ]
                },
                {
                    name: "houseSize",
                    label: "Select house size (1 floor area)",
                    type: "select",
                    options: [
                        { label: "1 BHK", value: "1bhk" },
                        { label: "2 BHK", value: "2bhk" },
                        { label: "3 BHK", value: "3bhk", priceChange: 500 },
                        { label: "4 BHK", value: "4bhk", priceChange: 1000 },
                        { label: "5 BHK", value: "5bhk", priceChange: 1500 },
                        { label: "6 BHK", value: "6bhk", priceChange: 2000 }
                    ]
                },
                {
                    name: "floors",
                    label: "How many such floors?",
                    type: "select",
                    options: [
                        { label: "1 floor only", value: "1" },
                        { label: "2 floors", value: "2", priceChange: 1000 },
                        { label: "3 floors", value: "3", priceChange: 2000 },
                        { label: "4 floors", value: "4", priceChange: 3000 },
                        { label: "5 floors", value: "5", priceChange: 4000 }
                    ]
                },
                {
                    name: "bathroomCleaning",
                    label: "Bathroom cleaning",
                    type: "radio",
                    options: [
                        { label: "1-2 bathrooms", value: "1-2" },
                        { label: "3-4 bathrooms", value: "3-4", priceChange: 500 },
                        { label: "5-6 bathrooms", value: "5-6", priceChange: 1000 },
                        { label: "Not required", value: "none" }
                    ]
                },
                {
                    name: "peopleCount",
                    label: "How many people are there at home?",
                    type: "select",
                    options: [
                        { label: "1 person", value: "1" },
                        { label: "2 people", value: "2" },
                        { label: "3 people", value: "3" },
                        { label: "4 people", value: "4" },
                        { label: "5-6 people", value: "5-6" },
                        { label: "7-9 people", value: "7-9" }
                    ]
                },
                {
                    name: "pets",
                    label: "Do you have pets at home?",
                    type: "radio",
                    options: [
                        { label: "No", value: "no" },
                        { label: "Dog(s)", value: "dogs" },
                        { label: "Cat(s)", value: "cats" }
                    ]
                }
            ]
        }
    ];
}

const servicesData = [
    {
        title: "Domestic Help", // Changed from Housekeeper as per header "Domestic help" in prompt, or maybe keep Housekeeper? Prompt says "Domestic help" then "Book a professional housekeeper". I will use "Domestic Help" as title.
        slug: "housekeeper",
        subtitle: "Professional home cleaning",
        description: "Book a professional housekeeper for your daily chores like brooming, mopping, dusting, dish-washing.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/edec0091f4348c22a0b08c5a10cef4d5-7.jpg",
        icon: "Home",
        gradientFrom: "orange-100",
        gradientTo: "orange-200",
        selectionMode: "multiple"
    },
    {
        title: "Cook",
        slug: "cook",
        subtitle: "Delicious home meals",
        description: "Professional cooks and chefs to prepare delicious, nutritious home-cooked meals for your family.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/130359605e8fb04bd76de91901a716bb-5.jpg",
        icon: "ChefHat",
        gradientFrom: "green-100",
        gradientTo: "green-200",
        selectionMode: "multiple"
    },
    {
        title: "Babysitter",
        slug: "babysitter",
        subtitle: "Caring for your little ones",
        description: "Book a reliable babysitter/ japa for your young ones. Babysitters are experienced professionals who can take care of your baby’s day-to-day needs like feeding, playing and putting to sleep. Japa maids are experts who take care of new born babies and mothers.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/cd253c39bd16fcdf8835ff502fec9273-3.jpg",
        icon: "Baby",
        gradientFrom: "pink-100",
        gradientTo: "pink-200",
        selectionMode: "single"
    },
    {
        title: "Elderly Care",
        slug: "elderly-care",
        subtitle: "Compassionate support",
        description: "Compassionate and trained caregivers providing dedicated 24-hour support and companionship for senior citizens.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/safely hands workersElederlyCare1-2.jpg",
        icon: "HeartHandshake",
        gradientFrom: "blue-100",
        gradientTo: "blue-200",
        selectionMode: "single"
    },
    {
        title: "All-Rounder",
        slug: "all-rounder",
        subtitle: "Versatile home support",
        description: "Versatile all-rounder staff capable of handling multiple household roles including cooking, cleaning, and general household management.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/allrounderImag_08_11_24-4.png",
        icon: "Layers",
        gradientFrom: "purple-100",
        gradientTo: "purple-200",
        selectionMode: "single"
    },
    {
        title: "24 Hrs Live-in",
        slug: "24-hrs",
        subtitle: "Full time support",
        description: "Verified and reliable 24 hrs live in workers. Feel free to customize your booking!",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/24hrs_livein_08_11_24-2.png",
        icon: "Clock",
        gradientFrom: "indigo-100",
        gradientTo: "indigo-200",
        selectionMode: "single"
    },
    {
        title: "Patient Care",
        slug: "patient-care",
        subtitle: "Dedicated support for recovery",
        description: "Specialized care for patients recovering from illness or surgery.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/safely hands workersElederlyCare1-2.jpg", // Reusing Elderly Care image
        icon: "Stethoscope",
        gradientFrom: "cyan-100",
        gradientTo: "cyan-200",
        selectionMode: "single"
    },
    {
        title: "Peon Service",
        slug: "peon-service",
        subtitle: "Office and pantry assistance",
        description: "Reliable staff for office maintenance, pantry management, and errands.",
        imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/e6c33f1f-26f1-4bf2-92ba-b28a162e87df-broomees-com/assets/images/allrounderImag_08_11_24-4.png", // Reusing All-Rounder image
        icon: "Briefcase",
        gradientFrom: "slate-100",
        gradientTo: "slate-200",
        selectionMode: "single"
    }
];

const subCategoriesData = {
    "housekeeper": [
        {
            name: "Morning Shift (8am - 8pm)",
            price: 5000,
            description: "Daily cleaning in the morning.",
            features: ["Brooming", "Mopping", "Dishwashing", "Dusting"],
            questions: [
                {
                    stepTitle: "House Details",
                    fields: [
                        {
                            name: "houseSize",
                            label: "House Size",
                            type: "select",
                            options: [
                                { label: "1 BHK", value: "1bhk", priceChange: 0 },
                                { label: "2 BHK", value: "2bhk", priceChange: 500 },
                                { label: "3 BHK", value: "3bhk", priceChange: 1000 },
                                { label: "4 BHK+", value: "4bhk", priceChange: 1500 }
                            ]
                        },
                        {
                            name: "bathroomCount",
                            label: "Number of Bathrooms",
                            type: "select",
                            options: [
                                { label: "1", value: "1", priceChange: 0 },
                                { label: "2", value: "2", priceChange: 200 },
                                { label: "3+", value: "3plus", priceChange: 400 }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Live-in (24 Hrs)",
            price: 18000,
            description: "24/7 support for your home.",
            features: ["Cleaning", "Cooking Support", "Laundry"],
            questions: [
                {
                    stepTitle: "Accommodation",
                    fields: [
                        {
                            name: "servantQuarter",
                            label: "Do you have a servant quarter?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No (Adjust in home)", value: "no" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "cook": [
        {
            name: "Home-style food",
            price: 3000,
            description: "Authentic Indian home-style cooking service for delicious meals",
            features: ["All services Inclusive", "Verified Staff", "Healthy Meals"],
            inclusions: "Note : Cook will cook 1-2 dish per meal",
            questions: [
                {
                    stepTitle: "Requirement Details",
                    fields: [
                        {
                            name: "peopleCount",
                            label: "How many people are there at home?",
                            type: "select",
                            options: [
                                { label: "1 person", value: "1" },
                                { label: "2 people", value: "2" },
                                { label: "3 people", value: "3" },
                                { label: "4 people", value: "4" },
                                { label: "5-6 people", value: "5-6" },
                                { label: "7-8 people", value: "7-8" }
                            ]
                        },
                        {
                            name: "mealsPerDay",
                            label: "How many meals per day?",
                            type: "select", // Changed to select based on "Select 1 out of 3 options" usually implying pills or dropdown, keeping consistent with others or radio if distinct
                            options: [
                                { label: "Breakfast & Lunch", value: "breakfast_lunch" },
                                { label: "Dinner", value: "dinner" },
                                { label: "All 3 meals (breakfast+lunch+dinner)", value: "all_3" }
                            ]
                        },
                        {
                            name: "foodType",
                            label: "Veg/Non Veg?",
                            type: "radio",
                            options: [
                                { label: "Veg food only", value: "veg" },
                                { label: "Veg + Non Veg", value: "veg_nonveg" }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home ?",
                            type: "radio",
                            options: [
                                { label: "No", value: "no" },
                                { label: "Dog(s)", value: "dogs" },
                                { label: "Cat(s)", value: "cats" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Dish-washing",
            price: 2550,
            description: "Expert dishwashing service ensuring spotless and sanitized dishes",
            features: ["Spotless Cleaning", "Verified Staff"],
            questions: [
                {
                    stepTitle: "Requirements",
                    fields: [
                        {
                            name: "isDishwashingRequired",
                            label: "Dish-washing?",
                            type: "radio",
                            options: [
                                { label: "Required", value: "required" },
                                { label: "Not Required", value: "not_required" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "babysitter": [
        {
            name: "2-12 Months Baby Care",
            price: 2500, // Monthly starting price
            description: "Babycare services for the well-being of your little one",
            features: ["All services Inclusive", "Verified Staff"],
            inclusions: "Our babysitters in this category have expertise in all things related to diapers, formula milk, massaging, sterilising, bathing, burping, washing of clothes, taking care of hygiene, nail cutting, basic food for baby like daliyaa, khichdi, playing with babies and making them sleep, packing baby travel bag, etc.",
            questions: [
                {
                    stepTitle: "Booking Details",
                    fields: [
                        {
                            name: "hoursPerDay",
                            label: "How many hours per day?",
                            type: "select",
                            options: [
                                { label: "4 hours", value: "4" },
                                { label: "5 hours", value: "5" },
                                { label: "6 hours", value: "6" },
                                { label: "7 hours", value: "7" },
                                { label: "8 hours", value: "8" },
                                { label: "9 hours", value: "9" },
                                { label: "10 hours", value: "10" }
                            ]
                        },
                        {
                            name: "numberOfKids",
                            label: "No of kids",
                            type: "radio",
                            options: [
                                { label: "Single", value: "single" },
                                { label: "Twins", value: "twins", priceChange: 5000 }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home?",
                            type: "radio",
                            options: [
                                { label: "No", value: "no" },
                                { label: "Dog(s)", value: "dogs" },
                                { label: "Cat(s)", value: "cats" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Japa",
            price: 33000,
            description: "Professional child care service, ensuring the safety & well-being of both mother and child",
            features: ["All services Inclusive", "Verified Staff", "Newborn Care"],
            inclusions: "Expert care for newborns including massage, bathing, and mother's recovery support.\n\nServices include: Massage for baby and mother, bathing, burping, sleep training, and overall newborn care.",
            questions: [
                {
                    stepTitle: "Japa Details",
                    fields: [
                        {
                            name: "babyAge",
                            label: "Please select your baby's age",
                            type: "select",
                            options: [
                                { label: "0-2 months", value: "0-2m" }
                            ]
                        },
                        {
                            name: "numberOfKids",
                            label: "No of kids",
                            type: "radio",
                            options: [
                                { label: "Single", value: "single" },
                                { label: "Twins", value: "twins", priceChange: 5000 }
                            ]
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter availaible ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home ?",
                            type: "radio",
                            options: [
                                { label: "No", value: "no" },
                                { label: "Dog(s)", value: "dogs" },
                                { label: "Cat(s)", value: "cats" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "elderly-care": [
        {
            name: "Elderly Care (24 Hrs)",
            price: 25000,
            description: "Experienced & compassionate, male & female care givers. From personal care to mobility support & emotional well-being.",
            features: ["All services Inclusive", "Verified Staff", "Assistance for elders"],
            video: "", // Placeholder for video URL
            questions: [
                {
                    stepTitle: "Elderly Details",
                    fields: [
                        {
                            name: "elderlyAge",
                            label: "Elderly's Age",
                            type: "select",
                            options: [
                                { label: "50-60", value: "50-60" },
                                { label: "60-70", value: "60-70" },
                                { label: "70-80", value: "70-80" },
                                { label: "80-90", value: "80-90" },
                                { label: "90+", value: "90plus" }
                            ]
                        },
                        {
                            name: "diaperChanging",
                            label: "Diaper changing required?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "all-rounder": [
        {
            name: "5 Hours Per Day",
            price: 11000,
            features: ["Complete household management", "Verified Staff", "All services inclusive"],
            inclusions: "Floor, slab and basin cleaning only.\n\nPots will NOT be cleaned by safely hands workers. Cleaning chemicals, agents etc. have to be provided by client.\n\nPlease note: You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality. The worker will only complete tasks possible in the booked time slot.",
            questions: getAllRounderQuestions()
        },
        {
            name: "6 Hours Per Day",
            price: 14000,
            features: ["Complete household management", "Verified Staff", "All services inclusive"],
            inclusions: "Floor, slab and basin cleaning only.\n\nPots will NOT be cleaned by safely hands workers. Cleaning chemicals, agents etc. have to be provided by client.\n\nPlease note: You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality. The worker will only complete tasks possible in the booked time slot.",
            questions: getAllRounderQuestions()
        },
        {
            name: "8 Hours Per Day",
            price: 16000,
            features: ["Complete household management", "Verified Staff", "All services inclusive"],
            inclusions: "Floor, slab and basin cleaning only.\n\nPots will NOT be cleaned by safely hands workers. Cleaning chemicals, agents etc. have to be provided by client.\n\nPlease note: You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality. The worker will only complete tasks possible in the booked time slot.",
            questions: getAllRounderQuestions()
        },
        {
            name: "10 Hours Per Day",
            price: 18000,
            features: ["Complete household management", "Verified Staff", "All services inclusive"],
            inclusions: "Floor, slab and basin cleaning only.\n\nPots will NOT be cleaned by safely hands workers. Cleaning chemicals, agents etc. have to be provided by client.\n\nPlease note: You are booking for specific hours/slots and we do not guarantee all selected tasks to be completed in that time-frame. It is only an estimate of the tasks for us to ensure service quality. The worker will only complete tasks possible in the booked time slot.",
            questions: getAllRounderQuestions()
        }
    ],
    "24-hrs": [
        {
            name: "Housekeeper",
            price: 15000,
            features: ["Complete floor cleaning", "Sanitization", "Verified Staff"],
            description: "Complete floor cleaning and sanitization for a sparkling clean home",
            questions: [
                {
                    stepTitle: "House Details",
                    fields: [
                        {
                            name: "houseSize",
                            label: "Select house size (Please describe the area of ONLY 1 floor)",
                            type: "select",
                            options: [
                                { label: "1 BHK", value: "1bhk" },
                                { label: "2 BHK", value: "2bhk" },
                                { label: "3 BHK", value: "3bhk" },
                                { label: "4 BHK", value: "4bhk" },
                                { label: "5 BHK", value: "5bhk" },
                                { label: "6 BHK", value: "6bhk" }
                            ]
                        },
                        {
                            name: "floorCount",
                            label: "How many such floors?",
                            type: "select",
                            options: [
                                { label: "1 floor only", value: "1" },
                                { label: "2 floors", value: "2" },
                                { label: "3 floors", value: "3" },
                                { label: "4 floors", value: "4" }
                            ]
                        },
                        {
                            name: "cleaningServiceType",
                            label: "Cleaning services?",
                            type: "select",
                            options: [
                                { label: "Brooming", value: "brooming" },
                                { label: "Mopping", value: "mopping" },
                                { label: "Brooming + Mopping", value: "brooming_mopping" },
                                { label: "Not required", value: "none" }
                            ]
                        },
                        {
                            name: "additionalServices",
                            label: "Do you wish to include these services?",
                            type: "select",
                            options: [
                                { label: "Bathroom cleaning", value: "bathroom", priceChange: 500 },
                                { label: "Dusting", value: "dusting", priceChange: 500 },
                                { label: "Dish Washing", value: "dishwashing", priceChange: 1000 },
                                { label: "Bathroom cleaning + Dusting", value: "bathroom_dusting", priceChange: 1000 },
                                { label: "Bathroom cleaning + Dish Washing", value: "bathroom_dishwashing", priceChange: 1500 },
                                { label: "Dusting + Dish Washing", value: "dusting_dishwashing", priceChange: 1500 },
                                { label: "Bathroom cleaning + Dusting + Dish Washing", value: "all", priceChange: 2000 },
                                { label: "Not required", value: "none", priceChange: 0 }
                            ]
                        },
                        {
                            name: "bathroomCount",
                            label: "Bathroom cleaning (Pots will NOT be cleaned by safely hands workers)",
                            type: "select",
                            options: [
                                { label: "1-2 bathrooms", value: "1-2", priceChange: 0 },
                                { label: "3-4 bathrooms", value: "3-4", priceChange: 500 },
                                { label: "5-6 bathrooms", value: "5-6", priceChange: 1000 },
                                { label: "Not required", value: "none", priceChange: 0 }
                            ]
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter availaible ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes", priceChange: 0 },
                                { label: "No", value: "no", priceChange: 0 }
                            ]
                        },
                        {
                            name: "religion",
                            label: "Worker Religion ?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "hindu", priceChange: 0 },
                                { label: "Any Religion (rs 500/- OFF)", value: "any", priceChange: -500 }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes", priceChange: 500 },
                                { label: "No", value: "no", priceChange: 0 }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Japa Maid",
            price: 30000,
            features: ["Newborn Care", "Postpartum Care", "Baby Massage", "Mother Support"],
            description: "Specialized care for newborns and new mothers (Japa care).",
            questions: [
                {
                    stepTitle: "Baby Details",
                    fields: [
                        {
                            name: "babyDOB",
                            label: "Baby's Date of Birth (or Expected)",
                            type: "date",
                        },
                        {
                            name: "massage",
                            label: "Baby Massage Required?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "motherCare",
                            label: "Mother's Massage/Care Required?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes", priceChange: 2000 },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter availaible ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Cook",
            price: 17000,
            features: ["Authentic Indian Cooking", "Verified Staff", "Healthy Meals"],
            description: "Authentic Indian home-style cooking service for delicious meals",
            inclusions: "Note : Cook will cook 1-2 dish per meal",
            questions: [
                {
                    stepTitle: "Cooking Details",
                    fields: [
                        {
                            name: "peopleCount",
                            label: "How many people are there at home?",
                            type: "select",
                            options: [
                                { label: "1 person", value: "1", priceChange: 0 },
                                { label: "2 people", value: "2", priceChange: 0 },
                                { label: "3 people", value: "3", priceChange: 1000 },
                                { label: "4 people", value: "4", priceChange: 1500 },
                                { label: "5-6 people", value: "5-6", priceChange: 2000 },
                                { label: "7-8 people", value: "7-8", priceChange: 3000 }
                            ]
                        },
                        {
                            name: "mealsPerDay",
                            label: "How many meals per day?",
                            type: "select",
                            options: [
                                { label: "Breakfast & Lunch", value: "breakfast_lunch", priceChange: 0 },
                                { label: "Dinner", value: "dinner", priceChange: 0 },
                                { label: "All 3 meals (breakfast+lunch+dinner)", value: "all_3", priceChange: 1000 }
                            ]
                        },
                        {
                            name: "foodType",
                            label: "Veg/Non Veg?",
                            type: "radio",
                            options: [
                                { label: "Veg food only", value: "veg" },
                                { label: "Veg + Non Veg", value: "veg_nonveg" }
                            ]
                        },
                        {
                            name: "isDishwashingRequired",
                            label: "Is dish-washing to be included?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter availaible ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "religion",
                            label: "Worker Religion ?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "hindu" },
                                { label: "Any Religion (rs 500/- OFF)", value: "any", priceChange: -500 }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home ?",
                            type: "radio",
                            options: [
                                { label: "No", value: "no" },
                                { label: "Dog(s)", value: "dogs" },
                                { label: "Cat(s)", value: "cats" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Babysitter",
            price: 20000,
            features: ["Verified Staff", "Child Care Expert", "Safety First"],
            description: "Professional child care service, ensuring their safety & well-being",
            questions: [
                {
                    stepTitle: "Baby Details",
                    fields: [
                        {
                            name: "babyAge",
                            label: "Please select your baby's age",
                            type: "select",
                            options: [
                                { label: "2-12 months", value: "2-12m" },
                                { label: "1-2 years", value: "1-2y" },
                                { label: "2-4 years", value: "2-4y" },
                                { label: "More than 4 years", value: "4y_plus" }
                            ]
                        },
                        {
                            name: "numberOfKids",
                            label: "No of kids",
                            type: "radio",
                            options: [
                                { label: "Single", value: "single" },
                                { label: "Twins", value: "twins" }
                            ]
                        },
                        {
                            name: "servantQuarter",
                            label: "Servant quarter availaible ?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" }
                            ]
                        },
                        {
                            name: "religion",
                            label: "Worker Religion ?",
                            type: "radio",
                            options: [
                                { label: "Hindu Only", value: "hindu" },
                                { label: "Any Religion (rs 500/- OFF)", value: "any", priceChange: -500 }
                            ]
                        },
                        {
                            name: "pets",
                            label: "Do you have pets at home ?",
                            type: "radio",
                            options: [
                                { label: "No", value: "no" },
                                { label: "Dog(s)", value: "dogs" },
                                { label: "Cat(s)", value: "cats" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "All-Rounder",
            price: 16000,
            features: ["Complete household management", "Verified Staff", "All services inclusive"],
            description: "Complete household management, taking care of cooking, cleaning and more",
            questions: getAllRounderQuestions()
        }
    ],
    "patient-care": [
        {
            name: "12 Hours Patient Care",
            price: 22000,
            features: ["Day or Night Shift", "Medication Management", "Mobility Assistance", "Vitals Monitoring"],
            description: "Professional patient care for 12-hour shifts to assist with recovery and daily needs.",
            questions: [
                {
                    stepTitle: "Patient Details",
                    fields: [
                        {
                            name: "patientAge",
                            label: "Patient's Age",
                            type: "text",
                            placeholder: "e.g. 65 years"
                        },
                        {
                            name: "gender",
                            label: "Patient's Gender",
                            type: "radio",
                            options: [
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" }
                            ]
                        },
                        {
                            name: "mobility",
                            label: "Mobility Status",
                            type: "select",
                            options: [
                                { label: "Walking / Independent", value: "walking" },
                                { label: "Semi-mobile (Needs support)", value: "semi_mobile" },
                                { label: "Bedridden", value: "bedridden", priceChange: 2000 }
                            ]
                        },
                        {
                            name: "medicalCondition",
                            label: "Medical Condition (Brief)",
                            type: "text",
                            placeholder: "e.g. Post-surgery, Stroke recovery..."
                        },
                        {
                            name: "shiftType",
                            label: "Preferred Shift",
                            type: "radio",
                            options: [
                                { label: "Day Shift (8am - 8pm)", value: "day" },
                                { label: "Night Shift (8pm - 8am)", value: "night" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "24 Hours Patient Care",
            price: 35000,
            features: ["Round-the-clock Care", "Medication Management", "Mobility Assistance", "Emergency Support"],
            description: "24/7 dedicated care for patients requiring constant attention and support.",
            questions: [
                {
                    stepTitle: "Patient Details",
                    fields: [
                        {
                            name: "patientAge",
                            label: "Patient's Age",
                            type: "text",
                            placeholder: "e.g. 65 years"
                        },
                        {
                            name: "gender",
                            label: "Patient's Gender",
                            type: "radio",
                            options: [
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" }
                            ]
                        },
                        {
                            name: "mobility",
                            label: "Mobility Status",
                            type: "select",
                            options: [
                                { label: "Walking / Independent", value: "walking" },
                                { label: "Semi-mobile (Needs support)", value: "semi_mobile" },
                                { label: "Bedridden", value: "bedridden", priceChange: 3000 }
                            ]
                        },
                        {
                            name: "medicalCondition",
                            label: "Medical Condition (Brief)",
                            type: "text",
                            placeholder: "e.g. Post-surgery, Stroke recovery..."
                        },
                        {
                            name: "accommodation",
                            label: "Staff Accommodation Available?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" } // Might imply higher cost or unserviceable, but keeping simple
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "peon-service": [
        {
            name: "Office Boy (8-10 Hours)",
            price: 15000,
            features: ["Files Management", "Bank Work", "General Errand", "Office Cleaning"],
            description: "Standard office boy for daily office chores and errands.",
            questions: [
                {
                    stepTitle: "Office Details",
                    fields: [
                        {
                            name: "staffCount",
                            label: "Number of Staff",
                            type: "select",
                            options: [
                                { label: "1-10", value: "1-10" },
                                { label: "11-20", value: "11-20", priceChange: 1000 },
                                { label: "20+", value: "20_plus", priceChange: 2000 }
                            ]
                        },
                        {
                            name: "dutyType",
                            label: "Primary Duties",
                            type: "radio",
                            options: [
                                { label: "Cleaning Only", value: "cleaning" },
                                { label: "Cleaning + Errands", value: "all_rounder", priceChange: 1000 }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Pantry Boy (8-10 Hours)",
            price: 16000,
            features: ["Tea/Coffee Service", "Pantry Maintenance", "Guest Hospitality", "Snacks Management"],
            description: "Dedicated pantry boy for serving refreshments and maintaining pantry hygiene.",
            questions: [
                {
                    stepTitle: "Pantry Requirements",
                    fields: [
                        {
                            name: "beverageCount",
                            label: "Approx. Beverages per Day",
                            type: "select",
                            options: [
                                { label: "Up to 50", value: "50" },
                                { label: "50-100", value: "100", priceChange: 1000 },
                                { label: "100+", value: "100_plus", priceChange: 2000 }
                            ]
                        },
                        {
                            name: "dishwashing",
                            label: "Dishwashing Included?",
                            type: "radio",
                            options: [
                                { label: "Yes", value: "yes", priceChange: 500 },
                                { label: "No", value: "no" }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected for Seeding");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }
};

const seed = async () => {
    await connectDB();

    console.log("Clearing Service, SubCategory, and Booking collections...");
    await Service.deleteMany({});
    await SubCategory.deleteMany({});
    await Booking.deleteMany({});

    console.log("Starting to seed Services...");

    for (const serviceInfo of servicesData) {
        // 1. Create the Service
        const service = await Service.create(serviceInfo);
        console.log(`Created Service: ${service.title}`);

        // 2. Create SubCategories for this Service
        const subs = subCategoriesData[service.slug];
        if (subs) {
            for (const subInfo of subs) {
                await SubCategory.create({
                    ...subInfo,
                    service: service._id, // Link to the service
                    image: service.imageUrl // Use service image as default if not specified
                });
                console.log(`  -> Created SubCategory: ${subInfo.name}`);
            }
        }
    }

    console.log("Seeding Complete!");
    process.exit();
};

seed();
