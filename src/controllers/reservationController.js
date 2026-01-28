const Reservation = require('../models/Reservation');
const ParkingSpot = require('../models/ParkingSpot');

// @desc    Yeni rezervasyon oluştur
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res, next) => {
    try {
        const { spotId, startDate, endDate, pricingType, notes } = req.body;

        // Park yerini bul
        const spot = await ParkingSpot.findById(spotId);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        // Müsaitlik kontrolü
        if (!spot.availability || !spot.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Park yeri şu anda müsait değil'
            });
        }

        // Kendi park yerine rezervasyon yapamaz
        if (spot.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Kendi park yerinize rezervasyon yapamazsınız'
            });
        }

        // Tarih kontrolü
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            return res.status(400).json({
                success: false,
                message: 'Başlangıç tarihi geçmiş olamaz'
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'
            });
        }

        // Çakışma kontrolü
        const isAvailable = await Reservation.checkAvailability(spotId, start, end);

        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Bu tarihler için park yeri zaten rezerve edilmiş'
            });
        }

        // Fiyat hesaplama
        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = diffHours / 24;
        const diffMonths = diffDays / 30;

        let totalPrice = 0;

        switch (pricingType) {
            case 'hourly':
                totalPrice = Math.ceil(diffHours) * spot.pricing.hourly;
                break;
            case 'daily':
                totalPrice = Math.ceil(diffDays) * spot.pricing.daily;
                break;
            case 'monthly':
                totalPrice = Math.ceil(diffMonths) * spot.pricing.monthly;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz fiyatlandırma tipi'
                });
        }

        // Rezervasyon oluştur
        const reservation = await Reservation.create({
            spotId,
            renterId: req.user._id,
            ownerId: spot.ownerId,
            startDate: start,
            endDate: end,
            totalPrice,
            pricingType,
            notes
        });

        // Spot'un toplam rezervasyon sayısını artır
        spot.totalReservations += 1;
        await spot.save();

        // Rezervasyonu populate et
        await reservation.populate([
            { path: 'spotId', select: 'title address photos pricing' },
            { path: 'ownerId', select: 'name phone' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Rezervasyon oluşturuldu',
            data: { reservation }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Kendi rezervasyonlarımı getir (kiracı olarak)
// @route   GET /api/reservations/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = { renterId: req.user._id };
        if (status) {
            query.status = status;
        }

        const reservations = await Reservation.find(query)
            .populate('spotId', 'title address photos pricing location')
            .populate('ownerId', 'name phone rating')
            .sort('-createdAt');

        res.json({
            success: true,
            count: reservations.length,
            data: { reservations }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Park yerime yapılan rezervasyonları getir (owner olarak)
// @route   GET /api/reservations/my-listings
// @access  Private (Owner only)
exports.getMyListings = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = { ownerId: req.user._id };
        if (status) {
            query.status = status;
        }

        const reservations = await Reservation.find(query)
            .populate('spotId', 'title address photos')
            .populate('renterId', 'name phone rating')
            .sort('-createdAt');

        res.json({
            success: true,
            count: reservations.length,
            data: { reservations }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Rezervasyon detayı
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('spotId', 'title description address photos pricing features')
            .populate('renterId', 'name phone email rating reviewCount')
            .populate('ownerId', 'name phone email rating reviewCount');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Rezervasyon bulunamadı'
            });
        }

        // Yetki kontrolü (kiracı veya sahibi olmalı)
        const isAuthorized =
            reservation.renterId._id.toString() === req.user._id.toString() ||
            reservation.ownerId._id.toString() === req.user._id.toString();

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Bu rezervasyonu görüntüleme yetkiniz yok'
            });
        }

        res.json({
            success: true,
            data: { reservation }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Rezervasyon durumunu güncelle
// @route   PUT /api/reservations/:id/status
// @access  Private
exports.updateReservationStatus = async (req, res, next) => {
    try {
        const { status, cancellationReason } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Rezervasyon bulunamadı'
            });
        }

        // Yetki kontrolü
        const isOwner = reservation.ownerId.toString() === req.user._id.toString();
        const isRenter = reservation.renterId.toString() === req.user._id.toString();

        if (!isOwner && !isRenter) {
            return res.status(403).json({
                success: false,
                message: 'Bu rezervasyonu güncelleme yetkiniz yok'
            });
        }

        // Durum geçişi kontrolü
        const validTransitions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['active', 'cancelled'],
            active: ['completed', 'cancelled'],
            completed: [],
            cancelled: []
        };

        if (!validTransitions[reservation.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `${reservation.status} durumundan ${status} durumuna geçiş yapılamaz`
            });
        }

        // Owner sadece onaylayabilir, kiracı iptal edebilir
        if (status === 'confirmed' && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Sadece park yeri sahibi rezervasyonu onaylayabilir'
            });
        }

        reservation.status = status;
        if (status === 'cancelled' && cancellationReason) {
            reservation.cancellationReason = cancellationReason;
        }

        await reservation.save();

        res.json({
            success: true,
            message: 'Rezervasyon durumu güncellendi',
            data: { reservation }
        });
    } catch (error) {
        next(error);
    }
};