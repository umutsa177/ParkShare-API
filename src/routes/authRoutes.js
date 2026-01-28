const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const {
    registerValidation,
    loginValidation,
    validate
} = require('../middlewares/validator');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// 'profileImage' alanındaki dosyayı al, tek dosya bekleniyor
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;