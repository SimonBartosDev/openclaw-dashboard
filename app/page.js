import KanbanBoard from '@/components/KanbanBoard';
import DashboardShell from '@/components/layout/DashboardShell';
import MissionControlLive from '@/components/MissionControlLive';
import { getOverview, getKanban, getRuntimeSnapshot } from '@/lib/openclaw';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getOverview();
  const kanban = getKanban();
  const runtime = getRuntimeSnapshot();
  const activity = (kanban.activity || []).slice(0, 8);

  return (
    <DashboardShell>
      <main className="container">
        <div className="row" style={{ marginBottom: 18 }}>
          <div>
            <h1 className="title">OpenClaw Team Dashboard</h1>
            <div className="muted">Modern SaaS control panel · orchestration + workflow</div>
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

        <MissionControlLive initial={runtime} />

        <section className="grid2" style={{ marginBottom: 16 }}>
          <div className="card">
            <div className="row"><h3>Team lanes</h3><span className="muted">owner routing</span></div>
            <ul className="clean">
              {data.agents.map((a) => (
                <li key={a}><strong>{a}</strong></li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="row"><h3>Recent activity</h3><span className="muted">latest events</span></div>
            <ul className="clean">
              {activity.map((a, i) => (
                <li key={i}>
                  <div>{a.text}</div>
                  <div className="muted">{new Date(a.ts).toLocaleString()}</div>
                </li>
              ))}
              {activity.length === 0 && <li className="muted">No activity yet.</li>}
            </ul>
          </div>
        </section>

        <section className="card">
          <KanbanBoard initial={kanban} />
        </section>
      </main>
    </DashboardShell>
  );
}
