const Document = require('../models/Document');
const path = require('path');

/**
 * @desc    Upload a new document (e.g. Driver License)
 * @route   POST /api/documents/upload
 * @access  Private
 */
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { type, expiryDate } = req.body;

    const document = await Document.create({
      user: req.user.id,
      type: type || 'drivers_license',
      fileUrl: `uploads/${req.file.filename}`,
      expiryDate,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents for logged-in user
 * @route   GET /api/documents
 * @access  Private
 */
exports.getMyDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update document status (Admin only)
 * @route   PATCH /api/documents/:id/status
 * @access  Private/Admin
 */
exports.updateDocumentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    document.status = status;
    if (notes) document.notes = notes;
    document.verifiedAt = status === 'verified' ? Date.now() : undefined;
    
    await document.save();

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents (Admin/Employee only)
 * @route   GET /api/documents/all
 * @access  Private/Admin|Employee
 */
exports.getAllDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .populate('user', 'firstName lastName email phoneNumber')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a document
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
    }

    await document.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

