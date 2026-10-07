import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CreateInstructionModal({ isOpen, onClose, onCreate }) {
  const [prompt, setPrompt] = useState('Buy 10 INFY if price falls below ₹1500');
  const [parsedRule, setParsedRule] = useState({
    symbol: 'INFY', action: 'BUY', quantity: 10,
    condition: 'Price < ₹1500', targetPrice: 1500, requiresApproval: true,
  });

  if (!isOpen) return null;

  const handlePromptChange = (val) => {
    setPrompt(val);
    const upper = val.toUpperCase();
    let symbol = 'INFY';
    if (upper.includes('TCS')) symbol = 'TCS';
    if (upper.includes('RELIANCE')) symbol = 'RELIANCE';
    if (upper.includes('HDFC')) symbol = 'HDFCBANK';
    let action = upper.includes('SELL') ? 'SELL' : 'BUY';
    let qtyMatch = val.match(/\d+/);
    let qty = qtyMatch ? parseInt(qtyMatch[0]) : 10;
    let priceMatch = val.match(/(below|above|<|>|at)\s*₹?\s*(\d+)/i);
    let target = priceMatch ? parseInt(priceMatch[2]) : 1500;
    setParsedRule({ symbol, action, quantity: qty, condition: `Price < ₹${target}`, targetPrice: target, requiresApproval: true });
  };

  const handleSave = () => {
    onCreate({
      id: `SI-${Math.floor(100 + Math.random() * 900)}`,
      title: `${parsedRule.action} ${parsedRule.symbol}`,
      symbol: parsedRule.symbol, action: parsedRule.action, quantity: parsedRule.quantity,
      condition: parsedRule.condition, status: 'MONITORING', triggered: 0,
      lastChecked: 'Just now', orderType: 'LIMIT', targetPrice: parsedRule.targetPrice,
      notes: 'AI monitors order book. Requires Trader Approval before execution.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Standing Instruction</h3>
              <p className="text-xs text-slate-400">Natural Language Rule Definition</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Describe rule in natural language:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="e.g. Buy 10 INFY if price falls below ₹1500"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 font-sans transition-all"
          />
          <div className="flex gap-2 text-[11px] text-slate-400">
            <span>Quick:</span>
            <button onClick={() => handlePromptChange("Buy 10 INFY if price falls below ₹1500")} className="text-blue-500 hover:underline">Buy 10 INFY &lt; ₹1500</button>
            <span>•</span>
            <button onClick={() => handlePromptChange("Sell 25 RELIANCE if price exceeds ₹2950")} className="text-blue-500 hover:underline">Sell 25 RELIANCE &gt; ₹2950</button>
          </div>
        </div>

        {/* Parsed Rule Preview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" />STRUCTURED RULE PREVIEW</span>
            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">SYNTAX VALID</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Action & Symbol', value: <span><span className={parsedRule.action === 'BUY' ? 'text-emerald-600' : 'text-rose-500'} >{parsedRule.action}</span> {parsedRule.symbol}</span> },
              { label: 'Quantity', value: `${parsedRule.quantity} shares` },
              { label: 'Trigger Condition', value: <span className="text-amber-600">{parsedRule.condition}</span> },
              { label: 'Execution Mode', value: <span className="text-blue-600">Require Approval</span> },
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{item.label}</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
            <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
            <span>Strict Human-in-the-Loop: AI notifies and prompts for approval on trigger.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-200 flex items-center gap-1.5">
            <span>Activate Instruction</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
