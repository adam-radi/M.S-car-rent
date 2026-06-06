const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  getAllUsers,
  updateUserDiscount,
  updateUserByAdmin
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Admin only routes
router.get('/users', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), getAllUsers);
router.patch('/users/:id/discount', protect, authorize(USER_ROLES.ADMIN), updateUserDiscount);
router.patch('/users/:id', protect, authorize(USER_ROLES.ADMIN), updateUserByAdmin);

module.exports = router;
