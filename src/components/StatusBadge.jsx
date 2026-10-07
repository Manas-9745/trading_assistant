import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const normalized = (status || '').toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'FILLED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
      case 'PENDING APPROVAL':
      case 'WAITING FOR APPROVAL':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PARTIALLY FILLED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'MONITORING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PRICE CHANGED':
      case 'ORDER CONDITIONS CHANGED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const dotColor = () => {
    switch (normalized) {
      case 'FILLED': return 'bg-emerald-500';
      case 'PENDING':
      case 'PENDING APPROVAL':
      case 'WAITING FOR APPROVAL': return 'bg-amber-500';
      case 'PARTIALLY FILLED': return 'bg-sky-500';
      case 'MONITORING': return 'bg-indigo-500 animate-ping';
      case 'PRICE CHANGED':
      case 'ORDER CONDITIONS CHANGED': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const sizeClasses = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-full border ${getStyle()} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor()}`}></span>
      <span>{status}</span>
    </span>
  );
}
