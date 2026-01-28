const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Puan zorunludur'],
        min: [1, 'Puan en az 1 olmalıdır'],
        max: [5, 'Puan en fazla 5 olabilir']
    },
    comment: {
        type: String,
        required: [true, 'Yorum zorunludur'],
        minlength: [10, 'Yorum en az 10 karakter olmalıdır'],
        maxlength: [500, 'Yorum en fazla 500 karakter olabilir']
    },
    reviewType: {
        type: String,
        enum: ['spot', 'renter'],
        required: true
    }
}, {
    timestamps: true
});

// İndeksler
reviewSchema.index({ userId: 1 });
reviewSchema.index({ targetUserId: 1 });

// Virtual fields
reviewSchema.virtual('reviewer', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

reviewSchema.virtual('target', {
    ref: 'User',
    localField: 'targetUserId',
    foreignField: '_id',
    justOne: true
});

reviewSchema.virtual('reservation', {
    ref: 'Reservation',
    localField: 'reservationId',
    foreignField: '_id',
    justOne: true
});

// Review eklendiğinde kullanıcı rating'ini güncelle
reviewSchema.post('save', async function () {
    const User = mongoose.model('User');
    const targetUser = await User.findById(this.targetUserId);
    if (targetUser) {
        await targetUser.updateRating();
    }

    // Park yeri rating'ini güncelle
    const Reservation = mongoose.model('Reservation');
    const reservation = await Reservation.findById(this.reservationId);
    if (reservation) {
        const ParkingSpot = mongoose.model('ParkingSpot');
        const spot = await ParkingSpot.findById(reservation.spotId);
        if (spot) {
            await spot.updateRating();
        }
    }
});

module.exports = mongoose.model('Review', reviewSchema);