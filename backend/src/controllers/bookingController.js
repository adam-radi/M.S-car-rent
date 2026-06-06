const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { BOOKING_STATUS, CAR_STATUS, NOTIFICATION_TYPES } = require('../config/constants');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer, Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const { carId, startDate, endDate, pickupLocation, notes, customerId, guestInfo, manualDiscount, paymentStatus } = req.body;
    const isStaff = ['admin', 'employee'].includes(req.user.role);

    // Determine customer: admin can book for existing user OR for a guest (no account)
    let actualCustomerId = req.user.id;
    if (isStaff) {
      if (customerId) {
        actualCustomerId = customerId; // Existing user selected
      } else if (guestInfo) {
        actualCustomerId = null; // Guest booking - no user account
      }
    }

    // Validation: non-admin must be logged in (customer is always req.user.id)
    if (!isStaff && !actualCustomerId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Guest bookings must have at least a name and CIN
    if (isStaff && !customerId && guestInfo) {
      if (!guestInfo.fullName || !guestInfo.cin) {
        return res.status(400).json({ success: false, message: 'Guest full name and CIN are required' });
      }
    }

    if (!carId || !startDate || !endDate || !pickupLocation) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.status === CAR_STATUS.MAINTENANCE || car.status === CAR_STATUS.RETIRED || car.isDeleted) {
      return res.status(400).json({ success: false, message: 'Car is not available for booking' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      car: carId,
      status: { $nin: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED] },
      $and: [
        { startDate: { $lte: end } },
        { endDate: { $gte: start } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ success: false, message: 'Car is already booked for the selected dates' });
    }

    // Build booking document
    const bookingData = {
      car: carId,
      startDate: start,
      endDate: end,
      pickupLocation,
      notes,
      status: isStaff ? BOOKING_STATUS.CONFIRMED : BOOKING_STATUS.PENDING,
      handledBy: isStaff ? req.user.id : undefined,
      manualDiscount: isStaff && manualDiscount ? manualDiscount : 0,
      paymentStatus: isStaff && ['paid', 'unpaid', 'partial'].includes(paymentStatus) ? paymentStatus : 'unpaid',
    };

    if (actualCustomerId) {
      bookingData.customer = actualCustomerId;
    } else {
      // Guest booking
      bookingData.guestInfo = guestInfo;
    }

    const booking = new Booking(bookingData);
    await booking.save();
    await booking.populate('car', 'brand model year licensePlate dailyPrice images');

    const carName = booking.car && booking.car.brand ? `${booking.car.brand} ${booking.car.model}` : 'a car';

    // 1. Customer Notification (if booked by or for a registered user)
    if (booking.customer) {
      try {
        const customerMsg = booking.status === BOOKING_STATUS.PENDING
          ? `Your booking request for ${carName} has been received and is pending review.`
          : `A new booking for ${carName} has been created for you by our staff.`;

        await Notification.create({
          recipient: booking.customer,
          type: NOTIFICATION_TYPES.BOOKING_REQUEST,
          message: customerMsg,
          relatedBooking: booking._id
        });
      } catch (err) {
        console.error('Error creating customer booking notification:', err);
      }
    }

    // 2. Admin & Employee Notifications (always send to all staff)
    try {
      const staffMembers = await User.find({ role: { $in: ['admin', 'employee'] } });
      let customerName = 'Guest';
      if (booking.customer) {
        const custUser = await User.findById(booking.customer);
        if (custUser) {
          customerName = `${custUser.firstName} ${custUser.lastName}`;
        }
      } else if (booking.guestInfo) {
        customerName = booking.guestInfo.fullName;
      }

      const adminMsg = booking.status === BOOKING_STATUS.PENDING
        ? `New pending booking request #${booking._id} for ${carName} by customer ${customerName}.`
        : `New booking #${booking._id} for ${carName} created by staff for ${customerName}.`;

      const notificationPromises = staffMembers.map(staff => {
        return Notification.create({
          recipient: staff._id,
          type: NOTIFICATION_TYPES.BOOKING_REQUEST,
          message: adminMsg,
          relatedBooking: booking._id
        });
      });
      await Promise.all(notificationPromises);
    } catch (err) {
      console.error('Error creating staff booking notifications:', err);
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('car', 'brand model year images dailyPrice')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin/Employee)
// @route   GET /api/bookings
// @access  Private (Admin, Employee)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'firstName lastName email phone cin')
      .populate('car', 'brand model licensePlate')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone cin')
      .populate('car', 'brand model year licensePlate images dailyPrice');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only allow customer to see their own booking, but let admin/employee see any
    const isCustomerOwner = booking.customer._id.toString() === req.user.id;
    const isStaff = ['admin', 'employee'].includes(req.user.role);

    if (!isCustomerOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve, Reject, Cancel, Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, employeeNotes, cancelReason, manualDiscount, paymentStatus } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Process cancellations by user
    if (status === BOOKING_STATUS.CANCELLED) {
      // Must be owner to cancel, or admin
      if (booking.customer && booking.customer.toString() !== req.user.id && !['admin', 'employee'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }
      
      booking.status = BOOKING_STATUS.CANCELLED;
      booking.cancelledAt = Date.now();
      booking.cancelReason = cancelReason || 'Cancelled by user';
    } 
    // Other status updates are for Staff only
    else {
      if (!['admin', 'employee'].includes(req.user.role)) {
         return res.status(403).json({ success: false, message: 'Not authorized to change booking status' });
      }

      if (!Object.values(BOOKING_STATUS).includes(status)) {
         return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      booking.status = status;
      if (employeeNotes) booking.employeeNotes = employeeNotes;
      if (typeof manualDiscount !== 'undefined') booking.manualDiscount = manualDiscount;
      if (typeof paymentStatus !== 'undefined' && ['paid', 'unpaid', 'partial'].includes(paymentStatus)) {
        booking.paymentStatus = paymentStatus;
      }
      booking.handledBy = req.user.id;

      // When active, change car status to RENTED
      if (status === BOOKING_STATUS.ACTIVE) {
        await Car.findByIdAndUpdate(booking.car, { status: CAR_STATUS.RENTED });
      }
      
      // When completed or cancelled/rejected, change car status back to AVAILABLE
      if (['completed', 'cancelled', 'rejected'].includes(status)) {
         await Car.findByIdAndUpdate(booking.car, { status: CAR_STATUS.AVAILABLE });
      }
    }

    await booking.save();

    // Populate for notifications
    if (booking.customer) {
      await booking.populate('customer', 'firstName lastName email phone preferredLanguage');
    }
    await booking.populate('car', 'brand model year dailyPrice');

    const carName = booking.car && booking.car.brand ? `${booking.car.brand} ${booking.car.model}` : 'your selected car';
    let customerName = 'Guest';
    if (booking.customer) {
      customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
    } else if (booking.guestInfo) {
      customerName = booking.guestInfo.fullName;
    }

    const isCustomerCancel = (status === BOOKING_STATUS.CANCELLED && booking.customer && booking.customer._id.toString() === req.user.id);

    // 1. Customer Notification (if registered customer exists)
    if (booking.customer) {
      try {
        const notifType = ['cancelled', 'rejected'].includes(status) 
          ? NOTIFICATION_TYPES.BOOKING_CANCELLED 
          : NOTIFICATION_TYPES.BOOKING_CONFIRMED;

        const customerMsg = isCustomerCancel
          ? `Your booking for ${carName} has been successfully cancelled.`
          : `Your booking status for ${carName} has been updated to ${status.toUpperCase()}.`;

        await Notification.create({
          recipient: booking.customer._id,
          type: notifType,
          message: customerMsg,
          relatedBooking: booking._id
        });
      } catch (err) {
        console.error('Error creating customer status update notification:', err);
      }
    }

    // 2. Admin & Employee Notifications (always send to all staff)
    try {
      const staffMembers = await User.find({ role: { $in: ['admin', 'employee'] } });
      const notifType = ['cancelled', 'rejected'].includes(status) 
        ? NOTIFICATION_TYPES.BOOKING_CANCELLED 
        : NOTIFICATION_TYPES.BOOKING_CONFIRMED;

      const adminMsg = isCustomerCancel
        ? `Booking #${booking._id} for ${carName} has been cancelled by customer ${customerName}.`
        : `Booking #${booking._id} status updated to ${status.toUpperCase()} by staff member ${req.user.firstName} ${req.user.lastName}.`;

      const notificationPromises = staffMembers.map(staff => {
        return Notification.create({
          recipient: staff._id,
          type: notifType,
          message: adminMsg,
          relatedBooking: booking._id
        });
      });
      await Promise.all(notificationPromises);
    } catch (err) {
      console.error('Error creating admin status update notifications:', err);
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download invoice for a completed booking
// @route   GET /api/bookings/:id/invoice
// @access  Private
exports.downloadInvoice = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('car', 'brand model licensePlate dailyPrice');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Must be completed
    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      return res.status(400).json({ success: false, message: 'Invoices are only generated for completed bookings' });
    }

    // Authorization: owner or staff
    const isCustomerOwner = booking.customer._id.toString() === req.user.id;
    const isStaff = ['admin', 'employee'].includes(req.user.role);

    if (!isCustomerOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to download this invoice' });
    }

    const { generateInvoicePDF } = require('../utils/pdfGenerator');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${booking._id}.pdf`);

    generateInvoicePDF(
      booking,
      (chunk) => res.write(chunk),
      () => res.end()
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked dates for a car for the availability calendar
// @route   GET /api/bookings/car/:carId/dates
// @access  Public
exports.getCarBookedDates = async (req, res, next) => {
  try {
    // Only get active or confirmed bookings that occupy the car
    const bookings = await Booking.find({
      car: req.params.carId,
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.ACTIVE, BOOKING_STATUS.PENDING] }
    }).select('startDate endDate');

    // Also get scheduled or in-progress maintenance records
    const Maintenance = require('../models/Maintenance');
    const maintenances = await Maintenance.find({
      car: req.params.carId,
      status: { $in: ['scheduled', 'in_progress'] }
    }).select('scheduledDate endDate');

    // Convert maintenance records into the same format as bookings for the calendar
    const maintenanceDates = maintenances.map(m => ({
      startDate: m.scheduledDate,
      endDate: m.endDate || m.scheduledDate,
      type: 'maintenance'
    }));

    res.status(200).json({
      success: true,
      data: [...bookings, ...maintenanceDates]
    });
  } catch (error) {
    next(error);
  }
};
