const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Maintenance = require('../models/Maintenance');
const CarDocument = require('../models/CarDocument');
const { CAR_STATUS, BOOKING_STATUS, MAINTENANCE_STATUS, CAR_DOCUMENT_TYPES } = require('../config/constants');

/**
 * @desc    Get cars with date-based availability status
 * @route   GET /api/cars/availability?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 * @access  Public
 */
const getCarAvailability = async (req, res, next) => {
  try {
    const { start_date, end_date, brand, model, transmission } = req.query;

    // --- Validate dates ---
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date and end_date are required.'
      });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'end_date must be after start_date.'
      });
    }

    // --- Build car filter query ---
    const carQuery = { isDeleted: { $ne: true } };
    if (req.query.id) carQuery._id = req.query.id;
    if (brand && brand !== 'Any makes') carQuery.brand = brand;
    if (model && model !== 'Any models') carQuery.model = model;
    if (transmission && transmission !== 'Any transmission') {
      carQuery.transmission = transmission.toLowerCase();
    }

    // Apply pricing filter from query params
    const minPrice = req.query['dailyPrice[gte]'];
    const maxPrice = req.query['dailyPrice[lte]'];
    if (minPrice || maxPrice) {
      carQuery.dailyPrice = {};
      if (minPrice) carQuery.dailyPrice.$gte = Number(minPrice);
      if (maxPrice) carQuery.dailyPrice.$lte = Number(maxPrice);
    }

    // --- Fetch all matching cars ---
    const cars = await Car.find(carQuery).sort('-createdAt');
    const carIds = cars.map(c => c._id);

    // --- Find all overlapping bookings in the period ---
    const activeStatuses = [
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.ACTIVE
    ];

    const overlappingBookings = await Booking.find({
      status: { $in: activeStatuses },
      startDate: { $lte: end },
      endDate: { $gte: start }
    }).select('car');

    const bookedCarIds = new Set(
      overlappingBookings.map((b) => b.car.toString())
    );

    // --- Find all overlapping maintenances ---
    const overlappingMaintenances = await Maintenance.find({
      car: { $in: carIds },
      status: { $in: [MAINTENANCE_STATUS.SCHEDULED, MAINTENANCE_STATUS.IN_PROGRESS] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    const maintenanceByCar = {};
    overlappingMaintenances.forEach(m => {
      maintenanceByCar[m.car.toString()] = m;
    });

    // --- Fetch car documents ---
    const carDocuments = await CarDocument.find({ car: { $in: carIds } });
    const docsByCar = {};
    carDocuments.forEach(doc => {
      const carId = doc.car.toString();
      if (!docsByCar[carId]) docsByCar[carId] = [];
      docsByCar[carId].push(doc);
    });

    const today = new Date();

    // --- Annotate each car with availability ---
    const annotatedCars = cars.map((car) => {
      const carObj = car.toObject();
      const carIdStr = car._id.toString();

      let availability = 'available';
      let reasons = [];
      let details = {};

      // 1. Manual status check
      if (car.status === CAR_STATUS.RETIRED) {
        availability = 'unavailable';
        reasons.push('retired');
      } else if (car.status === 'unavailable') {
        availability = 'unavailable';
        reasons.push('manual_unavailable');
      }

      // 2. Booking overlap
      if (bookedCarIds.has(carIdStr)) {
        availability = 'unavailable';
        reasons.push('booked');
      }

      // 3. Maintenance overlap
      if (maintenanceByCar[carIdStr]) {
        availability = 'unavailable';
        reasons.push('maintenance');
        details.maintenance = maintenanceByCar[carIdStr];
      }

      // 4. Document check
      const docs = docsByCar[carIdStr] || [];
      docs.forEach(doc => {
        const isExpired = doc.endDate && new Date(doc.endDate) < today;
        if (isExpired && doc.isBlocking !== false) {
          availability = 'unavailable';
          reasons.push(`${doc.type}_expired`);
        }
      });

      return { ...carObj, availability, reasons, details };
    });

    // --- Sort: available first, unavailable lower ---
    annotatedCars.sort((a, b) => {
      if (a.availability === b.availability) return 0;
      return a.availability === 'available' ? -1 : 1;
    });

    res.status(200).json({
      success: true,
      count: annotatedCars.length,
      data: annotatedCars
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all busy date ranges for a specific car (bookings + maintenance)
 * @route   GET /api/cars/:id/busy-dates
 * @access  Public
 */
const getCarBusyDates = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });

    const today = new Date();

    // 1. Fetch busy ranges
    const bookings = await Booking.find({
      car: id,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE] },
      endDate: { $gte: today }
    }).select('startDate endDate');

    const maintenances = await Maintenance.find({
      car: id,
      status: { $in: [MAINTENANCE_STATUS.SCHEDULED, MAINTENANCE_STATUS.IN_PROGRESS] },
      endDate: { $gte: today }
    }).select('startDate endDate');

    // 2. Check current health block
    const docs = await CarDocument.find({ car: id });
    const isCurrentlyBlocked = docs.some(d => 
      d.isBlocking !== false && d.endDate && new Date(d.endDate) < today && d.status !== 'deleted'
    );

    const busyDates = [
      ...bookings.map(b => ({ from: b.startDate, to: b.endDate, type: 'booking' })),
      ...maintenances.map(m => ({ from: m.startDate, to: m.endDate, type: 'maintenance' }))
    ];

    res.status(200).json({
      success: true,
      data: {
        busyDates,
        isCurrentlyBlocked,
        reasons: isCurrentlyBlocked ? docs.filter(d => d.isBlocking !== false && d.endDate && new Date(d.endDate) < today).map(d => d.type) : []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCarAvailability, getCarBusyDates };
