import React, { useState } from 'react';
import { ChevronDown, User, Wallet, Sparkles, RefreshCw } from 'lucide-react';
import { marketTickers } from '../data/mockData';

export default function Topbar({ onSelectScenario, activeScenario, resetDemo }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const demoScenarios = [
    { id: 'standard', name: '1. Standard Order (Buy 20 TCS @ ₹3500)', tag: 'Order Preview & Approval' },
    { id: 'multistep', name: '2. Multi-Step Plan (Sell 10 TCS & Buy 20 INFY)', tag: 'Partial Fill Demo' },
    { id: 'price_change', name: '3. Price Shift Safeguard', tag: 'Market Condition Changed' },
    { id: 'ambiguous', name: '4. Ambiguous Request ("Buy some TCS")', tag: 'Clarification Required' },
    { id: 'standing', name: '5. Standing Instruction Trigger', tag: 'Automated Monitoring' },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs select-none sticky top-0 z-30 shadow-sm">
      {/* Ticker tape */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-2xl py-1">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold tracking-wider text-[10px] uppercase pl-1 pr-2 border-r border-slate-200">
          <span>MARKETS</span>
        </div>
        <div className="flex items-center gap-4 whitespace-nowrap">
          {marketTickers.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="font-semibold text-slate-600">{ticker.symbol}</span>
              <span className="text-slate-800">₹{ticker.price}</span>
              <span className={ticker.positive ? 'text-emerald-600' : 'text-rose-500'}>
                {ticker.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Demo Scenarios */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-all shadow-sm shadow-blue-200"
          >
            <Sparkles size={13} />
            <span>Demo Scenarios</span>
            <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>TEST PROBLEM STATEMENT SCENARIOS</span>
                <span className="text-[10px] text-blue-500">1-Click Demos</span>
              </div>
              <div className="py-1">
                {demoScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => { onSelectScenario(sc.id); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex flex-col gap-0.5 hover:bg-slate-50 transition-colors ${
                      activeScenario === sc.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <span className="font-semibold text-slate-700">{sc.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sc.tag}</span>
                  </button>
                ))}
              </div>
              <div className="px-3 pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => { resetDemo(); setDropdownOpen(false); }}
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <RefreshCw size={11} />
                  <span>Reset Chat & Orders</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Funds */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono">
          <Wallet size={13} className="text-emerald-500" />
          <span className="text-slate-500 text-[11px]">Funds:</span>
          <span className="text-slate-800 font-bold text-[11px]">₹82,500</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
            <User size={13} />
          </div>
          <div className="hidden md:block">
            <div className="font-semibold text-[11px] text-slate-700 leading-tight">Manas P.</div>
            <div className="text-[10px] font-mono text-slate-400">TR-88219</div>
          </div>
        </div>
      </div>
    </header>
  );
}
