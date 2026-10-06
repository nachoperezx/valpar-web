import React, { useState } from 'react';
import { Visit } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Star, MessageSquare, Send, ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-react';

interface PostVisitFeedbackModalProps {
  visit: Visit;
  onClose: () => void;
}

export const PostVisitFeedbackModal: React.FC<PostVisitFeedbackModalProps> = ({ visit, onClose }) => {
  const { submitFeedback } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback(visit.id, rating, comment);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Valoración Transparente de Experiencia</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <HeartHandshake className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xl">¡Opinión Registrada Transparentemente!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Tu valoración en Valpar ayuda directamente al restaurante a mejorar y entrega información real a la comunidad.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md"
              >
                <span>¿Quieres compartirla también en Google?</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              ¿Cómo estuvo tu experiencia hoy en <strong className="text-white">{visit.placeName}</strong>?
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-slate-300 block">Tu Valapar Rating:</label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-9 h-9 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-400 block pt-1">
                {rating === 5 && '⭐⭐⭐⭐⭐ Excelente'}
                {rating === 4 && '⭐⭐⭐⭐ Muy Bueno'}
                {rating === 3 && '⭐⭐⭐ Regular'}
                {rating === 2 && '⭐⭐ Oportunidad de mejora'}
                {rating === 1 && '⭐ Mala experiencia'}
              </span>
            </div>

            {/* Optional Feedback */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Comentario / Feedback opcional:</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Dinos qué te gustó o en qué podemos mejorar..."
                className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Transparent Policy Banner */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Valpar no filtra artificialmente reseñas. Todas las opiniones ayudan al local a detectar fallos y construir confianza genuina.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Registrar Valoración en Valpar</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
