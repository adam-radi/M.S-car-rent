const express = require('express');
const {
  uploadDocument,
  getMyDocuments,
  updateDocumentStatus,
  getAllDocuments
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', getMyDocuments);
router.get('/all', authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), getAllDocuments);

// Admin-only route to verify documents
router.patch('/:id/status', authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), updateDocumentStatus);

module.exports = router;
