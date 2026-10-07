import React, { useState } from 'react';
import { Plus, Play, AlertTriangle, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CreateInstructionModal from '../components/CreateInstructionModal';

export default function StandingInstructionsView({ standingInstructions, onAddInstruction, onSimulateTrigger, onNavigateTab }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [triggerNotification, setTriggerNotification] = useState(null);

  const handleTriggerSim = (instruction) => {
    setTriggerNotification({ instruction, message: `Rule triggered: ${instruction.symbol} condition met! Order staged, awaiting Trader Approval.` });
    if (onSimulateTrigger) onSimulateTrigger(instruction);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-slate-900 tracking-tight">Standing Instructions</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">PERSISTENT MONITORING</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Rules continuously evaluate market data. When triggered, AI formats the order — but never executes without your confirmation.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-200">
          <Plus size={15} /><span>CREATE INSTRUCTION</span>
        </button>
      </div>

      {/* Trigger Alert Banner */}
      {triggerNotification && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={17} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-mono font-bold text-xs text-amber-700">TRIGGER EVENT: {triggerNotification.instruction.title}</div>
              <p className="text-xs text-slate-600 mt-0.5">{triggerNotification.message}</p>
            </div>
          </div>
          <button onClick={() => onNavigateTab('copilot')} className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1 shadow-sm">
            <span>Review & Approve</span><ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {standingInstructions.map((si) => (
          <div key={si.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">STANDING INSTRUCTION</span>
                <StatusBadge status={si.status} size="xs" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-base font-bold font-mono text-slate-900">{si.title}</h3>
                <span className="text-xs font-mono text-slate-400">{si.symbol}</span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                {si.quantity && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400">Quantity:</span>
                    <span className="font-bold text-slate-700">{si.quantity} shares</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <span className="text-slate-500">Condition:</span>
                  <span className="font-bold text-amber-600">{si.condition}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400">Triggered:</span>
                  <span className="text-slate-700">{si.triggered} times</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400">Last checked:</span>
                  <span className="text-slate-500">{si.lastChecked}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed italic">{si.notes}</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button onClick={() => handleTriggerSim(si)} className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-600 hover:text-amber-700 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 group">
                <Play size={12} className="text-amber-500 group-hover:scale-110 transition-transform" />
                Simulate Trigger Condition
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateInstructionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={onAddInstruction} />
    </div>
  );
}
