const { body, param, query, validationResult } = require('express-validator');

// Validation hatalarını kontrol et
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation hatası',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validations
exports.registerValidation = [
    body('name').trim().notEmpty().withMessage('İsim zorunludur'),
    body('email').isEmail().withMessage('Geçerli bir email giriniz').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır'),
    body('phone').trim().notEmpty().withMessage('Telefon numarası zorunludur'),
    body('role').optional().isIn(['owner', 'renter']).withMessage('Geçersiz rol')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Geçerli bir email giriniz').normalizeEmail(),
    body('password').notEmpty().withMessage('Şifre zorunludur')
];

// Parking Spot validations
exports.createSpotValidation = [
    body('title').trim().notEmpty().withMessage('Başlık zorunludur')
        .isLength({ max: 100 }).withMessage('Başlık en fazla 100 karakter olabilir'),
    body('description').trim().notEmpty().withMessage('Açıklama zorunludur')
        .isLength({ max: 500 }).withMessage('Açıklama en fazla 500 karakter olabilir'),
    body('location.coordinates').isArray({ min: 2, max: 2 })
        .withMessage('Koordinatlar [longitude, latitude] formatında olmalıdır'),
    body('location.coordinates.*').isFloat().withMessage('Koordinatlar sayı olmalıdır'),
    body('address.fullAddress').trim().notEmpty().withMessage('Adres zorunludur'),
    body('pricing.hourly').isFloat({ min: 0 }).withMessage('Geçerli saatlik fiyat giriniz'),
    body('pricing.daily').isFloat({ min: 0 }).withMessage('Geçerli günlük fiyat giriniz'),
    body('pricing.monthly').isFloat({ min: 0 }).withMessage('Geçerli aylık fiyat giriniz'),
    body('features').optional().isArray().withMessage('Özellikler dizi olmalıdır')
];

exports.updateSpotValidation = [
    body('title').optional().trim().isLength({ max: 100 })
        .withMessage('Başlık en fazla 100 karakter olabilir'),
    body('description').optional().trim().isLength({ max: 500 })
        .withMessage('Açıklama en fazla 500 karakter olabilir'),
    body('pricing.hourly').optional().isFloat({ min: 0 })
        .withMessage('Geçerli saatlik fiyat giriniz'),
    body('pricing.daily').optional().isFloat({ min: 0 })
        .withMessage('Geçerli günlük fiyat giriniz'),
    body('pricing.monthly').optional().isFloat({ min: 0 })
        .withMessage('Geçerli aylık fiyat giriniz')
];

// Reservation validations
exports.createReservationValidation = [
    body('spotId').notEmpty().withMessage('Park yeri ID zorunludur')
        .isMongoId().withMessage('Geçersiz park yeri ID'),
    body('startDate').isISO8601().withMessage('Geçerli başlangıç tarihi giriniz'),
    body('endDate').isISO8601().withMessage('Geçerli bitiş tarihi giriniz'),
    body('pricingType').isIn(['hourly', 'daily', 'monthly'])
        .withMessage('Geçersiz fiyatlandırma tipi'),
    body('notes').optional().isLength({ max: 300 })
        .withMessage('Notlar en fazla 300 karakter olabilir')
];

// Review validations
exports.createReviewValidation = [
    body('reservationId').notEmpty().withMessage('Rezervasyon ID zorunludur')
        .isMongoId().withMessage('Geçersiz rezervasyon ID'),
    body('rating').isInt({ min: 1, max: 5 })
        .withMessage('Puan 1-5 arasında olmalıdır'),
    body('comment').trim().isLength({ min: 10, max: 500 })
        .withMessage('Yorum 10-500 karakter arasında olmalıdır')
];

// Query validations
exports.nearbyQueryValidation = [
    query('lat').optional().isFloat({ min: -90, max: 90 })
        .withMessage('Geçerli enlem giriniz'),
    query('lng').optional().isFloat({ min: -180, max: 180 })
        .withMessage('Geçerli boylam giriniz'),
    query('radius').optional().isInt({ min: 1, max: 50000 })
        .withMessage('Yarıçap 1-50000 metre arasında olmalıdır')
];

// Param validations
exports.mongoIdValidation = [
    param('id').isMongoId().withMessage('Geçersiz ID formatı')
];