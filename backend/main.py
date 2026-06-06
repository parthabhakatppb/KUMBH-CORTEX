from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ai_agent
from simulation import KumbhTelemetrySimulator
import time

app = FastAPI(
    title="Kumbh-Cortex Engine v1.0",
    description="AI-powered Command Center Backend for Mahakumbh 2028",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = KumbhTelemetrySimulator()
active_strategies = []
start_time = time.time()


class IncidentReport(BaseModel):
    description: str
    location: str


@app.get("/api/vitals")
async def get_vitals():
    """Fetches real-time snapshots of the whole ecosystem — the primary polling endpoint."""
    current_state = simulator.update_telemetry()
    return {
        "status": "success",
        "telemetry": current_state,
        "active_strategies": active_strategies
    }


@app.get("/api/system-status")
async def get_system_status():
    """Returns aggregate system-level metrics for the top status bar."""
    threat_level = simulator.get_system_threat_level()
    uptime_seconds = int(time.time() - start_time)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    return {
        "threat_level": threat_level,
        "total_pilgrims": simulator.total_pilgrims,
        "active_incidents": len(active_strategies),
        "incidents_resolved": simulator.incidents_resolved,
        "uptime": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "sector_count": len(simulator.sectors),
        "hub_count": len(simulator.hubs),
    }


@app.get("/api/history")
async def get_history():
    """Returns rolling telemetry history for time-series chart rendering."""
    return {
        "status": "success",
        "history": simulator.get_history()
    }


@app.post("/api/trigger-incident")
async def trigger_incident():
    """Forced incident creation endpoint to simulate high-stress live events."""
    raw_incident = simulator.generate_random_incident()

    # Get current telemetry for context-aware AI
    current_state = {"sectors": simulator.sectors, "hubs": simulator.hubs}

    # Process strategy via OpenAI Engine with full context
    ai_strategy = ai_agent.generate_omni_strategy(
        f"Location: {raw_incident['location']}. Details: {raw_incident['description']}",
        telemetry_context=current_state
    )

    payload = {
        "id": raw_incident["id"],
        "timestamp": raw_incident["timestamp"],
        "location": raw_incident["location"],
        "description": raw_incident["description"],
        "strategy": ai_strategy
    }

    active_strategies.insert(0, payload)

    # Cap active strategies at 10 for UI performance
    if len(active_strategies) > 10:
        active_strategies.pop()

    return {"status": "incident_propagated", "data": payload}


@app.post("/api/execute-strategy/{strategy_id}")
async def execute_strategy(strategy_id: str):
    """Mutates server state to reflect administrative overrides and remediation."""
    global active_strategies

    for strat in active_strategies:
        if strat["id"] == strategy_id:
            # Simulate comprehensive remediation
            simulator.resolve_incident_impact(strat["location"])

            active_strategies = [s for s in active_strategies if s["id"] != strategy_id]
            return {
                "status": "executed",
                "target_resolved": strategy_id,
                "incidents_resolved": simulator.incidents_resolved
            }

    raise HTTPException(status_code=404, detail="Strategy signature not found in active queue")


class BroadcastMessage(BaseModel):
    message: str
    target: str
    priority: str  # "normal" | "urgent" | "critical"
    broadcast_type: str  # "emergency" | "resource" | "info" | "lockdown"


# In-memory broadcast log (last 50 broadcasts)
broadcast_log: list[dict] = []


@app.post("/api/broadcast")
async def send_broadcast(payload: BroadcastMessage):
    """Logs a field broadcast message and returns a simulated acknowledgement."""
    import datetime
    entry = {
        "id": str(int(time.time() * 1000)),
        "message": payload.message,
        "target": payload.target,
        "priority": payload.priority,
        "broadcast_type": payload.broadcast_type,
        "sent_at": datetime.datetime.utcnow().isoformat() + "Z",
        "status": "transmitted",
    }
    broadcast_log.insert(0, entry)
    if len(broadcast_log) > 50:
        broadcast_log.pop()
    return {"status": "broadcast_sent", "entry": entry}


@app.get("/api/broadcasts")
async def get_broadcasts():
    """Returns last 20 broadcast messages for the log panel."""
    return {"status": "success", "broadcasts": broadcast_log[:20]}


@app.post("/api/manual-override")
async def manual_override():
    """Anti-Stampede Lockdown: force flush all sectors and hubs to safe baseline."""
    global active_strategies
    simulator.incidents_resolved += 1

    # Force all sectors toward safe baseline
    for data in simulator.sectors.values():
        data["baseline"] = max(40.0, data["baseline"] - 25.0)
        data["current_density"] = max(35.0, data["current_density"] - 30.0)
        data["status"] = "NORMAL"

    # Clear transit hub congestion
    for hub in simulator.hubs.values():
        hub["baseline"] = max(15000, hub["baseline"] - int(hub["capacity"] * 0.3))
        hub["current_occupancy"] = max(0, int(hub["current_occupancy"] - hub["capacity"] * 0.25))

    # Clear all AI strategies since human override took control
    active_strategies.clear()

    # Auto-log a lockdown broadcast
    import datetime
    broadcast_log.insert(0, {
        "id": str(int(time.time() * 1000)),
        "message": "🔴 ANTI-STAMPEDE LOCKDOWN EXECUTED — All sectors entering controlled clearance. Ground teams to positions. Entry sealed.",
        "target": "ALL GROUND UNITS",
        "priority": "critical",
        "broadcast_type": "lockdown",
        "sent_at": datetime.datetime.utcnow().isoformat() + "Z",
        "status": "transmitted",
    })

    return {"status": "override_complete", "message": "Lockdown executed. All sectors flushed to baseline."}