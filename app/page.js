import KanbanBoard from '@/components/KanbanBoard';

async function loadJson(path) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const res = await fetch(`${base}${path}`, { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  const [overviewPayload, kanbanPayload] = await Promise.all([
    loadJson('/api/overview'),
    loadJson('/api/kanban')
  ]);

  const data = overviewPayload?.data || { agents: [], columns: {}, cardCount: 0, activeSubagentsExpected: 0 };
  const kanban = kanbanPayload?.data || { columns: { backlog: [], in_progress: [], review: [], done: [] } };

  return (
    <main className="container">
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="title">OpenClaw Team Dashboard</h1>
          <div className="muted">Modern SaaS control panel · orchestration + kanban</div>
        </div>
        <span className="pill">{data.mode || 'live'}</span>
      </div>

      <section className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="muted">Configured Team Agents</div>
          <div className="kpi">{data.agents.length}</div>
        </div>
        <div className="card">
          <div className="muted">Expected Active Subagents</div>
          <div className="kpi">{data.activeSubagentsExpected}</div>
        </div>
        <div className="card">
          <div className="muted">Kanban Cards</div>
          <div className="kpi">{data.cardCount}</div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="row"><h3>Team lanes</h3><span className="muted">from workspace config</span></div>
        <ul className="clean">
          {data.agents.map((a) => (
            <li key={a}><strong>{a}</strong></li>
          ))}
        </ul>
      </section>

      <section className="card">
        <KanbanBoard initial={kanban} />
      </section>
    </main>
  );
}
