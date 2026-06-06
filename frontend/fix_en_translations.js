const fs = require('fs');
const path = require('path');

const enAdmin = {
  "dashboard": {
    "loading": "Loading dashboard...",
    "bookingPipeline": {
      "pending": "Pending",
      "pendingNote": "Awaiting confirmation",
      "active": "Active",
      "activeNote": "Currently ongoing",
      "completed": "Completed",
      "completedNote": "Successfully finished"
    },
    "statCards": {
      "fleet": "Fleet",
      "availableNow": "available now",
      "utilized": "utilized",
      "reservations": "Reservations",
      "confirmedBookings": "confirmed bookings",
      "activeRightNow": "active right now",
      "customers": "Customers",
      "repeatRate": "repeat rate",
      "activeLast30Days": "active last 30 days",
      "revenue": "Revenue",
      "last30Days": "last 30 days",
      "completedBookings": "completed bookings"
    },
    "title": "Admin Dashboard",
    "subtitle": "Overview of your business performance",
    "last30Days": "Last 30 Days",
    "buttons": {
      "export": "Export"
    },
    "alerts": {
      "vehicles": "vehicles",
      "expiredDocs": "with expired documents",
      "manageNow": "Manage Now",
      "expiringWithin7": "expiring within 7 days",
      "reviewFleet": "Review Fleet"
    },
    "revenueCard": {
      "title": "Revenue",
      "totalProfit": "Total Profit",
      "completedRevenue": "Completed Revenue",
      "last30Days": "Last 30 Days",
      "revenue": "Revenue"
    },
    "bookingCard": {
      "title": "Bookings",
      "pipeline": "Booking Pipeline"
    },
    "productsCard": {
      "title": "Top Vehicles",
      "topSellingProducts": "Most Booked Cars",
      "car": "Car",
      "plate": "Plate",
      "bookings": "Bookings",
      "revenue": "Revenue",
      "ratePerDay": "Rate / Day",
      "noData": "No data available"
    },
    "activityCard": {
      "title": "Activity",
      "mostActiveDay": "Most Active Day",
      "bookingsCreated": "bookings created",
      "bookings": "Bookings"
    },
    "loyaltyCard": {
      "title": "Loyalty",
      "repeatRate": "Repeat Customer Rate",
      "of": "of",
      "customersBookedMore": "customers booked more than once"
    },
    "fleetCard": {
      "inMaintenance": "In Maintenance",
      "fleetUtilization": "Fleet Utilization",
      "documentsExpiring": "Documents Expiring",
      "cancelledBookings": "Cancelled Bookings"
    }
  },
  "paymentStatus": {
    "unpaid": "Unpaid",
    "partial": "Partial",
    "paid": "Paid"
  },
  "manageBookings": {
    "filterAll": "All",
    "alerts": {
      "downloadInvoiceFailed": "Failed to download invoice"
    },
    "title": "Manage Bookings",
    "subtitle": "Track and manage all reservations",
    "searchPlaceholder": "Search bookings...",
    "filterLabel": "Filter",
    "buttons": {
      "directEntry": "Direct Entry"
    },
    "tableHeaders": {
      "customer": "Customer",
      "vehicle": "Vehicle",
      "dates": "Dates",
      "total": "Total",
      "status": "Status",
      "actions": "Actions"
    },
    "guestClient": "Guest Client",
    "noEmail": "No email",
    "downloadInvoiceTitle": "Download Invoice",
    "emptyState": "No bookings found",
    "modal": {
      "fields": {
        "status": "Status",
        "manualDiscount": "Manual Discount",
        "paymentStatus": "Payment Status",
        "notes": "Notes"
      },
      "hint": {
        "manualDiscount": "Enter discount amount"
      },
      "buttons": {
        "confirmChanges": "Confirm Changes"
      }
    }
  },
  "common": {
    "cancel": "Cancel"
  },
  "manageCarDocuments": {
    "alerts": {
      "selectRequiredFields": "Please fill in all required fields",
      "submitFailed": "Submission failed",
      "updateStatusFailed": "Failed to update status"
    },
    "status": {
      "expired": "Expired",
      "expiringSoon": "Expiring Soon",
      "valid": "Valid"
    },
    "title": "Car Documents",
    "subtitle": "Manage vehicle documentation",
    "buttons": {
      "uploadDocument": "Upload Document"
    },
    "filters": {
      "filterByCar": "Filter by Car",
      "allVehicles": "All Vehicles"
    },
    "searchPlaceholder": "Search documents...",
    "tableHeaders": {
      "vehicle": "Vehicle",
      "documentType": "Document Type",
      "period": "Period",
      "status": "Status",
      "actions": "Actions"
    },
    "viewDocument": "View Document",
    "actions": {
      "delete": "Delete"
    },
    "modal": {
      "title": "Add Document",
      "description": "Upload a new document",
      "selectVehicle": "Select Vehicle",
      "selectVehiclePlaceholder": "Choose a vehicle...",
      "documentType": "Document Type",
      "startDate": "Start Date",
      "endDate": "End Date",
      "uploadDocument": "Upload",
      "notesOptional": "Notes (optional)",
      "blockAvailabilityTitle": "Block Availability",
      "blockAvailabilityDescription": "Prevent this vehicle from being booked",
      "submitButton": "Submit"
    },
    "documentType": {
      "insurance": "Insurance",
      "technical_control": "Technical Control",
      "vignette": "Vignette",
      "carte_grise": "Registration Card"
    }
  },
  "manageCars": {
    "alerts": {
      "failedLoadCars": "Failed to load cars",
      "noImagesConfirm": "No images added. Continue?",
      "operationFailed": "Operation failed",
      "errorSavingCar": "Error saving car",
      "deleteConfirm": "Are you sure you want to delete this car?",
      "errorDeletingCar": "Error deleting car"
    },
    "loading": "Loading cars...",
    "title": "Manage Fleet",
    "subtitle": "Add, edit, and manage your vehicles",
    "buttons": {
      "addVehicle": "Add Vehicle"
    },
    "searchPlaceholder": "Search cars...",
    "filters": {
      "status": "Status",
      "allFleet": "All Fleet"
    },
    "modal": {
      "titleEdit": "Edit Vehicle",
      "titleNew": "New Vehicle",
      "subtitleEdit": "Update vehicle information",
      "subtitleNew": "Add to your fleet",
      "fields": {
        "brand": "Brand",
        "model": "Model",
        "year": "Year",
        "licensePlate": "License Plate",
        "dailyPrice": "Daily Price",
        "mileage": "Mileage",
        "transmission": "Transmission",
        "fuelType": "Fuel Type",
        "availabilityStatus": "Availability Status"
      },
      "placeholders": {
        "brand": "e.g. Toyota",
        "model": "e.g. Corolla",
        "licensePlate": "e.g. A-12345"
      },
      "options": {
        "automatic": "Automatic",
        "manual": "Manual",
        "gasoline": "Gasoline",
        "diesel": "Diesel",
        "electric": "Electric",
        "hybrid": "Hybrid"
      },
      "features": {
        "promoteFeatured": {
          "title": "Feature this car",
          "description": "Display on the homepage"
        },
        "blockIfVignetteExpired": {
          "title": "Block if vignette expired",
          "description": "Prevent booking when vignette is expired"
        }
      },
      "buttons": {
        "updateVehicle": "Update Vehicle",
        "saveVehicle": "Save Vehicle"
      }
    }
  },
  "status": {
    "available": "Available",
    "rented": "Rented",
    "maintenance": "Maintenance",
    "retired": "Retired"
  },
  "manageClients": {
    "errors": {
      "isRequired": "This field is required",
      "invalidCin": "Invalid CIN number",
      "lookupFailed": "Client lookup failed"
    },
    "title": "Manage Clients",
    "subtitle": "Search and manage client profiles",
    "labels": {
      "cin": "National ID (CIN)",
      "phone": "Phone Number"
    },
    "placeholders": {
      "cin": "Enter CIN...",
      "phone": "Enter phone..."
    },
    "buttons": {
      "searchLoading": "Searching...",
      "search": "Search"
    },
    "search": {
      "loading": "Loading...",
      "noResults": "No client found",
      "resultLabel": "Client found",
      "resultNote": "Client details"
    },
    "list": {
      "title": "Client List",
      "subtitle": "All registered clients",
      "count": "Total"
    },
    "table": {
      "client": "Client",
      "cin": "CIN",
      "phone": "Phone",
      "linked": "Linked",
      "email": "Email",
      "bookings": "Bookings",
      "latest": "Latest"
    },
    "status": {
      "loadingClients": "Loading clients...",
      "noClientRows": "No clients found"
    },
    "profile": {
      "cin": "CIN",
      "linkedAccount": "Linked Account",
      "email": "Email",
      "phonesUsed": "Phones Used"
    },
    "history": {
      "title": "Booking History",
      "subtitle": "Previous reservations"
    },
    "filters": {
      "status": "Status",
      "car": "Car",
      "from": "From",
      "to": "To"
    },
    "bookingsTable": {
      "car": "Car",
      "startDate": "Start Date",
      "endDate": "End Date",
      "status": "Status",
      "payment": "Payment",
      "total": "Total",
      "phoneUsed": "Phone Used",
      "actions": "Actions"
    }
  },
  "manageMaintenance": {
    "alerts": {
      "createFailed": "Failed to create maintenance record",
      "statusUpdateFailed": "Failed to update status"
    },
    "title": "Maintenance",
    "buttons": {
      "scheduleService": "Schedule Service",
      "schedule": "Schedule"
    },
    "tableHeaders": {
      "car": "Car",
      "serviceType": "Service Type",
      "status": "Status",
      "period": "Period",
      "actions": "Actions"
    },
    "status": {
      "scheduled": "Scheduled",
      "inProgress": "In Progress",
      "done": "Done",
      "cancelled": "Cancelled"
    },
    "modal": {
      "title": "Schedule Maintenance",
      "subtitle": "Add a new maintenance record",
      "fields": {
        "car": "Car",
        "type": "Type",
        "startDate": "Start Date",
        "endDate": "End Date",
        "description": "Description"
      },
      "placeholders": {
        "selectCar": "Select a car..."
      },
      "options": {
        "oilChange": "Oil Change",
        "tireChange": "Tire Change",
        "inspection": "Inspection",
        "repair": "Repair",
        "other": "Other"
      }
    }
  },
  "manageMessages": {
    "confirmDelete": "Are you sure you want to delete this message?",
    "title": "Messages",
    "subtitle": "Customer inquiries and messages",
    "emptyState": "No messages yet",
    "noPhone": "No phone",
    "buttons": {
      "delete": "Delete",
      "reply": "Reply",
      "whatsapp": "WhatsApp"
    },
    "sentOn": "Sent on",
    "placeholder": "Write a message..."
  },
  "manageUsers": {
    "notSpecified": "Not specified",
    "title": "Manage Users",
    "subtitle": "Manage all user accounts",
    "tabs": {
      "all": "All",
      "customers": "Customers",
      "employees": "Employees",
      "admins": "Admins"
    },
    "tableHeaders": {
      "user": "User",
      "email": "Email",
      "phone": "Phone",
      "role": "Role",
      "status": "Status",
      "discount": "Discount",
      "actions": "Actions"
    },
    "status": {
      "active": "Active",
      "inactive": "Inactive"
    },
    "buttons": {
      "setDiscount": "Set Discount",
      "viewDetails": "View Details"
    },
    "emptyState": "No users found",
    "discountModal": {
      "title": "Set Discount"
    },
    "detailsModal": {
      "title": "User Details",
      "email": "Email",
      "phone": "Phone",
      "cin": "CIN",
      "license": "License",
      "memberSince": "Member Since",
      "loyaltyDiscount": "Loyalty Discount",
      "roleLabel": "Role",
      "statusLabel": "Status",
      "statusActive": "Active",
      "statusInactive": "Inactive",
      "saving": "Saving...",
      "save": "Save"
    },
    "roles": {
      "customer": "Customer",
      "employee": "Employee",
      "admin": "Admin"
    }
  },
  "verifyDocuments": {
    "alerts": {
      "updateFailed": "Failed to update document"
    },
    "title": "Document Verification",
    "subtitle": "Review and approve user documents",
    "tableHeaders": {
      "user": "User",
      "documentType": "Document Type",
      "status": "Status",
      "uploaded": "Uploaded",
      "actions": "Actions"
    },
    "buttons": {
      "review": "Review",
      "approve": "Approve",
      "reject": "Reject"
    },
    "documentPreviewAlt": "Document preview",
    "userDetails": "User Details",
    "labels": {
      "name": "Name",
      "phone": "Phone",
      "verificationNotes": "Verification Notes"
    },
    "noPhone": "No phone",
    "placeholders": {
      "notes": "Add notes..."
    },
    "documentType": {
      "driver_license": "Driver's License",
      "id_card": "ID Card",
      "passport": "Passport",
      "vehicle_registration": "Vehicle Registration"
    },
    "status": {
      "pending": "Pending",
      "verified": "Verified",
      "rejected": "Rejected"
    },
    "reviewTitle": "Review Document: {{name}}"
  },
  "sidebar": {
    "dashboard": "Dashboard",
    "fleet": "Fleet",
    "bookings": "Bookings",
    "clients": "Clients",
    "users": "Users",
    "maintenance": "Maintenance",
    "fleetHealth": "Fleet Health",
    "verification": "Verification",
    "messages": "Messages",
    "systemOnline": "System Online"
  }
};

const localesDir = path.join(__dirname, 'src', 'locales');
const enFile = path.join(localesDir, 'en.json');

const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
enData.admin = enAdmin;

fs.writeFileSync(enFile, JSON.stringify(enData, null, 2));
console.log('English translations fixed successfully.');
