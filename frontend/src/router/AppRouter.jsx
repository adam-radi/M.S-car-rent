import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import ProtectedRoute from '../components/ProtectedRoute';
import CarsPage from '../pages/CarsPage';
import CarDetailPage from '../pages/CarDetailPage';
import BookingPage from '../pages/BookingPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import AdminDashboard from '../pages/AdminDashboard';
import ManageCars from '../pages/ManageCars';
import ManageBookings from '../pages/ManageBookings';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import ManageMaintenance from '../pages/ManageMaintenance';
import VerifyDocuments from '../pages/VerifyDocuments';
import ManageUsers from '../pages/ManageUsers';
import AboutPage from '../pages/AboutPage';
import ReviewsPage from '../pages/ReviewsPage';
import AdminLayout from '../components/AdminLayout';
import ManageClients from '../pages/ManageClients';


import ManageMessages from '../pages/ManageMessages';
import ManageCarDocuments from '../pages/ManageCarDocuments';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/cars" element={<CarsPage />} />

      <Route path="/cars/:id" element={<CarDetailPage />} />

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Guest/Mixed Routes */}
      <Route path="/book/:carId" element={<BookingPage />} />
      
      {/* Protected Customer Routes */}
      <Route path="/my-bookings" element={<ProtectedRoute allowedRoles={['customer', 'employee', 'admin']}><MyBookingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['employee', 'admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cars" element={<ManageCars />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="maintenance" element={<ManageMaintenance />} />
        <Route path="documents" element={<VerifyDocuments />} />
        <Route path="fleet-health" element={<ManageCarDocuments />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
