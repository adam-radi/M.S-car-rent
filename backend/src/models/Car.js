const mongoose = require('mongoose');
const { CAR_STATUS } = require('../config/constants');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true, unique: true },
    color: { type: String },
    transmission: { type: String, enum: ['manual', 'automatic'] },
    fuelType: { type: String, enum: ['gasoline', 'diesel', 'electric', 'hybrid'] },
    seats: { type: Number, default: 5 },
    dailyPrice: { type: Number, required: true },
    discountThreshold: { type: Number, default: 7 },
    discountPercent: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(CAR_STATUS), default: CAR_STATUS.AVAILABLE },
    images: [{ type: String }],
    description: { type: String },
    mileage: { type: Number, default: 0 },
    vignetteBlocking: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
