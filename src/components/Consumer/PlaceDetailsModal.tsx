import React, { useState } from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Star, MapPin, Clock, Phone, Nfc, Utensils, CheckCircle2, Heart, Plus, Tag } from 'lucide-react';

interface PlaceDetailsModalProps {
  place: Place;
  onClose: () => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ place, onClose }) => {
  const { openNfcScannerForPlace, favorites, toggleFavorite, addToCart } = useApp();
  const [selectedTab, setSelectedTab] = useState<'info' | 'menu' | 'reviews'>('info');
  const isFav = favorites.includes(place.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden border border-slate-700 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Favorite buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 backdrop-blur-md">
              <Nfc className="w-3.5 h-3.5" />
              <span>NFC Adherido</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleFavorite(place.id)}
                className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-rose-400 border border-slate-700"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Place Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{place.rating} ({place.reviewCount} reseñas)</span>
              <span>·</span>
              <span>{place.priceLevel}</span>
              <span>·</span>
              <span className="text-emerald-400">{place.verifiedVisits} Visitas Verificadas</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{place.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300">{place.tagline}</p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-6">
          <button
            onClick={() => setSelectedTab('info')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              selectedTab === 'info'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Información & Ubicación
          </button>
          <button
            onClick={() => setSelectedTab('menu')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              selectedTab === 'menu'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menú Digital ({place.menu.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {selectedTab === 'info' && (
            <div className="space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed">{place.description}</p>

              {/* Promo Banner */}
              {place.currentOffer && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center space-x-3 text-sm text-emerald-300">
                  <Tag className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Beneficio exclusivo por Visita NFC:</span>
                    <span>{place.currentOffer}</span>
                  </div>
                </div>
              )}

              {/* Info Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block">Ubicación</span>
                    <span className="text-slate-400">{place.location.address}, {place.location.city}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block">Horario de Atención</span>
                    <span className="text-slate-400">{place.openingHours}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block">Contacto Directo</span>
                    <span className="text-slate-400">{place.phone}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block">Validación Antifraude</span>
                    <span className="text-slate-400">Etiqueta NFC activa en entrada & mesa</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'menu' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Pide directamente desde tu mesa al hacer check-in NFC</span>
                <span className="text-emerald-400 font-bold">Asociado a tu Visita</span>
              </div>

              {place.menu.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                      <span className="font-extrabold text-emerald-400 text-sm mt-1 block">
                        ${item.price.toLocaleString()} CLP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(place.id, item)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 text-xs font-bold hover:text-slate-950 transition-colors flex items-center space-x-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer Action Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            ¿Estás en el local? Toca con tu teléfono la etiqueta NFC
          </div>
          <button
            onClick={() => {
              onClose();
              openNfcScannerForPlace(place);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all flex items-center justify-center space-x-2"
          >
            <Nfc className="w-5 h-5 stroke-[2.5]" />
            <span>Registrar Visita con NFC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
