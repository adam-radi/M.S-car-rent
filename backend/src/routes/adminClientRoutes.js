const express = require('express');
const { lookupClientByCin, listClients } = require('../controllers/adminClientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.get('/clients/list', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), listClients);
router.get('/clients', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), lookupClientByCin);

module.exports = router;
