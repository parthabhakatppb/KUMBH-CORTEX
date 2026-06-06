import random
import time
from typing import Dict, List, Any
from collections import deque

class KumbhTelemetrySimulator:
    """
    Real-time telemetry simulation engine for the Mahakumbh 2028 Command Center.
    Maintains state for 4 micro sectors, 3 macro hubs, incident generation,
    and rolling history buffers for time-series visualization.
    """

    def __init__(self):
        # Micro sectors inside Ujjain
        self.sectors = {
            "sec_1": {"name": "Ram Ghat", "baseline": 55.0, "current_density": 55.0, "status": "NORMAL"},
            "sec_2": {"name": "Mahakal Temple Area", "baseline": 65.0, "current_density": 65.0, "status": "NORMAL"},
            "sec_3": {"name": "Triveni Sangam", "baseline": 42.0, "current_density": 42.0, "status": "NORMAL"},
            "sec_4": {"name": "Dutt Akhada Sector", "baseline": 50.0, "current_density": 50.0, "status": "NORMAL"},
        }

        # Macro regional holding hubs
        self.hubs = {
            "hub_indore": {"name": "Indore Highway Hub", "capacity": 50000, "baseline": 22000, "current_occupancy": 22000, "transit_status": "FLUID"},
            "hub_dewas": {"name": "Dewas Transit Node", "capacity": 40000, "baseline": 15000, "current_occupancy": 15000, "transit_status": "FLUID"},
            "hub_dhar": {"name": "Dhar Holding Area", "capacity": 35000, "baseline": 18000, "current_occupancy": 18000, "transit_status": "FLUID"},
        }

        # Rolling history buffer for time-series charts (last 20 ticks)
        self.history: deque = deque(maxlen=20)

        # Statistics
        self.total_pilgrims = 12_450_000  # Base count for the event
        self.incidents_resolved = 0
        self.tick_count = 0

        # Expanded incident pool for demo variety
        self.incident_pool = [
            {"description": "Sudden crowd buildup at linear bottleneck gate 2B near transit entry point. Estimated 8,000 pilgrims queued beyond safe limit.", "location": "Mahakal Temple Area"},
            {"description": "Minor structural failure of safety barricade due to high pressure push. Steel railing buckled at Zone C perimeter.", "location": "Ram Ghat"},
            {"description": "Water pipeline burst reported; reducing local sanitation capability drastically. Area flooding risk at 30%.", "location": "Dutt Akhada Sector"},
            {"description": "Medical distress call: Multiple heat exhaustion vectors near main bathing zone. 12 pilgrims reported collapsed.", "location": "Triveni Sangam"},
            {"description": "VIP motorcade disruption: Unexpected political delegation arrival blocking primary evacuation corridor Alpha-7.", "location": "Ram Ghat"},
            {"description": "Fire hazard alert: Illegal cooking setup detected near temporary shelter zone. LPG cylinder count exceeds safe limits.", "location": "Dutt Akhada Sector"},
            {"description": "Stampede warning trigger: Abnormal crowd velocity spike detected via CCTV analytics. Movement vector analysis shows convergence pattern.", "location": "Mahakal Temple Area"},
            {"description": "Communication blackout: Cell tower overload in sector causing loss of volunteer radio network. Emergency relay switching needed.", "location": "Triveni Sangam"},
            {"description": "Drone sighting: Unauthorized UAV detected over restricted airspace above main bathing ghat. Potential surveillance threat.", "location": "Ram Ghat"},
            {"description": "Flash flood warning: Upstream water level rising rapidly. Shipra River ghat areas may need emergency evacuation within 45 minutes.", "location": "Triveni Sangam"},
        ]

    def update_telemetry(self) -> Dict[str, Any]:
        """Simulates realistic telemetry drift over time with natural crowd dynamics."""
        self.tick_count += 1

        for sec_id, data in self.sectors.items():
            # Mean-reverting drift towards baseline
            diff = data["baseline"] - data["current_density"]
            base_drift = diff * 0.15 + random.uniform(-3.5, 3.5)
            
            # Very rare spontaneous minor surge
            if random.random() < 0.05:
                base_drift += random.uniform(2.0, 5.0)
                
            data["current_density"] = max(10.0, min(100.0, round(data["current_density"] + base_drift, 1)))

            if data["current_density"] >= 85.0:
                data["status"] = "CRITICAL"
            elif data["current_density"] >= 75.0:
                data["status"] = "WARNING"
            else:
                data["status"] = "NORMAL"

        for hub_id, data in self.hubs.items():
            # Mean reverting for hubs
            diff = data["baseline"] - data["current_occupancy"]
            inflow = diff * 0.1 + random.randint(-800, 800)
            data["current_occupancy"] = max(0, min(data["capacity"], int(data["current_occupancy"] + inflow)))
            
            # Dynamic transit status
            load_ratio = data["current_occupancy"] / data["capacity"] if data["capacity"] > 0 else 0
            if load_ratio >= 0.85:
                data["transit_status"] = "BLOCKED"
            elif load_ratio >= 0.70:
                data["transit_status"] = "HEAVY"
            elif load_ratio >= 0.50:
                data["transit_status"] = "MODERATE"
            else:
                data["transit_status"] = "FLUID"

        # Drift total pilgrim count naturally
        self.total_pilgrims += random.randint(500, 5000)

        # Store snapshot in history buffer
        snapshot = {
            "tick": self.tick_count,
            "timestamp": time.strftime("%H:%M:%S"),
            "sectors": {sid: {"density": s["current_density"], "status": s["status"]} for sid, s in self.sectors.items()},
            "hubs": {hid: {"occupancy": h["current_occupancy"], "status": h["transit_status"]} for hid, h in self.hubs.items()},
        }
        self.history.append(snapshot)

        return {"sectors": self.sectors, "hubs": self.hubs}

    def get_system_threat_level(self) -> str:
        """Compute aggregate threat level from all sector densities."""
        densities = [s["current_density"] for s in self.sectors.values()]
        avg = sum(densities) / len(densities)
        max_d = max(densities)
        if max_d >= 90 or avg >= 80:
            return "CRITICAL"
        elif max_d >= 80 or avg >= 70:
            return "HIGH"
        elif max_d >= 70 or avg >= 60:
            return "ELEVATED"
        return "LOW"

    def get_history(self) -> List[Dict]:
        """Returns the rolling history buffer for time-series visualization."""
        return list(self.history)

    def generate_random_incident(self) -> Dict[str, str]:
        base = random.choice(self.incident_pool)
        # Spike density AND increase baseline so it stays critical until resolved
        for sec_id, data in self.sectors.items():
            if data["name"] == base["location"]:
                data["baseline"] = min(95.0, data["baseline"] + 25.0)
                data["current_density"] = min(100.0, data["current_density"] + random.uniform(15.0, 25.0))
                if data["current_density"] >= 85.0:
                    data["status"] = "CRITICAL"
                elif data["current_density"] >= 75.0:
                    data["status"] = "WARNING"
                    
        # Also spike a random hub to reflect the macro impact
        hub = random.choice(list(self.hubs.values()))
        hub["baseline"] = min(hub["capacity"] * 0.9, hub["baseline"] + hub["capacity"] * 0.3)
        hub["current_occupancy"] = min(hub["capacity"], int(hub["current_occupancy"] + hub["capacity"] * 0.2))
        return {
            "id": f"inc_{int(time.time() * 1000) % 100000}_{random.randint(100,999)}",
            "description": base["description"],
            "location": base["location"],
            "timestamp": time.strftime("%H:%M:%S")
        }

    def resolve_incident_impact(self, location: str):
        """Simulate remediation: lower density at target + resolve hub pressure."""
        self.incidents_resolved += 1
        for sec_id, data in self.sectors.items():
            if data["name"] == location:
                # Restore the baseline and artificially drop density quickly
                data["baseline"] = max(40.0, data["baseline"] - 25.0)
                data["current_density"] = max(35.0, data["current_density"] - random.uniform(18.0, 30.0))
                data["status"] = "NORMAL" if data["current_density"] < 75 else "WARNING"
                
        # Ease all hubs back to normal baselines
        for hub in self.hubs.values():
            hub["baseline"] = max(15000, hub["baseline"] - hub["capacity"] * 0.2)
            hub["current_occupancy"] = max(0, int(hub["current_occupancy"] - hub["capacity"] * 0.15))