const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const CarDocument = require('../models/CarDocument');
const { BOOKING_STATUS, CAR_STATUS } = require('../config/constants');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BOOKING_STATUSES_FOR_DEMAND = [
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.ACTIVE,
  BOOKING_STATUS.COMPLETED,
];

const formatCurrency = (amount) => Math.round(amount || 0);

const buildRevenueSeries = (revenueAnalytics) => {
  const today = new Date();
  const monthlyTotals = new Map();

  revenueAnalytics.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    monthlyTotals.set(key, formatCurrency(item.revenue));
  });

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    return {
      name: MONTH_NAMES[date.getMonth()],
      revenue: monthlyTotals.get(key) || 0,
    };
  });
};

const buildWeekdaySeries = (weekdayAnalytics) => {
  const weekdayTotals = new Map();

  weekdayAnalytics.forEach((item) => {
    weekdayTotals.set(item._id, item.count);
  });

  const maxValue = Math.max(0, ...weekdayTotals.values());
  const peakIndex = WEEKDAY_NAMES.findIndex((_, index) => weekdayTotals.get(index + 1) === maxValue);

  return WEEKDAY_NAMES.map((day, index) => ({
    day,
    value: weekdayTotals.get(index + 1) || 0,
    active: peakIndex === index && maxValue > 0,
  }));
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin|Employee
 */
exports.getStats = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalCars,
      totalBookings,
      totalUsers,
      pendingBookings,
      confirmedBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      availableCars,
      maintenanceCars,
      expiredDocsCars,
      expiringSoonDocsCars,
      revenueData,
      revenueLast30DaysData,
      activeCustomersLast30Days,
      repeatCustomersData,
    ] = await Promise.all([
      Car.countDocuments({ isDeleted: false }),
      Booking.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments({ status: BOOKING_STATUS.PENDING }),
      Booking.countDocuments({ status: BOOKING_STATUS.CONFIRMED }),
      Booking.countDocuments({ status: BOOKING_STATUS.ACTIVE }),
      Booking.countDocuments({ status: BOOKING_STATUS.COMPLETED }),
      Booking.countDocuments({ status: BOOKING_STATUS.CANCELLED }),
      Car.countDocuments({ status: CAR_STATUS.AVAILABLE, isDeleted: false }),
      Car.countDocuments({ status: CAR_STATUS.MAINTENANCE, isDeleted: false }),
      CarDocument.distinct('car', { endDate: { $lt: today } }),
      CarDocument.distinct('car', { endDate: { $gte: today, $lte: nextWeek } }),
      Booking.aggregate([
        { $match: { status: BOOKING_STATUS.COMPLETED } },
        { $group: { _id: null, total: { $sum: '$finalPrice' } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: BOOKING_STATUS.COMPLETED,
            createdAt: { $gte: last30Days },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalPrice' } } },
      ]),
      Booking.distinct('customer', {
        customer: { $ne: null },
        status: { $in: BOOKING_STATUSES_FOR_DEMAND },
        createdAt: { $gte: last30Days },
      }),
      Booking.aggregate([
        {
          $match: {
            customer: { $ne: null },
            status: { $in: BOOKING_STATUSES_FOR_DEMAND },
          },
        },
        { $group: { _id: '$customer', bookings: { $sum: 1 } } },
        { $match: { bookings: { $gt: 1 } } },
        { $count: 'count' },
      ]),
    ]);

    const totalRevenue = revenueData.length > 0 ? formatCurrency(revenueData[0].total) : 0;
    const revenueLast30Days = revenueLast30DaysData.length > 0 ? formatCurrency(revenueLast30DaysData[0].total) : 0;
    const repeatCustomers = repeatCustomersData.length > 0 ? repeatCustomersData[0].count : 0;
    const repeatCustomerPercentage = totalUsers > 0 ? Math.round((repeatCustomers / totalUsers) * 100) : 0;
    const fleetUtilization = totalCars > 0 ? Math.round(((totalCars - availableCars) / totalCars) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCars,
        totalBookings,
        totalUsers,
        pendingBookings,
        confirmedBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        availableCars,
        totalRevenue,
        revenueLast30Days,
        maintenanceCars,
        fleetUtilization,
        customerBreakdown: {
          registeredCustomers: totalUsers,
          repeatCustomers,
          activeCustomersLast30Days: activeCustomersLast30Days.length,
        },
        repeatCustomerRate: {
          percentage: repeatCustomerPercentage,
          repeatCustomers,
          totalCustomers: totalUsers,
        },
        healthAlerts: {
          expiredCount: expiredDocsCars.length,
          expiringSoonCount: expiringSoonDocsCars.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard analytics (Historical data)
 * @route   GET /api/dashboard/analytics
 * @access  Private/Admin|Employee
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [revenueAnalytics, topSellingProducts, weekdayActivity] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            status: BOOKING_STATUS.COMPLETED,
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            revenue: { $sum: '$finalPrice' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $in: BOOKING_STATUSES_FOR_DEMAND },
            car: { $ne: null },
          },
        },
        {
          $group: {
            _id: '$car',
            sold: { $sum: 1 },
            revenue: { $sum: '$finalPrice' },
          },
        },
        { $sort: { sold: -1, revenue: -1 } },
        { $limit: 12 },
        {
          $lookup: {
            from: 'cars',
            localField: '_id',
            foreignField: '_id',
            as: 'car',
          },
        },
        { $unwind: '$car' },
        {
          $project: {
            _id: 0,
            id: '$_id',
            carId: '$_id',
            sold: 1,
            revenue: 1,
            name: {
              $concat: [
                '$car.brand',
                ' ',
                '$car.model',
                ' ',
                { $toString: '$car.year' },
              ],
            },
            brand: '$car.brand',
            model: '$car.model',
            year: '$car.year',
            dailyPrice: '$car.dailyPrice',
            licensePlate: '$car.licensePlate',
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: {
            status: { $in: BOOKING_STATUSES_FOR_DEMAND },
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: '$createdAt' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueByMonth: buildRevenueSeries(revenueAnalytics),
        activityByWeekday: buildWeekdaySeries(weekdayActivity),
        topSellingProducts: topSellingProducts.map((item) => ({
          ...item,
          revenue: formatCurrency(item.revenue),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
