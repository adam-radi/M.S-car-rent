const nodemailer = require('nodemailer');

// Create a transporter using environment variables or a fallback/mock
const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send email when a user requests a booking (notifies admin and customer)
 */
const sendBookingRequestEmail = async (booking, customer, car) => {
  const fromEmail = process.env.SMTP_FROM || 'noreply@mscar.com';
  const carName = `${car.brand} ${car.model} (${car.year})`;
  const totalDays = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
  const totalAmount = booking.manualDiscount 
    ? (car.dailyPrice * totalDays - booking.manualDiscount) 
    : (car.dailyPrice * totalDays);

  const customerName = customer ? `${customer.firstName} ${customer.lastName}` : (booking.guestInfo ? booking.guestInfo.fullName : 'Guest');
  const customerEmail = customer ? customer.email : 'No Email (Guest)';
  const customerPhone = customer ? customer.phone : (booking.guestInfo ? booking.guestInfo.phone : 'N/A');

  const subject = `New Booking Request #${booking._id} - M.S Car`;
  const bodyText = `
Hello,

A new booking request has been submitted:

Booking ID: ${booking._id}
Car: ${carName} (License Plate: ${car.licensePlate || 'N/A'})
Period: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()} (${totalDays} Days)
Pickup Location: ${booking.pickupLocation}
Total Amount: ${totalAmount} DH

Customer Details:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone}
- CIN: ${customer ? customer.cin : (booking.guestInfo ? booking.guestInfo.cin : 'N/A')}

Notes: ${booking.notes || 'None'}

Please review this booking in the Admin Dashboard.

Best regards,
M.S Car Team
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log('\n--- [EMAIL LOG (SMTP NOT CONFIG)] ---');
    console.log(`To: Admin (${fromEmail}) & Customer (${customerEmail})`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${bodyText}`);
    console.log('-------------------------------------\n');
    return;
  }

  try {
    // Send to admin
    await transporter.sendMail({
      from: `"M.S Car Booking System" <${fromEmail}>`,
      to: fromEmail,
      subject: `[ADMIN] ${subject}`,
      text: bodyText
    });

    // Send confirmation to customer if they have an email
    if (customer && customer.email) {
      await transporter.sendMail({
        from: `"M.S Car" <${fromEmail}>`,
        to: customer.email,
        subject: `Your Booking Request #${booking._id} - Received`,
        text: `Hello ${customer.firstName},\n\nWe have received your booking request for ${carName}. Your booking is currently pending review.\n\nDetails:\n${bodyText}\n\nThank you for choosing M.S Car!`
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

/**
 * Send email when booking status updates (notifies customer)
 */
const sendBookingStatusEmail = async (booking, customer, car, status) => {
  if (!customer || !customer.email) return;

  const fromEmail = process.env.SMTP_FROM || 'noreply@mscar.com';
  const carName = `${car.brand} ${car.model}`;
  const subject = `Booking #${booking._id} Status Update - M.S Car`;
  
  const bodyText = `
Hello ${customer.firstName} ${customer.lastName},

The status of your booking #${booking._id} for the ${carName} has been updated to: ${status.toUpperCase()}.

Details:
- Start Date: ${new Date(booking.startDate).toLocaleDateString()}
- End Date: ${new Date(booking.endDate).toLocaleDateString()}
- Location: ${booking.pickupLocation}

${booking.employeeNotes ? `Staff Notes: ${booking.employeeNotes}` : ''}
${booking.cancelReason ? `Cancellation Reason: ${booking.cancelReason}` : ''}

Thank you for choosing M.S Car!

Best regards,
M.S Car Team
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log('\n--- [EMAIL LOG (SMTP NOT CONFIG)] ---');
    console.log(`To: Customer (${customer.email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${bodyText}`);
    console.log('-------------------------------------\n');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"M.S Car" <${fromEmail}>`,
      to: customer.email,
      subject: subject,
      text: bodyText
    });
  } catch (error) {
    console.error('Error sending status email:', error);
  }
};

module.exports = {
  sendBookingRequestEmail,
  sendBookingStatusEmail
};
