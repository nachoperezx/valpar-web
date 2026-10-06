import React, { useState } from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Nfc, Star, ExternalLink, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  onSelectPlace: (place: Place) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectPlace }) => {
  const { places, openNfcScannerForPlace } = useApp();
  const [activePin, setActivePin] = useState<Place | null>(places[0]);

  // Map coordinates relative positions for SVG map simulation
  const getPinCoords = (placeId: string) => {
    switch (placeId) {
      case 'place-01': return { x: '35%', y: '58%', label: 'Café Turri' };
      case 'place-02': return { x: '32%', y: '64%', label: 'Cervecería Altamira' };
      case 'place-03': return { x: '68%', y: '22%', label: 'Mar de Amores' };
      case 'place-04': return { x: '58%', y: '38%', label: 'Empanadas Reñaca' };
      case 'place-05': return { x: '25%', y: '72%', label: 'Paseo 21 de Mayo' };
      case 'place-06': return { x: '85%', y: '45%', label: 'Olmué Patagual' };
      default: return { x: '50%', y: '50%', label: 'Local' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Mapa Interactivo de la Región</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Navega por las zonas de Valparaíso, Viña del Mar, Reñaca, Concón y Olmué. Haz clic en los pines para ver el local y realizar check-in NFC.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Local con Tag NFC activo</span>
        </div>
      </div>

      {/* Simulated Interactive Map Display */}
      <div className="relative w-full h-[520px] rounded-3xl overflow-hidden map-bg border border-slate-800 shadow-2xl">
        {/* Ocean & Coast Decorative SVG Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Coastline curves */}
          <path
            d="M 0,100 C 150,180 250,220 300,350 C 350,480 320,600 200,800"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6,6"
          />
          {/* Bay watermark text */}
          <text x="5%" y="30%" fill="#1e293b" fontSize="24" fontWeight="bold" letterSpacing="4">
            OCEANO PACIFICO - BAHIA VALPARAISO
          </text>
        </svg>

        {/* Map Pins */}
        {places.map((place) => {
          const coords = getPinCoords(place.id);
          const isSelected = activePin?.id === place.id;

          return (
            <div
              key={place.id}
              style={{ left: coords.x, top: coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              onClick={() => setActivePin(place)}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin Tooltip */}
                <div
                  className={`mb-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-lg ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 scale-110'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-700 group-hover:bg-slate-800'
                  }`}
                >
                  {coords.label}
                </div>

                {/* Animated Pin Marker */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 scale-110 shadow-lg shadow-emerald-500/50'
                      : 'bg-slate-900 text-emerald-400 border border-emerald-500/50 hover:scale-105'
                  }`}
                >
                  <MapPin className="w-5 h-5 fill-current" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Active Place Floating Card Preview inside Map */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 glass-panel p-4 rounded-2xl border border-slate-700 z-30 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <img
                src={activePin.imageUrl}
                alt={activePin.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{activePin.rating}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400">{activePin.location.zone}</span>
                </div>
                <h3 className="font-bold text-white text-sm truncate">{activePin.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{activePin.tagline}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => openNfcScannerForPlace(activePin)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center space-x-1 shadow-md"
              >
                <Nfc className="w-3.5 h-3.5" />
                <span>Simular NFC</span>
              </button>

              <button
                onClick={() => onSelectPlace(activePin)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors flex items-center space-x-1"
              >
                <span>Ver Ficha</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
