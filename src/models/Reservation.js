const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    spotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true
    },
    renterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Başlangıç tarihi zorunludur']
    },
    endDate: {
        type: Date,
        required: [true, 'Bitiş tarihi zorunludur']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Toplam fiyat zorunludur'],
        min: [0, 'Fiyat negatif olamaz']
    },
    pricingType: {
        type: String,
        enum: ['hourly', 'daily', 'monthly'],
        required: true
    },
    duration: {
        hours: Number,
        days: Number,
        months: Number
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: 300
    }
}, {
    timestamps: true
});

// İndeksler
reservationSchema.index({ renterId: 1, status: 1 });
reservationSchema.index({ spotId: 1, status: 1 });
reservationSchema.index({ ownerId: 1, status: 1 });
reservationSchema.index({ startDate: 1, endDate: 1 });

// Tarih validasyonu
reservationSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('Bitiş tarihi başlangıç tarihinden sonra olmalıdır'));
    }
    next();
});

// Süre hesaplama
reservationSchema.pre('save', function (next) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;
    const diffMonths = diffDays / 30;

    this.duration = {
        hours: Math.ceil(diffHours),
        days: Math.ceil(diffDays),
        months: Math.ceil(diffMonths)
    };
    next();
});

// Virtual fields
reservationSchema.virtual('spot', {
    ref: 'ParkingSpot',
    localField: 'spotId',
    foreignField: '_id',
    justOne: true
});

reservationSchema.virtual('renter', {
    ref: 'User',
    localField: 'renterId',
    foreignField: '_id',
    justOne: true
});

reservationSchema.virtual('owner', {
    ref: 'User',
    localField: 'ownerId',
    foreignField: '_id',
    justOne: true
});

// Rezervasyon çakışması kontrolü
reservationSchema.statics.checkAvailability = async function (spotId, startDate, endDate, excludeReservationId = null) {
    const query = {
        spotId,
        status: { $in: ['pending', 'confirmed', 'active'] },
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    };

    if (excludeReservationId) {
        query._id = { $ne: excludeReservationId };
    }

    const conflictingReservations = await this.find(query);
    return conflictingReservations.length === 0;
};

module.exports = mongoose.model('Reservation', reservationSchema);