import React, { useState } from 'react';
import { CustomerCRM } from '../../types';
import { useApp } from '../../context/AppContext';
import { Search, MessageSquare } from 'lucide-react';

export const CustomerCRMView: React.FC = () => {
  const { customers, sendManualWhatsApp } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCRM | null>(null);
  const [manualMsgText, setManualMsgText] = useState('');
  const [msgSentNotice, setMsgSentNotice] = useState(false);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !manualMsgText) return;
    sendManualWhatsApp(selectedCustomer.phone, manualMsgText);
    setManualMsgText('');
    setMsgSentNotice(true);
    setTimeout(() => setMsgSentNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Base de Datos de Clientes & CRM</h2>
          <p className="text-xs text-slate-300 mt-1">
            Gestión de clientes recurrentes, consentimientos de WhatsApp, gasto acumulado e historial de visitas.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Teléfono & Consentimiento</th>
                <th className="py-3.5 px-4">Visitas</th>
                <th className="py-3.5 px-4">Gasto Total</th>
                <th className="py-3.5 px-4">Ticket Prom.</th>
                <th className="py-3.5 px-4">Nivel Fidelidad</th>
                <th className="py-3.5 px-4">Última Visita</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">
                    <div>{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{c.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-mono text-emerald-400 font-semibold">{c.phone}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {(c as any).consents?.whatsappMarketing ?? c.consent?.marketingWhatsApp ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          MKT WhatsApp OK
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400">
                          Sin Consentimiento
                        </span>
                      )}

                    </div>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-white">{c.totalVisits}</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400">${c.totalSpent.toLocaleString()}</td>
                  <td className="py-4 px-4">${c.averageTicket.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {c.loyaltyTier}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{c.lastVisitDate}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500 text-xs font-bold hover:text-white transition-colors"
                    >
                      Ficha 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 border border-purple-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-lg">{selectedCustomer.name}</h3>
                <p className="text-xs text-purple-400">Perfil 360° · {selectedCustomer.loyaltyTier}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Visitas</span>
                <span className="font-extrabold text-white text-lg">{selectedCustomer.totalVisits}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gasto Acumulado</span>
                <span className="font-extrabold text-emerald-400 text-lg">${selectedCustomer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Ticket Promedio</span>
                <span className="font-extrabold text-amber-400 text-lg">${selectedCustomer.averageTicket.toLocaleString()}</span>
              </div>
            </div>

            {/* Details & Tags */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Notas del Establecimiento:</span>
                <p className="text-slate-400">{selectedCustomer.notes || 'Sin observaciones.'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300">Etiquetas / Preferencias:</span>
                {selectedCustomer.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Sender */}
            <form onSubmit={handleSendDirect} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Enviar Mensaje Personalizado por WhatsApp</span>
                </label>
                {msgSentNotice && (
                  <span className="text-[10px] text-emerald-400 font-bold">¡Mensaje Enviado!</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Escribe un mensaje directo a la usuaria..."
                value={manualMsgText}
                onChange={(e) => setManualMsgText(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
              >
                Enviar vía API Meta / WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
