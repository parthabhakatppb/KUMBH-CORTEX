"use client";

import React, { useState, useMemo } from "react";
import { Layers, Crosshair, Radio, Hexagon } from "lucide-react";

interface MapViewProps {
  telemetryData: {
    sectors: Record<
      string,
      { name: string; current_density: number; status: string; capacity: number }
    >;
    hubs: Record<
      string,
      {
        name: string;
        capacity: number;
        current_occupancy: number;
        transit_status: string;
      }
    >;
  } | null;
  onManualOverride?: () => void;
}

export default function MapView({ telemetryData, onManualOverride }: MapViewProps) {
  const [viewMode, setViewMode] = useState<"micro" | "macro">("micro");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Sector positions for the SVG tactical view
  const sectorsGeo = useMemo(
    () => [
      { id: "sec_1", x: 260, y: 175, radius: 48 },
      { id: "sec_2", x: 490, y: 120, radius: 55 },
      { id: "sec_3", x: 190, y: 310, radius: 42 },
      { id: "sec_4", x: 560, y: 285, radius: 38 },
    ],
    []
  );

  // Hub positions for macro view
  const hubsGeo = useMemo(
    () => [
      { id: "hub_indore", x: 180, y: 270 },
      { id: "hub_dewas", x: 400, y: 140 },
      { id: "hub_dhar", x: 620, y: 250 },
    ],
    []
  );

  // Ujjain center point for macro view
  const ujjainCenter = { x: 400, y: 200 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "#f43f5e";
      case "WARNING": return "#f59e0b";
      default: return "#10b981";
    }
  };

  const getHubStatusColor = (status: string) => {
    switch (status) {
      case "BLOCKED": return "#f43f5e";
      case "HEAVY": return "#f59e0b";
      case "MODERATE": return "#38bdf8";
      default: return "#10b981";
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-slate-950">
      {/* ===== HUD Controls ===== */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={() => setViewMode("micro")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-[0.15em] transition-all border flex items-center gap-1.5 ${
            viewMode === "micro"
              ? "bg-emerald-500/90 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25"
              : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Crosshair className="h-3 w-3" />
          MICRO: UJJAIN GHATS
        </button>
        <button
          onClick={() => setViewMode("macro")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-[0.15em] transition-all border flex items-center gap-1.5 ${
            viewMode === "macro"
              ? "bg-sky-500/90 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/25"
              : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Hexagon className="h-3 w-3" />
          MACRO: TRANSIT GRID
        </button>
      </div>

      {/* Mode Label and Override */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {onManualOverride && (
          <button
            onClick={onManualOverride}
            className="bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-2 backdrop-blur-sm transition-all"
            title="Force System Flush to Baseline"
          >
            <Radio className="h-3.5 w-3.5" />
            ANTI-STAMPEDE LOCKDOWN
          </button>
        )}
        <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-500 flex items-center gap-2 backdrop-blur-sm">
          <Layers className="h-3.5 w-3.5" />
          <span>
            {viewMode === "micro" ? "UJJAIN COMMAND ZONE" : "REGIONAL TRANSIT GRID"}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* ===== MAIN SVG CANVAS ===== */}
      <div className="flex-1 w-full h-full grid-bg relative overflow-hidden flex items-center justify-center">
        <svg
          className="w-full h-full min-h-[380px]"
          viewBox="0 0 800 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient definitions */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="node-glow-green" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="node-glow-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="node-glow-amber" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated dash pattern */}
            <pattern id="flow-pattern" width="20" height="1" patternUnits="userSpaceOnUse">
              <rect width="10" height="1" fill="#10b981" opacity="0.4">
                <animate attributeName="x" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </pattern>

            {/* Density clip paths for sectors */}
            {sectorsGeo.map((geo) => (
              <clipPath id={`clip-${geo.id}`} key={`clip-${geo.id}`}>
                <circle cx={geo.x} cy={geo.y} r={geo.radius - 2} />
              </clipPath>
            ))}
          </defs>

          {/* Ambient grid lines */}
          <line x1="0" y1="200" x2="800" y2="200" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="400" y1="0" x2="400" y2="400" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="#0f172a" strokeWidth="0.3" strokeDasharray="2 12" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#0f172a" strokeWidth="0.3" strokeDasharray="2 12" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#0f172a" strokeWidth="0.3" strokeDasharray="2 12" />
          <line x1="600" y1="0" x2="600" y2="400" stroke="#0f172a" strokeWidth="0.3" strokeDasharray="2 12" />

          {viewMode === "micro" ? (
            <>
              {/* ===== MICRO VIEW: Ujjain Ghats ===== */}

              {/* Radar sweep circle */}
              <circle cx="400" cy="200" r="180" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="400" cy="200" r="120" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="2 6" />
              <circle cx="400" cy="200" r="60" fill="none" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="2 6" />

              {/* Rotating radar sweep line */}
              <g className="radar-sweep" style={{ transformOrigin: "400px 200px" }}>
                <line x1="400" y1="200" x2="400" y2="20" stroke="url(#radar-glow)" strokeWidth="1.5" />
                <path
                  d="M 400 200 L 395 40 A 160 160 0 0 1 400 20 Z"
                  fill="url(#radar-glow)"
                  opacity="0.3"
                />
              </g>

              {/* Shipra River path */}
              <path
                d="M 80,400 Q 200,280 220,180 T 350,50 Q 450,20 650,10"
                fill="none"
                stroke="#0c4a6e"
                strokeWidth="28"
                strokeLinecap="round"
                opacity="0.25"
              />
              <path
                d="M 80,400 Q 200,280 220,180 T 350,50 Q 450,20 650,10"
                fill="none"
                stroke="url(#river-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 4"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-24"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Corridor flow lines between sectors */}
              {sectorsGeo.map((geo, i) => {
                const next = sectorsGeo[(i + 1) % sectorsGeo.length];
                return (
                  <line
                    key={`corridor-${i}`}
                    x1={geo.x}
                    y1={geo.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    opacity="0.5"
                  />
                );
              })}

              {/* Sector nodes */}
              {sectorsGeo.map((geo) => {
                const liveData = telemetryData?.sectors[geo.id];
                const density = liveData ? liveData.current_density : 50;
                const status = liveData?.status || "NORMAL";
                const strokeColor = getStatusColor(status);
                const isCritical = status === "CRITICAL";
                const isWarning = status === "WARNING";
                const isHovered = hoveredNode === geo.id;
                const glowId =
                  isCritical ? "node-glow-red" : isWarning ? "node-glow-amber" : "node-glow-green";

                return (
                  <g
                    key={geo.id}
                    className="transition-all duration-500 cursor-pointer"
                    onMouseEnter={() => setHoveredNode(geo.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Outer glow */}
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={geo.radius + 25 + density / 5}
                      fill={`url(#${glowId})`}
                      opacity={isCritical ? 0.6 : 0.3}
                    >
                      {isCritical && (
                        <animate
                          attributeName="r"
                          values={`${geo.radius + 20};${geo.radius + 35};${geo.radius + 20}`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>

                    {/* Pulse ring */}
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={geo.radius + 8}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="0.8"
                      opacity={isCritical ? 0.5 : 0.2}
                    >
                      {(isCritical || isWarning) && (
                        <animate
                          attributeName="r"
                          values={`${geo.radius + 5};${geo.radius + 20};${geo.radius + 5}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      )}
                      {(isCritical || isWarning) && (
                        <animate
                          attributeName="opacity"
                          values="0.5;0;0.5"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>

                    {/* Core circle */}
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={geo.radius}
                      fill="#0f172a"
                      fillOpacity="0.85"
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      filter={isCritical ? "url(#glow-filter)" : undefined}
                    />

                    {/* Fill based on density */}
                    <rect
                      x={geo.x - geo.radius}
                      y={geo.y + geo.radius - (density / 100) * (geo.radius * 2)}
                      width={geo.radius * 2}
                      height={(density / 100) * (geo.radius * 2)}
                      fill={strokeColor}
                      opacity="0.12"
                      clipPath={`url(#clip-${geo.id})`}
                    />

                    {/* Text labels */}
                    <text
                      x={geo.x}
                      y={geo.y - 6}
                      textAnchor="middle"
                      fill="#f1f5f9"
                      className="text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{ pointerEvents: "none" }}
                    >
                      {liveData ? liveData.name.replace(" Sector", "") : "..."}
                    </text>
                    <text
                      x={geo.x}
                      y={geo.y + 10}
                      textAnchor="middle"
                      fill={strokeColor}
                      className="text-[12px] font-mono font-bold tracking-wider"
                      style={{ pointerEvents: "none" }}
                    >
                      {density.toFixed(1)}%
                    </text>

                    {/* Hover tooltip */}
                    {isHovered && liveData && (
                      <g>
                        <rect
                          x={geo.x + geo.radius + 8}
                          y={geo.y - 30}
                          width="130"
                          height="55"
                          rx="6"
                          fill="#0f172a"
                          stroke={strokeColor}
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text x={geo.x + geo.radius + 16} y={geo.y - 14} fill="#e2e8f0" className="text-[9px] font-mono font-bold">
                          {liveData.name}
                        </text>
                        <text x={geo.x + geo.radius + 16} y={geo.y + 1} fill="#94a3b8" className="text-[8px] font-mono">
                          Density: {density.toFixed(1)}%
                        </text>
                        <text x={geo.x + geo.radius + 16} y={geo.y + 14} fill={strokeColor} className="text-[8px] font-mono font-bold">
                          Status: {status}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Zone label */}
              <text x="400" y="388" textAnchor="middle" fill="#334155" className="text-[9px] font-mono tracking-[0.3em]">
                UJJAIN COMMAND ZONE — LIVE TELEMETRY
              </text>
            </>
          ) : (
            <>
              {/* ===== MACRO VIEW: Transit Grid ===== */}

              {/* Ujjain center node */}
              <circle cx={ujjainCenter.x} cy={ujjainCenter.y} r="30" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <circle cx={ujjainCenter.x} cy={ujjainCenter.y} r="42" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3">
                <animate attributeName="r" values="35;48;35" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x={ujjainCenter.x} y={ujjainCenter.y - 4} textAnchor="middle" fill="#10b981" className="text-[10px] font-mono font-bold">
                UJJAIN
              </text>
              <text x={ujjainCenter.x} y={ujjainCenter.y + 8} textAnchor="middle" fill="#64748b" className="text-[7px] font-mono">
                EVENT CORE
              </text>

              {/* Transit routes from hubs to Ujjain */}
              {hubsGeo.map((geo) => {
                const hubData = telemetryData?.hubs[geo.id];
                const hubColor = hubData ? getHubStatusColor(hubData.transit_status) : "#334155";
                return (
                  <g key={`route-${geo.id}`}>
                    {/* Route line */}
                    <line
                      x1={geo.x}
                      y1={geo.y}
                      x2={ujjainCenter.x}
                      y2={ujjainCenter.y}
                      stroke={hubColor}
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-20"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </line>
                    {/* Animated particle along route */}
                    <circle r="3" fill={hubColor} opacity="0.8">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M ${geo.x} ${geo.y} L ${ujjainCenter.x} ${ujjainCenter.y}`}
                      />
                    </circle>
                    <circle r="6" fill={hubColor} opacity="0.2">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M ${geo.x} ${geo.y} L ${ujjainCenter.x} ${ujjainCenter.y}`}
                      />
                    </circle>
                  </g>
                );
              })}

              {/* Hub nodes */}
              {hubsGeo.map((geo) => {
                const liveData = telemetryData?.hubs[geo.id];
                const occupancy = liveData ? liveData.current_occupancy : 0;
                const maxCap = liveData ? liveData.capacity : 1;
                const loadRatio = (occupancy / maxCap) * 100;
                const statusColor = liveData ? getHubStatusColor(liveData.transit_status) : "#334155";
                const isHovered = hoveredNode === geo.id;

                return (
                  <g
                    key={geo.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(geo.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Outer glow */}
                    <circle cx={geo.x} cy={geo.y} r="55" fill="none" stroke={statusColor} strokeWidth="0.5" opacity="0.15" />

                    {/* Hub container */}
                    <rect
                      x={geo.x - 72}
                      y={geo.y - 28}
                      width="144"
                      height="56"
                      rx="8"
                      fill="#0f172a"
                      fillOpacity="0.9"
                      stroke={statusColor}
                      strokeWidth={isHovered ? 2 : 1.2}
                    />

                    {/* Status indicator dot */}
                    <circle cx={geo.x - 58} cy={geo.y - 14} r="3" fill={statusColor}>
                      {liveData?.transit_status === "BLOCKED" && (
                        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
                      )}
                    </circle>

                    {/* Hub name */}
                    <text x={geo.x - 48} y={geo.y - 10} fill="#e2e8f0" className="text-[10px] font-mono font-bold">
                      {liveData ? liveData.name.split(" ").slice(0, 2).join(" ") : "Hub"}
                    </text>

                    {/* Transit status */}
                    <text x={geo.x + 62} y={geo.y - 10} textAnchor="end" fill={statusColor} className="text-[8px] font-mono font-bold">
                      {liveData?.transit_status || "---"}
                    </text>

                    {/* Volume text */}
                    <text x={geo.x - 58} y={geo.y + 6} fill="#94a3b8" className="text-[8px] font-mono">
                      Vol: {occupancy.toLocaleString()} / {maxCap.toLocaleString()}
                    </text>

                    {/* Progress bar background */}
                    <rect x={geo.x - 58} y={geo.y + 14} width="116" height="4" rx="2" fill="#1e293b" />
                    {/* Progress bar fill */}
                    <rect
                      x={geo.x - 58}
                      y={geo.y + 14}
                      width={Math.min(116, (loadRatio / 100) * 116)}
                      height="4"
                      rx="2"
                      fill={statusColor}
                      opacity="0.8"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.6;0.9;0.6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </g>
                );
              })}

              {/* Grid label */}
              <text x="400" y="388" textAnchor="middle" fill="#334155" className="text-[9px] font-mono tracking-[0.3em]">
                REGIONAL TRANSIT GRID — SATELLITE MONITORING
              </text>
            </>
          )}
        </svg>

        {/* ===== LEGEND PANEL ===== */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-[9px] font-mono flex flex-col gap-1.5 backdrop-blur-sm">
          <div className="text-slate-500 font-bold mb-0.5 tracking-wider">
            {viewMode === "micro" ? "SECTOR STATUS" : "TRANSIT STATUS"}
          </div>
          {viewMode === "micro" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Normal (&lt;75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-slate-400">Warning (75-85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 status-blink" />
                <span className="text-slate-400">Critical (&gt;85%)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Fluid</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span className="text-slate-400">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-slate-400">Heavy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 status-blink" />
                <span className="text-slate-400">Blocked</span>
              </div>
            </>
          )}
        </div>

        {/* Live indicator */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-slate-500 flex items-center gap-2 backdrop-blur-sm">
          <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
          LIVE
        </div>
      </div>
    </div>
  );
}