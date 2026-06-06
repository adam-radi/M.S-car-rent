const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  downloadInvoice,
  getCarBookedDates
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Public route for calendar
router.get('/car/:carId/dates', getCarBookedDates);

// Apply protect middleware to all routes below
router.use(protect);

// Routes for both customers and staff
router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBookingById);
router.get('/:id/invoice', downloadInvoice);
router.put('/:id/status', updateBookingStatus); // the controller handles internal role checks for status

// Admin/Employee only route
router.get('/', authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), getAllBookings);

module.exports = router;

