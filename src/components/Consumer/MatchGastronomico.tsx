import React, { useState } from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, X, Eye, Star, MapPin, Sparkles, Flame, RefreshCw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchGastronomicoProps {
  onSelectPlace: (place: Place) => void;
}

export const MatchGastronomico: React.FC<MatchGastronomicoProps> = ({ onSelectPlace }) => {
  const { places, favorites, toggleFavorite } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Discovery deck across all catalog places (DISCOVERED, RECOMMENDED, PARTNER)
  const validPlaces = places;
  const currentPlace = validPlaces[currentIndex];

  const handleNext = () => {
    setSwipeDirection(null);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeLeft = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleSwipeRight = () => {
    if (currentPlace && !favorites.includes(currentPlace.id)) {
      toggleFavorite(currentPlace.id);
      confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
    }
    setSwipeDirection('right');
    setTimeout(() => {
      handleNext();
    }, 300);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setSwipeDirection(null);
  };

  if (!currentPlace || currentIndex >= validPlaces.length) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 animate-pulse">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¡Has explorado todo el catálogo de experiencias!</h2>
        <p className="text-slate-400 text-sm mb-6">
          Guardaste {favorites.length} lugares en tu lista "Quiero conocer". Te avisaremos cuando agreguemos más secretos locales en Valparaíso.
        </p>
        <button
          onClick={handleResetDeck}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Volver a explorar</span>
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(currentPlace.id);
  const featuredDish = currentPlace.menu && currentPlace.menu.length > 0 ? currentPlace.menu[0] : null;

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Match de Experiencias
          </span>
          <h2 className="text-xl font-black text-white">Descubrir Lugares</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold">
          {currentIndex + 1} / {validPlaces.length}
        </span>
      </div>

      {/* Swipeable Card Deck Container */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900 group">
        {/* Main Background Image with Gradient Overlay */}
        <img
          src={currentPlace.imageUrl}
          alt={currentPlace.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            swipeDirection === 'left' ? '-translate-x-full rotate-[-12deg] opacity-0 transition-all duration-300' : ''
          } ${swipeDirection === 'right' ? 'translate-x-full rotate-[12deg] opacity-0 transition-all duration-300' : ''}`}
        />

        {/* Gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-2">
            {/* Status Pill */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md ${
              currentPlace.status === 'PARTNER'
                ? 'bg-purple-600 text-white'
                : currentPlace.status === 'RECOMMENDED'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800/90 text-slate-300 border border-slate-700'
            }`}>
              {currentPlace.status === 'PARTNER' ? 'Socio NFC' : currentPlace.status === 'RECOMMENDED' ? '★ Destacado' : '🔍 Descubierto'}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-white text-xs font-bold flex items-center gap-1">
              {currentPlace.category}
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{currentPlace.rating}</span>
          </div>
        </div>

        {/* Floating Swipe Feedback Indicators */}
        {swipeDirection === 'right' && (
          <div className="absolute top-20 right-6 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg border-2 border-white rotate-12 shadow-2xl animate-bounce">
            ¡FAVORITO! ❤️
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute top-20 left-6 px-4 py-2 rounded-xl bg-rose-500 text-white font-black text-lg border-2 border-white -rotate-12 shadow-2xl animate-bounce">
            PASAR ❌
          </div>
        )}

        {/* Bottom Card Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-300 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{currentPlace.location.zone}, {currentPlace.location.city}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-bold">{currentPlace.priceLevel}</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
              {currentPlace.name}
            </h3>
            <p className="text-slate-300 text-xs line-clamp-2 mt-1 font-medium">
              "{currentPlace.tagline || currentPlace.description}"
            </p>
          </div>

          {/* Featured Dish Highlight */}
          {featuredDish && (
            <div className="p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 flex items-center space-x-3">
              <img
                src={featuredDish.imageUrl || currentPlace.imageUrl}
                alt={featuredDish.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">Plato Recomendado</span>
                <p className="text-xs font-bold text-white truncate">{featuredDish.name}</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-400">${featuredDish.price.toLocaleString()}</span>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between pt-1 text-slate-400 text-xs">
            <span>{currentPlace.verifiedVisits} visitas verificadas</span>
            <span>{currentPlace.reviewCount} opiniones</span>
          </div>
        </div>
      </div>

      {/* Action Bar (Tinder Style Buttons) */}
      <div className="flex items-center justify-center space-x-6 py-2">
        {/* Pass Button */}
        <button
          onClick={handleSwipeLeft}
          className="w-14 h-14 rounded-full bg-slate-900 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center shadow-xl hover:scale-110 hover:bg-rose-500 hover:text-white transition-all duration-200"
          title="No ahora (Pasar)"
        >
          <X className="w-7 h-7 stroke-[3]" />
        </button>

        {/* View Details Button */}
        <button
          onClick={() => onSelectPlace(currentPlace)}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center shadow-lg hover:scale-110 hover:border-cyan-400 transition-all duration-200"
          title="Ver Ficha Completa"
        >
          <Eye className="w-6 h-6" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleSwipeRight}
          className={`w-14 h-14 rounded-full bg-slate-900 border-2 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200 ${
            isFav
              ? 'border-emerald-500 bg-emerald-500 text-slate-950'
              : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
          }`}
          title="Guardar en Favoritos"
        >
          <Heart className={`w-7 h-7 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => onSelectPlace(currentPlace)}
          className="text-xs text-slate-400 hover:text-white inline-flex items-center space-x-1"
        >
          <span>Toca para ver menú, mapa y cómo llegar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
