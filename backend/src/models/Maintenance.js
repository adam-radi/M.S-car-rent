const mongoose = require('mongoose');
const { MAINTENANCE_STATUS } = require('../config/constants');

const maintenanceSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    type: { type: String, enum: ['oil_change', 'tire_change', 'inspection', 'repair', 'other'] },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: { type: String, enum: Object.values(MAINTENANCE_STATUS), default: MAINTENANCE_STATUS.SCHEDULED },
    cost: { type: Number },
    mileageAtService: { type: Number },
    performedBy: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
