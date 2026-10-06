import React from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, MapPin, Nfc, Heart, CheckCircle2, Tag } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect }) => {
  const { favorites, toggleFavorite, openNfcScannerForPlace } = useApp();
  const isFav = favorites.includes(place.id);

  return (
    <div className="group rounded-2xl glass-panel overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between">
      {/* Thumbnail & Badges */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <Nfc className="w-3.5 h-3.5" />
              <span>NFC Verificado</span>
            </span>
            {place.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-slate-950 shadow-md">
                Destacado
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(place.id);
            }}
            className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors border border-slate-700"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Tags */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center space-x-1 font-medium bg-slate-900/70 px-2 py-0.5 rounded text-emerald-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{place.location.zone}</span>
          </span>
          <span className="font-bold text-amber-400 bg-slate-900/70 px-2 py-0.5 rounded">{place.priceLevel}</span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelect(place)}
              className="font-bold text-lg text-white hover:text-emerald-400 cursor-pointer transition-colors line-clamp-1"
            >
              {place.name}
            </h3>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{place.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{place.tagline}</p>

          {/* Current Promo Offer Banner */}
          {place.currentOffer && (
            <div className="mt-3 p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center space-x-2 text-xs text-emerald-300">
              <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{place.currentOffer}</span>
            </div>
          )}
        </div>

        {/* Verified Visits & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-300">{place.verifiedVisits.toLocaleString()}</span>
            <span>visitas</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openNfcScannerForPlace(place)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center space-x-1 shadow-md shadow-emerald-500/20"
            >
              <Nfc className="w-3.5 h-3.5" />
              <span>Check-In</span>
            </button>
            <button
              onClick={() => onSelect(place)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors"
            >
              Ver Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
