// Tarih formatlamaya yardımcı fonksiyonlar

// İki tarih arasındaki gün farkını hesapla
exports.getDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// İki tarih arasındaki saat farkını hesapla
exports.getHoursDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
};

// Koordinatlar arası mesafe hesapla (km)
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Fiyat formatla (TL)
exports.formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price);
};

// Pagination helper
exports.getPagination = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
};

// Success response
exports.successResponse = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

// Error response
exports.errorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

// Telefon numarası formatla
exports.formatPhoneNumber = (phone) => {
    // Sadece rakamları al
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Türkiye telefon formatı: 0555 123 45 67
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
    }

    return phone;
};

// Random string oluştur
exports.generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};