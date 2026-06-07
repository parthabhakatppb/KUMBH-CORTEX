"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Radio,
  Send,
  X,
  Megaphone,
  AlertTriangle,
  Package,
  Shield,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

import { API_BASE_URL as API } from "@/lib/api";
interface ServerBroadcast {
  id: string;
  message: string;
  target: string;
  priority: string;
  broadcast_type: "emergency" | "resource" | "info" | "lockdown";
  sent_at: string;
  status: string;
}

interface BroadcastPanelProps {
  isOpen: boolean;
  onClose: () => void;
  threatLevel: string;
}

const PRESET_MESSAGES = {
  emergency: [
    "🚨 STAMPEDE RISK DETECTED at Ram Ghat — Clear the sector NOW. All ground teams to positions.",
    "🏥 Medical emergency at Sector 2 (Mahakal). Dispatch MRT-Alpha immediately.",
    "⚠️ Crowd surge detected. Activate Route Delta diversion. Block eastern entry points.",
    "🔴 CRITICAL: Unsafe density at Sangam Ghat. Mobilize crowd control barriers.",
  ],
  resource: [
    "💧 Deploy water distribution unit to Ram Ghat. Estimated 50,000 pilgrims en route.",
    "💡 Request additional lighting at Sector 3. Night operations commencing.",
    "🩺 Medical supplies needed at Hub Dewas Transit. Restock kits now.",
    "🚧 Barrier team required at Indore Highway junction. Divert vehicle flow.",
  ],
};

const TARGETS = [
  "ALL GROUND UNITS",
  "Alpha Team (Ram Ghat)",
  "Bravo Team (Mahakal)",
  "Charlie Team (Sangam)",
  "Delta Team (Dutt Akhada)",
  "Medical Response Teams",
  "Traffic Control Units",
  "Barrier & Barricade Crew",
  "VIP Security Detail",
];

const TYPE_COLORS: Record<string, string> = {
  emergency: "border-rose-500/40 bg-rose-500/5",
  resource: "border-sky-500/40 bg-sky-500/5",
  info: "border-slate-600/40 bg-slate-800/40",
  lockdown: "border-purple-500/40 bg-purple-500/5",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  emergency: <AlertTriangle className="h-3 w-3 text-rose-400" />,
  resource: <Package className="h-3 w-3 text-sky-400" />,
  info: <Megaphone className="h-3 w-3 text-slate-400" />,
  lockdown: <Shield className="h-3 w-3 text-purple-400" />,
};

function formatTime(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

export default function BroadcastPanel({
  isOpen,
  onClose,
  threatLevel,
}: BroadcastPanelProps) {
  const [tab, setTab] = useState<"compose" | "emergency" | "resource">(
    "compose"
  );
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState(TARGETS[0]);
  const [priority, setPriority] = useState<"normal" | "urgent" | "critical">(
    "normal"
  );
  const [serverLog, setServerLog] = useState<ServerBroadcast[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch broadcast log from backend
  const fetchLog = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/broadcasts`);
      const data = await res.json();
      if (data.status === "success") setServerLog(data.broadcasts);
    } catch {
      // Backend might not be ready yet
    }
  }, []);

  // Poll log every 3s while panel is open
  useEffect(() => {
    if (!isOpen) return;
    fetchLog();
    const interval = setInterval(fetchLog, 3000);
    return () => clearInterval(interval);
  }, [isOpen, fetchLog]);

  // Auto-populate on critical threat
  useEffect(() => {
    if (threatLevel === "CRITICAL" && tab === "compose" && message === "") {
      setMessage(PRESET_MESSAGES.emergency[0]);
      setPriority("critical");
    }
  }, [threatLevel, isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await fetch(`${API}/api/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          target,
          priority,
          broadcast_type:
            priority === "critical"
              ? "emergency"
              : tab === "resource"
              ? "resource"
              : "info",
        }),
      });
      await fetchLog();
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 2500);
    } catch (err) {
      console.error("Broadcast failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handlePreset = (msg: string, type: "emergency" | "resource") => {
    setMessage(msg);
    setPriority(type === "emergency" ? "critical" : "urgent");
    setTab("compose");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLog();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 flex flex-col my-4 sm:my-0 max-h-[85dvh] sm:max-h-[90vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-xs sm:text-sm font-mono tracking-wider text-slate-100 truncate">
                FIELD BROADCAST SYSTEM
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
                Secured comm — All ground units reachable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <Radio className="h-3 w-3 animate-pulse" />
              <span className="hidden sm:inline">LIVE</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Body: responsive flex col on mobile, row on sm+ ── */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-y-auto sm:overflow-hidden">

          {/* LEFT: Compose */}
          <div className="flex-none sm:flex-1 p-4 sm:p-5 flex flex-col gap-4 sm:overflow-y-auto sm:border-r border-slate-800">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg flex-shrink-0">
              {(["compose", "emergency", "resource"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-mono font-bold rounded-md transition-all ${
                    tab === t
                      ? t === "emergency"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : t === "resource"
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  {t === "compose"
                    ? "COMPOSE"
                    : t === "emergency"
                    ? "🚨 EMERGENCY"
                    : "📦 RESOURCE"}
                </button>
              ))}
            </div>

            {tab === "compose" ? (
              <>
                {/* Target */}
                <div className="flex-shrink-0">
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block">
                    BROADCAST TARGET
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  >
                    {TARGETS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="flex-shrink-0">
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block">
                    PRIORITY LEVEL
                  </label>
                  <div className="flex gap-2">
                    {(["normal", "urgent", "critical"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-mono font-bold rounded-lg border transition-all ${
                          priority === p
                            ? p === "critical"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                              : p === "urgent"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-slate-900 text-slate-600 border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col flex-none sm:flex-1 sm:min-h-0">
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block flex-shrink-0">
                    MESSAGE
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your broadcast message here..."
                    className="min-h-[120px] sm:flex-1 sm:min-h-[80px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none placeholder-slate-700"
                  />
                  <p className="text-[9px] text-slate-700 mt-1 font-mono flex-shrink-0">
                    {message.length}/500 chars
                  </p>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className={`flex-shrink-0 w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all font-mono tracking-wider border ${
                    sent
                      ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                      : priority === "critical"
                      ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-900/30 disabled:opacity-50"
                      : priority === "urgent"
                      ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-500 disabled:opacity-50"
                      : "bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-500/60 disabled:opacity-50"
                  }`}
                >
                  {sent ? (
                    <>
                      <CheckCircle className="h-4 w-4" /> BROADCAST SENT
                    </>
                  ) : isSending ? (
                    <>
                      <Radio className="h-4 w-4 animate-pulse" />{" "}
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> BROADCAST TO{" "}
                      {target.split("(")[0].trim()}
                    </>
                  )}
                </button>
              </>
            ) : (
              /* Presets */
              <div className="space-y-2 overflow-y-auto">
                <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">
                  {tab === "emergency"
                    ? "SELECT EMERGENCY PRESET"
                    : "SELECT RESOURCE PRESET"}
                </p>
                {(tab === "emergency"
                  ? PRESET_MESSAGES.emergency
                  : PRESET_MESSAGES.resource
                ).map((msg, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handlePreset(msg, tab as "emergency" | "resource")
                    }
                    className={`w-full text-left p-3 rounded-lg border text-[10px] sm:text-[11px] font-mono transition-all ${
                      tab === "emergency"
                        ? "border-rose-500/20 bg-rose-500/5 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10"
                        : "border-sky-500/20 bg-sky-500/5 text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/10"
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Server Broadcast Log */}
          <div className="flex-none sm:w-60 border-t sm:border-t-0 sm:border-l border-slate-800 p-4 flex flex-col gap-2 sm:overflow-hidden">
            <div className="flex items-center justify-between flex-shrink-0">
              <h3 className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                BROADCAST LOG
              </h3>
              <button
                onClick={handleRefresh}
                className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-400 transition-colors"
                title="Refresh log"
              >
                <RefreshCw
                  className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[100px] sm:min-h-0">
              {serverLog.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[10px] text-slate-700 font-mono text-center py-8">
                  No broadcasts yet
                </div>
              ) : (
                serverLog.map((b) => (
                  <div
                    key={b.id}
                    className={`rounded-lg border p-2 ${
                      TYPE_COLORS[b.broadcast_type] ?? TYPE_COLORS.info
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        {TYPE_ICONS[b.broadcast_type] ?? TYPE_ICONS.info}
                        <span className="text-[9px] font-mono font-bold text-slate-400 truncate max-w-[90px]">
                          {b.target.split("(")[0].trim()}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-emerald-500">
                        <CheckCircle className="h-2.5 w-2.5" />
                        <span className="text-[8px] font-mono">TX</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono leading-relaxed line-clamp-2">
                      {b.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-2 w-2 text-slate-700" />
                      <p className="text-[8px] text-slate-700 font-mono">
                        {formatTime(b.sent_at)}
                      </p>
                      <span
                        className={`ml-auto text-[8px] font-mono font-bold px-1 rounded ${
                          b.priority === "critical"
                            ? "text-rose-400"
                            : b.priority === "urgent"
                            ? "text-amber-400"
                            : "text-slate-600"
                        }`}
                      >
                        {b.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
