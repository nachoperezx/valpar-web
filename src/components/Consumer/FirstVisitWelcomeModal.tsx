import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Sparkles, CheckCircle2, Award, HeartHandshake, X } from 'lucide-react';

interface FirstVisitWelcomeModalProps {
  placeName: string;
  giftItemName?: string;
  pointsEarned: number;
  onClose: () => void;
}

export const FirstVisitWelcomeModal: React.FC<FirstVisitWelcomeModalProps> = ({
  placeName,
  giftItemName,
  pointsEarned,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-emerald-500/50 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
          <Gift className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ¡Experiencia de Primera Visita NFC!
          </span>
          <h3 className="text-2xl font-extrabold text-white">¡Bienvenido/a a {placeName}!</h3>
          <p className="text-xs text-slate-300">
            Gracias por registrar tu primera visita verificada en este restaurante socio de Valpar.
          </p>
        </div>

        {/* Gift Callout */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-amber-400 font-bold text-xs">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>Regalo de Bienvenida Valpar:</span>
          </div>
          <div className="text-lg font-extrabold text-white">
            {giftItemName || 'Tarta artesanal de cortesía'}
          </div>
          <p className="text-[11px] text-slate-400">Muestra la pantalla al garzón o cajero al pedir tu consumo.</p>
        </div>

        {/* Bonus Points */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold flex items-center space-x-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Puntos Ganados:</span>
          </span>
          <span className="font-extrabold text-emerald-400 text-sm">+{pointsEarned} Puntos</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all"
        >
          ¡Disfrutar Mi Experiencia!
        </button>
      </div>
    </div>
  );
};
