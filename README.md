# 🏢 Claw-Empire — AI Agent Office Simulator

> **Command Your AI Agent Empire from the CEO Desk**

[![Deployed](https://img.shields.io/badge/🚀_Live-Deployed-22c55e?style=for-the-badge)](https://claw-empire-ai.surge.sh)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-6366f1?style=for-the-badge&logo=github)](https://github.com/paopaonyapi-creator/claw-empire-ai)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Auto_Deploy-f59e0b?style=for-the-badge)](https://github.com/paopaonyapi-creator/claw-empire-ai/actions)

---

## 🎮 What is Claw-Empire?

A **local-first AI agent office simulator** where you play as CEO of your own tech company. Hire AI agents, assign tasks, earn coins, and compete against rival companies — all with a stunning dark-mode UI.

## ✨ Features (30+)

### 🤖 Agent Management
- **Agent Dashboard** — View, hire, and manage AI agents with real-time status
- **Agent Training System** — 8 training courses to level up skills
- **Agent Mood System** — 5 moods (😊😐😴😤⚡) affecting productivity
- **Agent Relationships** — Friendship/rivalry bonds between agents

### 💬 Communication
- **AI Chat & CEO Commands** — Chat with agents, use `$ commands` for quick actions
- **TTS Voice Responses** — Agents speak back (ElevenLabs → Web Speech fallback)
- **Inter-Agent Messenger** — Agents chat with each other automatically
- **Messenger Integration** — Telegram, Discord, Slack, WhatsApp channels

### 📊 Dashboard & Analytics
- **Real-time KPI Cards** — Tasks, agents, success rate, coins
- **Chart.js Visualizations** — Bar, Radar (team skills), Line (performance trend)
- **Sprint Burndown Chart** — 7-day sprint tracking
- **Export Reports** — CSV & JSON export for all data

### 🎮 Gamification
- **Economy System** — Earn coins through agent task completion
- **Agent Marketplace** — Buy new agents (Ninja Dev, Oracle AI, Phoenix) & boosts
- **Daily Quests** — 3 random daily missions with coin rewards
- **Random Company Events** — Hackathon, Server Crash, Investor Visit, Bug Outbreak
- **Achievements & Badges** — Unlock rewards for milestones
- **Level-Up Celebrations** — Full-screen confetti + fanfare

### 🏆 Endgame Systems
- **Company Rivals** — Compete vs 5 AI companies (NexusTech, PhantomAI, TitanCorp...)
- **Prestige System** — Reset for +15% permanent multiplier (idle game loop)
- **CEO Profile** — RPG-style character card with level, rank, and stats
- **Company Timeline** — 13 milestone achievements to unlock

### 🎮 Mini-Games
- **Typing Speed Test** — Type dev words for WPM score + coin reward
- **Memory Match** — 8 emoji pairs, scored by speed and accuracy

### ⚙️ Settings & Customization
- **8 Color Themes** — Neon, Ocean, Forest, Sunset, Cherry, Cyberpunk, Arctic, Mono
- **Dark/Light Mode** — Smooth theme switching
- **Animated Background** — Particle effects for premium feel
- **Keyboard Shortcuts** — 6 shortcuts for power users
- **Enhanced Sound Effects** — Purchase, level-up, coin sounds (Web Audio API)

### 🔐 Infrastructure
- **Supabase Auth** — Login, registration, session management
- **CI/CD Pipeline** — GitHub Actions auto-deploy to Surge on push
- **Mobile Responsive** — Full mobile/tablet support
- **Animated Splash Screen** — Premium loading experience
- **Notification Center** — Filter, mark-all-read, badge count
- **PWA Support** — Installable as mobile app

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/paopaonyapi-creator/claw-empire-ai.git
cd claw-empire-ai

# Just open index.html — no build required!
open index.html

# Or start the backend for AI responses
cd backend && npm install && node server.js
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS, CSS3, HTML5 |
| Charts | Chart.js 4 |
| Auth | Supabase |
| Backend | Node.js + Express |
| AI | Gemini API, OpenAI API |
| TTS | ElevenLabs / Web Speech API |
| CI/CD | GitHub Actions → Surge |
| Audio | Web Audio API |

## 📁 Project Structure

```
├── index.html          # Main entry + splash screen
├── styles.css          # 1800+ lines of premium CSS
├── js/
│   ├── store.js        # State management (localStorage)
│   ├── dashboard.js    # Dashboard + Charts
│   ├── agents.js       # Agent table + training
│   ├── chat.js         # AI chat + $ commands
│   ├── kanban.js       # Task management
│   ├── messenger.js    # Messenger + agent chat
│   ├── settings.js     # Settings + themes
│   ├── gameplay.js     # Quests, events, moods
│   ├── endgame.js      # Rivals, relationships, prestige
│   ├── extras.js       # Mini-games, notifications, timeline
│   └── app.js          # App init + economy + marketplace
├── backend/
│   └── server.js       # AI proxy server
└── .github/workflows/  # CI/CD pipeline
```

## 🎨 Color Themes

| Theme | Color |
|-------|-------|
| 💜 Neon (Default) | Purple/Indigo |
| 🌊 Ocean Blue | Sky Blue |
| 🌲 Forest Green | Emerald |
| 🌅 Sunset Orange | Orange/Amber |
| 🌸 Cherry Pink | Pink/Magenta |
| ⚡ Cyberpunk | Yellow/Gold |
| ❄️ Arctic Ice | Cyan/Teal |
| ⬛ Monochrome | Gray |

## 📜 License

MIT License — Built with ❤️ for AI agent enthusiasts.

---

**Made by Claw-Empire Team** 🐾
