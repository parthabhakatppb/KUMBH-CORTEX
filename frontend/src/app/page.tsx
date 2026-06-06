"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ShieldAlert,
  Activity,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wifi,
  Shield,
  HelpCircle,
} from "lucide-react";
import MapView from "@/components/MapView";
import CortexFeed from "@/components/CortexFeed";
import MetricsPanel from "@/components/MetricsPanel";
import HelpPanel from "@/components/HelpPanel";
import BroadcastPanel from "@/components/BroadcastPanel";
import AntiStampedeModal from "@/components/AntiStampedeModal";
import {
  fetchTelemetryVitals,
  fetchSystemStatus,
  fetchHistory,
  triggerSimulatedIncident,
  executeOmniStrategy,
  API_BASE_URL,
} from "@/lib/api";

interface SystemStatus {
  threat_level: string;
  total_pilgrims: number;
  active_incidents: number;
  incidents_resolved: number;
  uptime: string;
}

interface HistoryTick {
  tick: number;
  timestamp: string;
  sectors: Record<string, { density: number; status: string }>;
  hubs: Record<string, { occupancy: number; status: string }>;
}

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [history, setHistory] = useState<HistoryTick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");
  const [isHelpOpen, setIsHelpOpen] = useState(true);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isLockdownOpen, setIsLockdownOpen] = useState(false);
  const prevStrategiesCount = useRef(0);

  const fetchAll = useCallback(async () => {
    try {
      const [vitalsRes, statusRes, historyRes] = await Promise.all([
        fetchTelemetryVitals(),
        fetchSystemStatus(),
        fetchHistory(),
      ]);

      if (vitalsRes.status === "success") {
        setTelemetry(vitalsRes.telemetry);
        setStrategies(vitalsRes.active_strategies);
      }
      setSystemStatus(statusRes);
      if (historyRes.status === "success") {
        setHistory(historyRes.history);
      }
      setConnectionStatus("connected");
    } catch (err) {
      console.error("Telemetry link decoupled:", err);
      setConnectionStatus("disconnected");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 2500);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Automated Spontaneous Alerts Loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerAutoEvent = async () => {
      try {
        await triggerSimulatedIncident();
        await fetchAll();
      } catch (e) {
        console.error("Auto-incident error", e);
      }

      // Schedule next event (45s to 90s interval for variety)
      const nextDelay = Math.random() * 45000 + 45000;
      timeoutId = setTimeout(triggerAutoEvent, nextDelay);
    };

    // Start the first automated event 30 seconds after load
    timeoutId = setTimeout(triggerAutoEvent, 30000);
    return () => clearTimeout(timeoutId);
  }, [fetchAll]);

  const handleTriggerIncident = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    try {
      await triggerSimulatedIncident();
      await fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleExecuteStrategy = async (id: string) => {
    try {
      await executeOmniStrategy(id);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualOverride = async () => {
    // Open the confirmation modal first
    setIsLockdownOpen(true);
  };

  const executeAntiStampede = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/manual-override`, {
        method: "POST",
      });
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "HIGH": return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "ELEVATED": return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const getThreatDotColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-rose-500";
      case "HIGH": return "bg-orange-500";
      case "ELEVATED": return "bg-amber-500";
      default: return "bg-emerald-500";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <ShieldAlert className="h-12 w-12 text-emerald-500 animate-pulse" />
            <div className="absolute inset-0 h-12 w-12 rounded-full bg-emerald-500/20 animate-ping" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-100 tracking-wider font-mono">
              KUMBH-CORTEX
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-mono">
              Initializing neural command fabric...
            </p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-500/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* ===== TOP HEADER BAR ===== */}
      <header className="h-14 border-b border-slate-800/80 flex items-center justify-between px-5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="text-emerald-500 h-5 w-5" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-sm font-bold tracking-[0.2em] font-mono">
            KUMBH-CORTEX
          </h1>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          {/* Connection Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <Wifi className={`h-3 w-3 ${connectionStatus === "connected" ? "text-emerald-400" : "text-rose-400 animate-pulse"}`} />
            <span className={connectionStatus === "connected" ? "text-emerald-400" : "text-rose-400"}>
              {connectionStatus === "connected" ? "LINKED" : "SEVERED"}
            </span>
          </div>
          {/* Frequency */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>2.5 HZ</span>
          </div>
          {/* Help Button */}
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all font-bold tracking-wider"
            title="Field Broadcast"
          >
            <span className="text-[11px] font-mono">📡 BROADCAST</span>
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title="Command Guide"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            COMMAND GUIDE
          </button>
        </div>
      </header>

      {/* ===== STATUS STRIP ===== */}
      {systemStatus && (
        <div className="h-9 border-b border-slate-800/50 flex items-center px-5 gap-6 bg-slate-950/90 text-[11px] font-mono overflow-x-auto">
          {/* Threat Level */}
          <div className={`flex items-center gap-2 px-2.5 py-0.5 rounded border ${getThreatColor(systemStatus.threat_level)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getThreatDotColor(systemStatus.threat_level)} ${systemStatus.threat_level === "CRITICAL" ? "animate-ping" : "animate-pulse"}`} />
            <Shield className="h-3 w-3" />
            <span className="font-bold">{systemStatus.threat_level}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />

          {/* Total Pilgrims */}
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="h-3 w-3 text-sky-400" />
            <span className="text-slate-300 font-semibold">
              {(systemStatus.total_pilgrims / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-slate-600">PILGRIMS</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />

          {/* Active Incidents */}
          <div className="flex items-center gap-2 text-slate-400">
            <AlertTriangle className={`h-3 w-3 ${systemStatus.active_incidents > 0 ? "text-rose-400" : "text-slate-600"}`} />
            <span className={`font-semibold ${systemStatus.active_incidents > 0 ? "text-rose-300" : "text-slate-300"}`}>
              {systemStatus.active_incidents}
            </span>
            <span className="text-slate-600">ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />

          {/* Resolved */}
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">
              {systemStatus.incidents_resolved}
            </span>
            <span className="text-slate-600">RESOLVED</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />

          {/* Stampede Risk */}
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className={`h-3 w-3 ${systemStatus.threat_level === "CRITICAL" ? "text-rose-500 animate-pulse" : "text-amber-500"}`} />
            <span className={`font-semibold ${systemStatus.threat_level === "CRITICAL" ? "text-rose-400" : "text-amber-400"}`}>
              {systemStatus.threat_level === "CRITICAL" ? "98.5%" : "12.4%"}
            </span>
            <span className="text-slate-600">STAMPEDE PROBABILITY</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />

          {/* Uptime */}
          <div className="flex items-center gap-2 text-slate-400 ml-auto">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-slate-500">{systemStatus.uptime}</span>
            <span className="text-slate-700">UPTIME</span>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT GRID ===== */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-w-[1024px]">
        {/* Left Column: Map + Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Tactical Map */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 relative overflow-hidden h-[450px] lg:h-[550px] scan-line-overlay">
            {/* Interactive SVG Map Component */}
            <div className="absolute inset-0 z-0">
              <MapView
                telemetryData={telemetry}
                onManualOverride={handleManualOverride}
              />
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-3 h-[280px]">
            <MetricsPanel telemetryData={telemetry} history={history} />
          </div>
        </div>

        {/* Right Column: Cortex AI Feed */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 relative overflow-hidden flex flex-col h-[846px] sticky top-20">
          <CortexFeed
            strategies={strategies}
            onExecute={handleExecuteStrategy}
            onTriggerMock={handleTriggerIncident}
            isTriggering={isTriggering}
          />
        </div>
      </main>

      {/* Help Panel Modal */}
      <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Broadcast Panel */}
      <BroadcastPanel
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        threatLevel={systemStatus?.threat_level ?? "NORMAL"}
      />

      {/* Anti-Stampede Lockdown Modal */}
      <AntiStampedeModal
        isOpen={isLockdownOpen}
        onClose={() => setIsLockdownOpen(false)}
        onConfirm={executeAntiStampede}
      />
    </div>
  );
}