import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Place } from '../../types';

interface EditorialGuidesProps {
  onSelectPlace: (place: Place) => void;
}

export const EditorialGuides: React.FC<EditorialGuidesProps> = ({ onSelectPlace }) => {
  const { guides, places } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Contenido Editorial & SEO Orgánico</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Guías de Experiencias Regionales</h2>
          <p className="text-xs text-slate-300">
            Recomendaciones editoriales curadas para descubrir gastronomía, patrimonio y miradores de la V Región.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide: any) => (

          <div key={guide.id} className="group glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img src={guide.heroImageUrl} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                {guide.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-white text-lg group-hover:text-cyan-400 transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{guide.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Incluye {guide.places?.length || 1} local verificado</span>
                </span>
                <button
                  onClick={() => {
                    const matchedPlace = places.find(p => p.id === guide.places[0]);
                    if (matchedPlace) onSelectPlace(matchedPlace);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center space-x-1"
                >
                  <span>Explorar Guía</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
