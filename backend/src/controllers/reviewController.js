const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { BOOKING_STATUS } = require('../config/constants');

/**
 * @desc    Add a review for a car
 * @route   POST /api/reviews
 * @access  Private
 */
exports.addReview = async (req, res, next) => {
  try {
    const { carId, bookingId, rating, comment } = req.body;

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id,
      car: carId,
      status: BOOKING_STATUS.COMPLETED
    });

    if (!booking) {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review cars from your completed bookings.' 
      });
    }

    const review = await Review.create({
      user: req.user.id,
      car: carId,
      booking: bookingId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking.' });
    }
    next(error);
  }
};

/**
 * @desc    Get all reviews for a specific car
 * @route   GET /api/reviews/car/:carId
 * @access  Public
 */
exports.getCarReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews from all users/cars
 * @route   GET /api/reviews
 * @access  Public
 */
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'firstName lastName')
      .populate('car', 'brand model')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private/Admin|Employee
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
