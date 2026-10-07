import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, UserCheck, Bot, Clock } from 'lucide-react';
import { initialActivityLogs } from '../data/mockData';

export default function ActivityView({ logs = initialActivityLogs }) {
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'TRADER') return log.actor.includes('TRADER') || log.actor.includes('USER');
    if (filter === 'SAFETY') return log.actor.includes('SAFETY');
    if (filter === 'AI') return log.actor.includes('AI');
    if (filter === 'BROKER') return log.actor.includes('BROKER') || log.actor.includes('EXCHANGE');
    return true;
  });

  const getActorBadge = (actor) => {
    if (actor.includes('TRADER') || actor.includes('USER')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (actor.includes('SAFETY') || actor.includes('STANDING')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (actor.includes('AI')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getIcon = (event) => {
    if (event.includes('APPROVED')) return <UserCheck size={14} className="text-blue-500" />;
    if (event.includes('VALIDATION') || event.includes('SAFETY')) return <ShieldCheck size={14} className="text-emerald-500" />;
    if (event.includes('FILLED')) return <CheckCircle2 size={14} className="text-emerald-500" />;
    if (event.includes('AI')) return <Bot size={14} className="text-purple-500" />;
    return <Clock size={14} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">Audit & Activity Log</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">IMMUTABLE TIMELINE</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Full audit trail documenting AI intent, safety engine verification, and explicit human consent.</p>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'TRADER', label: 'Trader' },
            { id: 'SAFETY', label: 'Safety Engine' },
            { id: 'AI', label: 'AI Copilot' },
            { id: 'BROKER', label: 'Broker' }
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${filter === f.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center ring-4 ring-slate-50">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all space-y-2 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getIcon(log.event)}
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-800">{log.event}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getActorBadge(log.actor)}`}>{log.actor}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span>{log.time}</span>
                    {log.orderId && <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-500">{log.orderId}</span>}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{log.details}</p>
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-200">
                  <span>Audit Hash: #0x{Math.random().toString(16).substring(2, 8)}...</span>
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={10} />Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
