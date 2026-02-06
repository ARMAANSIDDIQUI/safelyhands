const Testimonial = require('../models/Testimonial');

// @desc    Get active testimonials (public)
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
    try {
        const { name, role, message, rating, imageUrl, isActive } = req.body;

        const testimonial = await Testimonial.create({
            name,
            role,
            message,
            rating,
            imageUrl,
            isActive
        });

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res) => {
    try {
        const { name, role, message, rating, imageUrl, isActive } = req.body;

        const testimonial = await Testimonial.findById(req.params.id);

        if (testimonial) {
            testimonial.name = name || testimonial.name;
            testimonial.role = role || testimonial.role;
            testimonial.message = message || testimonial.message;
            testimonial.rating = rating || testimonial.rating;
            testimonial.imageUrl = imageUrl || testimonial.imageUrl;
            testimonial.isActive = isActive !== undefined ? isActive : testimonial.isActive;

            const updatedTestimonial = await testimonial.save();
            res.json(updatedTestimonial);
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (testimonial) {
            await testimonial.deleteOne();
            res.json({ message: 'Testimonial removed' });
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTestimonials,
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
};
