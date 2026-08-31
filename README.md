# 🎮 NexusPlay - Enterprise-Grade Full Stack Gaming & Esports Platform

[![CI Pipeline](https://img.shields.io/badge/CI-Passing-00ffcc?style=for-the-badge&logo=githubactions&logoColor=black)](.github/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time_Netcode-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

**NexusPlay** is a high-performance, modular full-stack gaming platform monorepo engineered with modern web technologies, real-time authoritative multiplayer tick synchronization, a shared physics/math game engine, virtual economy, esports tournament ladders, and four playable 2D/3D games.

---

## 🌟 Playable Game Suite

| Game | Engine & Technology | Genre | Mechanics |
| :--- | :--- | :--- | :--- |
| **🏎️ Cyber Racer 3D** | Three.js + WebGL + Web Audio | 3D Anti-Gravity Racer | Procedural neon track, particle thrusters, speed gates, nitro boosts, dynamic camera |
| **🧙‍♂️ Dungeon Rogue** | HTML5 Canvas + Procedural BSP | Roguelike Action RPG | Procedural dungeon levels, fog of war, skeleton mob AI, combat math, chest looting |
| **🚀 Cosmo Strike** | Canvas 2D + Bullet Hell Engine | Arcade Space Shooter | Starfield parallax, weapon upgrades, enemy armada waves, shield mechanics |
| **♟️ Nexus Chess** | Cyber Tactics Engine | Turn-Based Strategy | Standard chess validation, capture animations, rating progression, AI opponent |

---

## 🏗️ Architecture & Monorepo Structure

```
gaming/
├── apps/
│   ├── web/                          # React 18 + Vite + TailwindCSS + Three.js Client
│   │   ├── src/
│   │   │   ├── components/           # Navbar, Real-time ChatBox, Matchmaking Modal, Audio Synthesizer
│   │   │   ├── games/                # Cyber Racer 3D, Dungeon Rogue, Cosmo Strike, Nexus Chess
│   │   │   └── pages/                # Hub, Arenas, Store, Clans, Tournaments, Leaderboard, Profile, Admin
│   └── server/                       # Node.js + Express + Socket.IO Backend Server
│       ├── prisma/                   # SQLite / PostgreSQL Schema & Migrations
│       └── src/
│           ├── controllers/          # Auth, Player, Economy, Clans, Tournaments, Admin
│           ├── middleware/           # JWT, RBAC, Anti-Cheat sanity filters
│           ├── services/             # Matchmaking queue, MMR calculations, Economy
│           └── sockets/              # Authoritative 30Hz game rooms & tick engine
├── packages/
│   ├── game-engine/                  # Shared Math, Physics (2D/3D), A* Pathfinding, Netcode, Procedural Gen
│   └── shared-types/                 # Universal TypeScript interfaces, enums, & Socket events
├── scripts/
│   ├── generate-pr-history.js        # Automated Git Pull Request simulation script
│   └── push-to-github.ps1            # Remote GitHub repository sync script
└── .github/
    ├── workflows/ci.yml              # Automated GitHub Actions CI pipeline
    ├── PULL_REQUEST_TEMPLATE.md      # Standardized PR template
    └── ISSUE_TEMPLATE/               # Feature request & Bug report templates
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x, v20.x, or v22.x)
- [npm](https://www.npmjs.com/) (v9+ or v10+)
- [Git](https://git-scm.com/)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full Stack Development Environment
```bash
# Start backend server & frontend web client concurrently
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API & WebSocket Server**: [http://localhost:4000](http://localhost:4000)
- **Server Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

---

## 🔄 GitHub Closed Pull Request History

This repository is initialized with a structured Git branch workflow where feature branches are merged into `main` via pull request merge commits:

1. **PR #1**: `feat(types)` - Shared data models, contracts, and real-time socket events
2. **PR #2**: `feat(engine)` - Core math, 2D/3D physics, A* pathfinding, and netcode reconciliation
3. **PR #3**: `feat(server)` - Express API, JWT auth, Prisma ORM, and Socket.IO 30Hz game rooms
4. **PR #4**: `feat(cyber-racer)` - High-speed 3D Three.js WebGL procedural racer
5. **PR #5**: `feat(dungeon-rogue)` - 2D roguelike dungeon crawler with fog of war & loot
6. **PR #6**: `feat(cosmo-strike)` - Arcade bullet hell space shooter & alien armada waves
7. **PR #7**: `feat(nexus-chess)` - Tactical strategy chess game with bot integration
8. **PR #8**: `feat(platform-ui)` - Cyberpunk dashboard, economy store, clans, and GM admin suite

### Generate or Replay PR Commit Tree
```bash
npm run git:history
```

### Push to Remote GitHub Repository
```powershell
.\scripts\push-to-github.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
```

---

## 🛡️ Anti-Cheat & Security
- **Packet Rate Sanity Checks**: Rejects spoofed client timestamps with delta > 10,000ms.
- **Velocity Clamping**: Authoritative server validates maximum movement vectors.
- **Role-Based Access Control (RBAC)**: Protected Game Master endpoints for real-time telemetry and balance variable overrides.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
