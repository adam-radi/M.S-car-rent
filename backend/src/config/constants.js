module.exports = {
  USER_ROLES: { VISITOR: 'visitor', CUSTOMER: 'customer', EMPLOYEE: 'employee', ADMIN: 'admin' },
  BOOKING_STATUS: { PENDING: 'pending', CONFIRMED: 'confirmed', ACTIVE: 'active', COMPLETED: 'completed', CANCELLED: 'cancelled', REJECTED: 'rejected' },
  CAR_STATUS: { AVAILABLE: 'available', RENTED: 'rented', MAINTENANCE: 'maintenance', RETIRED: 'retired' },
  MAINTENANCE_STATUS: { SCHEDULED: 'scheduled', IN_PROGRESS: 'in_progress', DONE: 'done', CANCELLED: 'cancelled' },
  NOTIFICATION_TYPES: { BOOKING_REQUEST: 'booking_request', BOOKING_CONFIRMED: 'booking_confirmed', BOOKING_CANCELLED: 'booking_cancelled', MAINTENANCE_DUE: 'maintenance_due' },
  CAR_DOCUMENT_TYPES: { INSURANCE: 'insurance', TECHNICAL_CONTROL: 'technical_control', VIGNETTE: 'vignette', CARTE_GRISE: 'carte_grise' },
  CAR_DOCUMENT_STATUS: { VALID: 'valid', EXPIRED: 'expired' }
};
