const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token'ı doğrula
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Header'dan token al
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Token yoksa
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Bu işlem için giriş yapmalısınız'
            });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcıyı bul
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        if (!req.user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token geçersiz veya süresi dolmuş'
        });
    }
};

// Rol kontrolü
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz yok'
            });
        }
        next();
    };
};

// Park yeri sahipliği kontrolü
exports.checkSpotOwnership = async (req, res, next) => {
    try {
        const ParkingSpot = require('../models/ParkingSpot');
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        if (spot.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bu park yerini düzenleme yetkiniz yok'
            });
        }

        req.spot = spot;
        next();
    } catch (error) {
        next(error);
    }
};