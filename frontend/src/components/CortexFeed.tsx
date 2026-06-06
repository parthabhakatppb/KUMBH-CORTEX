"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  Radio,
  Zap,
  Navigation,
  Loader2,
  AlertTriangle,
  Shield,
  Edit2,
  Save,
  X,
} from "lucide-react";

interface StrategyCard {
  id: string;
  timestamp: string;
  location: string;
  description: string;
  strategy: {
    strategy_title: string;
    severity: string;
    micro_action: string;
    macro_action: string;
    preventative_action: string;
  };
}

interface CortexFeedProps {
  strategies: StrategyCard[];
  onExecute: (id: string) => void;
  onTriggerMock: () => void;
  isTriggering: boolean;
}

export default function CortexFeed({
  strategies,
  onExecute,
  onTriggerMock,
  isTriggering,
}: CortexFeedProps) {
  const [executingIds, setExecutingIds] = useState<Set<string>>(new Set());

  const handleExecute = async (id: string) => {
    setExecutingIds((prev) => new Set(prev).add(id));
    await onExecute(id);
    setExecutingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Shield className="h-4 w-4 text-emerald-400" />
            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-xs font-bold font-mono tracking-[0.15em] text-slate-300">
            CORTEX AI FEED
          </h2>
        </div>
        <div className="text-[10px] font-mono text-slate-600">
          {strategies.length > 0 && (
            <span className="text-rose-400/80">
              {strategies.length} ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Inject Button */}
      <button
        onClick={onTriggerMock}
        disabled={isTriggering}
        className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all border ${
          isTriggering
            ? "bg-slate-800 text-slate-500 border-slate-700 cursor-wait"
            : "bg-emerald-600/90 hover:bg-emerald-500 active:bg-emerald-700 text-white border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50"
        }`}
      >
        {isTriggering ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono text-xs tracking-wider">AI PROCESSING...</span>
          </>
        ) : (
          <>
            <Radio className="h-4 w-4" />
            <span>Run Emergency Response Drill</span>
          </>
        )}
      </button>

      {/* Strategy Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {strategies.length === 0 ? (
          <div className="h-full min-h-[200px] border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-600 gap-3">
            <div className="relative">
              <ShieldAlert className="h-8 w-8 text-slate-700" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono tracking-wider">
                ALL SYSTEMS NOMINAL
              </p>
              <p className="text-[10px] text-slate-700 mt-1 font-mono">
                No active threat vectors detected
              </p>
            </div>
          </div>
        ) : (
          strategies.map((strat, index) => (
            <StrategyCardItem 
              key={strat.id} 
              strat={strat} 
              index={index}
              isExecuting={executingIds.has(strat.id)} 
              onExecute={handleExecute} 
            />
          ))
        )}
      </div>
    </div>
  );
}

function StrategyCardItem({ 
  strat, 
  index,
  isExecuting, 
  onExecute 
}: { 
  strat: StrategyCard; 
  index: number;
  isExecuting: boolean; 
  onExecute: (id: string) => void 
}) {
  const isCritical = strat.strategy.severity === "CRITICAL";
  
  const [isEditing, setIsEditing] = useState(false);
  const [micro, setMicro] = useState(strat.strategy.micro_action);
  const [macro, setMacro] = useState(strat.strategy.macro_action);
  const [prev, setPrev] = useState(strat.strategy.preventative_action);

  // Sync state if the incoming strategy changes (e.g. on hot-reload)
  React.useEffect(() => {
    if (!isEditing) {
      setMicro(strat.strategy.micro_action);
      setMacro(strat.strategy.macro_action);
      setPrev(strat.strategy.preventative_action);
    }
  }, [strat, isEditing]);

  return (
    <div
      className="card-animate-in"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div
        className={`border rounded-xl p-3.5 transition-all duration-300 bg-slate-900/90 ${
          isCritical
            ? "border-rose-500/30 shadow-lg shadow-rose-950/10"
            : "border-amber-500/30 shadow-lg shadow-amber-950/10"
        }`}
      >
        {/* Card header */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  isCritical
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {isCritical && <AlertTriangle className="h-2.5 w-2.5" />}
                {strat.strategy.severity}
              </span>
              <span className="text-[10px] text-slate-600 font-mono whitespace-nowrap">
                {strat.timestamp}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <h4 className="text-sm font-semibold text-slate-200 leading-tight pr-2">
                {strat.strategy.strategy_title}
              </h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1.5 rounded-md transition-colors border ${
                  isEditing 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30" 
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500"
                }`}
                title={isEditing ? "Save Adjustments" : "Human Override (Edit)"}
              >
                {isEditing ? <Save className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Trigger description */}
        <p className="text-[11px] text-slate-400 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 leading-relaxed">
          <span className="text-slate-500 font-semibold">TRIGGER:</span>{" "}
          {strat.description}
          <span className="text-slate-600 ml-1">@ {strat.location}</span>
        </p>

        {/* Strategy actions */}
        <div className="space-y-2.5 border-t border-slate-800/50 pt-3 mb-3">
          {/* Micro Action */}
          <div className="flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <Zap className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-400/80 tracking-wider block mb-0.5">
                MICRO-ACTION (LOCAL)
              </span>
              {isEditing ? (
                <textarea
                  value={micro}
                  onChange={(e) => setMicro(e.target.value)}
                  className="w-full bg-slate-950/80 border border-emerald-500/30 rounded p-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none"
                  rows={2}
                />
              ) : (
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  {micro}
                </span>
              )}
            </div>
          </div>

          {/* Macro Action */}
          <div className="flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded-md bg-sky-500/10 flex items-center justify-center">
                <Navigation className="h-3 w-3 text-sky-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-sky-400/80 tracking-wider block mb-0.5">
                MACRO-ACTION (REGIONAL)
              </span>
              {isEditing ? (
                <textarea
                  value={macro}
                  onChange={(e) => setMacro(e.target.value)}
                  className="w-full bg-slate-950/80 border border-sky-500/30 rounded p-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 resize-none"
                  rows={2}
                />
              ) : (
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  {macro}
                </span>
              )}
            </div>
          </div>

          {/* Preventative Action */}
          <div className="flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <div className="h-5 w-5 rounded-md bg-purple-500/10 flex items-center justify-center">
                <ShieldAlert className="h-3 w-3 text-purple-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-purple-400/80 tracking-wider block mb-0.5">
                PREVENTATIVE
              </span>
              {isEditing ? (
                <textarea
                  value={prev}
                  onChange={(e) => setPrev(e.target.value)}
                  className="w-full bg-slate-950/80 border border-purple-500/30 rounded p-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-none"
                  rows={2}
                />
              ) : (
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  {prev}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Execute button */}
        <button
          onClick={() => {
            if (isEditing) setIsEditing(false);
            onExecute(strat.id);
          }}
          disabled={isExecuting}
          className={`w-full py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all border ${
            isExecuting
              ? "bg-slate-800 text-slate-500 border-slate-700 cursor-wait"
              : isEditing 
                ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-slate-800/80 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border-slate-700/80 hover:border-emerald-500/40 active:bg-emerald-600/30"
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="font-mono tracking-wider">DEPLOYING...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{isEditing ? "Save Overrides & Execute" : "Authorize & Execute Omni-Strategy"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}