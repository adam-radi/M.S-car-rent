const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

const { protect, authorize } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../config/constants');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Mark a message as read
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
router.patch('/:id/read', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.read = true;
    await message.save();
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize(USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await message.deleteOne();
    res.json({ success: true, message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
