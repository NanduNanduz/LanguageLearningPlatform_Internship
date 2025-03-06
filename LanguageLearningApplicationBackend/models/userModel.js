const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String,
      enum:['user','uploader','admin'],  
      default: 'user' 
    },
    createdAt: { type: Date, default: Date.now },
    blocked:{type:String, enum:['yes','no'],default:'no'},
    mobile:{type:Number},
    subscription: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
