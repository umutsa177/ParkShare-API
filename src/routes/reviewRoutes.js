const express = require('express');
const router = express.Router();
const {
    createReview,
    getUserReviews,
    getSpotReviews,
    getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const {
    createReviewValidation,
    mongoIdValidation,
    validate
} = require('../middlewares/validator');

// Public routes
router.get('/user/:userId', mongoIdValidation, validate, getUserReviews);
router.get('/spot/:spotId', mongoIdValidation, validate, getSpotReviews);

// Protected routes
router.post(
    '/',
    protect,
    createReviewValidation,
    validate,
    createReview
);

router.get('/my-reviews', protect, getMyReviews);

module.exports = router;