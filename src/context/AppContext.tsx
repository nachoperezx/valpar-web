import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Place,
  PlaceCategory,
  NfcTag,
  CheckIn,
  Visit,
  Order,
  CustomerCRM,
  AutomationRule,
  Achievement,
  Reward,
  WhatsAppMessage,
  Feedback,
  User
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PLACES,
  INITIAL_NFC_TAGS,
  INITIAL_CUSTOMERS,
  INITIAL_RULES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_REWARDS
} from '../data/mockData';
import { api } from '../services/api';

export type ActiveTab = 'home' | 'discover' | 'map' | 'passport' | 'favorites' | 'history';
export type MerchantTab = 'overview' | 'customers' | 'automations' | 'nfc' | 'orders' | 'campaigns';

interface AppContextType {
  // App Mode & Navigation
  appMode: 'consumer' | 'merchant';
  setAppMode: (mode: 'consumer' | 'merchant') => void;
  consumerTab: ActiveTab;
  setConsumerTab: (tab: ActiveTab) => void;
  merchantTab: MerchantTab;
  setMerchantTab: (tab: MerchantTab) => void;
  isWhatsAppOpen: boolean;
  setIsWhatsAppOpen: (open: boolean) => void;

  // Current User (Consumer)
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  favorites: string[];
  toggleFavorite: (placeId: string) => void;

  // Regional Places & Filters
  places: Place[];
  categories: PlaceCategory[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;

  // NFC & Check-Ins Engine
  nfcTags: NfcTag[];
  checkIns: CheckIn[];
  visits: Visit[];
  activeVisit: Visit | null;
  triggerNfcCheckIn: (placeId: string, tagId?: string) => Promise<{ success: boolean; checkIn?: CheckIn; message: string }>;

  // Cart & Orders
  cart: { placeId: string; items: { product: any; quantity: number }[] } | null;
  addToCart: (placeId: string, product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  createOrderFromCart: (paymentMethod: 'webpay' | 'efectivo' | 'tarjeta_presencial') => Promise<Order | null>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;

  // Feedback & Reviews (Transparent)
  feedbacks: Feedback[];
  submitFeedback: (visitId: string, rating: number, comment: string) => Promise<void>;

  // Gamification & Passport & Routes
  achievements: Achievement[];
  rewards: Reward[];
  regionalRoutes: any[];
  localMissions: any[];
  guides: any[];
  redeemReward: (rewardId: string) => boolean;


  // Merchant CRM & Real Dynamic Analytics
  realAnalytics: any;
  customers: CustomerCRM[];
  rules: AutomationRule[];
  toggleRule: (ruleId: string) => void;
  updateRuleTemplate: (ruleId: string, template: string) => void;
  whatsappMessages: WhatsAppMessage[];
  sendManualWhatsApp: (toPhone: string, text: string) => void;

  // Modals Controller
  isNfcModalOpen: boolean;
  setIsNfcModalOpen: (open: boolean) => void;
  nfcScanPlace: Place | null;
  openNfcScannerForPlace: (place: Place) => void;
  isCartModalOpen: boolean;
  setIsCartModalOpen: (open: boolean) => void;
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;
  feedbackVisit: Visit | null;
  openFeedbackForVisit: (visit: Visit) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<'consumer' | 'merchant'>('consumer');
  const [consumerTab, setConsumerTab] = useState<ActiveTab>('home');
  const [merchantTab, setMerchantTab] = useState<MerchantTab>('overview');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  // User State
  const [user, setUser] = useState<User>({
    id: 'user-valpo-01',
    name: 'Valentina Silva',
    email: 'valentina.silva@email.cl',
    phone: '+56987654321',
    role: 'consumer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    points: 450,
    visitedPlacesCount: 4,
    passportLevel: 'Explorador Porteño'
  });

  const [favorites, setFavorites] = useState<string[]>(['place-01', 'place-03']);

  // Places Data
  const [places, setPlaces] = useState<Place[]>([]);
  const [isApiError, setIsApiError] = useState<boolean>(false);
  const [categories] = useState<PlaceCategory[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // NFC & Check-ins State
  const [nfcTags] = useState<NfcTag[]>(INITIAL_NFC_TAGS);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: 'visit-init-01',
      checkInId: 'checkin-00',
      userId: 'user-valpo-01',
      customerName: 'Valentina Silva',
      customerPhone: '+56987654321',
      placeId: 'place-01',
      placeName: 'Café Turri',
      date: '2026-09-28 15:30',
      status: 'completed',
      totalSpent: 15900,
      pointsEarned: 100,
      feedbackRating: 5
    }
  ]);
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);

  // Cart & Orders State
  const [cart, setCart] = useState<{ placeId: string; items: { product: any; quantity: number }[] } | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8841',
      visitId: 'visit-init-01',
      placeId: 'place-01',
      placeName: 'Café Turri',
      customerId: 'cust-101',
      customerName: 'Valentina Silva',
      items: [
        { productId: 'm1', productName: 'Capuchino Turri de Vainilla', price: 3800, quantity: 2 },
        { productId: 'm3', productName: 'Toast Avocado & Salmón Ahumado', price: 7900, quantity: 1 }
      ],
      subtotal: 15500,
      tip: 1550,
      total: 17050,
      status: 'paid',
      createdAt: '2026-09-28 15:45',
      paymentMethod: 'webpay'
    }
  ]);

  // Feedback State
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Gamification & Routes State
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [rewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [regionalRoutes, setRegionalRoutes] = useState<any[]>([]);
  const [localMissions, setLocalMissions] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);

  // Merchant CRM & Real Dynamic Analytics
  const [customers, setCustomers] = useState<CustomerCRM[]>(INITIAL_CUSTOMERS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [realAnalytics, setRealAnalytics] = useState<any>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'wa-init-1',
      toPhone: '+56987654321',
      senderName: 'Café Turri',
      message: '¡Hola Valentina! 🌊 Bienvenido/a a Café Turri. Gracias por registrar tu primera visita con NFC. Hoy acumulaste 100 puntos.',
      timestamp: '2026-09-28 15:31',
      type: 'automation',
      ruleCode: 'RULE_01'
    }
  ]);

  // Modals Controller
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [nfcScanPlace, setNfcScanPlace] = useState<Place | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState<Visit | null>(null);

  // Sync API Data on Mount & Changes
  useEffect(() => {
    const fetchData = async () => {
      setIsApiError(false);
      const apiPlaces = await api.getPlaces();
      if (apiPlaces && Array.isArray(apiPlaces)) {
        setPlaces(apiPlaces);
      } else {
        setIsApiError(true);
      }

      const apiAnalytics = await api.getBusinessAnalytics('place-01');
      if (apiAnalytics) setRealAnalytics(apiAnalytics);

      const apiCustomers = await api.getCustomers('place-01');
      if (apiCustomers) setCustomers(apiCustomers);

      const apiRoutes = await api.getRoutes();
      if (apiRoutes) setRegionalRoutes(apiRoutes);

      const apiMissions = await api.getLocalMissions();
      if (apiMissions) setLocalMissions(apiMissions);

      const apiGuides = await api.getGuides();
      if (apiGuides) setGuides(apiGuides);
    };

    fetchData();
  }, []);


  const toggleFavorite = (placeId: string) => {
    setFavorites(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const openNfcScannerForPlace = (place: Place) => {
    setNfcScanPlace(place);
    setIsNfcModalOpen(true);
  };

  const openFeedbackForVisit = (visit: Visit) => {
    setFeedbackVisit(visit);
    setIsFeedbackModalOpen(true);
  };

  const pushWhatsAppMessage = (msg: Omit<WhatsAppMessage, 'id' | 'timestamp'>) => {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `wa-msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWhatsappMessages(prev => [newMsg, ...prev]);
    setIsWhatsAppOpen(true);
  };

  // Real Check-In Trigger calling Backend API
  const triggerNfcCheckIn = async (placeId: string, tagId?: string) => {
    const targetPlace = places.find(p => p.id === placeId);
    if (!targetPlace) return { success: false, message: 'Lugar no encontrado.' };

    try {
      const res = await api.performCheckIn(placeId, tagId);

      if (res.success) {
        setCheckIns(prev => [res.checkIn, ...prev]);
        setVisits(prev => [res.visit, ...prev]);
        setActiveVisit(res.visit);

        setUser(prev => ({
          ...prev,
          points: prev.points + 100,
          visitedPlacesCount: prev.visitedPlacesCount + 1
        }));

        confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });

        // Refresh Real Dynamic Analytics from Backend!
        const refreshedAnalytics = await api.getBusinessAnalytics('place-01');
        if (refreshedAnalytics) setRealAnalytics(refreshedAnalytics);

        // Execute RULE 01 (Welcome message)
        const welcomeRule = rules.find(r => r.code === 'RULE_01');
        if (welcomeRule && welcomeRule.enabled) {
          pushWhatsAppMessage({
            toPhone: user.phone,
            senderName: targetPlace.name,
            message: welcomeRule.actionMessageTemplate
              .replace('{{nombre}}', user.name)
              .replace('{{lugar}}', targetPlace.name)
              .replace('{{puntos}}', '100'),
            type: 'automation',
            ruleCode: 'RULE_01'
          });
        }
      }

      return {
        success: res.success,
        checkIn: res.checkIn,
        message: res.message
      };
    } catch {
      return { success: false, message: 'Error al conectar con la API de Check-In.' };
    }
  };

  // Cart Functions
  const addToCart = (placeId: string, product: any) => {
    setCart(prev => {
      if (!prev || prev.placeId !== placeId) {
        return { placeId, items: [{ product, quantity: 1 }] };
      }
      const existing = prev.items.find(i => i.product.id === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map(i =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return { ...prev, items: [...prev.items, { product, quantity: 1 }] };
    });
    setIsCartModalOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      if (!prev) return null;
      const updated = prev.items
        .map(i => (i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0);
      return updated.length > 0 ? { ...prev, items: updated } : null;
    });
  };

  const clearCart = () => setCart(null);

  const createOrderFromCart = async (paymentMethod: 'webpay' | 'efectivo' | 'tarjeta_presencial') => {
    if (!cart || cart.items.length === 0) return null;

    const targetPlace = places.find(p => p.id === cart.placeId);
    if (!targetPlace) return null;

    const res = await api.createOrder({
      visitId: activeVisit ? activeVisit.id : `visit-guest-${Date.now()}`,
      placeId: targetPlace.id,
      placeName: targetPlace.name,
      customerId: user.id,
      customerName: user.name,
      items: cart.items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      })),
      source: 'VALPAR_INTERNAL',
      paymentMethod
    });

    if (res.success && res.order) {
      setOrders(prev => [res.order, ...prev]);
      clearCart();

      // Refresh DB Analytics
      const refreshedAnalytics = await api.getBusinessAnalytics('place-01');
      if (refreshedAnalytics) setRealAnalytics(refreshedAnalytics);

      // Execute RULE 02 (Post-visit survey prompt)
      const feedbackRule = rules.find(r => r.code === 'RULE_02');
      if (feedbackRule && feedbackRule.enabled) {
        pushWhatsAppMessage({
          toPhone: user.phone,
          senderName: targetPlace.name,
          message: feedbackRule.actionMessageTemplate
            .replace('{{nombre}}', user.name)
            .replace('{{lugar}}', targetPlace.name)
            .replace('{{link_encuesta}}', 'https://valpodescubre.cl/survey/' + res.order.id),
          type: 'survey',
          ruleCode: 'RULE_02',
          interactiveOptions: ['⭐⭐⭐⭐⭐ Excelente', '⭐⭐⭐ Regular', '⭐ Necesita mejorar']
        });
      }

      if (activeVisit) {
        setTimeout(() => {
          openFeedbackForVisit(activeVisit);
        }, 1200);
      }

      return res.order;
    }

    return null;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Refactored Transparent Review Handler (Punto 3: No artificial filtering)
  const submitFeedback = async (visitId: string, rating: number, comment: string) => {
    const targetVisit = visits.find(v => v.id === visitId);
    if (!targetVisit) return;

    await api.submitReview({
      visitId,
      placeId: targetVisit.placeId,
      userId: user.id,
      userName: user.name,
      rating,
      comment
    });

    const newFeedback: Feedback = {
      id: `fb-${Date.now()}`,
      visitId,
      placeId: targetVisit.placeId,
      customerName: user.name,
      rating,
      comment,
      type: 'public_review',
      createdAt: new Date().toLocaleString(),
      googleReviewClicked: true
    };

    setFeedbacks(prev => [newFeedback, ...prev]);

    pushWhatsAppMessage({
      toPhone: user.phone,
      senderName: targetVisit.placeName,
      message: `¡Muchas gracias ${user.name}! 🌟 Registrar tu opinión transparente (Rating ${rating}/5) apoya el comercio y turismo local de Valparaíso.`,
      type: 'automation'
    });
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || user.points < reward.pointsCost) return false;

    setUser(prev => ({
      ...prev,
      points: prev.points - reward.pointsCost
    }));

    confetti({ particleCount: 50, spread: 60 });
    return true;
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateRuleTemplate = (ruleId: string, template: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, actionMessageTemplate: template } : r))
    );
  };

  const sendManualWhatsApp = (toPhone: string, text: string) => {
    pushWhatsAppMessage({
      toPhone,
      senderName: 'CRM Valparaíso',
      message: text,
      type: 'campaign'
    });
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        consumerTab,
        setConsumerTab,
        merchantTab,
        setMerchantTab,
        isWhatsAppOpen,
        setIsWhatsAppOpen,

        user,
        setUser,
        favorites,
        toggleFavorite,

        places,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        selectedPlace,
        setSelectedPlace,

        nfcTags,
        checkIns,
        visits,
        activeVisit,
        triggerNfcCheckIn,

        cart,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        createOrderFromCart,
        updateOrderStatus,

        feedbacks,
        submitFeedback,

        achievements,
        rewards,
        regionalRoutes,
        localMissions,
        guides,
        redeemReward,


        realAnalytics,
        customers,
        rules,
        toggleRule,
        updateRuleTemplate,
        whatsappMessages,
        sendManualWhatsApp,

        isNfcModalOpen,
        setIsNfcModalOpen,
        nfcScanPlace,
        openNfcScannerForPlace,
        isCartModalOpen,
        setIsCartModalOpen,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        feedbackVisit,
        openFeedbackForVisit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
