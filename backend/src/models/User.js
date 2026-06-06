const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.CUSTOMER },
    cin: { type: String },
    licenseNumber: { type: String },
    licenseExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    preferredLanguage: { type: String, enum: ['ar', 'fr', 'en'], default: 'fr' },
    personalDiscount: { type: Number, default: 0 } // Loyalty discount in %
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
