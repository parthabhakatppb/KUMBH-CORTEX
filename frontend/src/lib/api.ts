const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    // If running on localhost or a local IP (e.g. 192.168.x.x), use port 8000 for the Python backend
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname)
    ) {
      return `http://${window.location.hostname}:8000`;
    }
    // If deployed on a real domain (like Render), use the same origin without hardcoding port 8000
    return window.location.origin;
  }
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getBaseUrl();

export async function fetchTelemetryVitals() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vitals`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch telemetry vitals");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchTelemetryVitals):", error);
    throw error;
  }
}

export async function fetchSystemStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system-status`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch system status");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchSystemStatus):", error);
    throw error;
  }
}

export async function fetchHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch history");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchHistory):", error);
    throw error;
  }
}

export async function triggerSimulatedIncident() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trigger-incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to trigger emergency vector");
    return await response.json();
  } catch (error) {
    console.error("API Error (triggerSimulatedIncident):", error);
    throw error;
  }
}

export async function executeOmniStrategy(strategyId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/execute-strategy/${strategyId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to authorize strategy execution");
    return await response.json();
  } catch (error) {
    console.error("API Error (executeOmniStrategy):", error);
    throw error;
  }
}