const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Başlık zorunludur'],
        trim: true,
        maxlength: [100, 'Başlık en fazla 100 karakter olabilir']
    },
    description: {
        type: String,
        required: [true, 'Açıklama zorunludur'],
        maxlength: [500, 'Açıklama en fazla 500 karakter olabilir']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: [true, 'Konum koordinatları zorunludur']
        }
    },
    address: {
        street: String,
        district: String,
        city: String,
        postalCode: String,
        fullAddress: {
            type: String,
            required: [true, 'Adres zorunludur']
        }
    },
    pricing: {
        hourly: {
            type: Number,
            required: [true, 'Saatlik fiyat zorunludur'],
            min: [0, 'Fiyat negatif olamaz']
        },
        daily: {
            type: Number,
            required: [true, 'Günlük fiyat zorunludur'],
            min: [0, 'Fiyat negatif olamaz']
        },
        monthly: {
            type: Number,
            required: [true, 'Aylık fiyat zorunludur'],
            min: [0, 'Fiyat negatif olamaz']
        }
    },
    features: [{
        type: String,
        enum: ['covered', 'secured', 'electric', 'cctv', 'accessible', 'valet']
    }],
    photos: [{
        type: String
    }],
    availability: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    totalReservations: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Geospatial index
parkingSpotSchema.index({ location: '2dsphere' });

// Owner bilgilerini getir
parkingSpotSchema.virtual('owner', {
    ref: 'User',
    localField: 'ownerId',
    foreignField: '_id',
    justOne: true
});

// Rating güncelleme metodu
parkingSpotSchema.methods.updateRating = async function () {
    const Review = mongoose.model('Review');
    const stats = await Review.aggregate([
        {
            $lookup: {
                from: 'reservations',
                localField: 'reservationId',
                foreignField: '_id',
                as: 'reservation'
            }
        },
        { $unwind: '$reservation' },
        { $match: { 'reservation.spotId': this._id } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        this.rating = Math.round(stats[0].avgRating * 10) / 10;
        this.reviewCount = stats[0].count;
    } else {
        this.rating = 0;
        this.reviewCount = 0;
    }
    await this.save();
};

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);