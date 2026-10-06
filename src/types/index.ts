export type UserRole = 'consumer' | 'merchant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  points: number;
  visitedPlacesCount: number;
  passportLevel: string;
}

export interface PlaceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Location {
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  zone: string; // e.g. 'Cerro Alegre', '8 Norte', 'Concón Caleta'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export type PlaceStatus = 'DISCOVERED' | 'RECOMMENDED' | 'PARTNER';

export interface Place {
  id: string;
  partnerId?: string;
  status: PlaceStatus;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categories: string[];
  imageUrl: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  verifiedVisits: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  location: Location;
  openingHours: string;
  phone: string;
  nfcActive: boolean;
  nfcTagId: string;
  isFeatured?: boolean;
  currentOffer?: string;
  experienceTags?: string[];
  menu: Product[];
}

export interface NfcTag {
  id: string;
  placeId: string;
  placeName: string;
  locationLabel: string; // e.g., 'Entrada Principal', 'Mesa 4', 'Barra'
  tokenSecret: string;
  status: 'active' | 'inactive';
  dailyScansLimit: number;
  totalScans: number;
  lastScannedAt?: string;
}

export interface CheckInValidation {
  isGeoValid: boolean;
  distanceMeters: number;
  isRateLimitValid: boolean;
  isTokenValid: boolean;
  timestamp: string;
  fraudAlertMessage?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  placeId: string;
  nfcTagId: string;
  timestamp: string;
  status: 'verified' | 'flagged' | 'rejected';
  method: 'NFC' | 'QR';
  pointsAwarded: number;
  validation: CheckInValidation;
}

export interface Visit {
  id: string;
  checkInId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  placeId: string;
  placeName: string;
  date: string;
  status: 'active' | 'completed';
  orderId?: string;
  totalSpent?: number;
  pointsEarned: number;
  feedbackRequested?: boolean;
  feedbackRating?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  visitId: string;
  placeId: string;
  placeName: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tip: number;
  total: number;
  status: 'created' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';
  createdAt: string;
  paymentMethod: 'webpay' | 'efectivo' | 'tarjeta_presencial';
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedVisit: boolean;
}

export interface Feedback {
  id: string;
  visitId: string;
  placeId: string;
  customerName: string;
  rating: number;
  comment: string;
  type: 'public_review' | 'private_feedback';
  createdAt: string;
  googleReviewClicked?: boolean;
}

export interface Consent {
  marketingWhatsApp: boolean;
  birthdayOffers: boolean;
  postVisitSurveys: boolean;
  reactivationMessages: boolean;
  updatedAt: string;
}

export interface CustomerCRM {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  firstVisitDate: string;
  lastVisitDate: string;
  totalVisits: number;
  totalSpent: number;
  averageTicket: number;
  loyaltyTier: 'Bronce' | 'Plata' | 'Oro' | 'VIP Porteño';
  consent: Consent;
  notes?: string;
  tags: string[];
}

export interface AutomationRule {
  id: string;
  code: 'RULE_01' | 'RULE_02' | 'RULE_03' | 'RULE_04' | 'RULE_05' | 'RULE_06';
  title: string;
  description: string;
  triggerEvent: string;
  condition: string;
  actionMessageTemplate: string;
  enabled: boolean;
  executionsCount: number;
}

export interface Campaign {
  id: string;
  title: string;
  targetSegment: string;
  messageTemplate: string;
  sentCount: number;
  openRate: number;
  conversionRate: number;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
}

export interface Reward {
  id: string;
  placeId: string;
  placeName: string;
  title: string;
  description: string;
  pointsCost: number;
  code: string;
  imageUrl: string;
  expiresAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Costa' | 'Cafés' | 'Patrimonio' | 'Noche' | 'Experiencias';
  description: string;
  icon: string;
  requiredVisits: number;
  currentProgress: number;
  unlocked: boolean;
  badgeUrl: string;
}

export interface WhatsAppMessage {
  id: string;
  toPhone: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'automation' | 'campaign' | 'order_update' | 'survey';
  ruleCode?: string;
  interactiveOptions?: string[];
}
