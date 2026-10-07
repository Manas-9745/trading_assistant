import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Layers,
  Clock,
  ShieldCheck,
  Activity as ActivityIcon,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, pendingCount = 1 }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'Core' },
    { id: 'orders', label: 'Orders', icon: Layers, count: pendingCount },
    { id: 'standing', label: 'Standing Instructions', icon: Clock },
    { id: 'safety', label: 'Safety Center', icon: ShieldCheck, highlight: true },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between select-none z-20 flex-shrink-0 min-h-screen shadow-sm">
      {/* Brand */}
      <div>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-slate-900 text-lg font-mono">VEYRA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                COPILOT
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            AI that understands your trade.<br />
            <span className="text-slate-600 font-semibold">You stay in control.</span>
          </p>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 rounded bg-blue-100 text-blue-600">
                      {item.badge}
                    </span>
                  )}
                  {item.count ? (
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      {item.count}
                    </span>
                  ) : null}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                  {isActive && <ChevronRight size={13} className="text-blue-500" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/70">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock size={12} className="text-amber-500" />
              LLM Execution Authority
            </span>
            <span className="font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] border border-rose-200">
              NONE (0%)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Human approval strictly required for all orders.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-600 tracking-wide">MARKET OPEN</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">NSE / BSE</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
            <span className="font-semibold text-slate-600">DEMO ACCOUNT</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              SIMULATED
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
