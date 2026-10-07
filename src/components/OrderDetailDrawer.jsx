import React from 'react';
import { X, CheckCircle2, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function OrderDetailDrawer({ order, onClose }) {
  if (!order) return null;
  const isBuy = order.side === 'BUY';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white border-l border-slate-200 h-full overflow-y-auto flex flex-col justify-between shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-400">{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-900 mt-1">
                {order.symbol}{' '}
                <span className={isBuy ? 'text-emerald-600' : 'text-rose-500'}>{order.side}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 my-5">
            {[
              { label: 'Quantity', value: `${order.filledQty || 0} / ${order.quantity} shares` },
              { label: 'Limit Price', value: `₹${order.price?.toLocaleString()}` },
              { label: 'Product / Type', value: `${order.product || 'CNC'} • ${order.orderType || 'LIMIT'}` },
              { label: 'Total Value', value: `₹${((order.quantity || 0) * (order.price || 0)).toLocaleString()}` },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">{item.label}</span>
                <p className="text-sm font-bold font-mono text-slate-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Safety Checks */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              <ShieldCheck size={14} className="text-emerald-500" />
              Deterministic Safety Checks
            </div>
            <div className="space-y-2">
              {(order.checks || []).map((chk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700">{chk.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{chk.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Human Approval Record */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 mb-6 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-blue-700">
              <span className="flex items-center gap-1.5"><UserCheck size={14} />Human Approval Record</span>
              <span className="font-mono text-[10px] bg-blue-100 px-2 py-0.5 rounded border border-blue-200">VERIFIED</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Intent Origin: <span className="font-mono text-slate-700">{order.intentOrigin || 'AI Copilot parsed prompt'}</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Approval Method: <span className="font-medium text-slate-700">{order.approvalType || 'Trader Explicit Confirmation'}</span>
            </p>
          </div>

          {/* Audit Timeline */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              <Clock size={14} className="text-blue-500" />
              Audit Timeline
            </div>
            <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 text-xs">
              {(order.timeline || []).map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-slate-700">{step.title}</span>
                    <span className="text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{step.desc}</p>
                  <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-400 border border-slate-200">
                    {step.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Idempotency: #idemp-{order.id?.replace('#', '')}98</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
