import fs from 'fs';
import path from 'path';

const ROOT = '/data/.openclaw/workspace';
const TEAM_DIR = path.join(ROOT, 'team', 'agents');
const KANBAN_PATH = path.join(ROOT, 'team', 'kanban.json');

function readJsonSafe(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function seedBoard() {
  return {
    columns: {
      backlog: [
        { id: 't-1', title: 'Dashboard v1: Live OpenClaw metrics', owner: 'Builder', status: 'backlog' },
        { id: 't-2', title: 'Wire Review + Audit gates', owner: 'Reviewer/Auditor', status: 'backlog' }
      ],
      in_progress: [
        { id: 't-3', title: 'Kanban board + workflow controls', owner: 'Builder', status: 'in_progress' }
      ],
      review: [],
      done: []
    },
    activity: [
      { ts: Date.now(), text: 'Board initialized.' }
    ]
  };
}

function ensureKanban() {
  if (!fs.existsSync(path.dirname(KANBAN_PATH))) {
    fs.mkdirSync(path.dirname(KANBAN_PATH), { recursive: true });
  }
  if (!fs.existsSync(KANBAN_PATH)) {
    fs.writeFileSync(KANBAN_PATH, JSON.stringify(seedBoard(), null, 2));
  }
}

export function getKanban() {
  ensureKanban();
  const data = readJsonSafe(KANBAN_PATH, seedBoard());
  if (!data.activity) data.activity = [];
  return data;
}

export function saveKanban(next) {
  ensureKanban();
  if (!next.activity) next.activity = [];
  fs.writeFileSync(KANBAN_PATH, JSON.stringify(next, null, 2));
  return next;
}

export async function getOverview() {
  ensureKanban();
  const agents = fs.existsSync(TEAM_DIR)
    ? fs.readdirSync(TEAM_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''))
    : [];
  const kanban = getKanban();
  const cardCount = Object.values(kanban.columns || {}).reduce((n, arr) => n + (arr?.length || 0), 0);

  return {
    mode: 'local-team-workspace',
    agents,
    activeSubagentsExpected: 5,
    cardCount,
    columns: Object.fromEntries(Object.entries(kanban.columns || {}).map(([k, v]) => [k, v.length]))
  };
}
