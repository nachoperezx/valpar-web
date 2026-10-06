import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, CheckCircle2, MessageSquare, Edit3, Save, Power, ShieldAlert, Sparkles } from 'lucide-react';
import { AutomationRule } from '../../types';

export const AutomationEngine: React.FC = () => {
  const { rules, toggleRule, updateRuleTemplate } = useApp();
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [tempText, setTempText] = useState<string>('');

  const handleStartEdit = (rule: AutomationRule) => {
    setEditingRuleId(rule.id);
    setTempText(rule.actionMessageTemplate);
  };

  const handleSaveEdit = (ruleId: string) => {
    updateRuleTemplate(ruleId, tempText);
    setEditingRuleId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Motor de Automatizaciones WhatsApp Business / Meta</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Reglas de Fidelización Automática (RULE 01 - 06)</h2>
          <p className="text-xs text-slate-300">
            Define la lógica de contacto automatizado tras check-ins, pedidos pagados, cumpleaños e inactividad.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>API WhatsApp Oficial Conectada</span>
        </div>
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => {
          const isEditing = editingRuleId === rule.id;
          return (
            <div
              key={rule.id}
              className={`p-6 rounded-2xl glass-panel border transition-all space-y-4 ${
                rule.enabled
                  ? 'border-purple-500/40 bg-slate-900/90 shadow-xl'
                  : 'border-slate-800 bg-slate-950/60 opacity-75'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {rule.code}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5">{rule.title}</h3>
                </div>

                {/* Enable Toggle Switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    rule.enabled
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{rule.enabled ? 'ACTIVA' : 'INACTIVA'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">{rule.description}</p>

              {/* Trigger Logic Conditions */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="text-emerald-400">
                  <span className="text-slate-500">CUANDO:</span> {rule.triggerEvent}
                </div>
                <div className="text-amber-400">
                  <span className="text-slate-500">CONDICIÓN:</span> {rule.condition}
                </div>
              </div>

              {/* Message Template Display or Edit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Plantilla de WhatsApp:</span>
                  </span>
                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(rule)}
                      className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 text-[11px]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveEdit(rule.id)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 text-[11px] font-extrabold"
                    >
                      <Save className="w-3 h-3" />
                      <span>Guardar</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    rows={3}
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/50 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                    "{rule.actionMessageTemplate}"
                  </div>
                )}
              </div>

              {/* Bottom Executions Counter */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Ejecuciones acumuladas:</span>
                <span className="font-bold text-purple-300">{rule.executionsCount} envíos</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
