const CarDocument = require('../models/CarDocument');
const Car = require('../models/Car');

exports.getCarDocuments = async (req, res, next) => {
  try {
    const { carId } = req.query;
    const filter = carId ? { car: carId } : {};
    
    // Auto-update expired documents on fetch
    const documents = await CarDocument.find(filter).populate('car', 'brand model licensePlate');
    
    let updated = false;
    const today = new Date();
    for (let doc of documents) {
      if (doc.endDate && new Date(doc.endDate) < today && doc.status !== 'expired') {
        doc.status = 'expired';
        await doc.save();
        updated = true;
      }
    }
    
    const finalDocs = updated ? await CarDocument.find(filter).populate('car', 'brand model licensePlate') : documents;

    res.status(200).json({
      success: true,
      data: finalDocs
    });
  } catch (error) {
    next(error);
  }
};

exports.addCarDocument = async (req, res, next) => {
  try {
    const { carId, type, startDate, endDate, notes, isBlocking } = req.body;
    let fileUrl = '';
    
    if (req.file) {
      fileUrl = `uploads/${req.file.filename}`;
    }

    const document = await CarDocument.create({
      car: carId,
      type,
      startDate: startDate || null,
      endDate: endDate || null,
      notes,
      isBlocking: isBlocking === 'true' || isBlocking === true,
      fileUrl
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCarDocument = async (req, res, next) => {
  try {
    const { status, endDate, notes } = req.body;
    const doc = await CarDocument.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (status) doc.status = status;
    if (endDate) doc.endDate = endDate;
    if (notes !== undefined) doc.notes = notes;
    if (req.body.isBlocking !== undefined) doc.isBlocking = req.body.isBlocking === 'true' || req.body.isBlocking === true;

    await doc.save();

    res.status(200).json({
      success: true,
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCarDocument = async (req, res, next) => {
  try {
    const doc = await CarDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await doc.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
