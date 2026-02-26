'use client';
import { useMemo, useState } from 'react';

const TITLES = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done'
};

const OWNERS = ['Builder', 'Researcher', 'GrowthContent', 'Reviewer', 'Auditor'];

function uid() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function KanbanBoard({ initial }) {
  const [board, setBoard] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Builder');
  const [dragging, setDragging] = useState(null);

  const cards = useMemo(() => Object.values(board.columns || {}).flat().length, [board]);

  async function persist(next, logText) {
    setSaving(true);
    if (!next.activity) next.activity = [];
    if (logText) next.activity = [{ ts: Date.now(), text: logText }, ...next.activity].slice(0, 30);
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
    if (!card) return;
    const nextCard = { ...card, status: to };
    const next = {
      ...board,
      columns: {
        ...board.columns,
        [from]: board.columns[from].filter((c) => c.id !== cardId),
        [to]: [...board.columns[to], nextCard]
      }
    };
    persist(next, `${nextCard.title} moved ${TITLES[from]} → ${TITLES[to]}`);
  }

  function addTask() {
    if (!title.trim()) return;
    const card = { id: uid(), title: title.trim(), owner, status: 'backlog' };
    const next = {
      ...board,
      columns: {
        ...board.columns,
        backlog: [...board.columns.backlog, card]
      }
    };
    setTitle('');
    persist(next, `Task created: ${card.title} (${card.owner})`);
  }

  function deleteTask(col, cardId) {
    const card = board.columns[col].find((c) => c.id === cardId);
    const next = {
      ...board,
      columns: {
        ...board.columns,
        [col]: board.columns[col].filter((c) => c.id !== cardId)
      }
    };
    persist(next, `Task deleted: ${card?.title || cardId}`);
  }

  function editTask(col, cardId) {
    const card = board.columns[col].find((c) => c.id === cardId);
    if (!card) return;
    const nextTitle = prompt('Task title', card.title);
    if (!nextTitle) return;
    const nextOwner = prompt('Owner (Builder/Researcher/GrowthContent/Reviewer/Auditor)', card.owner) || card.owner;
    const next = {
      ...board,
      columns: {
        ...board.columns,
        [col]: board.columns[col].map((c) => (c.id === cardId ? { ...c, title: nextTitle.trim(), owner: nextOwner.trim() } : c))
      }
    };
    persist(next, `Task edited: ${card.title} → ${nextTitle.trim()}`);
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Team Kanban v2</h3>
        <span className="muted">{saving ? 'saving…' : `saved · ${cards} cards`}</span>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ gap: 8, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title" style={{ minWidth: 280, background:'#0f1730', color:'#dbe7ff', border:'1px solid #35508a', borderRadius:8, padding:'8px 10px' }} />
          <select value={owner} onChange={(e) => setOwner(e.target.value)} style={{ background:'#0f1730', color:'#dbe7ff', border:'1px solid #35508a', borderRadius:8, padding:'8px 10px' }}>
            {OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <button onClick={addTask} style={{ background:'#1f5ed8', color:'white', border:0, borderRadius:8, padding:'8px 12px', cursor:'pointer' }}>+ Add Task</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {Object.keys(TITLES).map((col) => (
          <div
            className="card"
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragging && move(dragging.cardId, dragging.from, col)}
          >
            <div className="row" style={{ marginBottom: 8 }}>
              <strong>{TITLES[col]}</strong>
              <span className="muted">{board.columns[col]?.length || 0}</span>
            </div>
            <ul className="clean">
              {(board.columns[col] || []).map((card) => (
                <li key={card.id} draggable onDragStart={() => setDragging({ cardId: card.id, from: col })}>
                  <div><strong>{card.title}</strong></div>
                  <div className="muted">{card.owner}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => editTask(col, card.id)} style={{ background:'#0f1730', border:'1px solid #2f4478', color:'#c9d8fb', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>Edit</button>
                    <button onClick={() => deleteTask(col, card.id)} style={{ background:'#3b1322', border:'1px solid #7f2d49', color:'#ffc3d5', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>Delete</button>
                    {col !== 'review' && <button onClick={() => move(card.id, col, 'review')} style={{ background:'#0f1730', border:'1px solid #2f4478', color:'#c9d8fb', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>Send to Review</button>}
                    {col !== 'done' && <button onClick={() => move(card.id, col, 'done')} style={{ background:'#10321f', border:'1px solid #2e6e4c', color:'#b9ffd8', borderRadius:8, padding:'4px 8px', cursor:'pointer' }}>Mark Done</button>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row" style={{ marginBottom: 8 }}>
          <strong>Activity feed</strong>
          <span className="muted">latest 30</span>
        </div>
        <ul className="clean">
          {(board.activity || []).slice(0, 10).map((a, i) => (
            <li key={i}>
              <div>{a.text}</div>
              <div className="muted">{new Date(a.ts).toLocaleString()}</div>
            </li>
          ))}
          {(!board.activity || board.activity.length === 0) && <li className="muted">No activity yet.</li>}
        </ul>
      </div>
    </div>
  );
}
