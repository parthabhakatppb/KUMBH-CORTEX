import os
import json
import random
from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class IncidentStrategy(BaseModel):
    """Strict JSON schema enforced on GPT-4o-mini output."""
    strategy_title: str
    severity: str  # "CRITICAL" or "WARNING"
    micro_action: str
    macro_action: str
    preventative_action: str


# Pool of diverse fallback strategies for when API is unavailable
FALLBACK_STRATEGIES = [
    {
        "strategy_title": "Emergency Medical Corridor Activation",
        "severity": "CRITICAL",
        "micro_action": "Deploy Medical Response Unit 4 and Volunteer Squad 7 to establish a triage point at the nearest junction. Clear a 50m emergency corridor.",
        "macro_action": "Throttle all inbound shuttle departures from Indore Highway Hub for 30 minutes. Redirect traffic to Dewas Transit Node via NH-47 bypass.",
        "preventative_action": "Activate emergency PA announcements in affected sector. Deploy water distribution units and shade canopies at all nearby holding zones."
    },
    {
        "strategy_title": "Crowd Pressure Redistribution Protocol",
        "severity": "CRITICAL",
        "micro_action": "Activate barriers at Gate 2B and open alternate flow channel through Service Corridor Delta. Deploy 3 volunteer squads for guided dispersal.",
        "macro_action": "Implement HOLD status at Dhar Holding Area. All buses to queue at highway checkpoint until crowd pressure normalizes below 75%.",
        "preventative_action": "Begin loudspeaker announcements directing pilgrims to less crowded alternative ghats. Distribute real-time crowd maps to local volunteer leaders."
    },
    {
        "strategy_title": "Infrastructure Breach Containment",
        "severity": "WARNING",
        "micro_action": "Dispatch Engineering Response Team Bravo to the breach site. Establish 100m safety perimeter and deploy temporary barriers around affected zone.",
        "macro_action": "Reduce inflow from Dewas Transit Node by 40%. Reroute incoming pilgrims through Southern Entry Gate to avoid the compromised zone.",
        "preventative_action": "Alert all sector coordinators to monitor adjacent barricade stress levels. Pre-position backup barrier materials at 3 strategic reserve points."
    },
    {
        "strategy_title": "Thermal Emergency Response Vector",
        "severity": "CRITICAL",
        "micro_action": "Deploy Medical Units A and C with electrolyte distribution kits. Establish 4 emergency cooling stations with misting fans within 200m radius.",
        "macro_action": "Temporarily halt Indore and Dhar shuttle arrivals for 45 minutes to reduce crowd accumulation during peak temperature hours.",
        "preventative_action": "Activate all reserve water tankers in the region. Send push notifications via pilgrim app to seek shade and hydration stations."
    },
]


def generate_omni_strategy(incident_description: str, telemetry_context: dict = None) -> dict:
    """
    Passes raw incident data + live telemetry context to GPT-4o-mini 
    to get a structured 3-pronged strategy output.
    """

    # Build context-enriched prompt
    context_block = ""
    if telemetry_context:
        sectors = telemetry_context.get("sectors", {})
        hubs = telemetry_context.get("hubs", {})
        context_block = "\n\nCURRENT SYSTEM STATE:\n"
        for sid, s in sectors.items():
            context_block += f"  - {s['name']}: {s['current_density']}% density ({s['status']})\n"
        for hid, h in hubs.items():
            load = round((h['current_occupancy'] / h['capacity']) * 100, 1) if h['capacity'] > 0 else 0
            context_block += f"  - {h['name']}: {h['current_occupancy']:,}/{h['capacity']:,} ({load}% load, {h['transit_status']})\n"

    prompt = f"""You are the AI Commander for the Mahakumbh 2028 mega-event in Ujjain, managing crowd safety for 300 million expected pilgrims.

AN INCIDENT HAS OCCURRED: '{incident_description}'
{context_block}
Generate a precise 3-part Omni-Strategy to resolve this crisis:
1. **Micro Action** (Local): Specific volunteer squad dispatch, medical unit deployment, barrier adjustments, or corridor clearing. Name specific units/routes.
2. **Macro Action** (Regional): Highway/Transit throttling at satellite holding hubs (Indore, Dewas, Dhar). Specify hold durations and rerouting.
3. **Preventative Action** (Proactive): Crowd pacification, resource pre-positioning, communication broadcasts to prevent escalation.

Rules:
- Each action must be 1-2 sentences, actionable and specific.
- severity must be exactly "CRITICAL" or "WARNING" based on danger level.
- strategy_title should be a concise operational codename (4-6 words).
"""

    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an elite crisis management AI for the world's largest religious gathering. Output strict JSON matching the required schema. Be specific with unit names, routes, and durations."},
                {"role": "user", "content": prompt}
            ],
            response_format=IncidentStrategy,
        )

        return json.loads(completion.choices[0].message.content)

    except Exception as e:
        print(f"[CORTEX AI] OpenAI API Error: {e}")
        print("[CORTEX AI] Deploying fallback strategy from local pool...")
        # Return a random fallback for variety during demo
        fallback = random.choice(FALLBACK_STRATEGIES).copy()
        # Customize severity based on incident keywords
        if any(word in incident_description.lower() for word in ["stampede", "fire", "flood", "collapse", "critical"]):
            fallback["severity"] = "CRITICAL"
        return fallback