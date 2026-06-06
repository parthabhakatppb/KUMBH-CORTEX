"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  X,
  ShieldAlert,
  Radio,
  Brain,
  Zap,
  Navigation,
  Shield,
  CheckCircle,
  AlertTriangle,
  Activity,
  Map,
  BarChart3,
  ArrowRight,
  Layers,
  Target,
  ChevronRight,
} from "lucide-react";

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "workflow" | "components" | "guide">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-[90vw] max-w-[820px] max-h-[85vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wider font-mono">
                KUMBH-CORTEX COMMAND GUIDE
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">
                System Operations Manual v1.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 shrink-0">
          {[
            { id: "overview" as const, label: "OVERVIEW", icon: Shield },
            { id: "workflow" as const, label: "HOW IT WORKS", icon: Activity },
            { id: "components" as const, label: "DASHBOARD", icon: Layers },
            { id: "guide" as const, label: "QUICK START", icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-mono font-bold tracking-wider border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {activeTab === "overview" && (
            <>
              {/* Mission Statement */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-sky-500/5 border border-emerald-500/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Mission Statement
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-100">Kumbh-Cortex</strong> is a predictive,
                  AI-driven tactical command interface designed for the{" "}<strong className="text-sky-400">Ujjain Mahakumbh 2028</strong> — 
                  a mega-event expecting <strong className="text-amber-400">300 million pilgrims</strong>. 
                  Instead of just showing alerts, this system uses real-time crowd telemetry, 
                  feeds incidents to an AI reasoning engine (GPT-4o-mini), and outputs complete, 
                  3-pronged action strategies for event commanders to execute.
                </p>
              </div>

              {/* Architecture */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-3 tracking-wider font-mono flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-sky-400" />
                  SYSTEM ARCHITECTURE
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      title: "Simulation Engine",
                      desc: "Python backend generates realistic crowd telemetry — density drifts, crowd surges, and incident events across 4 sectors and 3 transit hubs.",
                      color: "sky",
                      icon: Activity,
                    },
                    {
                      title: "AI Reasoning Core",
                      desc: "OpenAI GPT-4o-mini receives incidents with live telemetry context and outputs structured 3-pronged strategies in strict JSON format.",
                      color: "purple",
                      icon: Brain,
                    },
                    {
                      title: "Command Dashboard",
                      desc: "Next.js frontend polls every 2.5s, rendering dual-scale tactical maps, time-series analytics, customizable lockdown protocols, and an integrated field broadcast network. Fully responsive and network-accessible for cross-device testing.",
                      color: "emerald",
                      icon: Map,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`bg-slate-900/60 border border-slate-800 rounded-xl p-3.5`}
                    >
                      <div className={`h-7 w-7 rounded-lg bg-${item.color}-500/10 flex items-center justify-center mb-2`}>
                        <item.icon className={`h-3.5 w-3.5 text-${item.color}-400`} />
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-200 mb-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Three-Pronged Strategy */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-3 tracking-wider font-mono flex items-center gap-2">
                  <Brain className="h-3.5 w-3.5 text-purple-400" />
                  THE OMNI-STRATEGY MODEL
                </h3>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Every AI-generated strategy contains three coordinated actions designed to work simultaneously at different scales:
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      icon: Zap,
                      color: "emerald",
                      title: "Micro-Action (Local Response)",
                      desc: "Immediate on-ground deployment — volunteer squads, medical units, barrier adjustments, corridor clearing within the affected ghat sector.",
                    },
                    {
                      icon: Navigation,
                      color: "sky",
                      title: "Macro-Action (Regional Throttle)",
                      desc: "Highway and transit control — throttling shuttle departures from satellite hubs (Indore, Dewas, Dhar), rerouting traffic, and implementing hold orders.",
                    },
                    {
                      icon: ShieldAlert,
                      color: "purple",
                      title: "Preventative Action (Proactive Shield)",
                      desc: "Crowd pacification and resource pre-positioning — PA announcements, water distribution, entertainment activation at holding zones to prevent cascading failures.",
                    },
                  ].map((action) => (
                    <div
                      key={action.title}
                      className="flex gap-3 bg-slate-900/40 border border-slate-800/60 rounded-lg p-3"
                    >
                      <div className={`h-6 w-6 rounded-md bg-${action.color}-500/10 flex items-center justify-center shrink-0 mt-0.5`}>
                        <action.icon className={`h-3.5 w-3.5 text-${action.color}-400`} />
                      </div>
                      <div>
                        <h4 className={`text-[11px] font-bold text-${action.color}-400 mb-0.5`}>
                          {action.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{action.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "workflow" && (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-3 tracking-wider font-mono flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  DATA PIPELINE — HOW AN INCIDENT IS RESOLVED
                </h3>
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  Here's the complete end-to-end flow from incident detection to resolution:
                </p>
              </div>

              {/* Pipeline Steps */}
              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    title: "Telemetry Ingestion",
                    desc: "The Python simulation engine continuously updates crowd density for 4 sectors (Ram Ghat, Mahakal Temple, Triveni Sangam, Dutt Akhada) and occupancy for 3 satellite transit hubs (Indore, Dewas, Dhar). Data drifts realistically with occasional crowd surges.",
                    color: "sky",
                    detail: "Polling: Every 2.5 seconds | History: Last 20 data points retained",
                  },
                  {
                    step: "02",
                    title: "Incident Detection",
                    desc: "When you click 'Inject Simulated Emergency Vector', the backend randomly selects from 10 incident types (stampede warning, fire hazard, VIP disruption, medical emergency, flood warning, etc.) and spikes crowd density at the affected sector.",
                    color: "amber",
                    detail: "Density spike: +8% to +15% at incident location",
                  },
                  {
                    step: "03",
                    title: "AI Strategy Generation",
                    desc: "The incident description PLUS all current telemetry data (sector densities, hub loads, transit status) is sent to OpenAI GPT-4o-mini. The AI sees the full system state and generates a context-aware 3-pronged Omni-Strategy in strict JSON format.",
                    color: "purple",
                    detail: "Model: GPT-4o-mini | Format: Structured JSON Output",
                  },
                  {
                    step: "04",
                    title: "Strategy Card Displayed",
                    desc: "The AI response appears as an interactive card in the Cortex Feed panel. It shows the severity (CRITICAL/WARNING), the triggering incident, and all three action components with clear instructions.",
                    color: "rose",
                    detail: "Cards appear with entrance animation | Capped at 10 active",
                  },
                  {
                    step: "05",
                    title: "Commander Executes Strategy",
                    desc: "When you click 'Authorize & Execute Omni-Strategy', the backend simulates remediation: crowd density drops 12-20% at the target sector, a random hub gets pressure relief, and the incident counter increments.",
                    color: "emerald",
                    detail: "Density reduction: -12% to -20% | Hub relief: -1,000 to -3,000",
                  },
                ].map((step) => (
                  <div
                    key={step.step}
                    className="flex gap-4 bg-slate-900/40 border border-slate-800/60 rounded-xl p-4"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-${step.color}-500/10 border border-${step.color}-500/20 flex items-center justify-center shrink-0`}>
                      <span className={`text-sm font-bold font-mono text-${step.color}-400`}>
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold text-slate-200 mb-1 flex items-center gap-2">
                        {step.title}
                        {parseInt(step.step) < 5 && (
                          <ArrowRight className="h-3 w-3 text-slate-600" />
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-1.5">{step.desc}</p>
                      <div className="text-[9px] font-mono text-slate-600 bg-slate-950/60 px-2 py-1 rounded inline-block">
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continuous Loop */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mt-2">
                <h4 className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Activity className="h-3 w-3 animate-pulse" />
                  CONTINUOUS MONITORING LOOP
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  The dashboard never stops. Every 2.5 seconds, it fetches fresh telemetry, updates the tactical map,
                  refreshes time-series charts, and re-evaluates the system threat level. The radar sweep on the map 
                  visualizes this constant scanning cycle. Crowd densities drift naturally, so sectors can escalate from 
                  NORMAL → WARNING → CRITICAL even without manual incident injection.
                </p>
              </div>
            </>
          )}

          {activeTab === "components" && (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-3 tracking-wider font-mono flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-sky-400" />
                  DASHBOARD COMPONENTS GUIDE
                </h3>
              </div>

              <div className="space-y-3">
                {/* Status Strip */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    Status Strip (Top Bar)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="text-slate-400">
                        <strong className="text-slate-300">Threat Level:</strong> Computed from all sector densities (LOW → ELEVATED → HIGH → CRITICAL)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="text-slate-400">
                        <strong className="text-slate-300">Pilgrim Count:</strong> Running total of estimated pilgrims at the event (millions)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="text-slate-400">
                        <strong className="text-slate-300">Active/Resolved:</strong> Count of unresolved incident strategies vs. executed ones
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="text-slate-400">
                        <strong className="text-slate-300">Stampede Probability:</strong> Global AI-computed index (0-100%) indicating immediate risk of crowd collapse
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="text-slate-400">
                        <strong className="text-slate-300">Connection:</strong> LINKED (connected to backend) or SEVERED (connection lost)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tactical Map */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Map className="h-3.5 w-3.5 text-sky-400" />
                    Tactical Radar Map (Left Panel)
                  </h4>
                  <div className="space-y-2 text-[10px] text-slate-400">
                    <p className="leading-relaxed">
                      <strong className="text-emerald-400">MICRO View (Ujjain Ghats):</strong> Shows 4 ghat sectors as circles. 
                      The rotating radar sweep scans continuously. Circle color indicates status: 
                      <span className="text-emerald-400"> green</span>=normal, 
                      <span className="text-amber-400"> amber</span>=warning (75-85%), 
                      <span className="text-rose-400"> red</span>=critical (&gt;85%).
                      Circles fill up proportionally to density. Critical sectors pulse with expanding rings.
                      The blue flowing line represents the Shipra River.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-sky-400">MACRO View (Transit Grid):</strong> Shows 3 satellite highway hubs 
                      connected to the Ujjain core by animated transit routes. Data particles flow along routes.
                      Progress bars show capacity utilization. Status colors: FLUID (green) → MODERATE (blue) → HEAVY (amber) → BLOCKED (red).
                    </p>
                    <p className="text-slate-500 leading-relaxed italic">
                      Hover over any node for detailed stats.
                    </p>
                  </div>
                </div>

                {/* Metrics Panel */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-rose-400" />
                    Analytics Panel (Bottom Left)
                  </h4>
                  <div className="space-y-2 text-[10px] text-slate-400">
                    <p className="leading-relaxed">
                      <strong className="text-rose-400">Sector Density Stream (Top Left Chart):</strong> Real-time area chart showing 
                      density % over the last 20 data points (~50 seconds) for all 4 sectors. The red dashed line at 85% marks 
                      the CRITICAL threshold. The amber dashed line at 75% marks WARNING.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-amber-400">Surge Velocity (Middle Chart):</strong> Line chart tracking the rate-of-change of crowd density. Spikes indicate dangerous rapid accumulation even if total density is still below critical levels.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-sky-400">Hub Load Distribution (Bottom Chart):</strong> Bar chart showing current 
                      capacity utilization (%) for each satellite hub. Bars change color based on load level.
                    </p>
                  </div>
                </div>

                {/* Cortex Feed */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-purple-400" />
                    Cortex AI Feed (Right Panel)
                  </h4>
                  <div className="space-y-2 text-[10px] text-slate-400">
                    <p className="leading-relaxed">
                      <strong className="text-emerald-400">Inject Button:</strong> Triggers a simulated emergency. 
                      Shows "AI PROCESSING..." while GPT-4o-mini generates the strategy (usually 2-4 seconds).
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-slate-300">Strategy Cards:</strong> Each card shows the incident trigger, 
                      severity badge, and all 3 strategy actions. Cards animate in from the right.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-emerald-400">Execute Button:</strong> Authorizes and deploys the strategy. 
                      The backend simulates remediation (crowd density drops, hub pressure eased), the card disappears, 
                      and the resolved counter increments.
                    </p>
                  </div>
                </div>

                {/* Field Broadcast & Override */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-[11px] font-bold text-slate-200 mb-2 flex items-center gap-2">
                    <Radio className="h-3.5 w-3.5 text-emerald-400" />
                    Field Communications & Override
                  </h4>
                  <div className="space-y-2 text-[10px] text-slate-400">
                    <p className="leading-relaxed">
                      <strong className="text-emerald-400">Field Broadcast Network:</strong> Integrated radio panel to send targeted messages (Emergency, Resource, Info) to specific field teams. Features a live server-synced broadcast log.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-rose-400">Customizable Anti-Stampede Lockdown:</strong> A massive red override button that triggers a customizable checklist of 6 emergency protocols. Select specific actions (e.g., Hub Flush, Medical Dispatch) to deploy targeted broadcasts and system-wide density reductions instantly.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "guide" && (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-3 tracking-wider font-mono flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-emerald-400" />
                  QUICK START — DEMO WALKTHROUGH
                </h3>
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  Follow these steps to run a full crisis simulation for hackathon judges:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Observe the Baseline",
                    desc: "Watch the dashboard for 10-15 seconds. Notice the radar sweep scanning sectors, density values drifting naturally, and time-series charts filling up. The system threat level in the status bar reflects aggregate crowd pressure.",
                    tip: "Look at the top status strip — threat level may shift between LOW, ELEVATED, and HIGH as densities drift.",
                  },
                  {
                    step: "2",
                    title: "Toggle Map Views",
                    desc: "Click 'MICRO: UJJAIN GHATS' and 'MACRO: TRANSIT GRID' buttons on the map to switch between local sector monitoring and regional hub oversight. Explain to judges that both scales operate simultaneously.",
                    tip: "In MACRO view, watch the animated particles flowing from hubs to Ujjain — this represents pilgrim transit flow.",
                  },
                  {
                    step: "3",
                    title: "Inject an Emergency",
                    desc: "Click the green 'Inject Simulated Emergency Vector' button. Watch the AI PROCESSING spinner — GPT-4o-mini is generating a real AI strategy based on current system state. A new strategy card will appear in 2-4 seconds.",
                    tip: "Notice how the sector density spikes at the incident location on the map — the circles may turn red.",
                  },
                  {
                    step: "4",
                    title: "Read the AI Strategy",
                    desc: "Examine the strategy card carefully. Point out to judges: the AI generated a specific strategy title, assessed severity, and created three coordinated actions — Micro (local), Macro (regional), and Preventative (proactive).",
                    tip: "The AI's strategy references actual sector names and hub statuses because it receives live telemetry context!",
                  },
                  {
                    step: "5",
                    title: "Deploy Custom Lockdown",
                    desc: "Click the red 'ANTI-STAMPEDE LOCKDOWN' button. Toggle the exact emergency protocols needed for the current situation (e.g., disable 'Hub Flush' if the issue is only at the Ghats), and hit Execute to send targeted field broadcasts.",
                    tip: "Show judges how the checkboxes allow for a flexible, tailored response rather than a rigid hardcoded sequence.",
                  },
                  {
                    step: "6",
                    title: "Send Field Broadcast",
                    desc: "Use the Field Broadcast Network panel to dispatch a targeted message (e.g., 'Deploy medical kits to Sector 2'). The message posts to the backend and appears in the real-time server log.",
                    tip: "This demonstrates complete end-to-end communication capabilities within the command center.",
                  },
                  {
                    step: "7",
                    title: "Demonstrate Scale",
                    desc: "Inject 3-4 incidents rapidly to show the system handling multiple concurrent crises. Each gets a unique AI strategy. Execute them one by one, showing how each resolution stabilizes different sectors.",
                    tip: "The CRITICAL threat level badge will pulse red — perfect for showing the system under maximum pressure.",
                  },
                ].map((step) => (
                  <div
                    key={step.step}
                    className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-400">{step.step}</span>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-200 mb-1">{step.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-1.5">{step.desc}</p>
                        <div className="flex items-start gap-1.5 text-[9px] text-emerald-400/70">
                          <span className="font-bold shrink-0">💡 TIP:</span>
                          <span>{step.tip}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Note for Judges */}
              <div className="bg-sky-500/5 border border-sky-500/10 rounded-xl p-4 mt-2">
                <h4 className="text-[11px] font-bold text-sky-400 mb-2 flex items-center gap-2">
                  <Layers className="h-3 w-3" />
                  KEY TECH HIGHLIGHTS FOR JUDGES
                </h4>
                <ul className="space-y-1.5 text-[10px] text-slate-400">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">OpenAI Structured Outputs</strong> — AI returns strict JSON matching our Pydantic schema, guaranteeing UI never breaks from malformed responses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Context-Aware AI</strong> — The LLM receives live telemetry so its strategies reference actual sector states and hub loads.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Dual-Scale Architecture</strong> — Simultaneous micro (local ghat) and macro (regional transit) monitoring reflects real crowd management practice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Graceful Degradation</strong> — If OpenAI API fails, the system seamlessly falls back to a pool of pre-generated strategies so the demo never breaks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Network Topology Ready</strong> — The frontend dynamically binds to the host IP, allowing judges to test the dashboard directly on their mobile phones by connecting to the local Wi-Fi.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-center text-[10px] text-slate-600 font-mono tracking-wider">
            KUMBH-CORTEX v1.0 — MAHAKUMBH 2028 COMMAND CENTER
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
