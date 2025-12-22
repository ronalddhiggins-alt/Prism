import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = `
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
        COUNT(s.id) as sources
      FROM articles a
      LEFT JOIN sources s ON a.id = s.article_id
    `;

    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (category && category !== "Breaking News") {
      paramCount++;
      conditions.push(`a.category = $${paramCount}`);
      values.push(category);
    }

    if (search) {
      paramCount++;
      conditions.push(`(
        LOWER(a.title) LIKE LOWER($${paramCount})
        OR LOWER(a.summary) LIKE LOWER($${paramCount})
        OR LOWER(a.content) LIKE LOWER($${paramCount})
      )`);
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += `
      GROUP BY a.id
      ORDER BY a.published_date DESC, a.id DESC
      LIMIT 50
    `;

    const articles = await sql(query, values);

    return Response.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return Response.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      summary,
      content,
      category,
      biasScore,
      credibilityScore,
      imageUrl,
      leftCoverage,
      centerCoverage,
      rightCoverage,
    } = body;

    if (!title || !summary || !content || !category) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO articles (
        title, 
        summary, 
        content, 
        category, 
        bias_score, 
        credibility_score, 
        image_url,
        left_coverage,
        center_coverage,
        right_coverage
      )
      VALUES (
        ${title}, 
        ${summary}, 
        ${content}, 
        ${category}, 
        ${biasScore || 50}, 
        ${credibilityScore || 50}, 
        ${imageUrl || null},
        ${leftCoverage || 0},
        ${centerCoverage || 0},
        ${rightCoverage || 0}
      )
      RETURNING *
    `;

    return Response.json({ article: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return Response.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}
