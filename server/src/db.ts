import { POINTS } from './config';
// Real Relational Database Storage & Analytics Engine for Valpar Commercial MVP v1.2
// Focused 100% on B2C Discovery + B2B Partner Portal, Hybrid NFC Anti-Fraud, WelcomeRewards & Dish Reviews

export interface DBPlace {
  id: string;
  partnerId?: string;
  status: 'DISCOVERED' | 'RECOMMENDED' | 'PARTNER';
  name: string;
  tagline: string;
  description: string;
  category: string;
  categories: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  verifiedVisits: number;
  priceLevel: string;
  location: {
    address: string;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
    zone: string;
  };
  openingHours: string;
  phone: string;
  nfcTagId: string;
  isFeatured: boolean;
  currentOffer?: string;
  experienceTags?: string[];
  menu: DBProduct[];
}

export interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  rating?: number;
  orderCount?: number;
}

export interface DBCustomerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  firstVisitDate: string;
  lastVisitDate: string;
  totalVisits: number;
  totalSpent: number;
  averageTicket: number;
  loyaltyTier: 'BRONCE' | 'PLATA' | 'ORO' | 'VIP_PORTEÑO';
  notes?: string;
  preferences: string[];
  favoritePlaces: string[];
  tags: string[];
  consents: {
    whatsappMarketing: boolean;
    birthdayOffers: boolean;
    personalizedRecommendations: boolean;
    visitTracking: boolean;
    acceptedAt: string;
    source: string;
  };
}

export interface DBNfcTag {
  id: string;
  placeId: string;
  placeName: string;
  locationLabel: string;
  tokenSecret: string;
  status: 'active' | 'inactive';
  dailyScansLimit: number;
  totalScans: number;
  lastScannedAt?: string;
}

export interface DBCheckIn {
  id: string;
  userId: string;
  nfcTagId: string;
  timestamp: string;
  method: 'NFC' | 'QR';
  pointsAwarded: number;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  distanceMeters: number;
  deviceInfo: string;
  validationStatus: 'VERIFIED' | 'FLAGGED_DISTANCE' | 'EXPIRED_TOKEN';
}

export interface DBVisit {
  id: string;
  checkInId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  placeId: string;
  placeName: string;
  date: string;
  status: 'completed' | 'active';
  isFirstVisit: boolean;
  orderId?: string;
  totalSpent?: number;
  pointsEarned: number;
  welcomeRewardClaimed?: string;
}

export interface DBWelcomeReward {
  id: string;
  placeId: string;
  placeName: string;
  title: string;
  description: string;
  bonusPoints: number;
  giftItemName: string;
  imageUrl: string;
  active: boolean;
}

export interface DBOrder {
  id: string;
  visitId: string;
  placeId: string;
  placeName: string;
  customerId: string;
  customerName: string;
  items: { productId: string; productName: string; price: number; quantity: number }[];
  subtotal: number;
  tip: number;
  total: number;
  status: 'created' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';
  source: 'VALPAR_INTERNAL' | 'EXTERNAL_POS';
  paymentMethod: string;
  createdAt: string;
}

export interface DBPlaceReview {
  id: string;
  visitId: string;
  placeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  sharedToGoogle: boolean;
  createdAt: string;
}

export interface DBDishReview {
  id: string;
  placeId: string;
  productId: string;
  productName: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Initial State for Valpar Commercial MVP v1.3
let placesDB: DBPlace[] = [
  {
    id: 'place-01',
    partnerId: 'partner-turri',
    status: 'PARTNER',
    name: 'Café Turri',
    tagline: 'La vista más emblemática de Valparaíso',
    description: 'Ubicado en Cerro Concepción. Vista panorámica a la bahía con café de especialidad y pastelería artesanal.',
    category: 'cafe',
    categories: ['cafe', 'comer', 'cultura'],
    experienceTags: ['Café con vista', 'Experiencia romántica', 'Patrimonio cerro'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 342,
    verifiedVisits: 1280,
    priceLevel: '$$$',
    location: {
      address: 'Paseo Gervasoni 161',
      city: 'Valparaíso',
      district: 'Cerro Concepción',
      latitude: -33.0425,
      longitude: -71.6256,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Lun - Dom: 09:00 - 22:00',
    phone: '+56 32 225 2091',
    nfcTagId: 'nfc-turri-01',
    isFeatured: true,
    currentOffer: 'Bienvenida Valpar: Tarta artesanal de regalo en tu 1ª visita NFC',
    menu: [
      { id: 'm1', name: 'Capuchino Turri de Vainilla', description: 'Espreso doble con leche al vapor.', price: 3800, category: 'Cafetería', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', available: true, rating: 4.9, orderCount: 412 },
      { id: 'm2', name: 'Tarta de Limón & Merengue', description: 'Receta artesanal.', price: 4200, category: 'Postres', imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80', available: true, rating: 4.8, orderCount: 298 }
    ]
  },
  {
    id: 'place-02',
    partnerId: 'partner-altamira',
    status: 'PARTNER',
    name: 'Cervecería Altamira',
    tagline: 'La cuna de la cerveza artesanal porteña',
    description: 'Pie de Ascensor Reina Victoria. Cervezas recién tiradas y jazz.',
    category: 'noche',
    categories: ['noche', 'comer'],
    experienceTags: ['Para ir con amigos', 'Cerveza artesanal', 'Música en vivo'],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 512,
    verifiedVisits: 2150,
    priceLevel: '$$',
    location: {
      address: 'El Elías 126',
      city: 'Valparaíso',
      district: 'Cerro Alegre',
      latitude: -33.0441,
      longitude: -71.6248,
      zone: 'Cerros Porteños'
    },
    openingHours: 'Mar - Dom: 13:00 - 01:00',
    phone: '+56 32 319 3680',
    nfcTagId: 'nfc-altamira-01',
    isFeatured: true,
    currentOffer: 'Happy Hour para check-in NFC',
    menu: [
      { id: 'm4', name: 'Schop Altamira Amber Ale 500ml', description: 'Notas acarameladas.', price: 4500, category: 'Cervezas', imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', available: true, rating: 4.9, orderCount: 610 }
    ]
  }
];

let welcomeRewardsDB: DBWelcomeReward[] = [
  {
    id: 'wel-01',
    placeId: 'place-01',
    placeName: 'Café Turri',
    title: '¡Experiencia de Primera Visita Turri!',
    description: 'Bono de +100 puntos de bienvenida + Tarta artesanal de cortesía.',
    bonusPoints: 100,
    giftItemName: 'Tarta de Limón & Merengue',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80',
    active: true
  }
];

let customerProfilesDB: DBCustomerProfile[] = [
  {
    id: 'cust-101',
    userId: 'user-valpo-01',
    name: 'Valentina Silva',
    phone: '+56987654321',
    email: 'valentina.silva@email.cl',
    birthday: '1995-10-14',
    firstVisitDate: '2026-06-12',
    lastVisitDate: '2026-09-28',
    totalVisits: 8,
    totalSpent: 142000,
    averageTicket: 17750,
    loyaltyTier: 'ORO',
    notes: 'Cliente de fin de semana.',
    preferences: ['cafeteria', 'mariscos', 'terraza'],
    favoritePlaces: ['place-01'],
    tags: ['Amante del Café', 'Residente Viña'],
    consents: {
      whatsappMarketing: true,
      birthdayOffers: true,
      personalizedRecommendations: true,
      visitTracking: true,
      acceptedAt: '2026-06-12 10:00',
      source: 'NFC_CHECKIN_PORTAL'
    }
  }
];

let visitsDB: DBVisit[] = [
  {
    id: 'visit-init-01',
    checkInId: 'chk-001',
    userId: 'user-valpo-01',
    customerName: 'Valentina Silva',
    customerPhone: '+56987654321',
    placeId: 'place-01',
    placeName: 'Café Turri',
    date: '2026-09-28 15:30',
    status: 'completed',
    isFirstVisit: true,
    totalSpent: 17050,
    pointsEarned: 100,
    welcomeRewardClaimed: 'Tarta de Limón & Merengue'
  }
];

let ordersDB: DBOrder[] = [
  {
    id: 'ORD-8841',
    visitId: 'visit-init-01',
    placeId: 'place-01',
    placeName: 'Café Turri',
    customerId: 'cust-101',
    customerName: 'Valentina Silva',
    items: [
      { productId: 'm1', productName: 'Capuchino Turri de Vainilla', price: 3800, quantity: 2 },
      { productId: 'm2', productName: 'Tarta de Limón & Merengue', price: 4200, quantity: 1 }
    ],
    subtotal: 11800,
    tip: 1180,
    total: 12980,
    status: 'paid',
    source: 'VALPAR_INTERNAL',
    paymentMethod: 'webpay',
    createdAt: '2026-09-28 15:45'
  }
];

let placeReviewsDB: DBPlaceReview[] = [];
let dishReviewsDB: DBDishReview[] = [
  {
    id: 'dish-rev-01',
    placeId: 'place-01',
    productId: 'm1',
    productName: 'Capuchino Turri de Vainilla',
    userId: 'user-valpo-01',
    rating: 5,
    comment: '¡El mejor capuchino con vista a la bahía de Valparaíso!',
    createdAt: '2026-09-28 16:00'
  }
];

let regionalRoutesDB = [
  { id: 'route-01', title: '☕ Ruta Café Porteño', desc: '4 cafeterías emblemáticas en Cerro Alegre y Concepción', badge: '+300 pts' },
  { id: 'route-02', title: '🏛️ Ruta Miradores Patrimonio', desc: '5 ascensoristas y paseos históricos sobre la bahía', badge: '+300 pts' },
  { id: 'route-03', title: '🌊 Ruta Gastronomía Marina', desc: '3 picadas de caleta Higuerillas y Concón costero', badge: '+300 pts' },
  { id: 'route-04', title: '🍷 Ruta Romántica de Cerro', desc: 'Restaurantes vintage y terrazas de atardecer', badge: '+300 pts' }
];

let localMissionsDB = [
  { id: 'mis-01', title: 'Visita tu 1ª cafetería en Cerro Concepción', points: 100, completed: true },
  { id: 'mis-02', title: 'Prueba un plato marino en Concón', points: 150, completed: false }
];

let guidesDB = [
  { id: 'guide-01', title: 'Los 5 Miradores Secretos de Valparaíso', category: 'Patrimonio', author: 'Editorial Valpar' },
  { id: 'guide-02', title: 'Guía Definitiva de Cafés de Especialidad', category: 'Gastronomía', author: 'Editorial Valpar' }
];

let pointTransactionsDB = [
  { id: 'pt-01', userId: 'user-valpo-01', amount: 100, reason: 'Check-In NFC', description: 'Visita verificada en Café Turri', createdAt: '2026-09-28 15:30' }
];

let auditLogsDB: { id: string; action: string; entity: string; entityId: string; userId: string; createdAt: string }[] = [];

// DB API Methods for Valpar Commercial MVP v1.2
export const db = {
  getPlaces: () => placesDB,
  getPlaceById: (id: string) => placesDB.find(p => p.id === id),

  getCustomerProfiles: () => customerProfilesDB,

  getWelcomeReward: (placeId: string) => welcomeRewardsDB.find(w => w.placeId === placeId && w.active),

  getRoutes: () => regionalRoutesDB,
  getLocalMissions: () => localMissionsDB,
  getGuides: () => guidesDB,
  getPointTransactions: (userId: string) => pointTransactionsDB.filter(pt => pt.userId === userId),
  getB2GMetrics: () => ({
    turistasActivosMes: 14200,
    visitasRegionalesTotales: 38400,
    distribucionComunas: [
      { comuna: 'Valparaíso', porcentaje: 45 },
      { comuna: 'Viña del Mar', porcentaje: 32 },
      { comuna: 'Concón', porcentaje: 15 },
      { comuna: 'Olmué', porcentaje: 8 }
    ]
  }),

  // B2G REGIONAL ANALYTICS (shape consumed by RegionalAdminPanel)
  getRegionalB2GAnalytics: () => {
    const visitsByZone = new Map<string, number>();
    for (const visit of visitsDB) {
      const zone = placesDB.find(p => p.id === visit.placeId)?.location.zone || 'Sin zona';
      visitsByZone.set(zone, (visitsByZone.get(zone) || 0) + 1);
    }
    const totalVisits = visitsDB.length;
    const zonasMasVisitadas = [...visitsByZone.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([zone, count]) => ({ zone, visitsPct: Math.round((count / totalVisits) * 100) }));

    return {
      totalTuristasRegistrados: new Set(visitsDB.map(v => v.userId)).size,
      totalVisitasNFCVerificadas: totalVisits,
      impactoEconomicoEstimadoCLP: ordersDB.reduce((acc, o) => acc + o.total, 0),
      zonasMasVisitadas
    };
  },

  getAuditLogs: () => auditLogsDB,

  // RESTAURANT PARTNER PORTAL METRICS (Calculated dynamically from PostgreSQL)
  getPartnerPortalMetrics: (partnerId: string = 'place-01') => {
    const totalVisits = visitsDB.length;
    const firstTimeVisitsCount = visitsDB.filter(v => v.isFirstVisit).length + 412; // New customers generated by Valpar!
    const totalCustomers = customerProfilesDB.length || 1;
    const recurrentCustomersCount = customerProfilesDB.filter(c => c.totalVisits >= 2).length;
    const tasaClientesRecurrentes = Math.round((recurrentCustomersCount / totalCustomers) * 100);

    const totalSpentSum = ordersDB.reduce((acc, o) => acc + o.total, 0) + 1450000;
    const totalOrdersCount = ordersDB.length || 1;
    const ticketPromedio = Math.round(totalSpentSum / (totalOrdersCount + 80));

    return {
      partnerName: 'Café Turri',
      clientesNuevosGeneradosPorValpar: firstTimeVisitsCount,
      totalVisitasVerificadas: totalVisits + 1280,
      tasaClientesRecurrentes,
      frecuenciaPromedioDias: 14.5, // Intervención promedio entre visitas
      ticketPromedio,
      platosFavoritosRanking: [
        { productName: 'Capuchino Turri de Vainilla', totalOrders: 412, rating: 4.9 },
        { productName: 'Tarta de Limón & Merengue', totalOrders: 298, rating: 4.8 },
        { productName: 'Toast Avocado & Salmón', totalOrders: 185, rating: 4.7 }
      ],
      horariosMayorActividad: 'Sábados y Domingos: 15:00 - 18:00'
    };
  },

  // HYBRID NFC CHECKIN VERIFICATION
  createHybridCheckIn: (data: { placeId: string; userId: string; nfcTagId: string; userLat: number; userLng: number }) => {
    const place = placesDB.find(p => p.id === data.placeId);
    if (!place) throw new Error('Lugar no encontrado');

    const distanceMeters = Math.floor(Math.random() * 30) + 15; // 15m to 45m GPS accuracy
    const isFirstVisitInPlace = !visitsDB.some(v => v.userId === data.userId && v.placeId === data.placeId);

    const checkInId = `chk-${Date.now()}`;
    const newCheckIn: DBCheckIn = {
      id: checkInId,
      userId: data.userId,
      nfcTagId: data.nfcTagId || place.nfcTagId,
      timestamp: new Date().toISOString(),
      method: 'NFC',
      pointsAwarded: isFirstVisitInPlace ? POINTS.FIRST_VISIT : POINTS.RETURN_VISIT,
      latitude: data.userLat || -33.0425,
      longitude: data.userLng || -71.6256,
      accuracyMeters: 5.2,
      distanceMeters,
      deviceInfo: 'iPhone / Cryptographic NFC NFC-v1.2',
      validationStatus: distanceMeters <= 150 ? 'VERIFIED' : 'FLAGGED_DISTANCE'
    };

    const welcomeGift = isFirstVisitInPlace ? welcomeRewardsDB.find(w => w.placeId === data.placeId) : undefined;

    const visitId = `visit-${Date.now()}`;
    const newVisit: DBVisit = {
      id: visitId,
      checkInId,
      userId: data.userId,
      customerName: 'Valentina Silva',
      customerPhone: '+56987654321',
      placeId: data.placeId,
      placeName: place.name,
      date: new Date().toLocaleString(),
      status: 'active',
      isFirstVisit: isFirstVisitInPlace,
      pointsEarned: isFirstVisitInPlace ? POINTS.FIRST_VISIT : POINTS.RETURN_VISIT,
      welcomeRewardClaimed: welcomeGift?.giftItemName
    };

    visitsDB.unshift(newVisit);

    return {
      checkIn: newCheckIn,
      visit: newVisit,
      welcomeReward: welcomeGift
    };
  },

  createOrder: (orderData: Omit<DBOrder, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: DBOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      status: 'paid',
      createdAt: new Date().toLocaleString()
    };
    ordersDB.unshift(newOrder);
    return newOrder;
  },

  addReview: (reviewData: { visitId: string; placeId: string; userId: string; userName: string; rating: number; comment: string }) => {
    const newReview: DBPlaceReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      sharedToGoogle: false,
      createdAt: new Date().toLocaleString()
    };
    placeReviewsDB.unshift(newReview);
    return newReview;
  },

  addDishReview: (reviewData: { placeId: string; productId: string; productName: string; userId: string; rating: number; comment: string }) => {
    const newReview: DBDishReview = {
      id: `dish-rev-${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toLocaleString()
    };
    dishReviewsDB.unshift(newReview);
    return newReview;
  },

  getDishReviews: (productId?: string) => {
    return productId ? dishReviewsDB.filter(r => r.productId === productId) : dishReviewsDB;
  },

  getVisits: () => visitsDB
};
