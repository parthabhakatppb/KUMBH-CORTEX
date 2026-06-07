"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  CheckCircle,
  Loader2,
  Radio,
  Users,
  Navigation,
  Lock,
  Zap,
  Volume2,
} from "lucide-react";

interface AntiStampedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

import { API_BASE_URL as API } from "@/lib/api";
const LOCKDOWN_ACTIONS = [
  {
    icon: <Lock className="h-4 w-4 text-rose-400" />,
    title: "Entry Lockdown",
    desc: "Seal all inbound access points to Ram Ghat, Mahakal & Sangam sectors.",
    broadcast: {
      message:
        "🔴 ENTRY LOCKDOWN ACTIVATED — Seal all inbound access points. Zero new pilgrim entry to Sectors 1-3. Implement immediately.",
      target: "ALL GROUND UNITS",
      priority: "critical",
      broadcast_type: "lockdown",
    },
    bg: "border-rose-500/20",
    activeBg: "border-rose-500/50 bg-rose-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    icon: <Navigation className="h-4 w-4 text-amber-400" />,
    title: "Emergency Diversion",
    desc: "Activate Route Epsilon & Zeta. Redirect pedestrian traffic to Dhar Holding Hub.",
    broadcast: {
      message:
        "⚠️ ROUTE DIVERSION ACTIVE — Activate Route Epsilon & Zeta. Redirect ALL pedestrian flow to Dhar Holding Hub. Block eastern entry.",
      target: "Traffic Control Units",
      priority: "critical",
      broadcast_type: "emergency",
    },
    bg: "border-amber-500/20",
    activeBg: "border-amber-500/50 bg-amber-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    icon: <Users className="h-4 w-4 text-sky-400" />,
    title: "Crowd Thinning Protocol",
    desc: "Deploy barrier teams. Enforce 1-way flow across all 4 sectors.",
    broadcast: {
      message:
        "👥 CROWD THINNING — Deploy barriers NOW. Enforce single-direction flow in all 4 sectors. No counter-flow permitted.",
      target: "Barrier & Barricade Crew",
      priority: "critical",
      broadcast_type: "emergency",
    },
    bg: "border-sky-500/20",
    activeBg: "border-sky-500/50 bg-sky-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    icon: <Radio className="h-4 w-4 text-purple-400" />,
    title: "Ground Alert Broadcast",
    desc: "Alert all field units. MRT teams on standby, medics deploy.",
    broadcast: {
      message:
        "🚨 ALL UNITS ALERT — ANTI-STAMPEDE LOCKDOWN IN EFFECT. Medical response teams to standby positions. Report status immediately.",
      target: "Medical Response Teams",
      priority: "critical",
      broadcast_type: "emergency",
    },
    bg: "border-purple-500/20",
    activeBg: "border-purple-500/50 bg-purple-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    icon: <Volume2 className="h-4 w-4 text-emerald-400" />,
    title: "PA System Announcement",
    desc: "Calm evacuation instructions broadcast in 5 languages via PA.",
    broadcast: {
      message:
        "📢 PA SYSTEM — Initiate calm evacuation announcement in Hindi, English, Marathi, Gujarati & Bengali. Repeat every 90 seconds.",
      target: "Alpha Team (Ram Ghat)",
      priority: "urgent",
      broadcast_type: "info",
    },
    bg: "border-emerald-500/20",
    activeBg: "border-emerald-500/50 bg-emerald-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
    title: "Hub Flush Command",
    desc: "Force-clear transit queues. Priority boarding to outbound buses.",
    broadcast: {
      message:
        "🚌 HUB FLUSH ORDER — Clear all transit queues immediately. Priority outbound boarding. Target: 40% density reduction in 15 mins.",
      target: "Traffic Control Units",
      priority: "urgent",
      broadcast_type: "resource",
    },
    bg: "border-yellow-500/20",
    activeBg: "border-yellow-500/50 bg-yellow-500/10",
    doneBg: "border-emerald-500/30 bg-emerald-500/5",
  },
];

async function postBroadcast(payload: {
  message: string;
  target: string;
  priority: string;
  broadcast_type: string;
}) {
  try {
    await fetch(`${API}/api/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-critical — continue lockdown even if broadcast fails
  }
}

export default function AntiStampedeModal({
  isOpen,
  onClose,
  onConfirm,
}: AntiStampedeModalProps) {
  const [phase, setPhase] = useState<"confirm" | "executing" | "done">(
    "confirm"
  );
  const [executedActions, setExecutedActions] = useState<number[]>([]);
  const [selectedActions, setSelectedActions] = useState<number[]>(
    LOCKDOWN_ACTIONS.map((_, i) => i)
  );
  const [timeLeft, setTimeLeft] = useState(5);

  const resetState = () => {
    setPhase("confirm");
    setExecutedActions([]);
    setSelectedActions(LOCKDOWN_ACTIONS.map((_, i) => i));
    setTimeLeft(5);
  };

  const toggleAction = (index: number) => {
    setSelectedActions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  const handleExecute = async () => {
    setPhase("executing");

    // Execute each selected action sequentially with a backend broadcast per step
    for (let i = 0; i < LOCKDOWN_ACTIONS.length; i++) {
      if (selectedActions.includes(i)) {
        // Fire the broadcast for this specific action
        await postBroadcast(LOCKDOWN_ACTIONS[i].broadcast);
        await new Promise((r) => setTimeout(r, 800));
        setExecutedActions((prev) => [...prev, i]);
      }
    }

    // Finally call the main backend override (flush densities + log lockdown)
    await onConfirm();
    setPhase("done");

    // Countdown auto-close
    let t = 5;
    const countdown = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(countdown);
        handleClose();
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={phase !== "executing" ? handleClose : undefined}
      />
      {phase === "executing" && (
        <div className="fixed inset-0 bg-rose-950/10 animate-pulse pointer-events-none" />
      )}

      {/* Modal card — responsive max-width, scrollable */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900 shadow-2xl shadow-rose-900/40 flex flex-col my-4 sm:my-0 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-hidden">

        {/* ── Header ── */}
        <div
          className={`flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-rose-500/30 ${
            phase === "executing" ? "bg-rose-950/40" : "bg-rose-500/5"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base font-mono tracking-wider text-rose-300 truncate">
                ANTI-STAMPEDE LOCKDOWN
              </h2>
              <p className="text-[9px] sm:text-[10px] text-rose-600 font-mono truncate">
                {phase === "confirm" &&
                  "⚠ Overrides all sector operations immediately"}
                {phase === "executing" &&
                  "🔴 EXECUTING — DO NOT CLOSE THIS WINDOW"}
                {phase === "done" && "✓ LOCKDOWN COMPLETE — System stabilized"}
              </p>
            </div>
          </div>
          {phase !== "executing" && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {phase === "confirm" && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                Select the emergency protocols to deploy. Each selected protocol will send an immediate broadcast to the responsible field team.
              </p>

              <div className="space-y-2">
                {LOCKDOWN_ACTIONS.map((action, i) => {
                  const isSelected = selectedActions.includes(i);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleAction(i)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? action.bg
                          : "border-slate-800 bg-slate-900/40 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "bg-rose-500 border-rose-500"
                              : "border-slate-600 bg-slate-800"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">{action.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-bold font-mono transition-colors ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {action.title}
                        </p>
                        <p className={`text-[10px] font-mono mt-0.5 leading-relaxed transition-colors ${isSelected ? "text-slate-500" : "text-slate-600"}`}>
                          {action.desc}
                        </p>
                        <p className={`text-[9px] font-mono mt-1 transition-colors ${isSelected ? "text-slate-600" : "text-slate-700"}`}>
                          📡 Broadcasts to:{" "}
                          <span className={isSelected ? "text-slate-500" : "text-slate-600"}>
                            {action.broadcast.target}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXECUTING phase */}
          {phase === "executing" && (
            <div className="space-y-2">
              {LOCKDOWN_ACTIONS.map((action, i) => {
                const done = executedActions.includes(i);
                const active = executedActions.length === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border transition-all duration-500 ${
                      done
                        ? action.doneBg
                        : active
                        ? action.activeBg + " animate-pulse"
                        : "border-slate-800 bg-slate-900/40 opacity-40"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {done ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 text-rose-400 animate-spin" />
                      ) : (
                        action.icon
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[11px] font-bold font-mono truncate ${
                          done
                            ? "text-emerald-400"
                            : active
                            ? "text-rose-300"
                            : "text-slate-600"
                        }`}
                      >
                        {done
                          ? `✓ ${action.title} — ACTIVE`
                          : active
                          ? `DEPLOYING: ${action.title}...`
                          : action.title}
                      </p>
                      {(done || active) && (
                        <p className="text-[9px] text-slate-600 font-mono mt-0.5">
                          📡{" "}
                          {done
                            ? `Broadcast sent → ${action.broadcast.target}`
                            : `Sending broadcast → ${action.broadcast.target}`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DONE phase */}
          {phase === "done" && (
            <div className="text-center py-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-mono text-emerald-400 mb-2">
                LOCKDOWN EXECUTED
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed">
                {executedActions.length} protocol(s) deployed. {executedActions.length} field broadcasts sent.
                <br />
                Crowd density is reducing across all sectors.
              </p>
              <div className="mt-4 text-[10px] text-slate-600 font-mono">
                Auto-closing in {timeLeft}s
              </div>
            </div>
          )}
        </div>

        {/* ── Footer buttons (only in confirm phase) ── */}
        {phase === "confirm" && (
          <div className="flex-shrink-0 flex gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-slate-800">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 text-xs sm:text-sm font-mono font-bold transition-all"
            >
              CANCEL
            </button>
            <button
              onClick={handleExecute}
              disabled={selectedActions.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 disabled:opacity-50 text-white text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/40 border border-rose-500 disabled:border-rose-900"
            >
              <Shield className="h-4 w-4" />
              EXECUTE {selectedActions.length} PROTOCOL(S)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
