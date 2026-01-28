const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// @desc    Yeni değerlendirme ekle
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { reservationId, rating, comment } = req.body;

        // Rezervasyonu bul
        const reservation = await Reservation.findById(reservationId)
            .populate('spotId')
            .populate('ownerId')
            .populate('renterId');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Rezervasyon bulunamadı'
            });
        }

        // Rezervasyon tamamlanmış mı kontrol et
        if (reservation.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Sadece tamamlanmış rezervasyonlar için değerlendirme yapabilirsiniz'
            });
        }

        // Yetki kontrolü (kiracı veya sahibi olmalı)
        const isRenter = reservation.renterId._id.toString() === req.user._id.toString();
        const isOwner = reservation.ownerId._id.toString() === req.user._id.toString();

        if (!isRenter && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Bu rezervasyon için değerlendirme yapma yetkiniz yok'
            });
        }

        // Daha önce değerlendirme yapılmış mı kontrol et
        const existingReview = await Review.findOne({ reservationId, userId: req.user._id });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Bu rezervasyon için zaten değerlendirme yapmışsınız'
            });
        }

        // Target user belirle
        let targetUserId;
        let reviewType;

        if (isRenter) {
            // Kiracı, park yeri sahibini değerlendiriyor
            targetUserId = reservation.ownerId._id;
            reviewType = 'spot';
        } else {
            // Park yeri sahibi, kiracıyı değerlendiriyor
            targetUserId = reservation.renterId._id;
            reviewType = 'renter';
        }

        // Değerlendirme oluştur
        const review = await Review.create({
            reservationId,
            userId: req.user._id,
            targetUserId,
            rating,
            comment,
            reviewType
        });

        // Populate et
        await review.populate([
            { path: 'userId', select: 'name profileImage' },
            { path: 'targetUserId', select: 'name' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Değerlendirme eklendi',
            data: { review }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Kullanıcının aldığı değerlendirmeleri getir
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Kullanıcı var mı kontrol et
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const reviews = await Review.find({ targetUserId: userId })
            .populate('userId', 'name profileImage')
            .populate({
                path: 'reservationId',
                populate: { path: 'spotId', select: 'title address' }
            })
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({ targetUserId: userId });

        res.json({
            success: true,
            count: reviews.length,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    rating: user.rating,
                    reviewCount: user.reviewCount
                },
                reviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Park yerine ait değerlendirmeleri getir
// @route   GET /api/reviews/spot/:spotId
// @access  Public
exports.getSpotReviews = async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const ParkingSpot = require('../models/ParkingSpot');
        const spot = await ParkingSpot.findById(spotId);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        // Park yerine ait rezervasyonları bul
        const reservations = await Reservation.find({ spotId }).select('_id');
        const reservationIds = reservations.map(r => r._id);

        const reviews = await Review.find({
            reservationId: { $in: reservationIds },
            reviewType: 'spot'
        })
            .populate('userId', 'name profileImage rating')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Review.countDocuments({
            reservationId: { $in: reservationIds },
            reviewType: 'spot'
        });

        res.json({
            success: true,
            count: reviews.length,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: {
                spot: {
                    id: spot._id,
                    title: spot.title,
                    rating: spot.rating,
                    reviewCount: spot.reviewCount
                },
                reviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Kendi yaptığım değerlendirmeleri getir
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.user._id })
            .populate('targetUserId', 'name profileImage')
            .populate({
                path: 'reservationId',
                populate: { path: 'spotId', select: 'title address' }
            })
            .sort('-createdAt');

        res.json({
            success: true,
            count: reviews.length,
            data: { reviews }
        });
    } catch (error) {
        next(error);
    }
};