const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token oluştur
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanılıyor'
            });
        }

        // Yeni kullanıcı oluştur
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'renter'
        });

        // Token oluştur
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    rating: user.rating,
                    reviewCount: user.reviewCount
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul (şifre dahil)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Şifre kontrolü
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // Hesap aktif mi kontrol et
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Token oluştur
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    rating: user.rating,
                    reviewCount: user.reviewCount,
                    profileImage: user.profileImage
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Profil bilgilerini getir
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    rating: user.rating,
                    reviewCount: user.reviewCount,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Profil güncelle
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, profileImage } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (phone) fieldsToUpdate.phone = phone;
        if (profileImage) fieldsToUpdate.profileImage = profileImage;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profil güncellendi',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    rating: user.rating,
                    reviewCount: user.reviewCount,
                    profileImage: user.profileImage
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Şifre değiştir
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Mevcut şifre kontrolü
        const isPasswordMatch = await user.comparePassword(currentPassword);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Mevcut şifre hatalı'
            });
        }

        // Yeni şifre
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Şifre başarıyla değiştirildi'
        });
    } catch (error) {
        next(error);
    }
};