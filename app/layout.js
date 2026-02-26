export const metadata = {
  title: process.env.DASHBOARD_TITLE || 'OpenClaw Control',
  description: 'Track sessions, subagents, cron jobs, and workflow state.'
};

const GLOBAL_CSS = `
:root {
  --bg: #0b1020;
  --panel: #121a2f;
  --panel-2: #1a2440;
  --text: #e8ecf8;
  --muted: #9fb0d1;
  --accent: #6ea8fe;
  --ok: #50d18d;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background: radial-gradient(1200px 600px at 20% -10%, #1b2a54, transparent), var(--bg);
  color: var(--text);
}
.shell { display:grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.sidebar { border-right:1px solid #24345d; padding:18px 14px; background:rgba(8,12,25,0.55); backdrop-filter: blur(8px); position: sticky; top:0; height:100vh; }
.brand { font-size:20px; font-weight:800; margin-bottom:4px; }
.nav { display:flex; flex-direction:column; gap:6px; }
.navItem { text-align:left; border:1px solid transparent; color:#b8c8ea; background:transparent; border-radius:10px; padding:8px 10px; cursor:pointer; }
.navItem:hover { background:#132043; border-color:#2a4277; }
.navItem.active { background:#173068; color:#dce8ff; border-color:#3557a0; }
.mainPane { min-width: 0; }
.topbar { position: sticky; top:0; z-index:3; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #24345d; background:rgba(11,16,32,0.8); backdrop-filter: blur(8px); padding:12px 18px; }
.searchWrap { flex:1; max-width:560px; }
.search { width:100%; background:#0f1730; border:1px solid #2f4478; color:#dce8ff; border-radius:10px; padding:10px 12px; }
.content { padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0,1fr)); }
.grid2 { display:grid; gap:16px; grid-template-columns: 1.2fr .8fr; }
.card {
  background: linear-gradient(180deg, var(--panel), var(--panel-2));
  border: 1px solid #2b3a63;
  border-radius: 14px;
  padding: 16px;
}
.kpi { font-size: 28px; font-weight: 700; }
.muted { color: var(--muted); font-size: 13px; }
.title { font-size: 28px; margin: 0 0 6px; }
.row { display: flex; justify-content: space-between; align-items: center; }
.pill { border:1px solid #35508a; color:#b8cdf8; border-radius:999px; padding:4px 10px; font-size:12px; }
ul.clean { list-style:none; padding:0; margin:0; }
ul.clean li { padding: 10px 0; border-bottom:1px solid #26365f; }
.btn { border:1px solid #35508a; color:#cfe1ff; background:#0f1730; border-radius:10px; padding:8px 10px; cursor:pointer; }
.btn.primary { background:#245ed6; border-color:#3e74e8; color:white; }
.btn.ghost { background:transparent; }
code { background:#0f1730; border:1px solid #2f4478; padding:2px 6px; border-radius:8px; }
@media (max-width: 1100px){ .shell{ grid-template-columns:1fr; } .sidebar{ display:none; } .grid{ grid-template-columns:1fr; } .grid2{ grid-template-columns:1fr; } }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {children}
      </body>
    </html>
  );
}
