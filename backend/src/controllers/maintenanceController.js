const Maintenance = require('../models/Maintenance');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { MAINTENANCE_STATUS, CAR_STATUS, BOOKING_STATUS } = require('../config/constants');

/**
 * @desc    Get all maintenance records
 * @route   GET /api/maintenance
 * @access  Private/Admin|Employee
 */
exports.getAllMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('car', 'brand model licensePlate')
      .populate('createdBy', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Schedule new maintenance
 * @route   POST /api/maintenance
 * @access  Private/Admin|Employee
 */
exports.createMaintenance = async (req, res, next) => {
  try {
    const { carId, type, description, startDate, endDate, cost, mileageAtService, performedBy } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Check overlap with bookings
    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot schedule maintenance: Car is booked during this period.' });
    }

    const maintenance = await Maintenance.create({
      car: carId,
      type,
      description,
      startDate,
      endDate,
      cost,
      mileageAtService,
      performedBy,
      createdBy: req.user.id
    });

    const today = new Date();
    if (today >= new Date(startDate) && today <= new Date(endDate)) {
      await Car.findByIdAndUpdate(carId, { status: CAR_STATUS.MAINTENANCE });
    }

    res.status(201).json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update maintenance status
 * @route   PATCH /api/maintenance/:id
 * @access  Private/Admin|Employee
 */
exports.updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, completedDate, cost, notes } = req.body;
    
    let maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    maintenance.status = status;
    if (completedDate) maintenance.completedDate = completedDate;
    if (cost) maintenance.cost = cost;
    
    await maintenance.save();

    // If maintenance is DONE, set car back to AVAILABLE
    if (status === MAINTENANCE_STATUS.DONE) {
      await Car.findByIdAndUpdate(maintenance.car, { status: CAR_STATUS.AVAILABLE });
    }

    res.status(200).json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};
