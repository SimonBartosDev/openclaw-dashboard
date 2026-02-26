# OpenClaw Dashboard (Modern SaaS v1)

A lightweight dashboard to track sessions and subagents in OpenClaw.

## Features (v1)
- Overview KPIs (sessions, subagents, gateway status)
- Recent sessions list
- Active subagents list
- Health endpoint

## Stack
- Next.js 14
- React 18
- Docker + Docker Compose

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Edit `.env`:
- `OPENCLAW_GATEWAY_URL` (usually `http://127.0.0.1:18789`)
- `OPENCLAW_GATEWAY_TOKEN` (gateway token)

3. Run locally:

```bash
npm install
npm run dev
```

Open: `http://localhost:3001`

## Docker Run

```bash
docker compose up -d --build
```

Open: `http://<server-ip>:3001`

## Suggested Production Access
- `dash.yourdomain.com` via Nginx/Caddy reverse proxy
- HTTPS (Let's Encrypt)
- Keep gateway token server-side only

## Next v1.5
- Workflow board
- Cron job panel
- Subagent controls (spawn/kill/steer)
- Role-tagged activity feed
