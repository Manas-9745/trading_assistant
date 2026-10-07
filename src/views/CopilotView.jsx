import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, ShieldCheck, CheckCircle2,
  AlertTriangle, Clock, ArrowRight, Sparkles, Lock,
  Layers, Edit3, XCircle, RefreshCw, AlertCircle, TrendingUp
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function CopilotView({ onOrderCreated, activeScenario, onNavigateTab }) {
  const [messages, setMessages] = useState([
    { id: 'msg-1', sender: 'user', text: "What's my P&L today?", time: '12:40:15' },
    {
      id: 'msg-2', sender: 'ai', text: 'Your portfolio is up ₹4,280 today (+1.82%).', time: '12:40:16',
      type: 'pnl_card',
      data: {
        totalPnL: 4280, percentage: 1.82,
        gainers: [
          { symbol: 'TCS', pnl: '+₹2,600', move: '+1.12%' },
          { symbol: 'RELIANCE', pnl: '+₹1,120', move: '+0.85%' },
          { symbol: 'HDFCBANK', pnl: '+₹560', move: '+0.24%' }
        ]
      }
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    if (!activeScenario) return;
    const map = {
      standard: "Buy 20 TCS at ₹3500",
      multistep: "Sell 10 TCS and buy 20 INFY",
      price_change: "Buy 20 TCS at ₹3500 (Simulate Price Shift)",
      ambiguous: "Buy some TCS",
      standing: "Buy 10 INFY if price falls below ₹1500"
    };
    if (map[activeScenario]) handleUserSubmit(map[activeScenario]);
  }, [activeScenario]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleUserSubmit = (textToSubmit) => {
    const text = textToSubmit || inputVal;
    if (!text.trim()) return;
    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); generateAIResponse(text); }, 600);
  };

  const generateAIResponse = (text) => {
    const lower = text.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (lower.includes('some tcs') || (lower.includes('tcs') && !lower.match(/\d+/))) {
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, sender: 'ai', time: timeStr, type: 'ambiguous', text: 'CLARIFICATION REQUIRED: How many TCS shares would you like to buy? We do not guess order quantities.', symbol: 'TCS' }]);
      return;
    }

    if (lower.includes('sell') && lower.includes('buy') && (lower.includes('tcs') || lower.includes('infy'))) {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}`, sender: 'ai', time: timeStr, type: 'multi_plan', planStatus: 'WAITING_APPROVAL',
        steps: [
          { id: 1, action: 'SELL', symbol: 'TCS', qty: 10, price: 3514, status: 'PENDING' },
          { id: 2, action: 'BUY', symbol: 'INFY', qty: 20, price: 1496, status: 'PENDING' }
        ]
      }]);
      return;
    }

    if (lower.includes('below') || lower.includes('falls') || lower.includes('standing')) {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}`, sender: 'ai', time: timeStr, type: 'standing_confirmation',
        text: 'Standing Instruction active and monitoring.',
        data: { title: 'BUY INFY BELOW ₹1500', symbol: 'INFY', condition: 'Price < ₹1500', qty: 10, status: 'MONITORING' }
      }]);
      return;
    }

    if (lower.includes('p&l') || lower.includes('profit') || lower.includes('loss')) {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now()}`, sender: 'ai', text: 'Your portfolio is up ₹4,280 today (+1.82%).', time: timeStr, type: 'pnl_card',
        data: { totalPnL: 4280, percentage: 1.82, gainers: [{ symbol: 'TCS', pnl: '+₹2,600', move: '+1.12%' }, { symbol: 'RELIANCE', pnl: '+₹1,120', move: '+0.85%' }] }
      }]);
      return;
    }

    const isPriceShift = lower.includes('simulate price shift');
    const orderData = {
      orderId: `#102${Math.floor(5 + Math.random() * 5)}`,
      action: lower.includes('sell') ? 'SELL' : 'BUY',
      symbol: lower.includes('infy') ? 'INFY' : lower.includes('reliance') ? 'RELIANCE' : 'TCS',
      quantity: 20, orderType: 'LIMIT', price: lower.includes('infy') ? 1500 : 3500, product: 'CNC',
      state: 'WAITING_APPROVAL', approvalProgress: null, simulatePriceShift: isPriceShift,
      checks: [
        { name: 'Symbol verified', passed: true, detail: 'NSE:TCS verified' },
        { name: 'Quantity valid', passed: true, detail: 'Lot size 1, lot multiple valid' },
        { name: 'Price valid', passed: true, detail: 'Within circuit limits (±10%)' },
        { name: 'Order structure valid', passed: true, detail: 'LIMIT CNC format verified' },
        { name: 'Margin check passed', passed: true, detail: '₹70,000 req. vs ₹82,500 available' }
      ]
    };
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, sender: 'ai', time: timeStr, type: 'order_preview', order: orderData }]);
  };

  const handleApproveOrder = (msgId, order) => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, state: 'APPROVING', approvalProgress: 'TRADER_APPROVED' } } : m));
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, approvalProgress: 'FINAL_VALIDATION' } } : m));
      setTimeout(() => {
        if (order.simulatePriceShift) {
          setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, state: 'PRICE_CHANGED', approvalProgress: 'HALTED', newPrice: 3524.50, priceDelta: '+0.70%' } } : m));
          showToast('⚠ Order stopped: Market price deviated after approval');
          return;
        }
        setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, approvalProgress: 'SENDING_BROKER' } } : m));
        setTimeout(() => {
          setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, state: 'FILLED', filledQty: m.order.quantity, avgPrice: m.order.price, fillTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) } } : m));
          showToast(`✓ Order Filled: ${order.quantity} shares of ${order.symbol} @ ₹${order.price}`);
          if (onOrderCreated) {
            onOrderCreated({ id: order.orderId || '#1025', symbol: order.symbol, side: order.action, quantity: order.quantity, price: order.price, orderType: order.orderType, product: order.product, status: 'FILLED', time: 'Just now', date: 'Today', exchange: 'NSE', filledQty: order.quantity, avgPrice: order.price, intentOrigin: "Copilot Chat Approval", approvalType: "Explicit Trader One-Click Approval", checks: order.checks, timeline: [{ time: '12:41:02', title: 'Order Requested', desc: `User requested ${order.symbol}`, actor: 'USER' }, { time: '12:41:03', title: 'AI Interpreted Intent', desc: 'Deterministic schema parsing', actor: 'AI_PARSER' }, { time: '12:41:08', title: 'Trader Approved', desc: 'Human authorization confirmed', actor: 'TRADER' }, { time: '12:41:10', title: 'Order Filled', desc: `Executed at ₹${order.price}`, actor: 'EXCHANGE' }] });
          }
        }, 800);
      }, 700);
    }, 600);
  };

  const handleApproveMultiPlan = (msgId) => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, planStatus: 'EXECUTING' } : m));
    setTimeout(() => {
      setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, planStatus: 'COMPLETED', steps: [{ id: 1, action: 'SELL', symbol: 'TCS', qty: 10, price: 3514, status: 'FILLED', filled: 10 }, { id: 2, action: 'BUY', symbol: 'INFY', qty: 20, price: 1496, status: 'PARTIALLY_FILLED', filled: 12, remaining: 8 }] } : m));
      showToast('Multi-step executed: TCS Filled, INFY Partially Filled (12/20)');
    }, 1000);
  };

  const handleCancelOrder = (msgId) => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, state: 'CANCELLED' } } : m));
    showToast('Order draft discarded by trader.');
  };

  const handleAcceptNewPrice = (msgId) => {
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, order: { ...m.order, state: 'FILLED', price: m.order.newPrice || 3524.50, filledQty: m.order.quantity } } : m));
    showToast('✓ Revalidated order filled at updated price ₹3,524.50');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-5xl mx-auto animate-fade-in relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-3 right-3 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xl text-xs font-mono text-slate-800 animate-fade-in">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-3 border-b border-slate-200 flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold font-mono text-slate-900 flex items-center gap-2">
              <Bot className="text-blue-600" size={20} />
              AI Trading Copilot
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              STRICT HITL MODE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">"Understand. Validate. Approve. Execute." — Zero direct execution authority for LLMs.</p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
          <span className="text-blue-600 font-bold">1. Understand</span>
          <span className="text-slate-400">→</span>
          <span className="text-blue-600 font-bold">2. Validate</span>
          <span className="text-slate-400">→</span>
          <span className="text-amber-600 font-bold">3. You Approve</span>
          <span className="text-slate-400">→</span>
          <span className="text-emerald-600 font-bold">4. Execute</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {/* User Bubble */}
            {msg.sender === 'user' && (
              <div className="flex items-start gap-2.5 max-w-xl">
                <div className="p-3.5 rounded-2xl rounded-tr-none bg-blue-600 text-white text-xs font-medium shadow-md shadow-blue-200">
                  <p>{msg.text}</p>
                  <span className="block text-[10px] text-blue-200 mt-1 text-right font-mono">{msg.time}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <User size={13} />
                </div>
              </div>
            )}

            {/* AI Bubble */}
            {msg.sender === 'ai' && (
              <div className="flex items-start gap-2.5 max-w-2xl w-full">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <Bot size={17} />
                </div>
                <div className="space-y-2.5 w-full">
                  {msg.text && (
                    <div className="p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-200 text-xs text-slate-700 inline-block shadow-sm">
                      <p>{msg.text}</p>
                      <span className="block text-[10px] text-slate-400 mt-1 font-mono">{msg.time}</span>
                    </div>
                  )}

                  {/* P&L Card */}
                  {msg.type === 'pnl_card' && msg.data && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-semibold uppercase text-slate-400">Intraday P&L</span>
                        <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={13} />+{msg.data.percentage}%</span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-600">+₹{msg.data.totalPnL?.toLocaleString()}</div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] text-slate-400 font-semibold uppercase">Top Gainers:</div>
                        {msg.data.gainers.map((g, i) => (
                          <div key={i} className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-700">{g.symbol}</span>
                            <span className="text-emerald-600">{g.pnl} ({g.move})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ORDER PREVIEW CARD */}
                  {msg.type === 'order_preview' && msg.order && (
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 max-w-lg space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">ORDER PREVIEW</span>
                          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{msg.order.orderId}</span>
                        </div>
                        <StatusBadge status={
                          msg.order.state === 'WAITING_APPROVAL' ? 'WAITING FOR APPROVAL' :
                          msg.order.state === 'APPROVING' ? 'PENDING' :
                          msg.order.state === 'PRICE_CHANGED' ? 'ORDER CONDITIONS CHANGED' :
                          msg.order.state === 'FILLED' ? 'FILLED' : 'CANCELLED'
                        } />
                      </div>

                      {/* Order Details */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${msg.order.action === 'BUY' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                              {msg.order.action}
                            </span>
                            <span className="text-base font-bold font-mono text-slate-900">{msg.order.symbol}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">NSE • Regular</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-200">
                          <div><span className="text-[10px] text-slate-400 block">Quantity</span><span className="font-bold text-slate-900 text-sm">{msg.order.quantity}</span></div>
                          <div><span className="text-[10px] text-slate-400 block">Order Type</span><span className="font-bold text-slate-700">{msg.order.orderType}</span></div>
                          <div><span className="text-[10px] text-slate-400 block">Limit Price</span><span className="font-bold text-slate-900 text-sm">₹{msg.order.price?.toLocaleString()}</span></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200">
                          <span>Product: <span className="text-slate-600 font-semibold">{msg.order.product}</span></span>
                          <span>Value: <span className="text-slate-600 font-semibold">₹{(msg.order.quantity * msg.order.price).toLocaleString()}</span></span>
                        </div>
                      </div>

                      {/* Safety Checks */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500">
                          <ShieldCheck size={13} className="text-emerald-500" />Safety Checks Passed
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {msg.order.checks.map((chk, i) => (
                            <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px]">
                              <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                              <span className="text-slate-600 truncate">{chk.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* STATE: WAITING */}
                      {msg.order.state === 'WAITING_APPROVAL' && (
                        <div className="space-y-3 pt-1">
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700 flex items-start gap-2">
                            <Lock size={13} className="mt-0.5 flex-shrink-0" />
                            <span><strong>Human Approval Required:</strong> AI verified this order but cannot execute. Review and approve to dispatch.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleApproveOrder(msg.id, msg.order)} className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 group">
                              <CheckCircle2 size={15} />
                              <span>APPROVE ORDER</span>
                              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => showToast('Edit mode: adjust in chat')} className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1">
                              <Edit3 size={13} /><span>Edit</span>
                            </button>
                            <button onClick={() => handleCancelOrder(msg.id)} className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1">
                              <XCircle size={13} /><span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STATE: APPROVING */}
                      {msg.order.state === 'APPROVING' && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-mono">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" />TRADER APPROVED</span>
                            <span className="text-emerald-500 font-bold">✓</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2">
                              {msg.order.approvalProgress === 'FINAL_VALIDATION' || msg.order.approvalProgress === 'SENDING_BROKER' ?
                                <CheckCircle2 size={14} className="text-emerald-500" /> : <RefreshCw size={14} className="text-blue-500 animate-spin" />}
                              FINAL VALIDATION
                            </span>
                            <span className="text-emerald-500">{(msg.order.approvalProgress === 'FINAL_VALIDATION' || msg.order.approvalProgress === 'SENDING_BROKER') ? '✓' : '...'}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="flex items-center gap-2"><RefreshCw size={14} className="text-amber-500 animate-spin" />BROKER GATEWAY</span>
                            <span className="text-amber-500">SENDING...</span>
                          </div>
                        </div>
                      )}

                      {/* STATE: FILLED */}
                      {msg.order.state === 'FILLED' && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={18} className="text-emerald-500" />
                              <span className="font-mono font-bold text-sm text-emerald-700">ORDER FILLED</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{msg.order.fillTime || 'Just now'}</span>
                          </div>
                          <div className="text-xs font-mono text-slate-600">✓ {msg.order.symbol} • {msg.order.quantity} shares • ₹{msg.order.price}</div>
                          <div className="pt-2 flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-mono">Executed on NSE via OMS</span>
                            <button onClick={() => onNavigateTab('orders')} className="text-blue-600 font-semibold hover:underline">View in Orders →</button>
                          </div>
                        </div>
                      )}

                      {/* STATE: PRICE CHANGED */}
                      {msg.order.state === 'PRICE_CHANGED' && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                          <div className="flex items-center gap-2 text-rose-700 font-mono font-bold text-xs">
                            <AlertTriangle size={15} />ORDER CONDITIONS CHANGED
                          </div>
                          <p className="text-xs text-slate-600">Market price shifted to <strong className="text-rose-600">₹{msg.order.newPrice}</strong> ({msg.order.priceDelta}) after approval. Order halted to prevent slippage.</p>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleAcceptNewPrice(msg.id)} className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                              REVIEW & ACCEPT NEW PRICE
                            </button>
                            <button onClick={() => handleCancelOrder(msg.id)} className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors">Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* STATE: CANCELLED */}
                      {msg.order.state === 'CANCELLED' && (
                        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-mono flex items-center justify-between">
                          <span>Order cancelled by trader. Nothing executed.</span>
                          <span className="text-rose-500 font-bold">CANCELLED</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MULTI-STEP PLAN */}
                  {msg.type === 'multi_plan' && (
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 max-w-lg space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2"><Layers size={15} className="text-blue-500" /><span className="font-mono text-xs font-bold text-slate-700">MULTI-STEP TRADE PLAN</span></div>
                        <StatusBadge status={msg.planStatus === 'WAITING_APPROVAL' ? 'WAITING FOR APPROVAL' : msg.planStatus === 'EXECUTING' ? 'PENDING' : 'FILLED'} />
                      </div>
                      <div className="space-y-2">
                        {msg.steps.map((step) => (
                          <div key={step.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2.5">
                              <span className="text-slate-400 font-bold">{step.id}.</span>
                              <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] border ${step.action === 'SELL' ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>{step.action}</span>
                              <span className="font-bold text-slate-800">{step.symbol}</span>
                              <span className="text-slate-400">Qty: {step.qty}</span>
                            </div>
                            <div>
                              {step.status === 'FILLED' && <span className="text-emerald-600 font-bold">✓ FILLED</span>}
                              {step.status === 'PARTIALLY_FILLED' && <span className="text-amber-600 font-bold">⚠ PARTIAL ({step.filled}/{step.qty})</span>}
                              {step.status === 'PENDING' && <span className="text-slate-400">Awaiting Approval</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                      {msg.planStatus === 'WAITING_APPROVAL' && (
                        <button onClick={() => handleApproveMultiPlan(msg.id)} className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                          <CheckCircle2 size={15} /><span>APPROVE FULL PLAN</span>
                        </button>
                      )}
                      {msg.planStatus === 'COMPLETED' && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-slate-600">
                          Step 1 fully filled. Step 2 partially filled (12/20 shares). Remaining 8 shares active in orderbook.
                        </div>
                      )}
                    </div>
                  )}

                  {/* AMBIGUOUS */}
                  {msg.type === 'ambiguous' && (
                    <div className="rounded-2xl bg-white border border-amber-200 shadow-sm p-4 max-w-sm space-y-3">
                      <div className="flex items-center gap-2 text-amber-600 font-mono font-bold text-xs"><AlertCircle size={15} />CLARIFICATION REQUIRED</div>
                      <p className="text-xs text-slate-700">{msg.text}</p>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-2 font-mono">Select share quantity to proceed:</span>
                        <div className="flex gap-2">
                          {[10, 20, 50, 100].map((qty) => (
                            <button key={qty} onClick={() => handleUserSubmit(`Buy ${qty} TCS at ₹3500`)} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-xs font-mono font-semibold text-slate-700 transition-all">
                              {qty}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STANDING CONFIRMATION */}
                  {msg.type === 'standing_confirmation' && (
                    <div className="rounded-2xl bg-white border border-indigo-200 shadow-sm p-4 max-w-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600">STANDING INSTRUCTION STAGED</span>
                        <StatusBadge status="MONITORING" size="xs" />
                      </div>
                      <p className="text-xs text-slate-600">Rule <strong>{msg.data.title}</strong> is active. When triggered, you'll be prompted for explicit approval before execution.</p>
                      <button onClick={() => onNavigateTab('standing')} className="text-[11px] text-blue-600 font-semibold hover:underline">Inspect in Standing Instructions →</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500"><Bot size={14} /></div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
              <span>Parsing intent & running safety checks...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggestion Pills */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-200">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-wider pl-1 flex-shrink-0">
          <Sparkles size={11} className="text-blue-500" />Quick:
        </span>
        {[
          { label: "Today's P&L", prompt: "What's my P&L today?" },
          { label: "Buy 20 TCS @ ₹3500", prompt: "Buy 20 TCS at ₹3500" },
          { label: "Multi-Step Plan", prompt: "Sell 10 TCS and buy 20 INFY" },
          { label: "Ambiguous: Buy some TCS", prompt: "Buy some TCS" },
          { label: "Price Shift Test", prompt: "Buy 20 TCS at ₹3500 (Simulate Price Shift)" },
          { label: "Standing Instruction", prompt: "Buy 10 INFY if price falls below ₹1500" },
        ].map((sug, idx) => (
          <button key={idx} onClick={() => handleUserSubmit(sug.prompt)} className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-600 font-medium whitespace-nowrap transition-all">
            {sug.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="pt-2">
        <form onSubmit={(e) => { e.preventDefault(); handleUserSubmit(); }} className="relative flex items-center">
          <input
            type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask your trading copilot... (e.g. 'Buy 20 TCS at ₹3500')"
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 font-sans shadow-sm transition-all"
          />
          <button type="submit" disabled={!inputVal.trim()} className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-sm">
            <Send size={14} />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-mono">
          <span>AI generates structured orders. You approve execution.</span>
          <span>Deterministic Safety Shield Active</span>
        </div>
      </div>
    </div>
  );
}
