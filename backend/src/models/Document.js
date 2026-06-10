const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    type: { type: String, enum: ['drivers_license', 'cin', 'passport', 'other'], required: true },
    fileUrl: { type: String, required: true },
    originalName: { type: String },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    expiryDate: { type: Date },
    notes: { type: String },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
