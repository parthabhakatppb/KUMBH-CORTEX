# KUMBH-CORTEX | AI Command Center

**AI-Powered Crowd Management Dashboard for Ujjain Mahakumbh 2028**

Kumbh-Cortex is a predictive, AI-driven tactical command interface designed for mega-event crowd management. It uses real-time simulated telemetry, detects incidents, and feeds data to a **GPT-4o-mini reasoning engine** to output structured, 3-pronged action strategies (Omni-Strategies) for event commanders.

![Kumbh Cortex Architecture](https://via.placeholder.com/800x400.png?text=Kumbh-Cortex+Architecture)

## ✨ Core Features
- **Dual-Scale Tactical Maps**: Monitor local ghat sectors (MICRO) and regional transit hubs (MACRO) simultaneously.
- **AI Omni-Strategies**: GPT-4o-mini generates context-aware, 3-pronged strategies (Micro, Macro, Preventative) using OpenAI Structured Outputs.
- **Continuous Telemetry Simulation**: Python backend simulating crowd drifts, surges, and capacities for 4 sectors and 3 hubs.
- **Surge Velocity Tracking**: Real-time line charts tracking the rate-of-change of crowd density.
- **Stampede Probability Index**: Global AI-computed index indicating immediate risk.
- **Customizable Anti-Stampede Lockdown**: Selectively deploy 6 emergency protocols with instant field broadcasts.
- **Field Broadcast Network**: Integrated radio panel with a live server-synced broadcast log.
- **Graceful Degradation**: Fallback pool of pre-generated strategies if the OpenAI API fails.
- **Cross-Device Ready**: Frontend dynamically binds to host IP for easy mobile/field testing.

## 🏗️ System Architecture
1. **Simulation Engine (Python/FastAPI)**: Continuously updates crowd density.
2. **AI Reasoning Core (OpenAI GPT-4o-mini)**: Context-aware LLM pipeline.
3. **Command Dashboard (Next.js/Tailwind)**: Real-time UI polling every 2.5s.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
The backend runs on Python 3.11+ and uses FastAPI.

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory and add your OpenAI API key:
```env
OPENAI_API_KEY="your-api-key-here"
```

**Run the Server:**
```bash
# Binds to 0.0.0.0 to allow testing from other devices on the same Wi-Fi
python -m uvicorn main:app --host 0.0.0.0 --reload
```

### 2. Frontend Setup
The frontend runs on Next.js 14, React 18, and TailwindCSS.

```bash
cd frontend
npm install
```

**Run the Client:**
```bash
# Automatically connects to the backend and exposes the UI on your network
npm run dev
```

Open `http://localhost:3000` (or your PC's local IP address) to view the Command Center!

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Lucide Icons, Recharts
- **Backend**: FastAPI, Uvicorn, Pydantic
- **AI Pipeline**: OpenAI SDK (`gpt-4o-mini`), Structured JSON Outputs

## 📜 Hackathon Demo Walkthrough
1. **Observe Baseline**: Watch the density values drift and time-series charts populate.
2. **Inject Emergency**: Click *Inject Simulated Emergency Vector*.
3. **Read Strategy**: Explain how the AI generated a structured response based on live telemetry context.
4. **Deploy Lockdown**: Hit the red lockdown button to demonstrate customizable emergency protocols and field broadcasts.
5. **Execute Response**: Authorize the AI strategy to simulate immediate crowd density reduction.
