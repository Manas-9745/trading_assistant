import React, { useState } from 'react';
import {
  TrendingUp, Wallet, Briefcase, Layers,
  ArrowRight, ShieldCheck, Bot, Sparkles, ExternalLink, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { chartData1D, chartData1W, chartData1M } from '../data/mockData';

export default function DashboardView({ orders, standingInstructions, onNavigateTab, onSelectOrder, onPromptCopilot }) {
  const [timeframe, setTimeframe] = useState('1D');
  const chartData = timeframe === '1D' ? chartData1D : timeframe === '1W' ? chartData1W : chartData1M;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-900">Trading Dashboard</h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              LIVE SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Portfolio intelligence with mandatory human approval on every order.</p>
        </div>
        <button
          onClick={() => onNavigateTab('copilot')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-200 group"
        >
          <Bot size={15} />
          <span>Ask AI Copilot</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="TODAY'S P&L" value="+₹4,280" subvalue="+1.82%" isPositive={true} icon={TrendingUp} badge="Intraday Net" />
        <MetricCard title="PORTFOLIO" value="₹2,39,400" subvalue="+₹7,200 this week" isPositive={true} icon={Briefcase} badge="Total Equity" />
        <MetricCard title="AVAILABLE FUNDS" value="₹82,500" subvalue="₹70,000 reserved margin" isPositive={null} icon={Wallet} badge="Marginable" />
        <MetricCard title="OPEN POSITIONS" value="8" subvalue="6 Long • 2 Short" isPositive={null} icon={Layers} badge="Low Risk" />
      </div>

      {/* Chart + Quick Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* P&L Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold font-mono uppercase text-slate-700">P&L Performance Curve</h2>
              <span className="text-xs text-slate-400">Equity curve (NSE Market Hours)</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {['1D', '1W', '1M'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                    timeframe === tf ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg font-mono text-xs">
                          <p className="text-slate-500">{d.time}</p>
                          <p className="text-slate-900 font-bold text-sm">₹{d.value?.toLocaleString()}</p>
                          <p className="text-emerald-600 font-semibold mt-0.5">P&L: +₹{d.pnl?.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#pnlGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={15} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Copilot Quick Actions</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Test natural-language trade flows with guaranteed safety checks.</p>
            <div className="space-y-2">
              {[
                { label: "Buy 20 TCS at ₹3500", desc: "Single order limit preview & approval" },
                { label: "Sell 10 TCS and buy 20 INFY", desc: "Multi-step plan execution" },
                { label: "What's my P&L today?", desc: "Intraday position breakdown" },
                { label: "Buy some TCS", desc: "Ambiguous query handling test" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptCopilot(item.label)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs transition-all group"
                >
                  <div className="flex items-center justify-between text-blue-600 font-semibold font-mono">
                    <span>"{item.label}"</span>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" />Human approval required</span>
            <span className="font-mono">0% LLM Autonomy</span>
          </div>
        </div>
      </div>

      {/* Recent Orders + Standing Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-slate-700">Recent Orders</h3>
              <p className="text-xs text-slate-400">Click any order to inspect validation & approval logs</p>
            </div>
            <button onClick={() => onNavigateTab('orders')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ExternalLink size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Symbol</th>
                  <th className="pb-3 font-semibold">Side</th>
                  <th className="pb-3 font-semibold">Qty</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono">
                {orders.slice(0, 4).map((order) => {
                  const isBuy = order.side === 'BUY';
                  return (
                    <tr key={order.id} onClick={() => onSelectOrder(order)} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                      <td className="py-3 text-slate-500 font-semibold">{order.id}</td>
                      <td className="py-3 text-slate-900 font-bold">{order.symbol}</td>
                      <td className="py-3">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${isBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                          {order.side}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{order.filledQty ?? 0}/{order.quantity}</td>
                      <td className="py-3 text-slate-800 font-semibold">₹{order.price?.toLocaleString()}</td>
                      <td className="py-3"><StatusBadge status={order.status} size="xs" /></td>
                      <td className="py-3 text-right">
                        <span className="text-[11px] text-blue-500 group-hover:underline">Inspect →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standing Instructions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase text-slate-700">Active Instructions</h3>
                <p className="text-xs text-slate-400">Rules monitoring market conditions</p>
              </div>
              <button onClick={() => onNavigateTab('standing')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Manage</button>
            </div>
            <div className="space-y-3">
              {standingInstructions.map((si) => (
                <div key={si.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-slate-800">{si.title}</span>
                    <StatusBadge status={si.status} size="xs" />
                  </div>
                  <div className="text-[11px] text-amber-600 font-mono">Condition: {si.condition}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100 font-mono">
                    <span>Triggers: {si.triggered}</span>
                    <span>{si.lastChecked}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <button onClick={() => onNavigateTab('standing')} className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors">
              + Add Standing Instruction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
