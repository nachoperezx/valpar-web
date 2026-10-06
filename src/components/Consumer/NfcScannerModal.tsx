import React, { useState } from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Nfc, ShieldCheck, CheckCircle2, Award, Zap } from 'lucide-react';

interface NfcScannerModalProps {
  place: Place;
  onClose: () => void;
}

export const NfcScannerModal: React.FC<NfcScannerModalProps> = ({ place, onClose }) => {
  const { triggerNfcCheckIn } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; points?: number } | null>(null);

  const handleSimulateTap = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate real NFC radio contact + telemetry delay
    setTimeout(async () => {
      const res = await triggerNfcCheckIn(place.id);
      setIsScanning(false);
      setScanResult({
        success: res.success,
        message: res.message,
        points: res.success ? 100 : 0
      });
    }, 1400);

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Nfc className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Verificación NFC / QR</h3>
              <p className="text-xs text-slate-400">Valparaíso Regional Check-In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Place Card Info */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <img src={place.imageUrl} alt={place.name} className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <h4 className="font-bold text-white text-sm">{place.name}</h4>
            <p className="text-xs text-emerald-400">{place.location.zone} · Tag: {place.nfcTagId}</p>
          </div>
        </div>

        {/* NFC Tap Animation Circle */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div
            onClick={!isScanning ? handleSimulateTap : undefined}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isScanning
                ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-105 nfc-pulse-active'
                : scanResult?.success
                ? 'bg-emerald-500 text-slate-950 border-4 border-emerald-300 shadow-xl shadow-emerald-500/50'
                : 'bg-slate-900/90 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 hover:scale-105'
            }`}
          >
            {isScanning ? (
              <Zap className="w-12 h-12 text-emerald-400 animate-bounce" />
            ) : scanResult?.success ? (
              <CheckCircle2 className="w-16 h-16 text-slate-950 stroke-[2.5]" />
            ) : (
              <>
                <Nfc className="w-12 h-12 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-300 text-center px-2">
                  TOCA AQUÍ NFC
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center max-w-xs">
            {isScanning
              ? 'Leyendo chip NFC y ejecutando validaciones antifraude GPS...'
              : scanResult
              ? scanResult.message
              : 'Acerca tu dispositivo a la etiqueta física ubicada en la entrada o mesa del local.'}
          </p>
        </div>

        {/* Anti-Fraud Telemetry Diagnostic Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-300 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Diagnóstico de Seguridad Antifraude</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
              SECURE-NFC-v1.0
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
            <div>
              <span className="text-slate-500 block">Token NFC:</span>
              <span className="font-mono text-emerald-400">ROTATING-VALID</span>
            </div>
            <div>
              <span className="text-slate-500 block">Distancia GPS:</span>
              <span className="text-slate-200">22m (Dentro de rango)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Frecuencia Scan:</span>
              <span className="text-slate-200">OK (1 scan / día)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Recompensa:</span>
              <span className="font-bold text-amber-400 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>+100 Puntos</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex space-x-3">
          {scanResult?.success ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              disabled={isScanning}
              onClick={handleSimulateTap}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all disabled:opacity-50"
            >
              {isScanning ? 'Verificando...' : 'Simular Lectura NFC'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
