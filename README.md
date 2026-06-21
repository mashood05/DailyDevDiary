<div align="center">

# DailyDevDiary

### Your local workspace for commands, technical notes, and repeatable solutions.

[![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-Desktop-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)

**Fast · Private · Offline-first · No account required**

</div>

---

## What is DailyDevDiary?

DailyDevDiary is a lightweight desktop app for keeping the technical knowledge you reuse every day. Save commands, troubleshooting notes, setup guides, explanations, and screenshots in one focused local workspace.

Instead of solving the same problem from scratch, open your diary and pick up exactly where you left off.

## Highlights

| Feature | Description |
| --- | --- |
| 📁 **Collections** | Organize related notes into focused workspaces. |
| ✍️ **Inline editing** | Read and edit on the same page with a Notion-style experience. |
| 🧩 **Setup steps** | Build ordered guides with a title, command, and explanation for every step. |
| 🖼️ **Screenshots** | Attach multiple image references directly to individual setup steps. |
| 💾 **Autosave** | Changes are saved automatically to the current in-memory store. |
| 🖥️ **Desktop-first** | A clean native desktop shell powered by Tauri and Rust. |

> [!IMPORTANT]
> The project currently uses in-memory storage. Collections, notes, and screenshots reset when the app restarts. SQLite persistence is planned next.

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- Microsoft Edge WebView2 on Windows

### Install and run

```powershell
git clone https://github.com/mashood05/DailyDevDiary.git
cd DailyDevDiary

cd frontend
npm install

cd ../backend
npm install
npm run dev
```

Keep the terminal open while using the app. Press `Ctrl + C` to stop it.

## Project structure

```text
DailyDevDiary/
├── frontend/              React and TypeScript interface
│   └── src/
│       ├── data/          Storage contracts and in-memory repository
│       ├── hooks/         Application state and autosave behavior
│       └── *.tsx          Sidebar, workspace, and inline editor
└── backend/               Tauri and Rust desktop application
    ├── capabilities/      Desktop permissions
    └── src/               Rust entry point
```

## Architecture

The interface depends on a repository contract rather than a specific database implementation.

```text
React interface
      ↓
Application hooks
      ↓
DiaryRepository
      ↓
In-memory store → SQLite store (planned)
```

This keeps the current prototype simple while allowing persistence to be added without rewriting the editor UI.

## Roadmap

- [x] Desktop application shell
- [x] Collections and notes
- [x] Notion-style inline editor
- [x] Ordered command steps
- [x] In-memory screenshot attachments
- [ ] SQLite persistence
- [ ] Search, tags, and filters
- [ ] CodeMirror-powered code editing
- [ ] One-click command copying
- [ ] Snapshots and reusable templates

## Development principles

- Build one small, testable feature at a time.
- Keep frontend and backend responsibilities clear.
- Stay local-first and useful without an internet connection.
- Prefer simple code that is easy to understand and extend.

---

<div align="center">

Built for developers who would rather reuse a solution than rediscover it.

</div>
