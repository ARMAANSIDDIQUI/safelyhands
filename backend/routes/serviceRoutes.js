const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    getServiceBySlug,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getServices)
    .post(protect, admin, createService);

router.route('/slug/:slug')
    .get(getServiceBySlug);

router.route('/:id')
    .get(getServiceById)
    .put(protect, admin, updateService)
    .delete(protect, admin, deleteService);

module.exports = router;
