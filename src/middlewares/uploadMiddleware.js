const multer = require('multer');
const path = require('path');

// Depolama yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Resimleri 'uploads' klasörüne kaydet
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Benzersiz dosya ismi oluştur: alan-ismi-zaman-stamp.uzanti
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya filtresi (Sadece resim)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max dosya boyutu
    },
    fileFilter: fileFilter
});

module.exports = upload;