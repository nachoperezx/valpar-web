import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/Merchant/DashboardOverview';
import { CustomerCRMView } from './components/Merchant/CustomerCRM';
import { AutomationEngine } from './components/Merchant/AutomationEngine';
import { NfcManager } from './components/Merchant/NfcManager';
import { OrderMonitor } from './components/Merchant/OrderMonitor';
import { WhatsAppSimulatorWidget } from './components/WhatsApp/WhatsAppSimulatorWidget';
import { AdminPlaceCMS } from './components/Admin/AdminPlaceCMS';
import { Store, Users, Zap, Nfc, ShoppingBag, BarChart3, Building2, Shield, Lock } from 'lucide-react';

/**
 * ============================================================================
 * VALPAR WEB PLATFORM — ADMIN CMS & BUSINESS B2B PORTAL
 * ============================================================================
 * PROYECTO: plataforma-descubrimiento-regional (Web Portal)
 * MODOS:
 * 1. VALPAR ADMIN CMS (Panel Creador/Administrador Central VALPAR)
 * 2. VALPAR BUSINESS PORTAL (Portal para Restaurantes Socios)
 * ============================================================================
 */

const MainContent: React.FC = () => {
  const { merchantTab, setMerchantTab } = useApp();
  const [viewMode, setViewMode] = useState<'admin' | 'business'>('admin');
  const [selectedPartner] = useState({
    name: 'Café Turri',
    district: 'Cerro Concepción, Valparaíso',
    role: 'BUSINESS_ADMIN'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Web Header / Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-xl px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Building2 className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                  VALPAR <span className="text-indigo-400">{viewMode === 'admin' ? 'ADMIN CMS' : 'BUSINESS'}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v0.3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Plataforma Regional de Descubrimiento & Gestión</p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Creador VALPAR</span>
            </button>

            <button
              onClick={() => setViewMode('business')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'business'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Portal Business</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {viewMode === 'admin' ? (
          /* Central Admin CMS Panel */
          <AdminPlaceCMS />
        ) : (
          /* Merchant Business Partner Portal */
          <div className="space-y-6">
            {/* Merchant Business Context Banner */}
            <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xl">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold text-white tracking-tight">{selectedPartner.name}</h1>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {selectedPartner.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedPartner.district} • Portal Business Restaurante Socio</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Autorización API</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">PostgreSQL Membership Verified</span>
                </div>
              </div>
            </div>

            {/* B2B Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
              <button
                onClick={() => setMerchantTab('overview')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  merchantTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard & Analítica</span>
              </button>

              <button
                onClick={() => setMerchantTab('customers')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  merchantTab === 'customers'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clientes & CRM</span>
              </button>

              <button
                onClick={() => setMerchantTab('automations')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  merchantTab === 'automations'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Campañas & Automatizaciones</span>
              </button>

              <button
                onClick={() => setMerchantTab('nfc')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  merchantTab === 'nfc'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Nfc className="w-4 h-4 text-emerald-400" />
                <span>Administración Tags NFC</span>
              </button>

              <button
                onClick={() => setMerchantTab('orders')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  merchantTab === 'orders'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Visitas & Pedidos POS</span>
              </button>
            </div>

            {/* B2B Tab Router */}
            {merchantTab === 'overview' && <DashboardOverview />}
            {merchantTab === 'customers' && <CustomerCRMView />}
            {merchantTab === 'automations' && <AutomationEngine />}
            {merchantTab === 'nfc' && <NfcManager />}
            {merchantTab === 'orders' && <OrderMonitor />}
          </div>
        )}
      </main>

      <WhatsAppSimulatorWidget />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
