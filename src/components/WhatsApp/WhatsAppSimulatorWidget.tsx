import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, PhoneCall, Video, CheckCheck, MessageSquare } from 'lucide-react';

export const WhatsAppSimulatorWidget: React.FC = () => {
  const { isWhatsAppOpen, setIsWhatsAppOpen, whatsappMessages, sendManualWhatsApp, user, places } = useApp();
  const [replyInput, setReplyInput] = React.useState('');

  if (!isWhatsAppOpen) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput) return;
    sendManualWhatsApp(user.phone, replyInput);
    setReplyInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:w-96 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
        {/* Phone Header */}
        <div className="bg-emerald-800 p-3.5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-400">
              WA
            </div>
            <div>
              <h4 className="font-bold text-sm leading-none">WhatsApp Business API</h4>
              <span className="text-[10px] text-emerald-200">Meta Authorized Provider · En vivo</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsWhatsAppOpen(false)}
              className="w-7 h-7 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a] bg-opacity-95">
          <div className="text-center my-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] bg-slate-900 text-slate-400 font-mono">
              🔒 Mensajes cifrados de extremo a extremo por WhatsApp Business API
            </span>
          </div>

          {whatsappMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 rounded-2xl bg-[#202c33] text-slate-100 text-xs space-y-2 border border-slate-700/50 shadow-md max-w-[90%] font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-1 text-[10px]">
                <span className="font-bold text-emerald-400">{msg.senderName}</span>
                <span className="text-slate-400">{msg.timestamp}</span>
              </div>

              <p className="leading-relaxed whitespace-pre-line text-slate-200">{msg.message}</p>

              {/* Interactive Quick Reply Buttons */}
              {msg.interactiveOptions && msg.interactiveOptions.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-slate-700/50">
                  {msg.interactiveOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendManualWhatsApp(msg.toPhone, `Respuesta: ${opt}`)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#00a884]/20 border border-[#00a884]/40 text-[#00a884] font-bold text-[11px] hover:bg-[#00a884]/30 transition-colors text-center"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendReply} className="p-2.5 bg-[#202c33] border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Responder mensaje por WhatsApp..."
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#2a3942] border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00a884]"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-[#00a884] text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
