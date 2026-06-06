const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPES), required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    relatedCar: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
