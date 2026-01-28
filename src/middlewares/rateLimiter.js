const rateLimit = require('express-rate-limit');

// Genel API limiti: 15 dakikada 100 istek
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Her IP için max istek sayısı
    message: {
        success: false,
        message: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.'
    },
    standardHeaders: true, // RateLimit info'sunu header'a ekle
    legacyHeaders: false,
});

// Giriş denemeleri için daha sıkı limit: 15 dakikada 5 deneme
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Çok fazla giriş denemesi, hesabınız geçici olarak kilitlendi.'
    }
});

module.exports = { limiter, authLimiter };