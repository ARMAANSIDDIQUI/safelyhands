const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single service by slug
// @route   GET /api/services/slug/:slug
// @access  Public
const getServiceBySlug = async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
    try {
        const { title, slug, description, basePrice, minPrice, maxPrice, features, imageUrl, rating, reviewCount, badge, category, availability, verificationStatus } = req.body;

        const serviceExists = await Service.findOne({ slug });
        if (serviceExists) {
            return res.status(400).json({ message: 'Service with this slug already exists' });
        }

        const service = await Service.create({
            title,
            slug,
            description,
            basePrice: basePrice || 0,
            priceRange: {
                min: minPrice || 0,
                max: maxPrice || 0
            },
            features,
            imageUrl,
            rating,
            reviewCount,
            badge,
            category,
            availability,
            verificationStatus
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    try {
        const { title, description, basePrice, minPrice, maxPrice, features, imageUrl, isActive, rating, reviewCount, badge, category, availability, verificationStatus } = req.body;

        const service = await Service.findById(req.params.id);

        if (service) {
            service.title = title || service.title;
            service.description = description || service.description;
            service.basePrice = basePrice !== undefined ? basePrice : service.basePrice;
            service.priceRange = {
                min: minPrice !== undefined ? minPrice : (service.priceRange?.min || 0),
                max: maxPrice !== undefined ? maxPrice : (service.priceRange?.max || 0)
            };
            service.features = features || service.features;
            service.imageUrl = imageUrl || service.imageUrl;
            service.isActive = isActive !== undefined ? isActive : service.isActive;
            service.rating = rating !== undefined ? rating : service.rating;
            service.reviewCount = reviewCount !== undefined ? reviewCount : service.reviewCount;
            service.badge = badge !== undefined ? badge : service.badge;
            service.category = category || service.category;
            service.availability = availability || service.availability;
            service.verificationStatus = verificationStatus || service.verificationStatus;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    getServiceBySlug,
    createService,
    updateService,
    deleteService
};
