const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for temporary storage
// Use /tmp on Vercel (serverless has read-only filesystem except /tmp)
const getUploadPath = () => {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        return '/tmp';
    }
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, getUploadPath());
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
});

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'safely_hands', // Organization folder
            use_filename: true,
            unique_filename: false,
        });

        // Remove file from local uploads folder
        fs.unlinkSync(req.file.path);

        res.json({
            imageUrl: result.secure_url,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Upload Error:', error);
        // Clean up local file if upload fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server error during upload: ' + (error.message || error.toString() || 'Unknown error') });
    }
});

module.exports = router;
