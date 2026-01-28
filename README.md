# 🅿️ ParkShare API

<p align="center">
  <strong>Park yeri paylaşım platformu için RESTful API</strong>
</p>

<p align="center">
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://expressjs.com">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  </a>
  <a href="https://www.javascript.com">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge" alt="License"/>
  </a>
</p>

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Kullanım](#-kullanım)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [Lisans](#-lisans)

---

## 🚀 Proje Hakkında

**ParkShare API**, kullanıcıların park yerlerini paylaşabildiği, rezerve edebildiği ve yönetebildiği bir platform için geliştirilmiş RESTful API servisidir. Proje, park yeri bulma sorununa modern bir çözüm sunmayı amaçlar.

### 💡 Motivasyon

Şehirlerde park yeri bulmak giderek zorlaşırken, birçok özel park yeri boş kalıyor. ParkShare, bu boş park yerlerini ihtiyacı olanlara ulaştırarak hem park yeri sahiplerinin gelir elde etmesini hem de sürücülerin kolayca park yeri bulmasını sağlar.

---

## ✨ Özellikler

### 👤 Kullanıcı Yönetimi
- ✅ Kullanıcı kaydı ve girişi
- 🔐 JWT tabanlı kimlik doğrulama
- 👤 Profil yönetimi
- 🔑 Şifre sıfırlama

### 🅿️ Park Yeri Yönetimi
- 📍 Park yeri ekleme, düzenleme ve silme
- 🗺️ Konum bazlı park yeri arama
- 📸 Park yeri fotoğrafları
- ⭐ Park yeri değerlendirme ve yorumlama
- 💰 Fiyatlandırma yönetimi

### 📅 Rezervasyon Sistemi
- 🎫 Park yeri rezervasyonu oluşturma
- ⏱️ Saat bazlı rezervasyon
- 💳 Ödeme entegrasyonu (gelecek özellik)
- 📧 E-posta bildirimleri
- 🔔 Rezervasyon durumu takibi

### 🔍 Arama ve Filtreleme
- 📍 Konum bazlı arama
- 💵 Fiyat aralığına göre filtreleme
- ⏰ Müsaitlik durumuna göre filtreleme
- 🚗 Park yeri özelliklerine göre filtreleme (kapalı/açık, güvenlik vb.)

### 📊 Admin Paneli
- 📈 Kullanıcı ve park yeri istatistikleri
- 🛠️ Platform yönetimi
- 🚫 İçerik moderasyonu
- 💰 Gelir raporları

---

## 🛠️ Teknolojiler

### Backend Framework
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **JavaScript (ES6+)**: Programlama dili

### Veritabanı
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: ODM (Object Data Modeling)

### Authentication & Security
- **JWT (JSON Web Tokens)**: Token bazlı kimlik doğrulama
- **bcrypt**: Şifre hashleme
- **helmet**: HTTP güvenlik headers
- **cors**: Cross-Origin Resource Sharing

### Validation & Error Handling
- **express-validator**: İstek validasyonu
- **express-async-errors**: Async error handling

### File Upload
- **Multer**: Dosya yükleme middleware
- **Cloudinary/AWS S3**: Cloud storage (planlanan)

### Real-time Features (Planlanan)
- **Socket.io**: WebSocket bağlantıları
- **Redis**: Cache ve session management

### Development Tools
- **nodemon**: Auto-restart during development
- **dotenv**: Environment variables
- **morgan**: HTTP request logger
- **ESLint**: Code linting

---

## 📁 Proje Yapısı

```
ParkShare-API/
├── src/
│   ├── config/              # Konfigürasyon dosyaları
│   │   ├── database.js      # MongoDB bağlantısı
│   │   ├── cloudinary.js    # Cloudinary config
│   │   └── jwt.js           # JWT config
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── parkingController.js
│   │   ├── reservationController.js
│   │   └── reviewController.js
│   │
│   ├── models/              # Mongoose modelleri
│   │   ├── User.js
│   │   ├── ParkingSpot.js
│   │   ├── Reservation.js
│   │   ├── Review.js
│   │   └── Payment.js
│   │
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── parkingRoutes.js
│   │   ├── reservationRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── middlewares/         # Custom middlewares
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── utils/               # Yardımcı fonksiyonlar
│   │   ├── emailService.js
│   │   ├── geocoding.js
│   │   ├── imageUpload.js
│   │   └── errorHandler.js
│   │
│   ├── validators/          # Request validators
│   │   ├── authValidator.js
│   │   ├── parkingValidator.js
│   │   └── reservationValidator.js
│   │
│   └── app.js               # Express app setup
│
├── server.js                # Server entry point
├── package.json             # Dependencies
├── package-lock.json        # Dependency lock
├── .env.example             # Environment variables örneği
├── .gitignore               # Git ignore
└── LICENSE                  # Lisans dosyası
```

---

## 🚀 Kurulum

### Gereksinimler

- Node.js (v16.0.0 veya üzeri)
- npm veya yarn
- MongoDB (v5.0 veya üzeri)
- Git

### Adım Adım Kurulum

1. **Projeyi klonlayın**
```bash
git clone https://github.com/umutsa177/ParkShare-API.git
cd ParkShare-API
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Environment dosyasını oluşturun**
```bash
cp .env.example .env
```

4. **`.env` dosyasını düzenleyin**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/parkshare
# veya MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parkshare

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email (NodeMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

5. **MongoDB'yi başlatın**
```bash
# Local MongoDB
mongod

# veya MongoDB Atlas kullanıyorsanız connection string'i .env'ye ekleyin
```

6. **Sunucuyu başlatın**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Sunucu varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

---

## 📚 API Dokümantasyonu

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Kullanıcı Kaydı
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+90 555 123 4567"
}
```

#### Kullanıcı Girişi
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Şifre Sıfırlama Talebi
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Parking Spot Endpoints

#### Tüm Park Yerlerini Getir
```http
GET /api/v1/parkings?lat=41.0082&lng=28.9784&radius=5
Authorization: Bearer {token}
```

**Query Parameters:**
- `lat`: Enlem (latitude)
- `lng`: Boylam (longitude)
- `radius`: Arama yarıçapı (km)
- `minPrice`: Minimum fiyat
- `maxPrice`: Maximum fiyat
- `type`: Park yeri tipi (indoor/outdoor)

#### Park Yeri Detayı
```http
GET /api/v1/parkings/:id
Authorization: Bearer {token}
```

#### Park Yeri Oluştur
```http
POST /api/v1/parkings
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Merkezi Park Yeri",
  "description": "Şehir merkezinde güvenli park yeri",
  "location": {
    "address": "Taksim Meydanı, İstanbul",
    "coordinates": {
      "latitude": 41.0370,
      "longitude": 28.9850
    }
  },
  "price": {
    "hourly": 25,
    "daily": 150
  },
  "features": ["covered", "security", "cctv"],
  "capacity": 1
}
```

#### Park Yeri Güncelle
```http
PUT /api/v1/parkings/:id
Authorization: Bearer {token}
Content-Type: application/json
```

#### Park Yeri Sil
```http
DELETE /api/v1/parkings/:id
Authorization: Bearer {token}
```

### Reservation Endpoints

#### Rezervasyon Oluştur
```http
POST /api/v1/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "parkingSpotId": "65f1b2c3d4e5f6g7h8i9j0k1",
  "startTime": "2025-02-01T10:00:00Z",
  "endTime": "2025-02-01T18:00:00Z",
  "vehicleInfo": {
    "plate": "34 ABC 123",
    "model": "Toyota Corolla"
  }
}
```

#### Kullanıcının Rezervasyonları
```http
GET /api/v1/reservations/my-reservations
Authorization: Bearer {token}
```

#### Rezervasyon İptal
```http
DELETE /api/v1/reservations/:id
Authorization: Bearer {token}
```

### Review Endpoints

#### Yorum Ekle
```http
POST /api/v1/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "parkingSpotId": "65f1b2c3d4e5f6g7h8i9j0k1",
  "rating": 5,
  "comment": "Harika bir park yeri, çok temiz ve güvenli!"
}
```

#### Park Yerine Ait Yorumlar
```http
GET /api/v1/reviews/parking/:parkingId
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "İşlem başarılı"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Hata mesajı",
    "statusCode": 400
  }
}
```

---

## 🔐 Ortam Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `PORT` | Sunucu port numarası | `5000` |
| `NODE_ENV` | Çalışma ortamı | `development` / `production` |
| `MONGODB_URI` | MongoDB bağlantı URL'i | `mongodb://localhost:27017/parkshare` |
| `JWT_SECRET` | JWT şifreleme anahtarı | `your-secret-key` |
| `JWT_EXPIRE` | Token geçerlilik süresi | `7d` |
| `SMTP_HOST` | Email sunucu adresi | `smtp.gmail.com` |
| `SMTP_PORT` | Email sunucu portu | `587` |
| `SMTP_EMAIL` | Gönderici email | `noreply@parkshare.com` |
| `SMTP_PASSWORD` | Email şifresi | `your-app-password` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API anahtarı | `AIza...` |

---

## 🧪 Testing

```bash
# Unit testleri çalıştır
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

---

## 📦 Deployment

### Heroku

```bash
# Heroku CLI ile login
heroku login

# Yeni Heroku app oluştur
heroku create parkshare-api

# MongoDB addon ekle
heroku addons:create mongolab

# Environment variables ayarla
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Docker

```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Docker image build
docker build -t parkshare-api .

# Container çalıştır
docker run -p 5000:5000 --env-file .env parkshare-api
```

---

## 🤝 Katkıda Bulunma

Bu proje şu anda **özel** (private) durumdadır ve katkılar kabul edilmemektedir.

---

## 📄 Lisans

```
Copyright (c) 2026 Umut Sayar

All Rights Reserved

This code and associated documentation files (the "Software") are the exclusive
property of Umut Sayar. The Software may not be copied, modified, merged, published,
distributed, sublicensed, and/or sold without explicit written permission from
the copyright holder.

The Software is provided for viewing purposes only.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

Tüm hakları saklıdır. Bu yazılım ve ilgili dokümantasyon dosyaları, telif hakkı sahibinin açık yazılı izni olmadan kopyalanamaz, değiştirilemez, birleştirilemez, yayınlanamaz, dağıtılamaz, alt lisanslanamaz ve/veya satılamaz.

---

## 📞 İletişim

**Umut Sayar**

- GitHub: [@umutsa177](https://github.com/umutsa177)
- Email: umutsayar8@gmail.com
- Proje Linki: [https://github.com/umutsa177/ParkShare-API](https://github.com/umutsa177/ParkShare-API)

---

## 🙏 Teşekkürler

- [Node.js](https://nodejs.org) - JavaScript runtime
- [Express.js](https://expressjs.com) - Web framework
- [MongoDB](https://www.mongodb.com) - Database
- [JWT](https://jwt.io) - Authentication

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/umutsa177">Umut Sayar</a>
</p>

<p align="center">
  <sub>⚠️ Bu proje özel mülkiyettedir ve tüm hakları saklıdır.</sub>
</p>
