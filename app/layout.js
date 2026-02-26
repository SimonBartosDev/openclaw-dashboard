export const metadata = {
  title: process.env.DASHBOARD_TITLE || 'OpenClaw Control',
  description: 'Track sessions, subagents, cron jobs, and workflow state.'
};

import './styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
