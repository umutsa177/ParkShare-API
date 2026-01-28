const ParkingSpot = require('../models/ParkingSpot');

// @desc    Yakındaki park yerlerini getir
// @route   GET /api/parking-spots?lat=41.0082&lng=28.9784&radius=5000
// @access  Public
exports.getNearbySpots = async (req, res, next) => {
    try {
        const { lat, lng, radius = 5000, features, minPrice, maxPrice } = req.query;

        let query = { isActive: true, availability: true };

        // Konum bazlı arama
        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        // Özellik filtresi
        if (features) {
            const featureArray = features.split(',');
            query.features = { $all: featureArray };
        }

        // Fiyat filtresi
        if (minPrice || maxPrice) {
            query['pricing.hourly'] = {};
            if (minPrice) query['pricing.hourly'].$gte = parseFloat(minPrice);
            if (maxPrice) query['pricing.hourly'].$lte = parseFloat(maxPrice);
        }

        const spots = await ParkingSpot.find(query)
            .populate('ownerId', 'name rating reviewCount phone')
            .limit(50)
            .sort('-createdAt');

        res.json({
            success: true,
            count: spots.length,
            data: { spots }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Tek park yeri detayı
// @route   GET /api/parking-spots/:id
// @access  Public
exports.getSpotById = async (req, res, next) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id)
            .populate('ownerId', 'name email phone rating reviewCount profileImage createdAt');

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        res.json({
            success: true,
            data: { spot }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Yeni park yeri ekle
// @route   POST /api/parking-spots
// @access  Private (Owner only)
exports.createSpot = async (req, res, next) => {
    try {
        // Owner rolü kontrolü
        if (req.user.role !== 'owner') {
            return res.status(403).json({
                success: false,
                message: 'Park yeri eklemek için owner hesabına sahip olmalısınız'
            });
        }

        const spotData = {
            ...req.body,
            ownerId: req.user._id
        };

        const spot = await ParkingSpot.create(spotData);

        res.status(201).json({
            success: true,
            message: 'Park yeri başarıyla eklendi',
            data: { spot }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Park yeri güncelle
// @route   PUT /api/parking-spots/:id
// @access  Private (Owner only)
exports.updateSpot = async (req, res, next) => {
    try {
        //  Park yerini önce bul
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        // Sahiplik kontrolü
        if (spot.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bu park yerini düzenleme yetkiniz yok'
            });
        }

        const { title, description, pricing, address, location, features, availability } = req.body;

        // 2. Gelen verileri mevcut veri ile birleştir (Merge)
        if (title) spot.title = title;
        if (description) spot.description = description;
        if (address) spot.address = address;
        if (location) spot.location = location;
        if (features) spot.features = features;
        if (availability !== undefined) spot.availability = availability;

        // Eğer pricing gelirse, eski değerleri koru (spread) üzerine yaz (merge)
        if (pricing) {
            spot.pricing = {
                ...spot.pricing,
                ...pricing
            };
        }

        // Kaydet 
        await spot.save();

        res.json({
            success: true,
            message: 'Park yeri başarıyla güncellendi',
            data: { spot }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Park yeri sil
// @route   DELETE /api/parking-spots/:id
// @access  Private (Owner only)
exports.deleteSpot = async (req, res, next) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        // Sahiplik kontrolü
        if (spot.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bu park yerini silme yetkiniz yok'
            });
        }

        // Soft delete (isActive = false)
        spot.isActive = false;
        await spot.save();

        res.json({
            success: true,
            message: 'Park yeri silindi'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Kendi park yerlerimi getir
// @route   GET /api/parking-spots/my-spots
// @access  Private (Owner only)
exports.getMySpots = async (req, res, next) => {
    try {
        const spots = await ParkingSpot.find({
            ownerId: req.user._id,
            isActive: true
        }).sort('-createdAt');

        res.json({
            success: true,
            count: spots.length,
            data: { spots }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Park yeri müsaitlik durumunu güncelle
// @route   PATCH /api/parking-spots/:id/availability
// @access  Private (Owner only)
exports.updateAvailability = async (req, res, next) => {
    try {
        const { availability } = req.body;

        const spot = await ParkingSpot.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: 'Park yeri bulunamadı'
            });
        }

        // Sahiplik kontrolü
        if (spot.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Yetkiniz yok'
            });
        }

        spot.availability = availability;
        await spot.save();

        res.json({
            success: true,
            message: 'Müsaitlik durumu güncellendi',
            data: { availability: spot.availability }
        });
    } catch (error) {
        next(error);
    }
};