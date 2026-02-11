const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    getServiceBySlug,
    createService,
    updateService,
    deleteService,
    getSubCategories,
    createSubCategory
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

router.route('/:id/subcategories')
    .get(getSubCategories)
    .post(protect, admin, createSubCategory);

// We need a separate router for /api/subcategories if we want to access by subCategory ID nicely
// But since this file is mounted at /api/services, we might need a new route file for /api/subcategories
// OR we can hack it here if the URL is /api/services/subcategories/:id (not ideal)
// Let's create a NEW route file for subcategories or just put them in app.js
// Wait, I can just add them here if I change how index.js mounts routes, or just add a new mount in server.js
// For now, I'll add them here but distinct paths might be tricky if they conflict.
// Actually, `frontend` called: 
// 1. `${process.env.NEXT_PUBLIC_API_URL}/services/${id}/subcategories` (POST)
// 2. `${process.env.NEXT_PUBLIC_API_URL}/subcategories/${subId}` (GET, PUT) -> THIS requires /api/subcategories

// I need to create `backend/routes/subCategoryRoutes.js` and mount it in server.js
// But `serviceController` has the methods. I'll just export them.

module.exports = router;
