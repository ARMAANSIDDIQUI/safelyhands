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
const os = require('os');

const getUploadPath = () => {
    // Vercel serverless has read-only filesystem except /tmp
    if (process.env.VERCEL) {
        return '/tmp';
    }

    // For local development (even in production mode on Windows) or other environments,
    // use a local uploads directory that we can ensure exists.
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
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (for videos)
});

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
router.post('/', (req, res, next) => {
    // Run multer manually so its errors enter Express error chain
    // (which sets CORS headers) instead of sending a bare response
    upload.single('image')(req, res, async (multerErr) => {
        if (multerErr) {
            return next(multerErr); // goes to global error handler with CORS headers
        }
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'safely_hands',
                use_filename: true,
                unique_filename: false,
                resource_type: 'auto', // Handles images AND videos
            });

            // Remove file from local uploads folder
            fs.unlinkSync(req.file.path);

            res.json({
                url: result.secure_url,        // Primary field
                imageUrl: result.secure_url,   // Legacy compat
                resourceType: result.resource_type,
                message: 'File uploaded successfully'
            });
        } catch (error) {
            console.error('Upload Error:', error);
            // Clean up local file if upload fails
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error); // goes to global error handler with CORS headers
        }
    });
});

module.exports = router;
