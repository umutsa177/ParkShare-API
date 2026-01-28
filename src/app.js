const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const parkingSpotRoutes = require('./routes/parkingSpotRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { limiter, authLimiter } = require('./middlewares/rateLimiter');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tüm API için genel limit
app.use('/api/', limiter);

// Sadece auth rotaları için sıkı limit
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🚗 ParkShare API - Park Yeri Paylaşım Platformu',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            parkingSpots: '/api/parking-spots',
            reservations: '/api/reservations',
            reviews: '/api/reviews'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/parking-spots', parkingSpotRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);

// İzin verilen origin listesi (Production'da frontend URL'inizi buraya ekleyin)
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://parkshare-frontend.com']
    : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        // Postman gibi araçlar origin göndermez, geliştirme aşamasında izin ver
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS politikası tarafından erişim reddedildi'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route bulunamadı'
    });
});

// Error handler (en sonda olmalı)
app.use(errorHandler);

module.exports = app;