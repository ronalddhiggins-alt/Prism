import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdentifier = searchParams.get("userId") || "guest";

    const saved = await sql`
      SELECT 
        a.id,
        a.title,
        a.summary,
        a.category,
        a.bias_score,
        a.credibility_score,
        a.published_date,
        a.image_url,
        a.left_coverage,
        a.center_coverage,
        a.right_coverage,
        sa.saved_at,
        COUNT(s.id) as sources
      FROM saved_articles sa
      JOIN articles a ON sa.article_id = a.id
      LEFT JOIN sources s ON a.id = s.article_id
      WHERE sa.user_identifier = ${userIdentifier}
      GROUP BY a.id, sa.saved_at
      ORDER BY sa.saved_at DESC
    `;

    return Response.json({ articles: saved });
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    return Response.json(
      { error: "Failed to fetch saved articles" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { articleId, userIdentifier = "guest" } = body;

    if (!articleId) {
      return Response.json({ error: "Missing articleId" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO saved_articles (article_id, user_identifier)
      VALUES (${articleId}, ${userIdentifier})
      ON CONFLICT (article_id, user_identifier) DO NOTHING
      RETURNING *
    `;

    return Response.json({ saved: result[0] || { articleId, userIdentifier } });
  } catch (error) {
    console.error("Error saving article:", error);
    return Response.json({ error: "Failed to save article" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const userIdentifier = searchParams.get("userId") || "guest";

    if (!articleId) {
      return Response.json({ error: "Missing articleId" }, { status: 400 });
    }

    await sql`
      DELETE FROM saved_articles
      WHERE article_id = ${parseInt(articleId)}
      AND user_identifier = ${userIdentifier}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing saved article:", error);
    return Response.json(
      { error: "Failed to remove saved article" },
      { status: 500 },
    );
  }
}
