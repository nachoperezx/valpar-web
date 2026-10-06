// Real API Client connecting Valpar Frontend to Backend API v1.1 (http://localhost:3001/api)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  getPlaces: async (params?: { city?: string; category?: string; search?: string }) => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/places?${query}`);
      const data = await res.json();
      return data.places || [];
    } catch {
      return null;
    }
  },

  performCheckIn: async (placeId: string, nfcTagId?: string) => {
    const res = await fetch(`${API_BASE}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, nfcTagId })
    });
    return await res.json();
  },

  createOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  submitReview: async (reviewData: any) => {
    const res = await fetch(`${API_BASE}/orders/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  },

  getBusinessAnalytics: async (businessId: string = 'place-01') => {
    try {
      const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics`);
      const data = await res.json();
      return data.analytics;
    } catch {
      return null;
    }
  },

  getCustomers: async (businessId: string = 'place-01', preference?: string, zone?: string) => {
    try {
      const params = new URLSearchParams();
      if (preference) params.append('preference', preference);
      if (zone) params.append('zone', zone);
      const res = await fetch(`${API_BASE}/businesses/${businessId}/customers?${params.toString()}`);
      const data = await res.json();
      return data.customers || [];
    } catch {
      return null;
    }
  },

  // B2G Regional Admin Metrics (Municipalities / Tourism Boards)
  getB2GAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/b2g/analytics`);
      const data = await res.json();
      return data.analytics;
    } catch {
      return null;
    }
  },

  // Editorial Guides for Organic Traffic
  getGuides: async () => {
    try {
      const res = await fetch(`${API_BASE}/guides`);
      const data = await res.json();
      return data.guides || [];
    } catch {
      return [];
    }
  },

  // Point Ledger Transactional History
  getPointLedger: async (userId: string = 'user-valpo-01') => {
    try {
      const res = await fetch(`${API_BASE}/ledger/${userId}`);
      const data = await res.json();
      return data.transactions || [];
    } catch {
      return [];
    }
  },

  getRoutes: async () => {
    try {
      const res = await fetch(`${API_BASE}/routes`);
      const data = await res.json();
      return data.routes || [];
    } catch {
      return [];
    }
  },

  getLocalMissions: async () => {
    try {
      const res = await fetch(`${API_BASE}/missions`);
      const data = await res.json();
      return data.missions || [];
    } catch {
      return [];
    }
  }
};
