import sql from "@/app/api/utils/sql";

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(/;\s*/);
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx > -1) {
      const k = decodeURIComponent(p.slice(0, idx).trim());
      const v = decodeURIComponent(p.slice(idx + 1).trim());
      out[k] = v;
    }
  }
  return out;
}

export async function POST(request) {
  try {
    // Ensure table exists (idempotent)
    await sql`CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      path TEXT NOT NULL,
      referrer TEXT,
      session_id TEXT,
      is_owner BOOLEAN DEFAULT false,
      user_agent TEXT,
      visited_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits (visited_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visits_session ON visits (session_id)`;

    const { path, referrer, sessionId } = await request
      .json()
      .catch(() => ({}));
    const headers = request.headers;
    const ua = headers.get("user-agent") || null;
    const cookies = parseCookies(headers.get("cookie"));
    const isOwner = cookies["prism_owner"] === "1";

    const safePath = typeof path === "string" && path.length ? path : "/";
    const safeRef =
      typeof referrer === "string" ? referrer.slice(0, 1024) : null;
    const safeSession =
      typeof sessionId === "string" ? sessionId.slice(0, 128) : null;

    await sql`INSERT INTO visits (path, referrer, session_id, is_owner, user_agent) VALUES (${safePath}, ${safeRef}, ${safeSession}, ${isOwner}, ${ua})`;

    return Response.json({ ok: true });
  } catch (err) {
    console.error("/api/analytics/visit error", err);
    return Response.json(
      { ok: false, error: "failed_to_log_visit" },
      { status: 500 },
    );
  }
}
