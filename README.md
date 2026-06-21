# DailyDevDiary

DailyDevDiary is a local-first desktop app for saving technical notes, commands, setup steps, and screenshots.

The current version includes:

- Collections and notes
- Notion-style inline editing
- Ordered setup steps with commands and explanations
- In-memory screenshot attachments
- In-memory autosaving

Data currently resets when the app restarts. SQLite persistence will be added later.

## Tech stack

- Tauri
- React
- TypeScript
- Rust

## Development

Install the frontend dependencies:

```powershell
cd frontend
npm install
```

Install the Tauri CLI dependency:

```powershell
cd ../backend
npm install
```

Run the desktop app from the backend directory:

```powershell
npm run dev
```

Press `Ctrl + C` to stop the development process.

## Project structure

```text
frontend/  React and TypeScript interface
backend/   Tauri and Rust desktop application
```
