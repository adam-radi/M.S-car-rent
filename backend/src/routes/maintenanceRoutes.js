const express = require('express');
const {
  getAllMaintenance,
  createMaintenance,
  updateMaintenanceStatus
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE));

router.route('/')
  .get(getAllMaintenance)
  .post(createMaintenance);

router.patch('/:id', updateMaintenanceStatus);

module.exports = router;
