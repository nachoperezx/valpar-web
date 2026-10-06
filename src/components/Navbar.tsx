import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, MessageSquare, ShieldCheck, BarChart2 } from 'lucide-react';

interface NavbarProps {
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const {
    isWhatsAppOpen,
    setIsWhatsAppOpen,
    whatsappMessages
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-xl px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & B2B Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <Store className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-slate-300 bg-clip-text text-transparent">
                VALPAR <span className="text-purple-400">BUSINESS</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Web B2B v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Portal de Gestión de Restaurantes Socios & Analítica</p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold">Rol: BUSINESS_ADMIN</span>
          </div>

          {/* WhatsApp Simulator Drawer Toggle */}
          <button
            onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isWhatsAppOpen
                ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-900 border-slate-700 text-purple-300 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Simulador Campañas WA</span>
            {whatsappMessages.length > 0 && (
              <span className="w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] rounded-full flex items-center justify-center font-extrabold">
                {whatsappMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
