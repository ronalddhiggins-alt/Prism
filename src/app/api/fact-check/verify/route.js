import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { articleId, claims } = await request.json();

    if (!articleId || !claims || !Array.isArray(claims)) {
      return Response.json(
        { error: "Missing articleId or claims array" },
        { status: 400 },
      );
    }

    // Extract key claims from article content
    const extractClaimsResponse = await fetch(
      "/integrations/chat-gpt/conversationgpt4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a fact-checking expert. Extract the 3-5 most important and verifiable factual claims from the given text. Format each claim as a clear, specific statement that can be fact-checked.",
            },
            {
              role: "user",
              content: `Extract key claims from this content:\n\n${claims.join("\n")}`,
            },
          ],
        }),
      },
    );

    const extractedResponse = await extractClaimsResponse.json();
    const extractedClaims = extractedResponse.choices[0].message.content
      .split("\n")
      .filter(Boolean);

    // Verify each claim using Google Search
    const verifications = await Promise.all(
      extractedClaims.slice(0, 5).map(async (claim) => {
        try {
          // Search for information about the claim
          const searchParams = new URLSearchParams();
          searchParams.append("q", claim);

          const searchResponse = await fetch(
            `/integrations/google-search/search?q=${encodeURIComponent(claim)}`,
            { method: "GET" },
          );
          const searchResults = await searchResponse.json();

          // Use AI to verify the claim based on search results
          const verifyResponse = await fetch(
            "/integrations/chat-gpt/conversationgpt4",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [
                  {
                    role: "system",
                    content:
                      'You are a fact-checker. Based on the search results provided, determine if the claim is verified, partially-true, or false. Provide a brief explanation. Respond in JSON format: {"status": "verified|partially-true|false", "explanation": "..."}',
                  },
                  {
                    role: "user",
                    content: `Claim: "${claim}"\n\nSearch Results:\n${searchResults.items
                      .slice(0, 3)
                      .map((item) => `${item.title}: ${item.snippet}`)
                      .join("\n")}`,
                  },
                ],
              }),
            },
          );

          const verifyResult = await verifyResponse.json();
          const verification = JSON.parse(
            verifyResult.choices[0].message.content,
          );

          return {
            claim,
            status: verification.status || "false",
            explanation: verification.explanation || "Unable to verify",
            sources: searchResults.items
              .slice(0, 3)
              .map((item) => item.displayLink),
          };
        } catch (error) {
          console.error(`Error verifying claim: ${claim}`, error);
          return {
            claim,
            status: "false",
            explanation: "Verification failed",
            sources: [],
          };
        }
      }),
    );

    // Store verifications in database
    for (const verification of verifications) {
      await sql`
        INSERT INTO fact_checks (article_id, claim, status, explanation, sources, verification_data, ai_verified_at)
        VALUES (${articleId}, ${verification.claim}, ${verification.status}, ${verification.explanation}, ${verification.sources}, ${JSON.stringify(verification)}, NOW())
        ON CONFLICT (article_id, claim) DO UPDATE SET
          status = ${verification.status},
          explanation = ${verification.explanation},
          sources = ${verification.sources},
          verification_data = ${JSON.stringify(verification)},
          ai_verified_at = NOW()
      `;
    }

    return Response.json({
      success: true,
      verifications,
      count: verifications.length,
    });
  } catch (error) {
    console.error("Fact-check verification error:", error);
    return Response.json({ error: "Failed to verify claims" }, { status: 500 });
  }
}
