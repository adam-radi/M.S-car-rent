const express = require('express');
const {
  addReview,
  getCarReviews,
  getAllReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', getAllReviews);

router.get('/car/:carId', getCarReviews);

router.post('/', protect, addReview);

router.delete('/:id', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), deleteReview);

module.exports = router;
