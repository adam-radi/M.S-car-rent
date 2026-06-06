const fs = require('fs');
const path = require('path');

const frAdmin = {
  "dashboard": {
    "loading": "Chargement",
    "bookingPipeline": {
      "pending": "En attente",
      "pendingNote": "Réservations en attente",
      "active": "Actif",
      "activeNote": "Actuellement en cours",
      "completed": "Terminé",
      "completedNote": "Réservations terminées"
    },
    "statCards": {
      "fleet": "Flotte",
      "availableNow": "Disponible maintenant",
      "utilized": "Utilisé",
      "reservations": "Réservations",
      "confirmedBookings": "Réservations confirmées",
      "activeRightNow": "Actif en ce moment",
      "customers": "Clients",
      "repeatRate": "Taux de retour",
      "activeLast30Days": "Actif ces 30 derniers jours",
      "revenue": "Revenus",
      "last30Days": "30 derniers jours",
      "completedBookings": "Réservations terminées"
    },
    "title": "Tableau de Bord",
    "subtitle": "Aperçu de votre activité",
    "last30Days": "30 derniers jours",
    "buttons": {
      "export": "Exporter"
    },
    "alerts": {
      "vehicles": "Véhicules",
      "expiredDocs": "Documents expirés",
      "manageNow": "Gérer maintenant",
      "expiringWithin7": "Expire dans 7 jours",
      "reviewFleet": "Revoir la flotte"
    },
    "revenueCard": {
      "title": "Revenus",
      "totalProfit": "Profit Total",
      "completedRevenue": "Revenus terminés",
      "last30Days": "30 derniers jours",
      "revenue": "Revenus"
    },
    "bookingCard": {
      "title": "Réservations",
      "pipeline": "Pipeline"
    },
    "productsCard": {
      "title": "Produits",
      "topSellingProducts": "Produits les plus vendus",
      "car": "Voiture",
      "plate": "Immatriculation",
      "bookings": "Réservations",
      "revenue": "Revenus",
      "ratePerDay": "Tarif par jour",
      "noData": "Aucune donnée"
    },
    "activityCard": {
      "title": "Activité",
      "mostActiveDay": "Jour le plus actif",
      "bookingsCreated": "Réservations créées",
      "bookings": "Réservations"
    },
    "loyaltyCard": {
      "title": "Fidélité",
      "repeatRate": "Taux de retour",
      "of": "de",
      "customersBookedMore": "clients ont réservé plus d'une fois"
    },
    "fleetCard": {
      "inMaintenance": "En maintenance",
      "fleetUtilization": "Utilisation de la flotte",
      "documentsExpiring": "Documents expirant",
      "cancelledBookings": "Réservations annulées"
    }
  },
  "paymentStatus": {
    "unpaid": "Non payé",
    "partial": "Partiel",
    "paid": "Payé"
  },
  "manageBookings": {
    "filterAll": "Filtrer tout",
    "alerts": {
      "downloadInvoiceFailed": "Échec du téléchargement de la facture"
    },
    "title": "Gérer les réservations",
    "subtitle": "Gérez toutes les réservations",
    "searchPlaceholder": "Rechercher...",
    "filterLabel": "Filtre",
    "buttons": {
      "directEntry": "Entrée directe"
    },
    "tableHeaders": {
      "customer": "Client",
      "vehicle": "Véhicule",
      "dates": "Dates",
      "total": "Total",
      "status": "Statut",
      "actions": "Actions"
    },
    "guestClient": "Client invité",
    "noEmail": "Pas d'email",
    "downloadInvoiceTitle": "Télécharger la facture",
    "emptyState": "Aucune donnée",
    "modal": {
      "fields": {
        "status": "Statut",
        "manualDiscount": "Remise manuelle",
        "paymentStatus": "Statut du paiement",
        "notes": "Notes"
      },
      "hint": {
        "manualDiscount": "Remise manuelle"
      },
      "buttons": {
        "confirmChanges": "Confirmer les modifications"
      }
    }
  },
  "common": {
    "cancel": "Annuler"
  },
  "manageCarDocuments": {
    "alerts": {
      "selectRequiredFields": "Sélectionnez les champs obligatoires",
      "submitFailed": "Échec de l'envoi",
      "updateStatusFailed": "Échec de la mise à jour du statut"
    },
    "status": {
      "expired": "Expiré",
      "expiringSoon": "Expire bientôt",
      "valid": "Valide"
    },
    "title": "Documents de Voiture",
    "subtitle": "Gérer les documents",
    "buttons": {
      "uploadDocument": "Télécharger le document"
    },
    "filters": {
      "filterByCar": "Filtrer par voiture",
      "allVehicles": "Tous les véhicules"
    },
    "searchPlaceholder": "Rechercher...",
    "tableHeaders": {
      "vehicle": "Véhicule",
      "documentType": "Type de document",
      "period": "Période",
      "status": "Statut",
      "actions": "Actions"
    },
    "viewDocument": "Voir le document",
    "actions": {
      "delete": "Supprimer"
    },
    "modal": {
      "title": "Ajouter un document",
      "description": "Détails du document",
      "selectVehicle": "Sélectionnez un véhicule",
      "selectVehiclePlaceholder": "Choisissez...",
      "documentType": "Type de document",
      "startDate": "Date de début",
      "endDate": "Date de fin",
      "uploadDocument": "Télécharger",
      "notesOptional": "Notes (optionnelles)",
      "blockAvailabilityTitle": "Bloquer la disponibilité",
      "blockAvailabilityDescription": "Empêcher la réservation de ce véhicule",
      "submitButton": "Soumettre"
    },
    "documentType": {
      "insurance": "Assurance",
      "technical_control": "Contrôle technique",
      "vignette": "Vignette",
      "carte_grise": "Carte Grise"
    }
  },
  "manageCars": {
    "alerts": {
      "failedLoadCars": "Échec du chargement des voitures",
      "noImagesConfirm": "Confirmer sans images",
      "operationFailed": "Opération échouée",
      "errorSavingCar": "Erreur lors de l'enregistrement",
      "deleteConfirm": "Confirmer la suppression",
      "errorDeletingCar": "Erreur lors de la suppression"
    },
    "loading": "Chargement...",
    "title": "Gérer les voitures",
    "subtitle": "Gérer votre flotte",
    "buttons": {
      "addVehicle": "Ajouter un véhicule"
    },
    "searchPlaceholder": "Rechercher...",
    "filters": {
      "status": "Statut",
      "allFleet": "Toute la flotte"
    },
    "modal": {
      "titleEdit": "Modifier la voiture",
      "titleNew": "Nouvelle voiture",
      "subtitleEdit": "Mettre à jour les informations",
      "subtitleNew": "Ajouter à la flotte",
      "fields": {
        "brand": "Marque",
        "model": "Modèle",
        "year": "Année",
        "licensePlate": "Immatriculation",
        "dailyPrice": "Prix journalier",
        "mileage": "Kilométrage",
        "transmission": "Transmission",
        "fuelType": "Carburant",
        "availabilityStatus": "Statut de disponibilité"
      },
      "placeholders": {
        "brand": "Marque",
        "model": "Modèle",
        "licensePlate": "Immatriculation"
      },
      "options": {
        "automatic": "Automatique",
        "manual": "Manuelle",
        "gasoline": "Essence",
        "diesel": "Diesel",
        "electric": "Électrique",
        "hybrid": "Hybride"
      },
      "features": {
        "promoteFeatured": {
          "title": "Mettre en avant",
          "description": "Afficher sur la page d'accueil"
        },
        "blockIfVignetteExpired": {
          "title": "Bloquer si vignette expirée",
          "description": "Empêche la réservation"
        }
      },
      "buttons": {
        "updateVehicle": "Mettre à jour",
        "saveVehicle": "Enregistrer"
      }
    }
  },
  "status": {
    "available": "Disponible",
    "rented": "Loué",
    "maintenance": "Maintenance",
    "retired": "Retiré"
  },
  "manageClients": {
    "errors": {
      "isRequired": "Requis",
      "invalidCin": "CIN invalide",
      "lookupFailed": "Recherche échouée"
    },
    "title": "Clients",
    "subtitle": "Gérer les clients",
    "labels": {
      "cin": "CIN",
      "phone": "Téléphone"
    },
    "placeholders": {
      "cin": "CIN",
      "phone": "Téléphone"
    },
    "buttons": {
      "searchLoading": "Recherche...",
      "search": "Rechercher"
    },
    "search": {
      "loading": "Chargement...",
      "noResults": "Aucun résultat",
      "resultLabel": "Résultat",
      "resultNote": "Détails du client"
    },
    "list": {
      "title": "Liste des clients",
      "subtitle": "Tous les clients",
      "count": "Total"
    },
    "table": {
      "client": "Client",
      "cin": "CIN",
      "phone": "Téléphone",
      "linked": "Lié",
      "email": "Email",
      "bookings": "Réservations",
      "latest": "Dernier"
    },
    "status": {
      "loadingClients": "Chargement...",
      "noClientRows": "Aucun client"
    },
    "profile": {
      "cin": "CIN",
      "linkedAccount": "Compte lié",
      "email": "Email",
      "phonesUsed": "Téléphones utilisés"
    },
    "history": {
      "title": "Historique",
      "subtitle": "Réservations précédentes"
    },
    "filters": {
      "status": "Statut",
      "car": "Voiture",
      "from": "De",
      "to": "À"
    },
    "bookingsTable": {
      "car": "Voiture",
      "startDate": "Date de début",
      "endDate": "Date de fin",
      "status": "Statut",
      "payment": "Paiement",
      "total": "Total",
      "phoneUsed": "Téléphone utilisé",
      "actions": "Actions"
    }
  },
  "manageMaintenance": {
    "alerts": {
      "createFailed": "Création échouée",
      "statusUpdateFailed": "Mise à jour échouée"
    },
    "title": "Maintenance",
    "buttons": {
      "scheduleService": "Planifier",
      "schedule": "Planifier"
    },
    "tableHeaders": {
      "car": "Voiture",
      "serviceType": "Type de service",
      "status": "Statut",
      "period": "Période",
      "actions": "Actions"
    },
    "status": {
      "scheduled": "Planifié",
      "inProgress": "En cours",
      "done": "Terminé",
      "cancelled": "Annulé"
    },
    "modal": {
      "title": "Maintenance",
      "subtitle": "Détails",
      "fields": {
        "car": "Voiture",
        "type": "Type",
        "startDate": "Début",
        "endDate": "Fin",
        "description": "Description"
      },
      "placeholders": {
        "selectCar": "Sélectionner la voiture"
      },
      "options": {
        "oilChange": "Vidange",
        "tireChange": "Changement de pneus",
        "inspection": "Inspection",
        "repair": "Réparation",
        "other": "Autre"
      }
    }
  },
  "manageMessages": {
    "confirmDelete": "Confirmer la suppression",
    "title": "Messages",
    "subtitle": "Gérer les messages",
    "emptyState": "Aucun message",
    "noPhone": "Pas de téléphone",
    "buttons": {
      "delete": "Supprimer",
      "reply": "Répondre",
      "whatsapp": "WhatsApp"
    },
    "sentOn": "Envoyé le",
    "placeholder": "Message..."
  },
  "manageUsers": {
    "notSpecified": "Non spécifié",
    "title": "Utilisateurs",
    "subtitle": "Gérer les utilisateurs",
    "tabs": {
      "all": "Tous",
      "customers": "Clients",
      "employees": "Employés",
      "admins": "Admins"
    },
    "tableHeaders": {
      "user": "Utilisateur",
      "email": "Email",
      "phone": "Téléphone",
      "role": "Rôle",
      "status": "Statut",
      "discount": "Remise",
      "actions": "Actions"
    },
    "status": {
      "active": "Actif",
      "inactive": "Inactif"
    },
    "buttons": {
      "setDiscount": "Appliquer remise",
      "viewDetails": "Détails"
    },
    "emptyState": "Aucun utilisateur",
    "discountModal": {
      "title": "Remise"
    },
    "detailsModal": {
      "title": "Détails",
      "email": "Email",
      "phone": "Téléphone",
      "cin": "CIN",
      "license": "Permis",
      "memberSince": "Membre depuis",
      "loyaltyDiscount": "Remise fidélité",
      "roleLabel": "Rôle",
      "statusLabel": "Statut",
      "statusActive": "Actif",
      "statusInactive": "Inactif",
      "saving": "Enregistrement...",
      "save": "Enregistrer"
    },
    "roles": {
      "customer": "Client",
      "employee": "Employé",
      "admin": "Admin"
    }
  },
  "verifyDocuments": {
    "alerts": {
      "updateFailed": "Mise à jour échouée"
    },
    "title": "Vérification",
    "subtitle": "Documents",
    "tableHeaders": {
      "user": "Utilisateur",
      "documentType": "Type de document",
      "status": "Statut",
      "uploaded": "Téléchargé",
      "actions": "Actions"
    },
    "buttons": {
      "review": "Examiner",
      "approve": "Approuver",
      "reject": "Rejeter"
    },
    "documentPreviewAlt": "Aperçu du document",
    "userDetails": "Détails de l'utilisateur",
    "labels": {
      "name": "Nom",
      "phone": "Téléphone",
      "verificationNotes": "Notes de vérification"
    },
    "noPhone": "Pas de téléphone",
    "placeholders": {
      "notes": "Notes"
    },
    "documentType": {
      "driver_license": "Permis de conduire",
      "id_card": "Carte d'identité",
      "passport": "Passeport",
      "vehicle_registration": "Carte grise"
    },
    "status": {
      "pending": "En attente",
      "verified": "Vérifié",
      "rejected": "Rejeté"
    },
    "reviewTitle": "Revoir Document: {{name}}"
  },
  "sidebar": {
    "dashboard": "Tableau de Bord",
    "fleet": "Flotte",
    "bookings": "Réservations",
    "clients": "Clients",
    "users": "Utilisateurs",
    "maintenance": "Maintenance",
    "fleetHealth": "État de la Flotte",
    "verification": "Vérification",
    "messages": "Messages",
    "systemOnline": "En ligne"
  }
};

const arAdmin = {
  "dashboard": {
    "loading": "جاري التحميل",
    "bookingPipeline": {
      "pending": "قيد الانتظار",
      "pendingNote": "حجوزات معلقة",
      "active": "نشط",
      "activeNote": "حجوزات نشطة حالياً",
      "completed": "مكتمل",
      "completedNote": "حجوزات مكتملة"
    },
    "statCards": {
      "fleet": "الأسطول",
      "availableNow": "متاح الآن",
      "utilized": "مُستخدم",
      "reservations": "الحجوزات",
      "confirmedBookings": "حجوزات مؤكدة",
      "activeRightNow": "نشط الآن",
      "customers": "العملاء",
      "repeatRate": "معدل التكرار",
      "activeLast30Days": "نشط آخر 30 يوم",
      "revenue": "الإيرادات",
      "last30Days": "آخر 30 يوم",
      "completedBookings": "حجوزات مكتملة"
    },
    "title": "لوحة القيادة",
    "subtitle": "نظرة عامة على النشاط",
    "last30Days": "آخر 30 يوم",
    "buttons": {
      "export": "تصدير"
    },
    "alerts": {
      "vehicles": "مركبات",
      "expiredDocs": "وثائق منتهية",
      "manageNow": "إدارة الآن",
      "expiringWithin7": "تنتهي خلال 7 أيام",
      "reviewFleet": "مراجعة الأسطول"
    },
    "revenueCard": {
      "title": "الإيرادات",
      "totalProfit": "إجمالي الأرباح",
      "completedRevenue": "إيرادات مكتملة",
      "last30Days": "آخر 30 يوم",
      "revenue": "إيرادات"
    },
    "bookingCard": {
      "title": "الحجوزات",
      "pipeline": "التدفق"
    },
    "productsCard": {
      "title": "المنتجات",
      "topSellingProducts": "المنتجات الأكثر مبيعاً",
      "car": "سيارة",
      "plate": "لوحة",
      "bookings": "الحجوزات",
      "revenue": "الإيرادات",
      "ratePerDay": "السعر اليومي",
      "noData": "لا توجد بيانات"
    },
    "activityCard": {
      "title": "النشاط",
      "mostActiveDay": "اليوم الأكثر نشاطاً",
      "bookingsCreated": "الحجوزات المُنشأة",
      "bookings": "حجوزات"
    },
    "loyaltyCard": {
      "title": "الولاء",
      "repeatRate": "معدل العودة",
      "of": "من",
      "customersBookedMore": "العملاء حجزوا أكثر من مرة"
    },
    "fleetCard": {
      "inMaintenance": "في الصيانة",
      "fleetUtilization": "استخدام الأسطول",
      "documentsExpiring": "وثائق تقترب من الانتهاء",
      "cancelledBookings": "حجوزات ملغاة"
    }
  },
  "paymentStatus": {
    "unpaid": "غير مدفوع",
    "partial": "جزئي",
    "paid": "مدفوع"
  },
  "manageBookings": {
    "filterAll": "عرض الكل",
    "alerts": {
      "downloadInvoiceFailed": "فشل تنزيل الفاتورة"
    },
    "title": "إدارة الحجوزات",
    "subtitle": "إدارة جميع الحجوزات",
    "searchPlaceholder": "بحث...",
    "filterLabel": "تصفية",
    "buttons": {
      "directEntry": "إدخال مباشر"
    },
    "tableHeaders": {
      "customer": "العميل",
      "vehicle": "المركبة",
      "dates": "التواريخ",
      "total": "الإجمالي",
      "status": "الحالة",
      "actions": "إجراءات"
    },
    "guestClient": "عميل زائر",
    "noEmail": "لا يوجد بريد إلكتروني",
    "downloadInvoiceTitle": "تنزيل الفاتورة",
    "emptyState": "لا توجد بيانات",
    "modal": {
      "fields": {
        "status": "الحالة",
        "manualDiscount": "خصم يدوي",
        "paymentStatus": "حالة الدفع",
        "notes": "ملاحظات"
      },
      "hint": {
        "manualDiscount": "خصم يدوي"
      },
      "buttons": {
        "confirmChanges": "تأكيد التغييرات"
      }
    }
  },
  "common": {
    "cancel": "إلغاء"
  },
  "manageCarDocuments": {
    "alerts": {
      "selectRequiredFields": "يرجى تحديد الحقول المطلوبة",
      "submitFailed": "فشل الإرسال",
      "updateStatusFailed": "فشل تحديث الحالة"
    },
    "status": {
      "expired": "منتهي",
      "expiringSoon": "ينتهي قريباً",
      "valid": "صالح"
    },
    "title": "وثائق السيارات",
    "subtitle": "إدارة الوثائق",
    "buttons": {
      "uploadDocument": "رفع وثيقة"
    },
    "filters": {
      "filterByCar": "تصفية حسب السيارة",
      "allVehicles": "جميع المركبات"
    },
    "searchPlaceholder": "بحث...",
    "tableHeaders": {
      "vehicle": "المركبة",
      "documentType": "نوع الوثيقة",
      "period": "الفترة",
      "status": "الحالة",
      "actions": "إجراءات"
    },
    "viewDocument": "عرض الوثيقة",
    "actions": {
      "delete": "حذف"
    },
    "modal": {
      "title": "إضافة وثيقة",
      "description": "تفاصيل الوثيقة",
      "selectVehicle": "اختر مركبة",
      "selectVehiclePlaceholder": "اختر...",
      "documentType": "نوع الوثيقة",
      "startDate": "تاريخ البدء",
      "endDate": "تاريخ الانتهاء",
      "uploadDocument": "رفع",
      "notesOptional": "ملاحظات (اختياري)",
      "blockAvailabilityTitle": "حظر التوفر",
      "blockAvailabilityDescription": "منع حجز هذه المركبة",
      "submitButton": "حفظ"
    },
    "documentType": {
      "insurance": "تأمين",
      "technical_control": "فحص تقني",
      "vignette": "ضريبة سنوية",
      "carte_grise": "البطاقة الرمادية"
    }
  },
  "manageCars": {
    "alerts": {
      "failedLoadCars": "فشل تحميل السيارات",
      "noImagesConfirm": "تأكيد بدون صور",
      "operationFailed": "فشلت العملية",
      "errorSavingCar": "خطأ في الحفظ",
      "deleteConfirm": "تأكيد الحذف",
      "errorDeletingCar": "خطأ في الحذف"
    },
    "loading": "جاري التحميل...",
    "title": "إدارة السيارات",
    "subtitle": "إدارة أسطولك",
    "buttons": {
      "addVehicle": "إضافة مركبة"
    },
    "searchPlaceholder": "بحث...",
    "filters": {
      "status": "الحالة",
      "allFleet": "كل الأسطول"
    },
    "modal": {
      "titleEdit": "تعديل سيارة",
      "titleNew": "سيارة جديدة",
      "subtitleEdit": "تحديث المعلومات",
      "subtitleNew": "إضافة للأسطول",
      "fields": {
        "brand": "العلامة",
        "model": "الموديل",
        "year": "السنة",
        "licensePlate": "رقم اللوحة",
        "dailyPrice": "السعر اليومي",
        "mileage": "المسافة المقطوعة",
        "transmission": "ناقل الحركة",
        "fuelType": "نوع الوقود",
        "availabilityStatus": "حالة التوفر"
      },
      "placeholders": {
        "brand": "العلامة التجارية",
        "model": "الموديل",
        "licensePlate": "رقم اللوحة"
      },
      "options": {
        "automatic": "أوتوماتيك",
        "manual": "عادي",
        "gasoline": "بنزين",
        "diesel": "ديزل",
        "electric": "كهربائي",
        "hybrid": "هجين"
      },
      "features": {
        "promoteFeatured": {
          "title": "تمييز كإعلان",
          "description": "عرض في الصفحة الرئيسية"
        },
        "blockIfVignetteExpired": {
          "title": "حظر إذا انتهت الضريبة",
          "description": "منع حجز السيارة"
        }
      },
      "buttons": {
        "updateVehicle": "تحديث",
        "saveVehicle": "حفظ"
      }
    }
  },
  "status": {
    "available": "متاح",
    "rented": "مؤجر",
    "maintenance": "صيانة",
    "retired": "متقاعد"
  },
  "manageClients": {
    "errors": {
      "isRequired": "مطلوب",
      "invalidCin": "بطاقة هوية غير صالحة",
      "lookupFailed": "فشل البحث"
    },
    "title": "العملاء",
    "subtitle": "إدارة العملاء",
    "labels": {
      "cin": "رقم البطاقة الوطنية",
      "phone": "الهاتف"
    },
    "placeholders": {
      "cin": "رقم البطاقة الوطنية",
      "phone": "الهاتف"
    },
    "buttons": {
      "searchLoading": "جاري البحث...",
      "search": "بحث"
    },
    "search": {
      "loading": "تحميل...",
      "noResults": "لا توجد نتائج",
      "resultLabel": "النتيجة",
      "resultNote": "تفاصيل العميل"
    },
    "list": {
      "title": "قائمة العملاء",
      "subtitle": "كل العملاء",
      "count": "العدد الإجمالي"
    },
    "table": {
      "client": "العميل",
      "cin": "البطاقة الوطنية",
      "phone": "الهاتف",
      "linked": "مرتبط",
      "email": "البريد الإلكتروني",
      "bookings": "الحجوزات",
      "latest": "الأحدث"
    },
    "status": {
      "loadingClients": "تحميل...",
      "noClientRows": "لا يوجد عملاء"
    },
    "profile": {
      "cin": "البطاقة الوطنية",
      "linkedAccount": "حساب مرتبط",
      "email": "البريد الإلكتروني",
      "phonesUsed": "الهواتف المستخدمة"
    },
    "history": {
      "title": "السجل",
      "subtitle": "حجوزات سابقة"
    },
    "filters": {
      "status": "الحالة",
      "car": "السيارة",
      "from": "من",
      "to": "إلى"
    },
    "bookingsTable": {
      "car": "السيارة",
      "startDate": "تاريخ البدء",
      "endDate": "تاريخ الانتهاء",
      "status": "الحالة",
      "payment": "الدفع",
      "total": "الإجمالي",
      "phoneUsed": "الهاتف المستخدم",
      "actions": "إجراءات"
    }
  },
  "manageMaintenance": {
    "alerts": {
      "createFailed": "فشل الإنشاء",
      "statusUpdateFailed": "فشل التحديث"
    },
    "title": "الصيانة",
    "buttons": {
      "scheduleService": "جدولة صيانة",
      "schedule": "جدولة"
    },
    "tableHeaders": {
      "car": "السيارة",
      "serviceType": "نوع الخدمة",
      "status": "الحالة",
      "period": "الفترة",
      "actions": "إجراءات"
    },
    "status": {
      "scheduled": "مُجدول",
      "inProgress": "قيد التنفيذ",
      "done": "مكتمل",
      "cancelled": "ملغى"
    },
    "modal": {
      "title": "صيانة",
      "subtitle": "التفاصيل",
      "fields": {
        "car": "السيارة",
        "type": "النوع",
        "startDate": "تاريخ البدء",
        "endDate": "تاريخ الانتهاء",
        "description": "الوصف"
      },
      "placeholders": {
        "selectCar": "اختر السيارة"
      },
      "options": {
        "oilChange": "تغيير الزيت",
        "tireChange": "تغيير الإطارات",
        "inspection": "فحص",
        "repair": "إصلاح",
        "other": "أخرى"
      }
    }
  },
  "manageMessages": {
    "confirmDelete": "تأكيد الحذف",
    "title": "الرسائل",
    "subtitle": "إدارة الرسائل",
    "emptyState": "لا توجد رسائل",
    "noPhone": "لا يوجد هاتف",
    "buttons": {
      "delete": "حذف",
      "reply": "رد",
      "whatsapp": "واتساب"
    },
    "sentOn": "أُرسل في",
    "placeholder": "الرسالة..."
  },
  "manageUsers": {
    "notSpecified": "غير محدد",
    "title": "المستخدمين",
    "subtitle": "إدارة المستخدمين",
    "tabs": {
      "all": "الكل",
      "customers": "عملاء",
      "employees": "موظفين",
      "admins": "مشرفين"
    },
    "tableHeaders": {
      "user": "المستخدم",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "role": "الدور",
      "status": "الحالة",
      "discount": "الخصم",
      "actions": "إجراءات"
    },
    "status": {
      "active": "نشط",
      "inactive": "غير نشط"
    },
    "buttons": {
      "setDiscount": "تعيين خصم",
      "viewDetails": "عرض التفاصيل"
    },
    "emptyState": "لا يوجد مستخدمين",
    "discountModal": {
      "title": "تطبيق الخصم"
    },
    "detailsModal": {
      "title": "التفاصيل",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "cin": "رقم البطاقة الوطنية",
      "license": "رخصة القيادة",
      "memberSince": "عضو منذ",
      "loyaltyDiscount": "خصم الولاء",
      "roleLabel": "الدور",
      "statusLabel": "الحالة",
      "statusActive": "نشط",
      "statusInactive": "غير نشط",
      "saving": "جاري الحفظ...",
      "save": "حفظ"
    },
    "roles": {
      "customer": "عميل",
      "employee": "موظف",
      "admin": "مشرف"
    }
  },
  "verifyDocuments": {
    "alerts": {
      "updateFailed": "فشل التحديث"
    },
    "title": "التحقق",
    "subtitle": "الوثائق",
    "tableHeaders": {
      "user": "المستخدم",
      "documentType": "نوع الوثيقة",
      "status": "الحالة",
      "uploaded": "تم الرفع",
      "actions": "إجراءات"
    },
    "buttons": {
      "review": "مراجعة",
      "approve": "موافقة",
      "reject": "رفض"
    },
    "documentPreviewAlt": "معاينة الوثيقة",
    "userDetails": "تفاصيل المستخدم",
    "labels": {
      "name": "الاسم",
      "phone": "الهاتف",
      "verificationNotes": "ملاحظات التحقق"
    },
    "noPhone": "لا يوجد هاتف",
    "placeholders": {
      "notes": "ملاحظات..."
    },
    "documentType": {
      "driver_license": "رخصة سياقة",
      "id_card": "بطاقة وطنية",
      "passport": "جواز سفر",
      "vehicle_registration": "بطاقة رمادية"
    },
    "status": {
      "pending": "قيد الانتظار",
      "verified": "تم التحقق",
      "rejected": "مرفوض"
    },
    "reviewTitle": "مراجعة وثيقة: {{name}}"
  },
  "sidebar": {
    "dashboard": "لوحة القيادة",
    "fleet": "الأسطول",
    "bookings": "الحجوزات",
    "clients": "العملاء",
    "users": "المستخدمين",
    "maintenance": "الصيانة",
    "fleetHealth": "صحة الأسطول",
    "verification": "التحقق",
    "messages": "الرسائل",
    "systemOnline": "النظام متصل"
  }
};

const localesDir = path.join(__dirname, 'src', 'locales');
const frFile = path.join(localesDir, 'fr.json');
const arFile = path.join(localesDir, 'ar.json');

const frData = JSON.parse(fs.readFileSync(frFile, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arFile, 'utf8'));

frData.admin = frAdmin;
arData.admin = arAdmin;

fs.writeFileSync(frFile, JSON.stringify(frData, null, 2));
fs.writeFileSync(arFile, JSON.stringify(arData, null, 2));

console.log('Translations successfully injected.');
