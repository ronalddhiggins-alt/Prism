import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Guard: table may not exist yet on a brand new app
    await sql`CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      path TEXT NOT NULL,
      referrer TEXT,
      session_id TEXT,
      is_owner BOOLEAN DEFAULT false,
      user_agent TEXT,
      visited_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;

    const [totals, uniques, me, others, recent] = await sql.transaction(
      (txn) => [
        txn`SELECT COUNT(*)::int AS count FROM visits`,
        txn`SELECT COUNT(DISTINCT session_id)::int AS count FROM visits WHERE session_id IS NOT NULL`,
        txn`SELECT COUNT(*)::int AS count FROM visits WHERE is_owner = true`,
        txn`SELECT COUNT(*)::int AS count FROM visits WHERE is_owner = false OR is_owner IS NULL`,
        txn`SELECT TO_CHAR(visited_at::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
           FROM visits
           WHERE visited_at >= NOW() - INTERVAL '30 days'
           GROUP BY visited_at::date
           ORDER BY visited_at::date ASC`,
      ],
    );

    return Response.json({
      ok: true,
      totals: {
        visits: totals?.[0]?.count ?? 0,
        uniqueSessions: uniques?.[0]?.count ?? 0,
      },
      me: { visits: me?.[0]?.count ?? 0 },
      others: { visits: others?.[0]?.count ?? 0 },
      recent: recent ?? [],
    });
  } catch (err) {
    console.error("/api/analytics/summary error", err);
    return Response.json(
      { ok: false, error: "failed_to_get_summary" },
      { status: 500 },
    );
  }
}
