const express = require('express');
const { getCarDocuments, addCarDocument, updateCarDocument, deleteCarDocument } = require('../controllers/carDocumentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'employee'), getCarDocuments)
  .post(protect, authorize('admin', 'employee'), upload.single('document'), addCarDocument);

router.route('/:id')
  .put(protect, authorize('admin', 'employee'), updateCarDocument)
  .delete(protect, authorize('admin', 'employee'), deleteCarDocument);

module.exports = router;
