import sql from "@/app/api/utils/sql";

// Log a new investigation
export async function POST(request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string") {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    // Get IP and user agent for tracking (optional)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Log the investigation
    await sql`
      INSERT INTO investigations (topic, ip_address, user_agent)
      VALUES (${topic}, ${ip}, ${userAgent})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error logging investigation:", error);
    return Response.json(
      { error: "Failed to log investigation" },
      { status: 500 },
    );
  }
}

// Get live activity data
export async function GET() {
  try {
    // Get recent investigations (last 2 hours)
    const recentInvestigations = await sql`
      SELECT topic, investigated_at
      FROM investigations
      WHERE investigated_at > NOW() - INTERVAL '2 hours'
      ORDER BY investigated_at DESC
      LIMIT 10
    `;

    // Get popular topics in last hour
    const popularTopics = await sql`
      SELECT topic, COUNT(*) as investigation_count
      FROM investigations
      WHERE investigated_at > NOW() - INTERVAL '1 hour'
      GROUP BY topic
      ORDER BY investigation_count DESC, MAX(investigated_at) DESC
      LIMIT 5
    `;

    // Get total investigations today
    const todayStats = await sql`
      SELECT COUNT(*) as total_today
      FROM investigations
      WHERE investigated_at > CURRENT_DATE
    `;

    // Get active investigations count (last 10 minutes)
    const activeCount = await sql`
      SELECT COUNT(DISTINCT topic) as active_investigations
      FROM investigations
      WHERE investigated_at > NOW() - INTERVAL '10 minutes'
    `;

    return Response.json({
      recentInvestigations,
      popularTopics,
      totalToday: parseInt(todayStats[0].total_today),
      activeInvestigations: parseInt(activeCount[0].active_investigations),
    });
  } catch (error) {
    console.error("Error fetching live activity:", error);
    return Response.json(
      { error: "Failed to fetch live activity" },
      { status: 500 },
    );
  }
}
