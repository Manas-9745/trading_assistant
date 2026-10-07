import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import OrderDetailDrawer from './components/OrderDetailDrawer';

import DashboardView from './views/DashboardView';
import CopilotView from './views/CopilotView';
import OrdersView from './views/OrdersView';
import StandingInstructionsView from './views/StandingInstructionsView';
import SafetyCenterView from './views/SafetyCenterView';
import ActivityView from './views/ActivityView';

import {
  initialOrders,
  initialStandingInstructions,
  initialActivityLogs
} from './data/mockData';
import { useState } from 'react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [orders, setOrders] = useState(initialOrders);
  const [standingInstructions, setStandingInstructions] = useState(initialStandingInstructions);
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    const newLog = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: 'ORDER FILLED',
      details: `${newOrder.symbol} ${newOrder.quantity} shares executed at ₹${newOrder.price} on NSE`,
      actor: 'BROKER / EXCHANGE',
      badgeType: 'success',
      orderId: newOrder.id
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleAddInstruction = (newInstruction) => {
    setStandingInstructions((prev) => [newInstruction, ...prev]);
  };

  const handleSimulateInstructionTrigger = (instruction) => {
    setStandingInstructions((prev) =>
      prev.map((item) =>
        item.id === instruction.id
          ? { ...item, triggered: item.triggered + 1, lastChecked: 'Just now' }
          : item
      )
    );
    const triggerLog = {
      id: `ACT-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: 'STANDING INSTRUCTION TRIGGERED',
      details: `${instruction.symbol} met condition: ${instruction.condition}. Pre-staged order awaiting human approval.`,
      actor: 'STANDING ENGINE',
      badgeType: 'warning',
      orderId: '#1023'
    };
    setActivityLogs((prev) => [triggerLog, ...prev]);
  };

  const handleSelectScenario = (scenarioId) => {
    setCurrentTab('copilot');
    setActiveScenario(scenarioId);
    setTimeout(() => { setActiveScenario(null); }, 200);
  };

  const handleResetDemo = () => {
    setOrders(initialOrders);
    setStandingInstructions(initialStandingInstructions);
    setActivityLogs(initialActivityLogs);
    setActiveScenario(null);
    setCurrentTab('dashboard');
  };

  const handlePromptCopilot = (promptText) => {
    setCurrentTab('copilot');
    if (promptText.includes('20 TCS')) handleSelectScenario('standard');
    else if (promptText.includes('Sell 10 TCS')) handleSelectScenario('multistep');
    else if (promptText.includes('some TCS')) handleSelectScenario('ambiguous');
    else setActiveScenario(null);
  };

  const pendingApprovalCount = orders.filter(
    (o) => o.status === 'PENDING APPROVAL' || o.status === 'WAITING FOR APPROVAL'
  ).length;

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      <Sidebar currentTab={currentTab} setTab={setCurrentTab} pendingCount={pendingApprovalCount} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onSelectScenario={handleSelectScenario} activeScenario={activeScenario} resetDemo={handleResetDemo} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f0f4f8]">
          {currentTab === 'dashboard' && (
            <DashboardView orders={orders} standingInstructions={standingInstructions}
              onNavigateTab={setCurrentTab} onSelectOrder={setSelectedOrder} onPromptCopilot={handlePromptCopilot} />
          )}
          {currentTab === 'copilot' && (
            <CopilotView onOrderCreated={handleOrderCreated} activeScenario={activeScenario} onNavigateTab={setCurrentTab} />
          )}
          {currentTab === 'orders' && (
            <OrdersView orders={orders} onSelectOrder={setSelectedOrder} />
          )}
          {currentTab === 'standing' && (
            <StandingInstructionsView standingInstructions={standingInstructions}
              onAddInstruction={handleAddInstruction} onSimulateTrigger={handleSimulateInstructionTrigger} onNavigateTab={setCurrentTab} />
          )}
          {currentTab === 'safety' && <SafetyCenterView />}
          {currentTab === 'activity' && <ActivityView logs={activityLogs} />}
        </main>
      </div>

      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
