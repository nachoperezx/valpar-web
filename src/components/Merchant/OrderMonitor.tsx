import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag } from 'lucide-react';
import { Order } from '../../types';

export const OrderMonitor: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PAGADO</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">EN PREPARACIÓN</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">LISTO PARA ENTREGAR</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">ENTREGADO</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">NUEVO</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Monitor de Cocina & Pedidos de Visita</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Pedidos Digitales en Tiempo Real</h2>
          <p className="text-xs text-slate-300">
            Seguimiento de pedidos creados desde la app por clientes en visitas verificadas con NFC.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span className="font-bold text-white">{orders.length}</span> Pedidos registrados hoy
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            {/* Top Bar */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-emerald-400 text-sm">{order.id}</span>
                <h3 className="font-bold text-white text-base mt-0.5">{order.customerName}</h3>
                <p className="text-xs text-slate-400">Visita ID: {order.visitId}</p>
              </div>

              {getStatusBadge(order.status)}
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Detalle de Consumos:</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                    <span className="text-slate-200 font-semibold">{item.quantity}x {item.productName}</span>
                    <span className="text-slate-400">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Payment Method */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block">Método de Pago:</span>
                <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Total con Propina:</span>
                <span className="font-extrabold text-emerald-400 text-sm">${order.total.toLocaleString()} CLP</span>
              </div>
            </div>

            {/* Status Change Action Buttons */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500 hover:text-slate-950 transition-colors"
              >
                En Preparación
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="flex-1 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs hover:bg-cyan-500 hover:text-slate-950 transition-colors"
              >
                Marcar Listo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
