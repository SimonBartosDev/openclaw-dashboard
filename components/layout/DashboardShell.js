'use client';

const NAV = [
  'Overview',
  'Agents',
  'Runs',
  'Events',
  'Automations',
  'Channels',
  'Knowledge',
  'Team',
  'Settings'
];

export default function DashboardShell({ children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">OpenClaw</div>
        <div className="muted" style={{ marginBottom: 14 }}>Control Center</div>
        <nav className="nav">
          {NAV.map((item, i) => (
            <button key={item} className={`navItem ${i === 0 ? 'active' : ''}`}>{item}</button>
          ))}
        </nav>
      </aside>
      <div className="mainPane">
        <header className="topbar">
          <div className="searchWrap">
            <input className="search" placeholder="Search runs, tasks, agents..." />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn ghost">⌘K</button>
            <button className="btn primary">+ Create</button>
          </div>
        </header>
        <section className="content">{children}</section>
      </div>
    </div>
  );
}
