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
.container { max-width: 1100px; margin: 0 auto; padding: 24px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0,1fr)); }
.card {
  background: linear-gradient(180deg, var(--panel), var(--panel-2));
  border: 1px solid #2b3a63;
  border-radius: 14px;
  padding: 16px;
}
.kpi { font-size: 28px; font-weight: 700; }
.muted { color: var(--muted); font-size: 13px; }
.title { font-size: 26px; margin: 0 0 6px; }
.row { display: flex; justify-content: space-between; align-items: center; }
.pill { border:1px solid #35508a; color:#b8cdf8; border-radius:999px; padding:4px 10px; font-size:12px; }
ul.clean { list-style:none; padding:0; margin:0; }
ul.clean li { padding: 10px 0; border-bottom:1px solid #26365f; }
code { background:#0f1730; border:1px solid #2f4478; padding:2px 6px; border-radius:8px; }
@media (max-width: 900px){ .grid{ grid-template-columns: 1fr; } }
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
