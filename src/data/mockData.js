export const initialPortfolio = {
  todayPnL: 4280,
  todayPnLPercent: 1.82,
  totalPortfolio: 239400,
  availableFunds: 82500,
  openPositionsCount: 8,
};

export const marketTickers = [
  { symbol: "NIFTY 50", price: "24,852.15", change: "+0.64%", positive: true },
  { symbol: "SENSEX", price: "81,424.80", change: "+0.58%", positive: true },
  { symbol: "TCS", price: "3,514.50", change: "+1.12%", positive: true },
  { symbol: "INFY", price: "1,496.20", change: "-0.38%", positive: false },
  { symbol: "RELIANCE", price: "2,842.10", change: "+0.85%", positive: true },
  { symbol: "HDFCBANK", price: "1,678.90", change: "+0.24%", positive: true },
];

export const chartData1D = [
  { time: "09:15", value: 235120, pnl: 0 },
  { time: "10:00", value: 236200, pnl: 1080 },
  { time: "11:00", value: 235800, pnl: 680 },
  { time: "12:00", value: 237400, pnl: 2280 },
  { time: "13:00", value: 238100, pnl: 2980 },
  { time: "14:00", value: 237900, pnl: 2780 },
  { time: "15:00", value: 239100, pnl: 3980 },
  { time: "15:30", value: 239400, pnl: 4280 },
];

export const chartData1W = [
  { time: "Mon", value: 231000, pnl: -1200 },
  { time: "Tue", value: 233400, pnl: 1200 },
  { time: "Wed", value: 232800, pnl: 600 },
  { time: "Thu", value: 236500, pnl: 4300 },
  { time: "Fri", value: 239400, pnl: 7200 },
];

export const chartData1M = [
  { time: "Week 1", value: 224000, pnl: -2000 },
  { time: "Week 2", value: 229500, pnl: 3500 },
  { time: "Week 3", value: 234200, pnl: 8200 },
  { time: "Week 4", value: 239400, pnl: 13400 },
];

export const initialOrders = [
  {
    id: "#1024",
    symbol: "TCS",
    side: "BUY",
    quantity: 20,
    price: 3500,
    orderType: "LIMIT",
    product: "CNC",
    status: "FILLED",
    time: "12:41:10",
    date: "Today",
    exchange: "NSE",
    filledQty: 20,
    avgPrice: 3500.0,
    intentOrigin: "AI Copilot: 'Buy 20 TCS at ₹3500'",
    approvalType: "Explicit Trader One-Click Approval",
    checks: [
      { name: "Symbol verified", passed: true, detail: "NSE:TCS recognized" },
      { name: "Quantity valid", passed: true, detail: "Lot size 1, lot multiple valid" },
      { name: "Price valid", passed: true, detail: "Within circuit limits (₹3,150 - ₹3,850)" },
      { name: "Order structure valid", passed: true, detail: "LIMIT CNC format validated" },
      { name: "Margin checked", passed: true, detail: "₹70,000 required vs ₹82,500 available" }
    ],
    timeline: [
      { time: "12:41:02", title: "Order Requested", desc: "User typed: 'Buy 20 TCS at ₹3500'", actor: "USER" },
      { time: "12:41:03", title: "AI Interpreted Intent", desc: "Parsed BUY 20 TCS @ LIMIT 3500 CNC", actor: "AI_PARSER" },
      { time: "12:41:03", title: "Safety Validation Passed", desc: "Margin and circuit checks approved", actor: "SAFETY_ENGINE" },
      { time: "12:41:08", title: "Trader Approved", desc: "Trader explicitly confirmed execution token", actor: "TRADER" },
      { time: "12:41:08", title: "Final Revalidation", desc: "Verified market price did not slip > 0.5%", actor: "SAFETY_ENGINE" },
      { time: "12:41:09", title: "Sent to Broker", desc: "Dispatched via OMS/Fix API to NSE", actor: "BROKER_GATEWAY" },
      { time: "12:41:10", title: "Order Filled", desc: "Executed at ₹3500.00 (20/20 shares)", actor: "EXCHANGE" }
    ]
  },
  {
    id: "#1023",
    symbol: "INFY",
    side: "BUY",
    quantity: 10,
    price: 1500,
    orderType: "LIMIT",
    product: "CNC",
    status: "PENDING APPROVAL",
    time: "12:35:14",
    date: "Today",
    exchange: "NSE",
    filledQty: 0,
    avgPrice: 0,
    intentOrigin: "Standing Instruction Triggered",
    approvalType: "Awaiting Trader Explicit Approval",
    checks: [
      { name: "Symbol verified", passed: true, detail: "NSE:INFY recognized" },
      { name: "Quantity valid", passed: true, detail: "10 units within risk limits" },
      { name: "Price valid", passed: true, detail: "₹1500 near market price ₹1496" },
      { name: "Order structure valid", passed: true, detail: "Valid LIMIT CNC structure" },
      { name: "Margin checked", passed: true, detail: "₹15,000 required, sufficient funds" }
    ],
    timeline: [
      { time: "12:35:12", title: "Condition Triggered", desc: "Rule 'BUY INFY BELOW ₹1500' triggered", actor: "STANDING_ENGINE" },
      { time: "12:35:13", title: "AI Formatted Order", desc: "Structured LIMIT order prepared", actor: "AI_PARSER" },
      { time: "12:35:14", title: "Safety Pre-Checks Passed", desc: "Ready for trader confirmation", actor: "SAFETY_ENGINE" },
      { time: "12:35:14", title: "Waiting For Trader Approval", desc: "Execution paused. AI cannot auto-submit.", actor: "SAFETY_ENGINE" }
    ]
  },
  {
    id: "#1022",
    symbol: "RELIANCE",
    side: "SELL",
    quantity: 50,
    price: 2840,
    orderType: "LIMIT",
    product: "CNC",
    status: "PARTIALLY FILLED",
    time: "11:15:42",
    date: "Today",
    exchange: "NSE",
    filledQty: 25,
    avgPrice: 2840.0,
    intentOrigin: "AI Copilot: 'Sell half my Reliance position'",
    approvalType: "Trader Approved",
    checks: [
      { name: "Holdings verified", passed: true, detail: "50 shares available in demat" },
      { name: "Price valid", passed: true, detail: "Limit price ₹2840 matches orderbook" },
      { name: "Order structure valid", passed: true, detail: "Valid SELL CNC structure" }
    ],
    timeline: [
      { time: "11:15:30", title: "Order Requested", desc: "Copilot parsed sell command", actor: "USER" },
      { time: "11:15:35", title: "Trader Approved", desc: "Explicit trader consent", actor: "TRADER" },
      { time: "11:15:38", title: "Sent to Broker", desc: "Dispatched to NSE", actor: "BROKER_GATEWAY" },
      { time: "11:15:42", title: "Partially Filled", desc: "25/50 shares filled at ₹2840. Remaining 25 active.", actor: "EXCHANGE" }
    ]
  },
  {
    id: "#1021",
    symbol: "HDFCBANK",
    side: "BUY",
    quantity: 15,
    price: 1675,
    orderType: "LIMIT",
    product: "CNC",
    status: "FILLED",
    time: "10:04:19",
    date: "Today",
    exchange: "NSE",
    filledQty: 15,
    avgPrice: 1675.0,
    intentOrigin: "AI Copilot: 'Buy 15 HDFC Bank at ₹1675'",
    approvalType: "Trader Approved",
    checks: [
      { name: "Symbol verified", passed: true, detail: "NSE:HDFCBANK verified" },
      { name: "Margin checked", passed: true, detail: "₹25,125 reserved" }
    ],
    timeline: [
      { time: "10:04:10", title: "Order Requested", desc: "Prompt received", actor: "USER" },
      { time: "10:04:14", title: "Trader Approved", desc: "Confirmation received", actor: "TRADER" },
      { time: "10:04:19", title: "Order Filled", desc: "Full 15 shares executed at ₹1675", actor: "EXCHANGE" }
    ]
  }
];

export const initialStandingInstructions = [
  {
    id: "SI-101",
    title: "BUY INFY",
    symbol: "INFY",
    action: "BUY",
    quantity: 10,
    condition: "Price < ₹1500",
    status: "MONITORING",
    triggered: 0,
    lastChecked: "12:42:31",
    orderType: "LIMIT",
    targetPrice: 1500,
    notes: "Requires trader approval prompt when condition is met. AI will NOT auto-execute."
  },
  {
    id: "SI-102",
    title: "ALERT TCS",
    symbol: "TCS",
    action: "ALERT",
    quantity: null,
    condition: "Holding falls > 5%",
    status: "MONITORING",
    triggered: 0,
    lastChecked: "12:42:30",
    orderType: "NOTIFICATION",
    targetPrice: null,
    notes: "Send immediate priority alert if unrealized loss on TCS exceeds -5% from avg price."
  },
  {
    id: "SI-103",
    title: "PROFIT TARGET RELIANCE",
    symbol: "RELIANCE",
    action: "SELL",
    quantity: 25,
    condition: "Price >= ₹2900",
    status: "MONITORING",
    triggered: 1,
    lastChecked: "12:42:28",
    orderType: "LIMIT",
    targetPrice: 2900,
    notes: "Pre-staged limit order triggered once, waiting for trader final confirmation."
  }
];

export const initialActivityLogs = [
  {
    id: "ACT-892",
    time: "12:41:10",
    event: "FILLED",
    details: "TCS 20 shares executed at ₹3500.00 on NSE",
    actor: "BROKER / EXCHANGE",
    badgeType: "success",
    orderId: "#1024"
  },
  {
    id: "ACT-891",
    time: "12:41:09",
    event: "SENT TO BROKER",
    details: "Dispatched to broker OMS with idempotency key #idemp-9941a",
    actor: "GATEWAY",
    badgeType: "info",
    orderId: "#1024"
  },
  {
    id: "ACT-890",
    time: "12:41:08",
    event: "FINAL VALIDATION",
    details: "Re-verified market price slippage (0.00% delta). Circuit checks clean.",
    actor: "SAFETY ENGINE",
    badgeType: "success",
    orderId: "#1024"
  },
  {
    id: "ACT-889",
    time: "12:41:08",
    event: "TRADER APPROVED",
    details: "Explicit trader click recorded. Execution token generated.",
    actor: "HUMAN TRADER",
    badgeType: "approval",
    orderId: "#1024"
  },
  {
    id: "ACT-888",
    time: "12:41:03",
    event: "VALIDATION PASSED",
    details: "Deterministic safety check suite passed (5/5 checks clean)",
    actor: "SAFETY ENGINE",
    badgeType: "success",
    orderId: "#1024"
  },
  {
    id: "ACT-887",
    time: "12:41:03",
    event: "AI INTERPRETED REQUEST",
    details: "Structured intent: { action: 'BUY', symbol: 'TCS', qty: 20, price: 3500 }",
    actor: "AI COPILOT",
    badgeType: "ai",
    orderId: "#1024"
  },
  {
    id: "ACT-886",
    time: "12:41:02",
    event: "ORDER REQUESTED",
    details: "Trader input: 'Buy 20 TCS at ₹3500'",
    actor: "USER",
    badgeType: "user",
    orderId: "#1024"
  },
  {
    id: "ACT-885",
    time: "12:35:14",
    event: "STANDING INSTRUCTION TRIGGERED",
    details: "INFY dropped to ₹1496.20, triggering condition 'Price < ₹1500'",
    actor: "STANDING ENGINE",
    badgeType: "warning",
    orderId: "#1023"
  },
  {
    id: "ACT-884",
    time: "11:15:42",
    event: "PARTIALLY FILLED",
    details: "RELIANCE 25/50 shares filled at ₹2840. Order remains active for 25.",
    actor: "EXCHANGE",
    badgeType: "warning",
    orderId: "#1022"
  }
];
