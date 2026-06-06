const Car = require('../models/Car');
const { deleteFile } = require('../utils/deleteFile');

const buildMongoFilters = (rawQuery) => {
  const filters = {};

  Object.entries(rawQuery).forEach(([key, value]) => {
    const bracketMatch = key.match(/^([^[\]]+)\[(gt|gte|lt|lte|in)\]$/);

    if (bracketMatch) {
      const [, field, operator] = bracketMatch;

      if (!filters[field] || typeof filters[field] !== 'object' || Array.isArray(filters[field])) {
        filters[field] = {};
      }

      filters[field][`$${operator}`] = value;
      return;
    }

    filters[key] = value;
  });

  return filters;
};

/**
 * @desc    Get all cars
 * @route   GET /api/cars
 * @access  Public
 */
const getCars = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from direct filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    const mongoFilters = buildMongoFilters(reqQuery);

    // Parse and find
    query = Car.find(mongoFilters);

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Car.countDocuments(mongoFilters);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const cars = await query;

    // Pagination result
    const pagination = {};
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: cars.length,
      pagination,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single car
 * @route   GET /api/cars/:id
 * @access  Public
 */
const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new car
 * @route   POST /api/cars
 * @access  Private/Admin|Employee
 */
const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update car
 * @route   PUT /api/cars/:id
 * @access  Private/Admin|Employee
 */
const updateCar = async (req, res, next) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete car
 * @route   DELETE /api/cars/:id
 * @access  Private/Admin
 */
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Delete associated images from disk
    if (car.images && car.images.length > 0) {
      car.images.forEach(imagePath => {
        deleteFile(imagePath);
      });
    }

    await car.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get car filters (makes and models)
 * @route   GET /api/cars/filters
 * @access  Public
 */
const getCarFilters = async (req, res, next) => {
  try {
    // Get distinct values and limit to 5 as requested
    const brands = await Car.distinct('brand');
    const models = await Car.distinct('model');
    const transmissions = await Car.distinct('transmission');
    const fuelTypes = await Car.distinct('fuelType');
    
    res.status(200).json({
      success: true,
      data: {
        brands: brands.slice(0, 5),
        models: models.slice(0, 5),
        transmissions: transmissions.slice(0, 5),
        fuelTypes: fuelTypes.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getCarFilters
};
