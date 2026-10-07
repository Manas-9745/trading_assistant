import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function OrdersView({ orders, onSelectOrder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'FILLED') return matchesSearch && order.status === 'FILLED';
    if (statusFilter === 'PENDING') return matchesSearch && (order.status === 'PENDING APPROVAL' || order.status === 'PENDING');
    if (statusFilter === 'PARTIAL') return matchesSearch && order.status === 'PARTIALLY FILLED';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">Order Book</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">AUDITED LOGS</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Every order is linked to verified safety checks and explicit human approval timestamps.</p>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-sm">
          <ShieldCheck size={15} className="text-emerald-500" />
          <span className="text-slate-600 font-mono text-[11px]">100% Orders Human-Approved</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by symbol or order ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 font-sans shadow-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
          {[{ id: 'ALL', label: 'All' }, { id: 'PENDING', label: 'Pending Approval' }, { id: 'FILLED', label: 'Filled' }, { id: 'PARTIAL', label: 'Partially Filled' }].map((f) => (
            <button
              key={f.id} onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${statusFilter === f.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Symbol</th>
                <th className="py-3.5 px-4 font-semibold">Side</th>
                <th className="py-3.5 px-4 font-semibold">Quantity</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Time</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-mono">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-xs">No orders matching your criteria.</td></tr>
              ) : filteredOrders.map((order) => {
                const isBuy = order.side === 'BUY';
                return (
                  <tr key={order.id} onClick={() => onSelectOrder(order)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-500">{order.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{order.symbol}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${isBuy ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{order.filledQty ?? 0} / {order.quantity}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">₹{order.price?.toLocaleString()}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={order.status} size="xs" /></td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{order.time}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-blue-500 group-hover:text-blue-700 text-xs flex items-center justify-end gap-1 font-sans font-medium">
                        <span>Inspect</span><ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
