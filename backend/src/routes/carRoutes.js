const express = require('express');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getCarFilters
} = require('../controllers/carController');
const { getCarAvailability, getCarBusyDates } = require('../controllers/carAvailabilityController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();
const upload = require('../utils/fileUpload');

router.get('/filters', getCarFilters);
router.get('/availability', getCarAvailability);
router.get('/:id/busy-dates', getCarBusyDates);

router.post('/upload', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.status(200).json({ success: true, data: filePaths });
});

router.route('/')
  .get(getCars)
  .post(protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), createCar);

router.route('/:id')
  .get(getCar)
  .put(protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), updateCar)
  .delete(protect, authorize(USER_ROLES.ADMIN), deleteCar);

module.exports = router;
