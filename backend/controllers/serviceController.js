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
        const { title, slug, subtitle, description, basePrice, minPrice, maxPrice, features, imageUrl, icon, gradientFrom, gradientTo, rating, reviewCount, badge, category, shift, gender, availability, verificationStatus, subcategories } = req.body;

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
            icon,
            subtitle,
            gradientFrom: gradientFrom || 'blue-100',
            gradientTo: gradientTo || 'blue-200',
            rating,
            reviewCount,
            badge,
            category,
            shift,
            gender: gender || 'Both',
            availability,
            verificationStatus,
            subcategories: subcategories || []
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
        const { title, subtitle, description, basePrice, minPrice, maxPrice, features, imageUrl, icon, gradientFrom, gradientTo, isActive, rating, reviewCount, badge, category, shift, gender, availability, verificationStatus, subcategories, questions } = req.body;

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
            service.icon = icon || service.icon;
            service.subtitle = subtitle || service.subtitle;
            service.gradientFrom = gradientFrom || service.gradientFrom;
            service.gradientTo = gradientTo || service.gradientTo;
            service.isActive = isActive !== undefined ? isActive : service.isActive;
            service.rating = rating !== undefined ? rating : service.rating;
            service.reviewCount = reviewCount !== undefined ? reviewCount : service.reviewCount;
            service.badge = badge !== undefined ? badge : service.badge;
            service.category = category || service.category;
            service.shift = shift || service.shift;
            service.gender = gender || service.gender;
            service.availability = availability || service.availability;
            service.verificationStatus = verificationStatus || service.verificationStatus;
            service.subcategories = subcategories || service.subcategories;
            service.questions = questions || service.questions;

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

const SubCategory = require('../models/SubCategory');

// @desc    Get subcategories for a service
// @route   GET /api/services/:id/subcategories
// @access  Public
const getSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find({ service: req.params.id });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubCategoryById = async (req, res) => {
    try {
        const subcategory = await SubCategory.findById(req.params.id);
        if (subcategory) {
            res.json(subcategory);
        } else {
            res.status(404).json({ message: 'SubCategory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubCategory = async (req, res) => {
    try {
        const { service } = req.body;
        // Verify service exists
        const serviceObj = await Service.findById(service);
        if (!serviceObj) return res.status(404).json({ message: "Service not found" });

        const subCategory = await SubCategory.create(req.body);
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (subCategory) {
            Object.assign(subCategory, req.body);
            const updated = await subCategory.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'SubCategory not found' });
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
    deleteService,
    getSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory
};
