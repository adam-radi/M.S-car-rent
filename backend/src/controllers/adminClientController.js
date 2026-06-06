const Booking = require('../models/Booking');
const User = require('../models/User');
const { BOOKING_STATUS } = require('../config/constants');

const CIN_REGEX = /^[A-Z0-9]{6,12}$/;

const normalizeText = (value = '') => value.trim();
const normalizeCin = (value = '') => normalizeText(value).toUpperCase();
const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildCarLabel = (car) => {
  if (!car) return 'Unknown car';
  const parts = [car.brand, car.model].filter(Boolean);
  return parts.length ? parts.join(' ') : 'Unknown car';
};

const buildClientListRows = (bookings = []) => {
  const grouped = new Map();

  bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((booking) => {
      const isStaff = ['admin', 'employee'].includes(booking.customer?.role);
      if (isStaff) return;

      const cin = normalizeCin(booking.customer?.cin || booking.guestInfo?.cin || '');
      const phone = normalizeText(booking.customer?.phone || booking.guestInfo?.phone || '');

      if (!cin && !phone) return;

      const key = `${cin || 'NO-CIN'}__${phone || 'NO-PHONE'}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          full_name: booking.customer
            ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
            : booking.guestInfo?.fullName || 'Guest client',
          cin: cin || '-',
          phone: phone || '-',
          email: booking.customer?.email || booking.guestInfo?.email || '-',
          linked_account: Boolean(booking.customer),
          total_bookings: 1,
          latest_booking: booking.createdAt
        });
        return;
      }

      grouped.get(key).total_bookings += 1;
    });

  return Array.from(grouped.values());
};

exports.lookupClientByCin = async (req, res, next) => {
  try {
    const cin = normalizeCin(req.query.cin || '');
    const phone = normalizeText(req.query.phone || '');

    if (!cin && !phone) {
      return res.status(400).json({
        success: false,
        message: 'CIN or phone is required'
      });
    }

    if (cin && !CIN_REGEX.test(cin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CIN format'
      });
    }

    const cinRegex = cin ? new RegExp(`^${escapeRegex(cin)}$`, 'i') : null;
    const phoneRegex = phone ? new RegExp(`^${escapeRegex(phone)}$`, 'i') : null;

    const userQuery = {
      $or: [
        ...(cinRegex ? [{ cin: cinRegex }] : []),
        ...(phoneRegex ? [{ phone: phoneRegex }] : [])
      ]
    };

    const linkedUsers = await User.find(userQuery).select('firstName lastName email phone cin isActive role');
    const linkedUserIds = linkedUsers.map((user) => user._id);

    const bookingQuery = {
      $or: [
        ...(cinRegex ? [{ 'guestInfo.cin': cinRegex }] : []),
        ...(phoneRegex ? [{ 'guestInfo.phone': phoneRegex }] : []),
        ...(linkedUserIds.length ? [{ customer: { $in: linkedUserIds } }] : [])
      ]
    };

    const bookings = await Booking.find(bookingQuery)
      .populate('customer', 'firstName lastName email phone cin isActive role')
      .populate('car', 'brand model year licensePlate')
      .sort({ createdAt: -1 });

    const filteredBookings = bookings.filter((booking) => {
      const guestCin = normalizeCin(booking.guestInfo?.cin || '');
      const customerCin = normalizeCin(booking.customer?.cin || '');
      const guestPhone = normalizeText(booking.guestInfo?.phone || '');
      const customerPhone = normalizeText(booking.customer?.phone || '');

      const matchesCin = !cinRegex || cinRegex.test(guestCin) || cinRegex.test(customerCin);
      const matchesPhone = !phoneRegex || phoneRegex.test(guestPhone) || phoneRegex.test(customerPhone);

      return matchesCin && matchesPhone;
    });

    if (!filteredBookings.length) {
      return res.status(200).json({
        success: true,
        client: null,
        bookings: []
      });
    }

    const primaryUser = linkedUsers[0] || filteredBookings.find((booking) => booking.customer)?.customer || null;
    const phones = new Set();
    const carCounts = new Map();
    let firstBooking = filteredBookings[0];
    let lastBooking = filteredBookings[0];
    let totalSpent = 0;

    filteredBookings.forEach((booking) => {
      const guestPhone = booking.guestInfo?.phone;
      const customerPhone = booking.customer?.phone;
      const carLabel = buildCarLabel(booking.car);

      if (guestPhone) phones.add(guestPhone);
      if (customerPhone) phones.add(customerPhone);

      carCounts.set(carLabel, (carCounts.get(carLabel) || 0) + 1);

      if (new Date(booking.createdAt) < new Date(firstBooking.createdAt)) firstBooking = booking;
      if (new Date(booking.createdAt) > new Date(lastBooking.createdAt)) lastBooking = booking;

      if (booking.status !== BOOKING_STATUS.CANCELLED) {
        totalSpent += Number(booking.finalPrice || 0);
      }
    });

    let mostRentedCar = null;
    for (const [carLabel, count] of carCounts.entries()) {
      if (!mostRentedCar || count > mostRentedCar.count) {
        mostRentedCar = { name: carLabel, count };
      }
    }

    const client = {
      cin: cin || primaryUser?.cin || filteredBookings.find((booking) => booking.guestInfo?.cin)?.guestInfo?.cin || null,
      phones: Array.from(phones),
      total_bookings: filteredBookings.length,
      first_booking: firstBooking.createdAt,
      last_booking: lastBooking.createdAt,
      linked_account: Boolean(primaryUser),
      email: primaryUser?.email || filteredBookings.find((booking) => booking.guestInfo?.email)?.guestInfo?.email || null,
      total_spent: totalSpent,
      most_rented_car: mostRentedCar?.name || null,
      account_status: primaryUser ? (primaryUser.isActive ? 'active' : 'inactive') : null,
      full_name: primaryUser
        ? `${primaryUser.firstName || ''} ${primaryUser.lastName || ''}`.trim()
        : filteredBookings.find((booking) => booking.guestInfo?.fullName)?.guestInfo?.fullName || null
    };

    const responseBookings = filteredBookings.map((booking) => ({
      id: booking._id,
      booking_id: booking._id,
      car: buildCarLabel(booking.car),
      start_date: booking.startDate,
      end_date: booking.endDate,
      status: booking.status,
      payment_status: booking.paymentStatus || 'unpaid',
      total_price: booking.finalPrice || 0,
      created_at: booking.createdAt,
      phone_used: booking.guestInfo?.phone || booking.customer?.phone || null,
      notes: booking.notes || booking.employeeNotes || '',
      customer_name: booking.customer
        ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
        : booking.guestInfo?.fullName || 'Guest client'
    }));

    res.status(200).json({
      success: true,
      client,
      bookings: responseBookings
    });
  } catch (error) {
    next(error);
  }
};

exports.listClients = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'firstName lastName email phone cin role')
      .sort({ createdAt: -1 });

    const clients = buildClientListRows(bookings);

    res.status(200).json({
      success: true,
      clients
    });
  } catch (error) {
    next(error);
  }
};
