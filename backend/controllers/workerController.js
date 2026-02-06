const Worker = require('../models/Worker');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({});
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (worker) {
            res.json(worker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Private/Admin
const createWorker = async (req, res) => {
    try {
        const { name, profession, experienceYears, imageUrl, bio } = req.body;

        const worker = await Worker.create({
            name,
            profession,
            experienceYears,
            imageUrl,
            bio
        });

        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a worker
// @route   PUT /api/workers/:id
// @access  Private/Admin
const updateWorker = async (req, res) => {
    try {
        const { name, profession, experienceYears, imageUrl, isAvailable, rating, numReviews, bio } = req.body;

        const worker = await Worker.findById(req.params.id);

        if (worker) {
            worker.name = name || worker.name;
            worker.profession = profession || worker.profession;
            worker.experienceYears = experienceYears || worker.experienceYears;
            worker.imageUrl = imageUrl || worker.imageUrl;
            worker.bio = bio || worker.bio;
            worker.isAvailable = isAvailable !== undefined ? isAvailable : worker.isAvailable;
            worker.rating = rating || worker.rating;
            worker.numReviews = numReviews || worker.numReviews;

            const updatedWorker = await worker.save();
            res.json(updatedWorker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);

        if (worker) {
            await worker.deleteOne();
            res.json({ message: 'Worker removed' });
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a worker with ID and optional email link
// @route   POST /api/workers/create-id
// @access  Private/Admin
const createWorkerWithId = async (req, res) => {
    try {
        const { name, profession, email } = req.body;
        const User = require('../models/User');
        const bcrypt = require('bcrypt');

        let userId = null;

        if (email) {
            let user = await User.findOne({ email });

            if (user) {
                // Update existing user to worker role
                user.role = 'worker';
                await user.save();
                userId = user._id;
            } else {
                // Create new user for worker
                const randomPassword = Math.random().toString(36).slice(-8);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(randomPassword, salt);

                const newUser = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    role: 'worker'
                });
                userId = newUser._id;
            }
        }

        // Generate unique worker ID (e.g., WRK-170725)
        const timestamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        const workerId = `WRK-${timestamp}-${randomStr}`;

        const worker = await Worker.create({
            name,
            profession,
            workerId,
            userId,
            experienceYears: 0, // Default
            bio: "" // Default
        });

        res.status(201).json({
            message: 'Worker created with ID',
            workerId: worker.workerId,
            worker
        });
    } catch (error) {
        console.error("Create Worker ID Error:", error);
        res.status(500).json({ message: 'Server error creating worker ID: ' + error.message });
    }
};

module.exports = {
    getWorkers,
    getWorkerById,
    createWorker,
    updateWorker,
    deleteWorker,
    createWorkerWithId
};
