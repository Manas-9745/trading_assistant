import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, value, subvalue, isPositive, icon: Icon, badge }) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden transition-all duration-200 shadow-sm">
      <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
        <span>{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">{value}</span>
      </div>

      <div className="flex items-center gap-2 text-xs mt-1">
        {subvalue && (
          <span className={`font-mono font-semibold flex items-center gap-0.5 ${
            isPositive === true ? 'text-emerald-600' : isPositive === false ? 'text-rose-500' : 'text-slate-400'
          }`}>
            {isPositive === true && <ArrowUpRight size={13} />}
            {isPositive === false && <ArrowDownRight size={13} />}
            {subvalue}
          </span>
        )}
        {badge && (
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400/60 via-indigo-400/40 to-transparent"></div>
    </div>
  );
}
