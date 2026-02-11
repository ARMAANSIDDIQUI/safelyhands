const express = require('express');
const router = express.Router();
const {
    getSubCategoryById,
    updateSubCategory
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:id')
    .get(getSubCategoryById)
    .put(protect, admin, updateSubCategory);

module.exports = router;
