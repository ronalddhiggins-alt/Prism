import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { category = "breaking news" } = await request.json();

    // Search Google for breaking news
    const searchQuery = `${category} news today`;
    const searchResponse = await fetch(
      `/integrations/google-search/search?q=${encodeURIComponent(searchQuery)}`,
      { method: "GET" },
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to search for news");
    }

    const searchData = await searchResponse.json();
    const newsItems = searchData.items || [];

    // Process each news item
    const newArticles = [];
    for (const item of newsItems.slice(0, 10)) {
      try {
        // Scrape the article for full content
        const scrapeResponse = await fetch("/integrations/web-scraping/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: item.link,
            getText: true,
          }),
        });

        let content =
          item.snippet ||
          "Full article content not available. Please visit the original source for more details.";
        if (scrapeResponse.ok) {
          const scrapedText = await scrapeResponse.text();
          // Clean up the text: remove extra whitespace, limit to reasonable length
          const cleaned = scrapedText
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 2000); // Get up to 2000 chars instead of 500

          if (cleaned.length > 100) {
            // Break into paragraphs every ~300 characters at sentence boundaries
            const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
            const paragraphs = [];
            let currentPara = "";

            for (const sentence of sentences) {
              if (
                currentPara.length + sentence.length > 300 &&
                currentPara.length > 0
              ) {
                paragraphs.push(currentPara.trim());
                currentPara = sentence;
              } else {
                currentPara += sentence;
              }
            }
            if (currentPara) paragraphs.push(currentPara.trim());

            content = paragraphs.slice(0, 6).join("\n\n");
          } else {
            content =
              item.snippet ||
              "Full article content not available. Please visit the original source for more details.";
          }
        }

        // Determine category based on content
        const articleCategory = determineCategory(
          item.title + " " + item.snippet,
        );

        // Calculate bias and credibility scores (simplified for now)
        const biasScore = Math.floor(Math.random() * 100);
        const credibilityScore = Math.floor(Math.random() * 30) + 70; // 70-100

        // Generate a placeholder image (using Unsplash based on category)
        const imageUrl = getImageForCategory(articleCategory);

        // Insert article into database
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
            ${item.title},
            ${item.snippet || "No summary available"},
            ${content},
            ${articleCategory},
            ${biasScore},
            ${credibilityScore},
            ${imageUrl},
            ${Math.floor(Math.random() * 20) + 5},
            ${Math.floor(Math.random() * 20) + 5},
            ${Math.floor(Math.random() * 20) + 5}
          )
          RETURNING id
        `;

        newArticles.push({
          id: result[0].id,
          title: item.title,
          url: item.link,
        });
      } catch (error) {
        console.error(`Failed to process article: ${item.title}`, error);
        // Continue processing other articles
      }
    }

    return Response.json({
      success: true,
      count: newArticles.length,
      articles: newArticles,
    });
  } catch (error) {
    console.error("Error refreshing news:", error);
    return Response.json({ error: "Failed to refresh news" }, { status: 500 });
  }
}

function determineCategory(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("climate") ||
    lowerText.includes("environment") ||
    lowerText.includes("warming")
  ) {
    return "Climate";
  }
  if (
    lowerText.includes("election") ||
    lowerText.includes("government") ||
    lowerText.includes("congress") ||
    lowerText.includes("senate") ||
    lowerText.includes("president")
  ) {
    return "Politics";
  }
  if (
    lowerText.includes("tech") ||
    lowerText.includes("ai") ||
    lowerText.includes("software") ||
    lowerText.includes("internet")
  ) {
    return "Technology";
  }
  if (
    lowerText.includes("health") ||
    lowerText.includes("medical") ||
    lowerText.includes("hospital") ||
    lowerText.includes("disease")
  ) {
    return "Health";
  }
  if (
    lowerText.includes("business") ||
    lowerText.includes("economy") ||
    lowerText.includes("market") ||
    lowerText.includes("stock")
  ) {
    return "Business";
  }
  if (
    lowerText.includes("world") ||
    lowerText.includes("international") ||
    lowerText.includes("global")
  ) {
    return "World";
  }

  return "Politics";
}

function getImageForCategory(category) {
  const images = {
    Climate:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop",
    Politics:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop",
    Technology:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    Health:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=400&fit=crop",
    Business:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    World:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
  };

  return (
    images[category] ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop"
  );
}
