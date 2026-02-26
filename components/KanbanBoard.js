'use client';
import { useState } from 'react';

const TITLES = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done'
};

export default function KanbanBoard({ initial }) {
  const [board, setBoard] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function persist(next) {
    setSaving(true);
    setBoard(next);
    await fetch('/api/kanban', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(next)
    });
    setSaving(false);
  }

  function move(cardId, from, to) {
    if (from === to) return;
    const card = board.columns[from].find((c) => c.id === cardId);
    const next = {
      columns: {
        ...board.columns,
        [from]: board.columns[from].filter((c) => c.id !== cardId),
        [to]: [...board.columns[to], card]
      }
    };
    persist(next);
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Team Kanban</h3>
        <span className="muted">{saving ? 'saving…' : 'saved'}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {Object.keys(TITLES).map((col) => (
          <div className="card" key={col}>
            <div className="row" style={{ marginBottom: 8 }}>
              <strong>{TITLES[col]}</strong>
              <span className="muted">{board.columns[col]?.length || 0}</span>
            </div>
            <ul className="clean">
              {(board.columns[col] || []).map((card) => (
                <li key={card.id}>
                  <div><strong>{card.title}</strong></div>
                  <div className="muted">{card.owner}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {Object.keys(TITLES).filter((k) => k !== col).map((k) => (
                      <button key={k} onClick={() => move(card.id, col, k)} style={{ background:'#0f1730', border:'1px solid #2f4478', color:'#c9d8fb', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>
                        → {TITLES[k]}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
