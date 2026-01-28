const express = require('express');
const router = express.Router();
const {
    getNearbySpots,
    getSpotById,
    createSpot,
    updateSpot,
    deleteSpot,
    getMySpots,
    updateAvailability
} = require('../controllers/parkingSpotController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    createSpotValidation,
    updateSpotValidation,
    mongoIdValidation,
    nearbyQueryValidation,
    validate
} = require('../middlewares/validator');

// Public routes
router.get('/', nearbyQueryValidation, validate, getNearbySpots);
router.get('/:id', mongoIdValidation, validate, getSpotById);

// Protected routes
router.post(
    '/',
    protect,
    authorize('owner'),
    createSpotValidation,
    validate,
    createSpot
);

router.get('/owner/my-spots', protect, authorize('owner'), getMySpots);

router.put(
    '/:id',
    protect,
    mongoIdValidation,
    updateSpotValidation,
    validate,
    updateSpot
);

router.delete(
    '/:id',
    protect,
    mongoIdValidation,
    validate,
    deleteSpot
);

router.patch(
    '/:id/availability',
    protect,
    authorize('owner'),
    mongoIdValidation,
    validate,
    updateAvailability
);

module.exports = router;