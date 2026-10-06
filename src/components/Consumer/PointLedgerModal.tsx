import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowUpRight, ArrowDownLeft, ShieldCheck, History } from 'lucide-react';
import { api } from '../../services/api';

interface PointLedgerModalProps {
  onClose: () => void;
}

export const PointLedgerModal: React.FC<PointLedgerModalProps> = ({ onClose }) => {
  const { user } = useApp();
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    const loadLedger = async () => {
      const data = await api.getPointLedger(user.id);
      setLedger(data);
    };
    loadLedger();
  }, [user.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Historial Transaccional de Puntos</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold">Saldo Actual:</span>
          <span className="font-extrabold text-amber-400 text-base">{user.points} Puntos</span>
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto">
          {ledger.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  item.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {item.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.description}</h4>
                  <span className="text-[10px] text-slate-400">{item.createdAt} · Motivo: {item.reason}</span>
                </div>
              </div>
              <span className={`font-extrabold text-sm ${item.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.amount > 0 ? `+${item.amount}` : item.amount} pts
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 text-[11px] text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Libro contable relacional de puntos auditado por `PointTransaction`.</span>
        </div>
      </div>
    </div>
  );
};
