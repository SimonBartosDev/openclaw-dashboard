async function callGateway(path, payload = {}) {
  const base = process.env.OPENCLAW_GATEWAY_URL;
  const token = process.env.OPENCLAW_GATEWAY_TOKEN;
  if (!base || !token) throw new Error('Missing gateway env vars');

  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Gateway ${res.status}`);
  return res.json();
}

export async function getOverview() {
  const [sessions, subs] = await Promise.all([
    callGateway('/v1/tools/sessions_list', { limit: 20, messageLimit: 0 }),
    callGateway('/v1/tools/subagents', { action: 'list', recentMinutes: 240 })
  ]);

  return {
    sessions: sessions?.sessions || [],
    subagents: subs?.items || subs?.subagents || []
  };
}
