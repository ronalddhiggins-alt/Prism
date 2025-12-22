import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [article] = await sql`
      SELECT 
        id,
        title,
        summary,
        content,
        category,
        bias_score,
        credibility_score,
        published_date,
        image_url,
        left_coverage,
        center_coverage,
        right_coverage
      FROM articles
      WHERE id = ${id}
    `;

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const sources = await sql`
      SELECT 
        id,
        name,
        bias,
        credibility,
        headline,
        url,
        excerpt
      FROM sources
      WHERE article_id = ${id}
      ORDER BY id
    `;

    const factChecks = await sql`
      SELECT 
        id,
        claim,
        status,
        explanation,
        sources
      FROM fact_checks
      WHERE article_id = ${id}
      ORDER BY id
    `;

    return Response.json({
      article: {
        ...article,
        sources,
        factChecks,
      },
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return Response.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "title",
      "summary",
      "content",
      "category",
      "bias_score",
      "credibility_score",
      "image_url",
      "left_coverage",
      "center_coverage",
      "right_coverage",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE articles 
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json({ article: result[0] });
  } catch (error) {
    console.error("Error updating article:", error);
    return Response.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM articles
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return Response.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
