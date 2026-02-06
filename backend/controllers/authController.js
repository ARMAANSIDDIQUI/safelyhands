const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isGoogleUser: !!user.googleId,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isGoogleUser: !!user.googleId,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Google Auth (Placeholder/Basic)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isGoogleUser: !!user.googleId,
                token: generateToken(user._id),
            });
        }

        // Generate a random password for Google users
        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            googleId: sub,
            profilePicture: picture
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isGoogleUser: !!user.googleId,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: "Invalid Google Token" });
    }
};

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
        }

        // Exchange code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            grant_type: 'authorization_code'
        });

        const { access_token } = tokenResponse.data;

        // Get user info from Google
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { email, name, picture, id: googleId } = userInfoResponse.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                googleId,
                profilePicture: picture
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isGoogleUser: !!user.googleId
        }))}`);

    } catch (error) {
        console.error("Google OAuth Callback Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
};

// @desc    Update user password
// @route   PUT /api/auth/profile/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { currentPassword, newPassword } = req.body;

        if (user) {
            // For non-Google users, verify current password
            if (!user.googleId) {
                if (!currentPassword) {
                    return res.status(400).json({ message: 'Current password is required' });
                }
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid current password' });
                }
            }
            // For Google users (or verified non-Google), set new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            // If they didn't have a googleId (standard flow) or did (google flow), 
            // the password is now set. 
            // Optional: If they were Google user, maybe clear googleId to unlink? 
            // For now, let's keep it linked but allow password login too.

            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
    googleAuthCallback,
    updatePassword
};
