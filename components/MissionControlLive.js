'use client';
import { useEffect, useState } from 'react';

function fmt(ts){ try { return new Date(ts).toLocaleString(); } catch { return ''; } }

export default function MissionControlLive({ initial }) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const r = await fetch('/api/runtime', { cache: 'no-store' });
        const j = await r.json();
        if (j?.ok) setData(j.data);
      } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid2" style={{ marginBottom: 16 }}>
      <div className="card">
        <div className="row"><h3>Live operations feed</h3><span className="muted">auto-refresh 5s</span></div>
        <ul className="clean">
          {(data.events || []).map((e, i) => (
            <li key={i}>
              <div><strong>{e.actor}</strong> {e.action} <strong>{e.object}</strong> {e.result}</div>
              <div className="muted">{fmt(e.ts)}</div>
            </li>
          ))}
          {(!data.events || data.events.length === 0) && <li className="muted">No live events yet.</li>}
        </ul>
      </div>
      <div className="card">
        <div className="row"><h3>Recent sessions</h3><span className="muted">workspace telemetry</span></div>
        <ul className="clean">
          {(data.sessions || []).map((s) => (
            <li key={s.file}>
              <div><strong>{s.name}</strong></div>
              <div className="muted">updated {fmt(s.mtime)} · {s.sizeKb} KB</div>
            </li>
          ))}
          {(!data.sessions || data.sessions.length === 0) && <li className="muted">No session files found.</li>}
        </ul>
      </div>
    </div>
  );
}
