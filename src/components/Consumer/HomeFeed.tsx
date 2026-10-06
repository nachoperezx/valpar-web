import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlaceCard } from './PlaceCard';
import { Search, MapPin, Sparkles, Nfc, Compass, Coffee, UtensilsCrossed, Wine, Waves, Landmark, Trees } from 'lucide-react';
import { Place } from '../../types';

interface HomeFeedProps {
  onSelectPlace: (place: Place) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ onSelectPlace }) => {
  const {
    places,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    setConsumerTab,
    openNfcScannerForPlace
  } = useApp();

  const cities = ['all', 'Valparaíso', 'Viña del Mar', 'Concón', 'Olmué'];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Wine': return <Wine className="w-4 h-4" />;
      case 'Waves': return <Waves className="w-4 h-4" />;
      case 'Landmark': return <Landmark className="w-4 h-4" />;
      case 'Trees': return <Trees className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.categories.includes(selectedCategory);
    const matchesCity = selectedCity === 'all' || place.location.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Valparaíso backdrop */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=1600&q=80"
          alt="Valparaíso"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Descubrimiento Regional & CRM NFC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Descubre Valparaíso. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Vive los lugares. Vuelve.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Conecta con los mejores restaurantes, cafeterías de cerro, miradores y panoramas. Registra tus visitas con NFC, acumula puntos y accede a beneficios exclusivos.
          </p>

          {/* Search Bar & City Selector */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar café, mirador, mariscos o Cerro Alegre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="relative shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-9 pr-8 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="all">Toda la Región</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Viña del Mar">Viña del Mar</option>
                <option value="Concón">Concón</option>
                <option value="Olmué">Olmué</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <span>Categorías Populares</span>
        </h2>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passport Promo Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center space-x-1 items-center justify-center shrink-0">
            <Nfc className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Pasaporte Digital Región de Valparaíso</h3>
            <p className="text-xs text-slate-300">
              Escanea tags NFC en locales adheridos. Completa rutas de Cerros, Gastronomía Marina y Playas para ganar insignias y premios.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => setConsumerTab('passport')}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
          >
            Ver Mi Pasaporte
          </button>
          <button
            onClick={() => openNfcScannerForPlace(places[0])}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 hover:bg-slate-700"
          >
            Simular Check-In NFC
          </button>
        </div>
      </div>

      {/* Curated Discovery Carousels (When not filtering heavily by search) */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="space-y-8 pt-4">
          {/* Section 1: Tendencias cerca mío */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Tendencias Cerca Mío</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">Ver más</span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
              {places.slice(0, 4).map((place) => (
                <div key={`trend-${place.id}`} className="w-72 shrink-0">
                  <PlaceCard place={place} onSelect={onSelectPlace} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Mejor Puntuados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-emerald-400" />
                <span>Mejor Puntuados ⭐ 4.8+</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">Ver más</span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
              {places.filter(p => p.rating >= 4.7).map((place) => (
                <div key={`top-${place.id}`} className="w-72 shrink-0">
                  <PlaceCard place={place} onSelect={onSelectPlace} />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Joyas Escondidas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-cyan-400" />
                <span>Joyas Escondidas de Cerro y Caleta</span>
              </h2>
              <span className="text-xs text-cyan-400 font-semibold cursor-pointer hover:underline">Ver más</span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
              {places.slice(2, 6).map((place) => (
                <div key={`hidden-${place.id}`} className="w-72 shrink-0">
                  <PlaceCard place={place} onSelect={onSelectPlace} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Places Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Todos los Lugares Verificados ({filteredPlaces.length})
          </h2>
          <span className="text-xs text-slate-400">
            {selectedCity === 'all' ? 'Región completa' : selectedCity}
          </span>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onSelect={onSelectPlace} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-panel rounded-2xl space-y-3">
            <p className="text-slate-400 text-sm">No encontramos lugares que coincidan con tu búsqueda.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
