import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, CreditCard, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';

interface CartAndOrderModalProps {
  onClose: () => void;
}

export const CartAndOrderModal: React.FC<CartAndOrderModalProps> = ({ onClose }) => {
  const { cart, removeFromCart, clearCart, createOrderFromCart, places } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'efectivo' | 'tarjeta_presencial'>('webpay');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!cart || cart.items.length === 0) return null;

  const targetPlace = places.find(p => p.id === cart.placeId);
  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tip = Math.round(subtotal * 0.1);
  const total = subtotal + tip;

  const handlePay = async () => {
    const order = await createOrderFromCart(paymentMethod);
    if (order) {
      setIsSuccess(true);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Pedido Asociado a Visita NFC</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xl">¡Pedido Confirmado & Pagado!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Tu consumo fue registrado en tu Visita en {targetPlace?.name}. Recibirás un mensaje por WhatsApp para tu encuesta post-visita.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
            >
              Cerrar y Ver Encuesta
            </button>
          </div>
        ) : (
          <>
            {/* Place Info */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center">
              <span className="font-bold text-white">{targetPlace?.name}</span>
              <span className="text-emerald-400 font-semibold">Check-In Activo</span>
            </div>

            {/* Items List */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {cart.items.map(item => (
                <div key={item.product.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white">{item.product.name}</h5>
                    <span className="text-slate-400">${item.product.price.toLocaleString()} x {item.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-emerald-400">${(item.product.price * item.quantity).toLocaleString()}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Tip summary */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal consumos:</span>
                <span>${subtotal.toLocaleString()} CLP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Propina sugerida 10%:</span>
                <span>${tip.toLocaleString()} CLP</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-emerald-400">${total.toLocaleString()} CLP</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Método de Pago:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('webpay')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    paymentMethod === 'webpay'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Webpay Directo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta_presencial')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    paymentMethod === 'tarjeta_presencial'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Tarjeta Garzón
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    paymentMethod === 'efectivo'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Efectivo
                </button>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300 transition-all flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
              <span>Confirmar & Pagar ${total.toLocaleString()} CLP</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
