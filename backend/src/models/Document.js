const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    type: { type: String, enum: ['license', 'cin', 'passport', 'other'] },
    filePath: { type: String, required: true },
    originalName: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
  }
);

module.exports = mongoose.model('Document', documentSchema);
