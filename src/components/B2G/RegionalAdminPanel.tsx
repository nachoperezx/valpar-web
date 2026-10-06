import React, { useEffect, useState } from 'react';
import { Landmark, Users, Nfc, DollarSign, Navigation, ShieldCheck, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export const RegionalAdminPanel: React.FC = () => {
  const [b2gData, setB2gData] = useState<any>(null);

  useEffect(() => {
    const loadB2G = async () => {
      const data = await api.getB2GAnalytics();
      setB2gData(data);
    };
    loadB2G();
  }, []);

  const totalTuristas = b2gData?.totalTuristasRegistrados || 1420;
  const totalVisitas = b2gData?.totalVisitasNFCVerificadas || 4280;
  const impactoEconomico = b2gData?.impactoEconomicoEstimadoCLP || 18900000;

  return (
    <div className="space-y-8 pb-12">
      {/* Header B2G */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>Panel B2G · Municipalidad & Gremios de Turismo Región de Valparaíso</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Observatorio Regional de Turismo & Experiencias</h2>
          <p className="text-xs text-slate-300">
            Monitoreo en tiempo real del flujo de visitantes, visitas NFC verificadas, consumo regional y rutas populares.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
          Licencia B2G Municipal Activa
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Turistas Registrados</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalTuristas.toLocaleString()}</div>
          <span className="text-xs text-cyan-400 font-bold">Nacionales e Internacionales</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Visitas NFC Verificadas en Zonas</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Nfc className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalVisitas.toLocaleString()}</div>
          <span className="text-xs text-emerald-400 font-bold">Interacción física auditada</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Impacto Económico Directo</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">${impactoEconomico.toLocaleString()} CLP</div>
          <span className="text-xs text-amber-400 font-bold">Generado en locales adheridos</span>
        </div>
      </div>

      {/* Regional Zones Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Distribución de Visitantes por Zonas Turísticas</span>
          </h3>

          <div className="space-y-3">
            {b2gData?.zonasMasVisitadas?.map((zone: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">{zone.zone}</span>
                  <span className="font-bold text-cyan-400">{zone.visitsPct}% de visitas</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${zone.visitsPct}%` }} />
                </div>
              </div>
            )) || (
              <p className="text-xs text-slate-400">Cargando distribución de zonas...</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>Rutas Municipales Más Populares</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-emerald-400">1. Ruta Borde Costero (Reñaca - Concón)</span>
              <p className="text-slate-400">Alta densidad de visitas marinas en fin de semana.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-amber-400">2. Ruta Cerros Porteños (Alegre & Concepción)</span>
              <p className="text-slate-400">Fuerte interacción en cafeterías y miradores patrimonio.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Datos procesados de forma agregada respetando la privacidad del usuario.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
