const express = require('express');
const router = express.Router();
const {
    createReservation,
    getMyBookings,
    getMyListings,
    getReservationById,
    updateReservationStatus
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    createReservationValidation,
    mongoIdValidation,
    validate
} = require('../middlewares/validator');

// Protected routes (tüm rezervasyon işlemleri login gerektir)
router.post(
    '/',
    protect,
    createReservationValidation,
    validate,
    createReservation
);

router.get('/my-bookings', protect, getMyBookings);

router.get(
    '/my-listings',
    protect,
    authorize('owner'),
    getMyListings
);

router.get(
    '/:id',
    protect,
    mongoIdValidation,
    validate,
    getReservationById
);

router.put(
    '/:id/status',
    protect,
    mongoIdValidation,
    validate,
    updateReservationStatus
);

module.exports = router;