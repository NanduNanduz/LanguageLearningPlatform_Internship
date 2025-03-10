const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
        index: { expires: 0 }
    }
});

module.exports = mongoose.model('Otp', otpSchema);
