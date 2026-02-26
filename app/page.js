async function loadOverview() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  const res = await fetch(`${base}/api/overview`, { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  const payload = await loadOverview();
  const data = payload?.data || { sessions: [], subagents: [] };

  return (
    <main className="container">
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="title">OpenClaw Dashboard</h1>
          <div className="muted">Modern SaaS control panel (v1)</div>
        </div>
        <span className="pill">live</span>
      </div>

      <section className="grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="muted">Active Sessions</div>
          <div className="kpi">{data.sessions.length}</div>
        </div>
        <div className="card">
          <div className="muted">Active Subagents</div>
          <div className="kpi">{data.subagents.length}</div>
        </div>
        <div className="card">
          <div className="muted">Gateway</div>
          <div className="kpi" style={{ color: 'var(--ok)' }}>Connected</div>
        </div>
      </section>

      <section className="grid">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="row"><h3>Recent Sessions</h3><span className="muted">top 8</span></div>
          <ul className="clean">
            {data.sessions.slice(0, 8).map((s) => (
              <li key={s.key}>
                <div><strong>{s.displayName || s.key}</strong></div>
                <div className="muted">{s.kind} · {s.model || 'default model'}</div>
              </li>
            ))}
            {data.sessions.length === 0 && <li className="muted">No sessions found</li>}
          </ul>
        </div>

        <div className="card">
          <h3>Subagents</h3>
          <ul className="clean">
            {data.subagents.slice(0, 8).map((a, i) => (
              <li key={a.childSessionKey || i}>
                <div><strong>{a.label || a.childSessionKey || `agent-${i+1}`}</strong></div>
                <div className="muted">{a.state || a.status || 'active'}</div>
              </li>
            ))}
            {data.subagents.length === 0 && <li className="muted">No active subagents</li>}
          </ul>
        </div>
      </section>

      {!payload?.ok && (
        <section className="card" style={{ marginTop: 16 }}>
          <strong>Connection error</strong>
          <div className="muted">{payload?.error || 'Unknown error'}</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Make sure <code>OPENCLAW_GATEWAY_URL</code> and <code>OPENCLAW_GATEWAY_TOKEN</code> are set.
          </div>
        </section>
      )}
    </main>
  );
}
