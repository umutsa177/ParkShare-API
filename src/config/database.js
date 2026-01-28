const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Sadece URI'yi verin, diğer opsiyonlar artık varsayılan/desteklenmiyor
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB bağlandı: ${conn.connection.host}`);

        // Geospatial index oluştur (Kodun geri kalanı aynı kalabilir)
        mongoose.connection.on('connected', async () => {
            try {
                await mongoose.connection.db.collection('parkingspots').createIndex({
                    location: '2dsphere'
                });
                console.log('📍 Geospatial index oluşturuldu');
            } catch (error) {
                console.log('⚠️  Index zaten mevcut veya oluşturulamadı');
            }
        });

    } catch (error) {
        console.error(`❌ MongoDB bağlantı hatası: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;