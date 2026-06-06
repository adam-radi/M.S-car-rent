const PDFDocument = require('pdfkit');

/**
 * Builds a PDF invoice for a given booking and writes it to the provided writable stream.
 * @param {Object} booking - The populated booking object.
 * @param {WritableStream} dataCallback - The function to call when data is generated.
 * @param {Function} endCallback - The function to call when the document is finished.
 */
exports.generateInvoicePDF = (booking, dataCallback, endCallback) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream plumbing
  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // --- Header ---
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('M.S. CAR RENTAL', 50, 57)
    .fontSize(10)
    .text('123 Auto Avenue', 200, 50, { align: 'right' })
    .text('Casablanca, Morocco', 200, 65, { align: 'right' })
    .text('Phone: +212 555-0198', 200, 80, { align: 'right' })
    .moveDown();

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 105).lineTo(550, 105).stroke();

  // --- Invoice Info ---
  doc
    .fontSize(16)
    .fillColor('#333333')
    .text('INVOICE', 50, 130)
    .fontSize(10)
    .text(`Invoice Number: INV-${booking._id.toString().substring(0, 8).toUpperCase()}`, 50, 155)
    .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 170)
    .text(`Status: ${booking.status.toUpperCase()}`, 50, 185)
    .moveDown();

  // --- Customer & Car Info ---
  const customerInfoTop = 220;
  
  doc
    .fontSize(12)
    .fillColor('#333333')
    .text('Bill To:', 50, customerInfoTop)
    .fontSize(10)
    .text(`${booking.customer?.firstName} ${booking.customer?.lastName}`, 50, customerInfoTop + 15)
    .text(booking.customer?.email, 50, customerInfoTop + 30)
    .text(booking.customer?.phone, 50, customerInfoTop + 45);

  doc
    .fontSize(12)
    .text('Rental Details:', 300, customerInfoTop)
    .fontSize(10)
    .text(`Vehicle: ${booking.car?.brand} ${booking.car?.model}`, 300, customerInfoTop + 15)
    .text(`License Plate: ${booking.car?.licensePlate || 'N/A'}`, 300, customerInfoTop + 30)
    .text(`Pick-up Location: ${booking.pickupLocation}`, 300, customerInfoTop + 45);

  // --- Trip Dates ---
  const tripsTop = 300;
  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, tripsTop - 10).lineTo(550, tripsTop - 10).stroke();
  
  doc
    .fontSize(10)
    .text('Pick-up Date:', 50, tripsTop)
    .text(new Date(booking.startDate).toLocaleDateString(), 150, tripsTop)
    .text('Return Date:', 50, tripsTop + 20)
    .text(new Date(booking.endDate).toLocaleDateString(), 150, tripsTop + 20)
    .text('Duration:', 50, tripsTop + 40)
    .text(`${booking.totalDays} Days`, 150, tripsTop + 40);

  // --- Pricing Breakdown ---
  const tableTop = 380;
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Description', 50, tableTop)
    .text('Daily Rate', 280, tableTop, { width: 90, align: 'right' })
    .text('Quantity', 370, tableTop, { width: 90, align: 'right' })
    .text('Total', 0, tableTop, { align: 'right' });

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  doc
    .font('Helvetica')
    .text(`Vehicle Rental: ${booking.car?.brand} ${booking.car?.model}`, 50, tableTop + 25)
    .text(`$${booking.car?.dailyPrice?.toFixed(2)}`, 280, tableTop + 25, { width: 90, align: 'right' })
    .text(`${booking.totalDays} Days`, 370, tableTop + 25, { width: 90, align: 'right' })
    .text(`$${booking.basePrice?.toFixed(2)}`, 0, tableTop + 25, { align: 'right' });

  const summaryTop = 450;
  
  // Calculate total discounts visually
  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(370, summaryTop - 10).lineTo(550, summaryTop - 10).stroke();
  
  doc
    .text('Subtotal:', 370, summaryTop, { width: 90, align: 'right' })
    .text(`$${booking.basePrice?.toFixed(2)}`, 0, summaryTop, { align: 'right' });

  let offset = 20;

  if (booking.discountApplied > 0) {
    doc.text(`Duration Discount (${booking.discountApplied}%):`, 300, summaryTop + offset, { width: 160, align: 'right' });
    doc.text(`-$${(booking.basePrice * (booking.discountApplied / 100)).toFixed(2)}`, 0, summaryTop + offset, { align: 'right' });
    offset += 20;
  }
  
  if (booking.personalDiscount > 0) {
    doc.text(`VIP Discount (${booking.personalDiscount}%):`, 300, summaryTop + offset, { width: 160, align: 'right' });
    doc.text(`-$${(booking.basePrice * (booking.personalDiscount / 100)).toFixed(2)}`, 0, summaryTop + offset, { align: 'right' });
    offset += 20;
  }
  
  if (booking.manualDiscount > 0) {
    doc.text(`Admin Discount (${booking.manualDiscount}%):`, 300, summaryTop + offset, { width: 160, align: 'right' });
    doc.text(`-$${(booking.basePrice * (booking.manualDiscount / 100)).toFixed(2)}`, 0, summaryTop + offset, { align: 'right' });
    offset += 20;
  }

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(370, summaryTop + offset).lineTo(550, summaryTop + offset).stroke();
  
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('Total Amount:', 370, summaryTop + offset + 10, { width: 90, align: 'right' })
    .text(`$${booking.finalPrice?.toFixed(2)}`, 0, summaryTop + offset + 10, { align: 'right' });

  // --- Footer ---
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Thank you for choosing M.S. Car Rental!', 50, 700, { align: 'center', width: 500 });

  doc.end();
};
