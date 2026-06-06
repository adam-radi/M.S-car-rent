const Booking = require('../models/Booking');
const { BOOKING_STATUS } = require('../config/constants');

/**
 * Check if a car is available for a given date range
 * @param {string} carId - The ID of the car
 * @param {Date|string} startDate - The requested start date
 * @param {Date|string} endDate - The requested end date
 * @param {string} excludeBookingId - (Optional) Booking ID to exclude (useful when updating a booking)
 * @returns {Promise<boolean>} True if available, false otherwise
 */
const checkAvailability = async (carId, startDate, endDate, excludeBookingId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const query = {
    car: carId,
    status: { $nin: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED] },
    $or: [
      // Condition for overlap: Requested start is before existing end AND requested end is after existing start
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await Booking.find(query);
  return overlappingBookings.length === 0;
};

module.exports = {
  checkAvailability
};
