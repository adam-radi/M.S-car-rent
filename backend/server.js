require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Connect to Database
connectDB();

// Apply middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes will be added here
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cars', require('./src/routes/carRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/admin', require('./src/routes/adminClientRoutes'));
app.use('/api/documents', require('./src/routes/documentRoutes'));
app.use('/api/car-documents', require('./src/routes/carDocumentRoutes'));
app.use('/api/maintenance', require('./src/routes/maintenanceRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));

// Serve static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
