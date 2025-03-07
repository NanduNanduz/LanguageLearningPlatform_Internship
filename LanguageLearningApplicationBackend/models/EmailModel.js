const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
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
        default: () => new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
        index: { expires: 0 }
    }
});

module.exports = mongoose.model('Email', emailSchema);
