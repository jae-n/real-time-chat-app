# Campfire Chat — Run Instructions


Prerequisites
- Node.js (v14+ recommended).
- A browser (Chrome, Edge, Firefox) and PowerShell or another terminal.

Quick start (Windows PowerShell)
1. Open PowerShell and change to the project directory:

```powershell
cd 'C:\Path\To\react'
```

2. Install dependencies (only required once):

```powershell
npm install express socket.io
```

3. Start the server:

```powershell
node server.js
```

4. Open a browser and go to:

```
http://localhost:3000
```

Open another tab to the same URL to test multi-client behavior (messages and presence).

Optional: add a start script
- Add the following `scripts` entry to your `package.json` so you can run `npm start`:

```json
"scripts": {
  "start": "node server.js"
}
```

Changing the port (if 3000 is busy)
- To run on a different port, set the `PORT` environment variable before starting the server:

```powershell
# set PORT for this session and start server
$env:PORT = 4000; node server.js

# or run in one line (PowerShell):
($env:PORT = 4000) -and (node server.js)
```

Troubleshooting
- Error `EADDRINUSE`: another process is using the port. Either stop that process or run the server on a different port (see above).
- Socket.IO client fails to connect: make sure `node server.js` is running and that the page loads `/socket.io/socket.io.js`. The server serves this automatically.
- Messages not appearing in other tabs: check browser console for connection errors and confirm both tabs are on the same origin (http://localhost:3000).

Demo checklist (quick)
- Two tabs open to `http://localhost:3000`.
- Send a message from one tab — it appears in the other.
- Online user count increments/decrements with tab open/close.

Notes & limitations
- Usernames are client-supplied and stored in `localStorage` (no server-side authentication).
- Messages are not persisted — restarting the server clears history.
- No rate-limiting is implemented; a production system should guard against spam.

Next suggested changes I can make for you
- Add a `start` script and update `package.json`.
- Add basic server-side validation (message length and type checks) to `server.js`.
- Start the server here to verify behavior and capture logs.

Tell me which one you'd like me to do next.
# Campfire Chat

Lightweight real-time chat demo using Node, Express and Socket.IO — suitable for a computer networks project/demo.

## Project Goal
- What: A small browser-based chat application (client + server) that demonstrates real-time messaging and presence tracking.
- Why: To show how WebSocket-based communication (Socket.IO) works over TCP, including event-driven messaging, connection lifecycle, and basic state management.

## Project Structure
- `server.js` — Node/Express server that serves static files and hosts Socket.IO. Tracks connected users and broadcasts events.
- `client.js` — Browser client that connects to the server via Socket.IO, sends/receives events, and updates the UI.
- `main.html` — Main chat UI (served by the server).
- `script.js` — Auxiliary client-side script used by sign-in or other pages (local account simulation).
- `main.css` / other static assets — Styling and UI resources.

## How it works (high level)
- Clients connect to the server using Socket.IO (WebSocket transport when available).
- Client events: `user-joined`, `chat message`, `user-leaving`.
- Server handles connections, maintains a Map of online users, and emits presence/messages to all connected clients.
- Transport: WebSocket (or HTTP long-polling fallback) over TCP on port `3000` by default.

## How to run (local, Windows PowerShell)
1. Ensure you have Node.js installed (v14+ recommended).
2. From the project root (`C:\Users\james\react`) install dependencies and start the server:

```powershell
npm init -y
npm install express socket.io
node server.js
```

3. Open a browser and go to `http://localhost:3000` (or open multiple tabs to test presence and messaging).

## What to test (demo checklist)
- Open two browser tabs to `http://localhost:3000` and confirm both connect.
- Send a message from one tab — it should appear in the other tab.
- Confirm online count increments/decrements when tabs open/close.
- Try sending a message containing HTML to verify the client escapes it (prevents simple XSS in rendering).

## Known limitations & security notes
- No server-side authentication — usernames are client-supplied and stored in `localStorage` (vulnerable to impersonation). Document this in your report.
- No persistence — messages are not stored across server restarts.
- No rate-limiting — a malicious client could spam messages. Add server-side rate-limiting for production or final submission.
- Uses plain HTTP/WebSocket by default — use HTTPS/WSS for secure deployments.

## Suggested improvements (for higher credit)
- Add server-side validation (message length, type checks) and sanitization.
- Add a basic rate limiter per-socket to prevent spam.
- Add message persistence (file, SQLite, or simple JSON store) if required by the assignment.
- Add authentication (even a simple username/password or OAuth) to prevent impersonation.
- Add a `package.json` `start` script: `"start": "node server.js"` for convenience.

