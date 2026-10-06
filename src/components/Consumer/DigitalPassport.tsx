import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Lock, Gift, Sparkles, Coffee, Waves, Fish, Trophy, Navigation, Target } from 'lucide-react';

export const DigitalPassport: React.FC = () => {
  const { user, achievements, rewards, regionalRoutes, localMissions, redeemReward } = useApp();

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'Cafés':
      case 'Cerros': return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'Costa': return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'Patrimonio': return <Fish className="w-5 h-5 text-emerald-400" />;
      default: return <Trophy className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Passport Identity Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-8 border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {user.passportLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">ID Pasaporte: VALPO-PASS-{user.id}</p>

              <div className="mt-3 flex items-center space-x-4 text-xs">
                <span className="text-slate-300">
                  <strong className="text-emerald-400 text-sm">{user.visitedPlacesCount}</strong> Visitas Verificadas
                </span>
                <span className="text-slate-300">
                  <strong className="text-amber-400 text-sm">{user.points}</strong> Puntos Acumulados
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-400">Racha de Explorador</span>
            <div className="flex items-center justify-center space-x-1 font-extrabold text-2xl text-amber-400">
              <Sparkles className="w-5 h-5 fill-amber-400" />
              <span>4 Semanas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rutas Regionales (Borde Costero, Cerros Porteños) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-emerald-400" />
          <span>Rutas Regionales de Valparaíso</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regionalRoutes.map((route) => (
            <div key={route.id} className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ruta {route.category}
                </span>
                <span className="text-xs font-bold text-amber-400">{route.badgeTitle}</span>
              </div>
              <h4 className="font-bold text-white text-base">{route.title}</h4>
              <p className="text-xs text-slate-300">{route.description}</p>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-800">
                <span className="text-slate-400">Meta: {route.requiredVisits} visitas en la ruta</span>
                <span className="font-bold text-emerald-400">Insignia Digital</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desafíos Propios de Locales */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-amber-400" />
          <span>Desafíos & Misiones de Restaurantes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localMissions.map((mission) => (
            <div key={mission.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-emerald-400">{mission.placeName}</span>
                <span>Meta: {mission.targetVisits} visitas/mes</span>
              </div>
              <h4 className="font-bold text-white text-sm">{mission.title}</h4>
              <p className="text-xs text-slate-300">{mission.description}</p>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
                Premio al completar: {mission.rewardText}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>Colección de Insignias</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl glass-panel border transition-all ${
                ach.unlocked
                  ? 'border-emerald-500/40 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-950/60 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  {getBadgeIcon(ach.category)}
                </div>
                {ach.unlocked ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Desbloqueada</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Bloqueada</span>
                  </span>
                )}
              </div>

              <h4 className="font-bold text-white text-base mt-3">{ach.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <span>Catálogo de Recompensas</span>
          </h3>
          <span className="text-xs text-amber-400 font-bold">Tus Puntos: {user.points} pts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const canAfford = user.points >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {reward.placeName}
                    </span>
                    <h4 className="font-bold text-white text-sm">{reward.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{reward.description}</p>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">
                      {reward.pointsCost} Puntos
                    </span>
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => redeemReward(reward.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Canjear' : 'Faltan pts'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reglas del Sistema de Puntos */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>¿Cómo Acumular Puntos Valpar?</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block text-sm">+100 Puntos</span>
            <span className="text-slate-300">Primera Visita NFC</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block text-sm">+50 Puntos</span>
            <span className="text-slate-300">Visita Recurrente</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block text-sm">+30 Puntos</span>
            <span className="text-slate-300">Recomendar Plato</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block text-sm">+20 Puntos</span>
            <span className="text-slate-300">Subir Foto</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block text-sm">+300 Puntos</span>
            <span className="text-slate-300">Ruta Completada</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block text-sm">+150 Puntos</span>
            <span className="text-slate-300">Invitar Amigos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
