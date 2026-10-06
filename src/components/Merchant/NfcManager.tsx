import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Nfc, QrCode, Plus, RefreshCw, CheckCircle2, Printer } from 'lucide-react';
import { NfcTag } from '../../types';

export const NfcManager: React.FC = () => {
  const { nfcTags } = useApp();
  const [selectedTag, setSelectedTag] = useState<NfcTag | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Nfc className="w-4 h-4" />
            <span>Gestión de Infraestructura Física NFC & QR</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Tags NFC Adheridos & Antifraude</h2>
          <p className="text-xs text-slate-300">
            Administra las etiquetas NFC físicas en entrada, mesas y barra. Configura límites de frecuencia y genera respaldos QR.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-colors flex items-center space-x-2 shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4" />
          <span>Vincular Nuevo Tag NFC</span>
        </button>
      </div>

      {/* Tags List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nfcTags.map((tag) => (
          <div key={tag.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tag ID: {tag.id}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{tag.locationLabel}</h3>
                <p className="text-xs text-slate-400">{tag.placeName}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Activo</span>
              </span>
            </div>

            {/* Token Secret & Antifraude Settings */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Token Criptográfico:</span>
                <span className="font-mono text-emerald-400 font-bold">{tag.tokenSecret}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Límite de Scans Diarios:</span>
                <span className="text-white font-bold">{tag.dailyScansLimit} scans / día</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Check-Ins acumulados:</span>
                <span className="text-amber-400 font-extrabold">{tag.totalScans} lecturas</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Último contacto:</span>
                <span className="text-slate-300">{tag.lastScannedAt || 'Reciente'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => setSelectedTag(tag)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Generar QR Respaldo</span>
              </button>

              <button className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white" title="Rotar Token Rotativo">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable QR Backup Modal */}
      {selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl text-center space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">QR de Respaldo Imprimible</h3>
              <button
                onClick={() => setSelectedTag(null)}
                className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white text-slate-950 space-y-4 max-w-xs mx-auto shadow-2xl">
              <div className="font-extrabold text-sm uppercase tracking-wider">{selectedTag.placeName}</div>
              <div className="w-40 h-40 mx-auto bg-slate-950 rounded-xl flex items-center justify-center p-2">
                <QrCode className="w-32 h-32 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-slate-700">{selectedTag.locationLabel}</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: {selectedTag.id} · NFC / QR</div>
            </div>

            <button className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center justify-center space-x-2">
              <Printer className="w-4 h-4" />
              <span>Imprimir Adhesivo para Mesa / Entrada</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
