/**
 * Seed Script for M.S Car
 * Run: node seedAll.js
 * 
 * Clears all collections then inserts:
 *   - 1 admin + 1 employee + 5 customers
 *   - 8 cars (4 with images from /uploads, 4 without)
 *   - 10 bookings (mix of statuses)
 *   - 4 maintenance records
 *   - 5 reviews
 *   - 10 notifications (sample)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Models ──────────────────────────────────────────────────────────────────
const User = require('./src/models/User');
const Car = require('./src/models/Car');
const Booking = require('./src/models/Booking');
const Maintenance = require('./src/models/Maintenance');
const Review = require('./src/models/Review');
const Notification = require('./src/models/Notification');

// ── Connect ──────────────────────────────────────────────────────────────────
async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/car_rental';
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected:', uri);
}

// ── Clear All ────────────────────────────────────────────────────────────────
async function clearAll() {
  await Promise.all([
    User.deleteMany({}),
    Car.deleteMany({}),
    Booking.deleteMany({}),
    Maintenance.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({})
  ]);
  console.log('🗑️  All collections cleared.');
}

// ── Seed Users ────────────────────────────────────────────────────────────────
async function seedUsers() {
  const salt = 10;
  const hashedPassword = await bcrypt.hash('Password123!', salt);

  const users = await User.insertMany([
    // Admin
    {
      firstName: 'Mohammed',
      lastName: 'Senhaji',
      email: 'admin@mscar.ma',
      phone: '0600000001',
      password: hashedPassword,
      role: 'admin',
      cin: 'BE123456',
      licenseNumber: 'LIC-ADMIN-01',
      licenseExpiry: new Date('2028-01-01'),
      isActive: true,
      personalDiscount: 0,
      preferredLanguage: 'ar'
    },
    // Employee
    {
      firstName: 'Youssef',
      lastName: 'Berrada',
      email: 'employee@mscar.ma',
      phone: '0600000002',
      password: hashedPassword,
      role: 'employee',
      cin: 'BK789012',
      licenseNumber: 'LIC-EMP-01',
      licenseExpiry: new Date('2027-06-01'),
      isActive: true,
      personalDiscount: 0,
      preferredLanguage: 'fr'
    },
    // Customers
    {
      firstName: 'Hamza',
      lastName: 'Alami',
      email: 'hamza.alami@gmail.com',
      phone: '0661111111',
      password: hashedPassword,
      role: 'customer',
      cin: 'AB112233',
      licenseNumber: 'LIC-C001',
      licenseExpiry: new Date('2026-09-15'),
      isActive: true,
      personalDiscount: 5,
      preferredLanguage: 'ar'
    },
    {
      firstName: 'Fatima',
      lastName: 'Ouahbi',
      email: 'fatima.ouahbi@gmail.com',
      phone: '0662222222',
      password: hashedPassword,
      role: 'customer',
      cin: 'CD334455',
      licenseNumber: 'LIC-C002',
      licenseExpiry: new Date('2027-03-10'),
      isActive: true,
      personalDiscount: 10,
      preferredLanguage: 'fr'
    },
    {
      firstName: 'Karim',
      lastName: 'Rachidi',
      email: 'karim.rachidi@gmail.com',
      phone: '0663333333',
      password: hashedPassword,
      role: 'customer',
      cin: 'EF556677',
      licenseNumber: 'LIC-C003',
      licenseExpiry: new Date('2025-12-01'),
      isActive: true,
      personalDiscount: 0,
      preferredLanguage: 'en'
    },
    {
      firstName: 'Laila',
      lastName: 'Benali',
      email: 'laila.benali@gmail.com',
      phone: '0664444444',
      password: hashedPassword,
      role: 'customer',
      cin: 'GH778899',
      licenseNumber: 'LIC-C004',
      licenseExpiry: new Date('2026-05-20'),
      isActive: true,
      personalDiscount: 15,
      preferredLanguage: 'ar'
    },
    {
      firstName: 'Omar',
      lastName: 'Tazi',
      email: 'omar.tazi@gmail.com',
      phone: '0665555555',
      password: hashedPassword,
      role: 'customer',
      cin: 'IJ990011',
      licenseNumber: 'LIC-C005',
      licenseExpiry: new Date('2028-08-30'),
      isActive: true,
      personalDiscount: 0,
      preferredLanguage: 'fr'
    }
  ]);

  console.log(`👥 ${users.length} users seeded.`);
  return users;
}

// ── Seed Cars ────────────────────────────────────────────────────────────────
// Uses existing images in /uploads for first 4 cars
async function seedCars() {
  const carsData = [
    {
      brand: 'Dacia',
      model: 'Sandero',
      year: 2022,
      licensePlate: 'A-12345-6',
      color: 'Blanc',
      transmission: 'manual',
      fuelType: 'gasoline',
      seats: 5,
      dailyPrice: 280,
      discountThreshold: 7,
      discountPercent: 10,
      status: 'available',
      images: ['/uploads/dacia.png'],
      description: 'Citadine économique et spacieuse. Idéale pour les trajets urbains et interurbains. Faible consommation de carburant.',
      mileage: 28000,
      isFeatured: true
    },
    {
      brand: 'Renault',
      model: 'Clio',
      year: 2023,
      licensePlate: 'B-23456-7',
      color: 'Rouge',
      transmission: 'automatic',
      fuelType: 'gasoline',
      seats: 5,
      dailyPrice: 350,
      discountThreshold: 5,
      discountPercent: 8,
      status: 'available',
      images: ['/uploads/renault.png'],
      description: 'Citadine moderne avec finition soignée. Boîte automatique pour un confort optimal en ville et sur route.',
      mileage: 15000,
      isFeatured: true
    },
    {
      brand: 'Peugeot',
      model: '208',
      year: 2023,
      licensePlate: 'C-34567-8',
      color: 'Gris',
      transmission: 'manual',
      fuelType: 'diesel',
      seats: 5,
      dailyPrice: 320,
      discountThreshold: 7,
      discountPercent: 12,
      status: 'available',
      images: ['/uploads/peugeot.png'],
      description: 'Compacte française élégante. Moteur diesel économique, parfaite pour les longs trajets sur autoroute.',
      mileage: 22000,
      isFeatured: true
    },
    {
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2022,
      licensePlate: 'D-45678-9',
      color: 'Noir',
      transmission: 'automatic',
      fuelType: 'hybrid',
      seats: 5,
      dailyPrice: 650,
      discountThreshold: 5,
      discountPercent: 15,
      status: 'available',
      images: ['/uploads/tucson.png'],
      description: 'SUV familial hybride haut de gamme. Confort exceptionnel, espace généreux et faible empreinte carbone.',
      mileage: 19500,
      isFeatured: true
    },
    {
      brand: 'Seat',
      model: 'Ibiza',
      year: 2021,
      licensePlate: 'E-56789-0',
      color: 'Bleu',
      transmission: 'manual',
      fuelType: 'gasoline',
      seats: 5,
      dailyPrice: 290,
      discountThreshold: 10,
      discountPercent: 10,
      status: 'available',
      images: ['/uploads/siat.png'],
      description: 'Citadine sportive avec un beau design. Parfaite pour les week-ends et explorations urbaines dynamiques.',
      mileage: 31000,
      isFeatured: false
    },
    {
      brand: 'Toyota',
      model: 'Yaris',
      year: 2023,
      licensePlate: 'F-67890-1',
      color: 'Blanc Perlé',
      transmission: 'automatic',
      fuelType: 'hybrid',
      seats: 5,
      dailyPrice: 420,
      discountThreshold: 7,
      discountPercent: 10,
      status: 'available',
      images: [],
      description: 'Hybride fiable et économique. Très faible consommation, idéale pour la ville comme pour la route.',
      mileage: 9000,
      isFeatured: false
    },
    {
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2022,
      licensePlate: 'G-78901-2',
      color: 'Argent',
      transmission: 'automatic',
      fuelType: 'diesel',
      seats: 5,
      dailyPrice: 480,
      discountThreshold: 7,
      discountPercent: 12,
      status: 'rented',
      images: [],
      description: 'La référence des compactes allemandes. Qualité de fabrication irréprochable et confort supérieur.',
      mileage: 41000,
      isFeatured: false
    },
    {
      brand: 'Mercedes',
      model: 'Classe A',
      year: 2023,
      licensePlate: 'H-89012-3',
      color: 'Noir Obsidienne',
      transmission: 'automatic',
      fuelType: 'gasoline',
      seats: 5,
      dailyPrice: 890,
      discountThreshold: 5,
      discountPercent: 10,
      status: 'available',
      images: [],
      description: 'Premium compacte allemande. Technologie de pointe, finition luxueuse et conduite sportive assurée.',
      mileage: 7500,
      isFeatured: true
    }
  ];

  const cars = await Car.insertMany(carsData);
  console.log(`🚗 ${cars.length} cars seeded.`);
  return cars;
}

// ── Seed Bookings ─────────────────────────────────────────────────────────────
async function seedBookings(users, cars, admin) {
  const customers = users.filter(u => u.role === 'customer');

  const now = new Date();
  const daysAgo = (n) => new Date(now - n * 86400000);
  const daysFromNow = (n) => new Date(now.getTime() + n * 86400000);

  const bookingsData = [
    // Completed booking
    {
      customer: customers[0]._id,
      car: cars[0]._id,
      startDate: daysAgo(20),
      endDate: daysAgo(15),
      pickupLocation: 'Agence Principale - Meknès',
      status: 'completed',
      paymentStatus: 'paid',
      handledBy: admin._id,
      notes: 'Client fidèle - traitement prioritaire'
    },
    // Active booking
    {
      customer: customers[1]._id,
      car: cars[6]._id,
      startDate: daysAgo(3),
      endDate: daysFromNow(4),
      pickupLocation: 'Aéroport Mohammed V - Casablanca',
      status: 'active',
      paymentStatus: 'paid',
      handledBy: admin._id,
    },
    // Confirmed booking
    {
      customer: customers[2]._id,
      car: cars[2]._id,
      startDate: daysFromNow(2),
      endDate: daysFromNow(7),
      pickupLocation: 'Agence Principale - Meknès',
      status: 'confirmed',
      paymentStatus: 'partial',
      handledBy: admin._id,
    },
    // Pending booking
    {
      customer: customers[3]._id,
      car: cars[3]._id,
      startDate: daysFromNow(5),
      endDate: daysFromNow(10),
      pickupLocation: 'Hotel Transatlantique - Meknès',
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Préfère une voiture propre avec GPS'
    },
    // Pending booking 2
    {
      customer: customers[4]._id,
      car: cars[7]._id,
      startDate: daysFromNow(8),
      endDate: daysFromNow(12),
      pickupLocation: 'Gare Meknès',
      status: 'pending',
      paymentStatus: 'unpaid',
    },
    // Rejected booking
    {
      customer: customers[0]._id,
      car: cars[1]._id,
      startDate: daysAgo(10),
      endDate: daysAgo(7),
      pickupLocation: 'Agence Principale - Meknès',
      status: 'rejected',
      paymentStatus: 'unpaid',
      handledBy: admin._id,
      employeeNotes: 'Problème de disponibilité - double réservation détectée'
    },
    // Cancelled booking
    {
      customer: customers[1]._id,
      car: cars[4]._id,
      startDate: daysAgo(5),
      endDate: daysAgo(2),
      pickupLocation: 'Agence Principale - Meknès',
      status: 'cancelled',
      paymentStatus: 'unpaid',
      cancelReason: 'Changement de plans de voyage',
      cancelledAt: daysAgo(6)
    },
    // Completed booking 2
    {
      customer: customers[2]._id,
      car: cars[1]._id,
      startDate: daysAgo(30),
      endDate: daysAgo(25),
      pickupLocation: 'Aéroport Meknès',
      status: 'completed',
      paymentStatus: 'paid',
      handledBy: admin._id,
    },
    // Guest booking
    {
      guestInfo: {
        fullName: 'Ahmed El Mansouri',
        cin: 'ZT123456',
        phone: '0677888999',
        email: 'ahmed.guest@hotmail.com'
      },
      car: cars[5]._id,
      startDate: daysFromNow(3),
      endDate: daysFromNow(6),
      pickupLocation: 'Agence Principale - Meknès',
      status: 'confirmed',
      paymentStatus: 'paid',
      handledBy: admin._id,
    },
    // Completed booking 3
    {
      customer: customers[3]._id,
      car: cars[0]._id,
      startDate: daysAgo(45),
      endDate: daysAgo(40),
      pickupLocation: 'Hotel Zaki - Meknès',
      status: 'completed',
      paymentStatus: 'paid',
      handledBy: admin._id,
    }
  ];

  const bookings = [];
  for (const data of bookingsData) {
    const booking = new Booking(data);
    await booking.save();
    bookings.push(booking);
  }

  console.log(`📅 ${bookings.length} bookings seeded.`);
  return bookings;
}

// ── Seed Maintenance ──────────────────────────────────────────────────────────
async function seedMaintenance(cars, admin) {
  const now = new Date();
  const daysAgo = (n) => new Date(now - n * 86400000);
  const daysFromNow = (n) => new Date(now.getTime() + n * 86400000);

  const maintenances = await Maintenance.insertMany([
    {
      car: cars[4]._id,
      type: 'oil_change',
      description: 'Vidange huile moteur + filtre - Seat Ibiza 50 000 km',
      startDate: daysAgo(2),
      endDate: daysAgo(1),
      status: 'done',
      cost: 350,
      mileageAtService: 31000,
      performedBy: 'Garage Amrani',
      completedDate: daysAgo(1),
      createdBy: admin._id
    },
    {
      car: cars[6]._id,
      type: 'inspection',
      description: 'Contrôle technique annuel - Golf',
      startDate: daysFromNow(5),
      endDate: daysFromNow(5),
      status: 'scheduled',
      cost: 200,
      mileageAtService: 41000,
      performedBy: 'Centre Contrôle Technique Meknès',
      createdBy: admin._id
    },
    {
      car: cars[2]._id,
      type: 'tire_change',
      description: 'Remplacement 4 pneus - Peugeot 208',
      startDate: daysAgo(10),
      endDate: daysAgo(10),
      status: 'done',
      cost: 1400,
      mileageAtService: 22000,
      performedBy: 'Norauto Meknès',
      completedDate: daysAgo(10),
      createdBy: admin._id
    },
    {
      car: cars[3]._id,
      type: 'repair',
      description: 'Réparation système de climatisation - Tucson',
      startDate: daysFromNow(1),
      endDate: daysFromNow(3),
      status: 'scheduled',
      cost: 1800,
      mileageAtService: 19500,
      performedBy: 'Auto Service Meknès',
      createdBy: admin._id
    }
  ]);

  console.log(`🔧 ${maintenances.length} maintenance records seeded.`);
  return maintenances;
}

// ── Seed Reviews ──────────────────────────────────────────────────────────────
async function seedReviews(users, cars, bookings) {
  // Only use completed bookings that have a real customer (not guest)
  const completedBookings = bookings.filter(b => b.status === 'completed' && b.customer);

  if (completedBookings.length < 2) {
    console.log('⚠️  Not enough completed customer bookings for reviews, skipping...');
    return [];
  }

  const reviewsData = [
    {
      user: completedBookings[0].customer,
      car: completedBookings[0].car,
      booking: completedBookings[0]._id,
      rating: 5,
      comment: 'Voiture impeccable, service excellent ! Je recommande vivement M.S Car à tous mes amis et collègues.'
    },
    {
      user: completedBookings[1].customer,
      car: completedBookings[1].car,
      booking: completedBookings[1]._id,
      rating: 4,
      comment: 'Très bonne expérience globalement. La Renault Clio était propre et en parfait état. Juste le temps d\'attente un peu long.'
    }
  ];

  // Add more if available
  if (completedBookings.length >= 3) {
    reviewsData.push({
      user: completedBookings[2].customer,
      car: completedBookings[2].car,
      booking: completedBookings[2]._id,
      rating: 5,
      comment: 'Service irréprochable et voiture de qualité. L\'équipe est professionnelle et accueillante. 5 étoiles méritées !'
    });
  }
  if (completedBookings.length >= 4) {
    reviewsData.push({
      user: completedBookings[3].customer,
      car: completedBookings[3].car,
      booking: completedBookings[3]._id,
      rating: 4,
      comment: 'Bonne agence de location à Meknès. Prix compétitifs et véhicules bien entretenus. Je reviendrai certainement.'
    });
  }

  const reviews = await Review.insertMany(reviewsData);
  console.log(`⭐ ${reviews.length} reviews seeded.`);
  return reviews;
}

// ── Seed Notifications ────────────────────────────────────────────────────────
async function seedNotifications(users, bookings) {
  const admin = users.find(u => u.role === 'admin');
  const customers = users.filter(u => u.role === 'customer');

  const notifsData = [
    // Admin notifications
    {
      recipient: admin._id,
      type: 'booking_request',
      message: `New pending booking request #${bookings[3]._id} for Hyundai Tucson by customer Laila Benali.`,
      isRead: false,
      relatedBooking: bookings[3]._id
    },
    {
      recipient: admin._id,
      type: 'booking_request',
      message: `New pending booking request #${bookings[4]._id} for Mercedes Classe A by customer Omar Tazi.`,
      isRead: false,
      relatedBooking: bookings[4]._id
    },
    {
      recipient: admin._id,
      type: 'booking_cancelled',
      message: `Booking #${bookings[6]._id} for Seat Ibiza has been cancelled by customer Fatima Ouahbi.`,
      isRead: true,
      relatedBooking: bookings[6]._id
    },
    // Customer notifications
    {
      recipient: customers[0]._id,
      type: 'booking_confirmed',
      message: `Your booking status for Dacia Sandero has been updated to COMPLETED.`,
      isRead: true,
      relatedBooking: bookings[0]._id
    },
    {
      recipient: customers[1]._id,
      type: 'booking_confirmed',
      message: `Your booking status for Volkswagen Golf has been updated to ACTIVE.`,
      isRead: false,
      relatedBooking: bookings[1]._id
    },
    {
      recipient: customers[2]._id,
      type: 'booking_confirmed',
      message: `Your booking status for Peugeot 208 has been updated to CONFIRMED.`,
      isRead: false,
      relatedBooking: bookings[2]._id
    },
    {
      recipient: customers[3]._id,
      type: 'booking_request',
      message: `Your booking request for Hyundai Tucson has been received and is pending review.`,
      isRead: false,
      relatedBooking: bookings[3]._id
    },
    {
      recipient: customers[0]._id,
      type: 'booking_cancelled',
      message: `Your booking for Renault Clio has been rejected by the staff. Reason: Problème de disponibilité.`,
      isRead: true,
      relatedBooking: bookings[5]._id
    },
    {
      recipient: customers[4]._id,
      type: 'booking_request',
      message: `Your booking request for Mercedes Classe A has been received and is pending review.`,
      isRead: false,
      relatedBooking: bookings[4]._id
    },
    {
      recipient: customers[1]._id,
      type: 'booking_cancelled',
      message: `Your booking for Seat Ibiza has been successfully cancelled.`,
      isRead: true,
      relatedBooking: bookings[6]._id
    }
  ];

  const notifications = await Notification.insertMany(notifsData);
  console.log(`🔔 ${notifications.length} notifications seeded.`);
  return notifications;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    await connect();
    await clearAll();

    const users = await seedUsers();
    const admin = users.find(u => u.role === 'admin');
    const cars = await seedCars();
    const bookings = await seedBookings(users, cars, admin);
    await seedMaintenance(cars, admin);
    await seedReviews(users, cars, bookings);
    await seedNotifications(users, bookings);

    console.log('\n✅ Seed completed successfully!\n');
    console.log('════════════════════════════════════════════════');
    console.log('   CREDENTIALS');
    console.log('════════════════════════════════════════════════');
    console.log('   Admin:    admin@mscar.ma   / Password123!');
    console.log('   Employee: employee@mscar.ma / Password123!');
    console.log('   Customer: hamza.alami@gmail.com / Password123!');
    console.log('════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

main();
