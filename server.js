const app = require('./src/app');
const connectDB = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı
connectDB();

// Sunucuyu başlat
const server = app.listen(PORT, () => {
    console.log(`🚀 ParkShare API ${PORT} portunda çalışıyor`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI}`);
});

// Hata yönetimi
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM alındı. Sunucu kapatılıyor...');
    server.close(() => {
        console.log('✅ Sunucu kapatıldı');
    });
});