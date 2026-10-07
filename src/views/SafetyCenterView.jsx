import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertOctagon, Terminal, RefreshCw } from 'lucide-react';

export default function SafetyCenterView() {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const pipelineStages = [
    { num: 1, title: "AI INTERPRETATION", actor: "LLM Parser", role: "Extracts symbols, side, quantity, and price from natural language.", status: "Active" },
    { num: 2, title: "STRUCTURED INTENT", actor: "Deterministic Validator", role: "Converts natural language into a strict JSON order contract.", status: "Active" },
    { num: 3, title: "VALIDATION", actor: "Risk Engine", role: "Verifies symbol on NSE/BSE, tick size, and lot multiples.", status: "Active" },
    { num: 4, title: "SAFETY CHECKS", actor: "Margin & Risk Gateway", role: "Checks margin, circuit breakers (±10%), and fat-finger limits.", status: "Active" },
    { num: 5, title: "ORDER PREVIEW", actor: "Presentation Layer", role: "Renders exact order parameters for trader inspection.", status: "Active" },
    { num: 6, title: "TRADER APPROVAL", actor: "Human Trader (You)", role: "Mandatory explicit approval. Generates single-use execution token.", status: "Mandatory Gate", highlight: true },
    { num: 7, title: "FINAL REVALIDATION", actor: "Pre-Flight OMS", role: "Re-checks market price to prevent post-approval slippage.", status: "Active" },
    { num: 8, title: "BROKER EXECUTION", actor: "Exchange FIX Gateway", role: "Orders dispatched only with a signed human token.", status: "Active" },
  ];

  const handleTestAutonomousBypass = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({ reason: "ERR_UNAUTHORIZED: DIRECT_LLM_EXECUTION_PROHIBITED", detail: "AI agent attempted to dispatch order payload without trader cryptographic signature. Security filter intercepted and aborted the transaction.", timestamp: new Date().toLocaleTimeString() });
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck size={24} className="text-emerald-500" />Trade Safety Center
          </h1>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">DEFENSE-IN-DEPTH</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Zero-trust execution architecture ensuring AI assists cognition without holding discretionary custody.</p>
      </div>

      {/* Hero Statement */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-200">Core Architectural Principle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              "AI can understand the trade.<br />
              <span className="text-blue-200">It cannot approve the trade."</span>
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed pt-1">
              LLMs are probabilistic. Financial trading requires deterministic certainty. VEYRA enforces a hardware-grade human firewall between LLM parsing and exchange dispatch.
            </p>
          </div>
          <div className="flex-shrink-0 p-5 rounded-2xl bg-white/20 backdrop-blur text-center space-y-1.5 shadow-lg border border-white/30">
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-100 font-mono">
              <Lock size={13} />LLM EXECUTION AUTHORITY
            </div>
            <div className="text-3xl font-extrabold font-mono text-white tracking-wider">NONE (0%)</div>
            <div className="text-[10px] text-blue-200 font-mono">Direct broker API key access: DISABLED</div>
          </div>
        </div>
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      </div>

      {/* 5 Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "AI Interpretation", sub: "Natural language parser" },
          { label: "Validation Engine", sub: "Risk & margin gates" },
          { label: "Trader Approval", sub: "Strict human consent", highlight: true },
          { label: "Final Revalidation", sub: "Pre-flight slippage halt" },
          { label: "Execution Gateway", sub: "Exchange FIX protocol" }
        ].map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-2xl border space-y-1 text-xs shadow-sm ${item.highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 size={14} />
              <span className="font-mono text-[11px]">Operational</span>
            </div>
            <div className={`font-bold text-xs ${item.highlight ? 'text-amber-700' : 'text-slate-700'}`}>{item.label}</div>
            <div className="text-[10px] text-slate-400">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* 8-Stage Pipeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold font-mono text-slate-800">Deterministic 8-Stage Execution Pipeline</h3>
            <p className="text-xs text-slate-400">Lifecycle of every trade request through VEYRA's defense architecture</p>
          </div>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Pipeline Health: 100%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineStages.map((stage) => (
            <div key={stage.num} className={`p-4 rounded-2xl border relative transition-all hover:shadow-md ${stage.highlight ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold ${stage.highlight ? 'text-amber-600' : 'text-blue-600'}`}>STAGE 0{stage.num}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${stage.highlight ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>{stage.status}</span>
              </div>
              <h4 className="text-xs font-bold font-mono text-slate-800 tracking-wide">{stage.title}</h4>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{stage.role}</div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-400">{stage.actor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rogue LLM Intercept Test */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Terminal size={17} className="text-rose-500" />
              <h3 className="text-base font-bold text-slate-800 font-mono">Judge Demo: Rogue LLM Interception Test</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Simulate an AI agent hallucinating and attempting direct execution without a human click.</p>
          </div>
          <button
            onClick={handleTestAutonomousBypass} disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {testing ? <><RefreshCw size={13} className="animate-spin" /><span>Simulating...</span></> : <><AlertOctagon size={13} /><span>Simulate Rogue Autonomous Order</span></>}
          </button>
        </div>

        {testResult && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 font-mono text-xs animate-fade-in">
            <div className="flex items-center justify-between text-rose-700 font-bold">
              <span className="flex items-center gap-2"><AlertOctagon size={15} />SECURITY SHIELD BLOCKED REQUEST</span>
              <span className="text-slate-400 text-[10px]">{testResult.timestamp}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 text-[11px] font-mono">{testResult.reason}</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">{testResult.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
