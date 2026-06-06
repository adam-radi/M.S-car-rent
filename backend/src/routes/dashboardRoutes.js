const express = require('express');
const { getStats, getAnalytics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.get('/stats', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), getStats);
router.get('/analytics', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), getAnalytics);

module.exports = router;
