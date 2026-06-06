const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../config/constants');

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Guest booking info (used when no account exists)
    guestInfo: {
      fullName: { type: String },
      cin: { type: String },
      phone: { type: String },
      email: { type: String }
    },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    totalDays: { type: Number },
    basePrice: { type: Number },
    discountApplied: { type: Number, default: 0 },
    personalDiscount: { type: Number, default: 0 },
    manualDiscount: { type: Number, default: 0 },
    finalPrice: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'partial'],
      default: 'unpaid'
    },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },
    notes: { type: String },
    employeeNotes: { type: String },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: { type: Date },
    cancelReason: { type: String }
  },
  { timestamps: true }
);

bookingSchema.index({ 'guestInfo.cin': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ customer: 1 });

bookingSchema.pre('save', async function () {
  if (this.isModified('startDate') || this.isModified('endDate') || this.isModified('manualDiscount') || this.isNew) {
    if (!this.populated('car')) await this.populate('car');
    
    // Check for user personal discount if it's a new booking
    if (this.isNew) {
      const User = mongoose.model('User');
      const user = await User.findById(this.customer);
      if (user) {
        this.personalDiscount = user.personalDiscount || 0;
      }
    }

    if (this.car) {
      const msPerDay = 1000 * 60 * 60 * 24;
      this.totalDays = Math.ceil((this.endDate - this.startDate) / msPerDay);
      this.basePrice = this.car.dailyPrice * this.totalDays;
      
      // Calculate standard car discount
      const carDiscount = (this.totalDays >= this.car.discountThreshold) ? this.car.discountPercent : 0;
      this.discountApplied = carDiscount;

      // Cumulative discount logic: Car Discount + VIP Discount + Admin Manual Discount
      const totalDiscountPercent = Math.min(carDiscount + (this.personalDiscount || 0) + (this.manualDiscount || 0), 100);
      
      this.finalPrice = this.basePrice * (1 - (totalDiscountPercent / 100));
    }
  }
});


module.exports = mongoose.model('Booking', bookingSchema);
