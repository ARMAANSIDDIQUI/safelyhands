const mongoose = require("mongoose");
const Service = require("./models/Service"); // Path adjusted for backend/ dir
require("dotenv").config(); // Standard .env load in backend/

const subcategoryData = [
    {
        serviceTitle: "Housekeeper",
        sub: {
            name: "Housekeeper",
            price: "₹15000/month starting",
            description: "Complete floor cleaning and sanitization for a sparkling clean home.",
            features: ["All services inclusive"]
        }
    },
    {
        serviceTitle: "Cook",
        sub: {
            name: "Cook",
            price: "₹17000/month starting",
            description: "Authentic Indian home-style cooking service for delicious meals.",
            features: ["All services inclusive"]
        }
    },
    {
        serviceTitle: "Babysitter",
        sub: {
            name: "Babysitter",
            price: "₹20000/month starting",
            description: "Professional child care service, ensuring their safety & well-being.",
            features: ["All services inclusive"]
        }
    },
    {
        serviceTitle: "All-Rounder",
        sub: {
            name: "All-Rounder",
            price: "₹16000/month starting",
            description: "Complete household management, taking care of your complex needs.",
            features: ["All services inclusive"]
        }
    },
    {
        serviceTitle: "Elderly Care",
        sub: {
            name: "Elderly Care",
            price: "₹25000/month starting",
            description: "Assistance for elders, verified staff.",
            features: ["All services inclusive"]
        }
    }
];

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

    for (const item of subcategoryData) {
        const service = await Service.findOne({
            title: { $regex: new RegExp(item.serviceTitle, "i") }
        });

        if (service) {
            console.log(`Updating service: ${service.title}`);

            const imageUrl = service.imageUrl || "https://placehold.co/400";

            const newSub = {
                name: item.sub.name,
                price: item.sub.price,
                description: item.sub.description,
                features: item.sub.features,
                image: imageUrl
            };

            service.subcategories = [newSub];
            await service.save();
            console.log(`  -> Added subcategory: ${newSub.name}`);
        } else {
            console.log(`Service NOT FOUND: ${item.serviceTitle}`);
        }
    }

    console.log("Seeding Complete!");
    process.exit();
};

seed();
