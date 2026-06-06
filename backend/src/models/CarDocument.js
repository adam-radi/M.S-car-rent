const mongoose = require('mongoose');
const { CAR_DOCUMENT_TYPES, CAR_DOCUMENT_STATUS } = require('../config/constants');

const carDocumentSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    type: { type: String, enum: Object.values(CAR_DOCUMENT_TYPES), required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: Object.values(CAR_DOCUMENT_STATUS), default: CAR_DOCUMENT_STATUS.VALID },
    isBlocking: { type: Boolean, default: true },
    fileUrl: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CarDocument', carDocumentSchema);
