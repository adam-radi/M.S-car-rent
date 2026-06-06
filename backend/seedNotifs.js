const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/car_rental');
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found');
      process.exit(1);
    }

    const notifs = [];
    users.forEach(user => {
      notifs.push(
        {
          recipient: user._id,
          type: 'booking_confirmed',
          message: 'Your booking status for car Mercedes-Benz S-Class has been updated to confirmed.',
          isRead: false
        },
        {
          recipient: user._id,
          type: 'booking_cancelled',
          message: 'Booking #1234567890abcdef12345678 has been cancelled by the customer.',
          isRead: false
        },
        {
          recipient: user._id,
          type: 'maintenance_due',
          message: 'Maintenance is required for car Range Rover Velar.',
          isRead: false
        }
      );
    });

    await Notification.insertMany(notifs);
    console.log('Successfully added 3 notifications for all users.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
