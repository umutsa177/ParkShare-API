const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İsim zorunludur'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email zorunludur'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email adresi giriniz']
    },
    password: {
        type: String,
        required: [true, 'Şifre zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Telefon numarası zorunludur'],
        trim: true
    },
    role: {
        type: String,
        enum: ['owner', 'renter'],
        default: 'renter'
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
    profileImage: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Şifre hashle
userSchema.pre('save', async function (next) {
    // Şifre değiştirilmemişse hiçbir şey yapma (geç)
    if (!this.isModified('password')) {
        return next();
    }

    // Şifre değişmişse hash'le
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);