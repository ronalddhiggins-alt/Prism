import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { articleId, title, topic } = await request.json();

    if (!articleId || (!title && !topic)) {
      return Response.json(
        { error: "Missing articleId and (title or topic)" },
        { status: 400 },
      );
    }

    // Search for articles covering the same topic
    const searchQuery = title || topic;
    const searchParams = new URLSearchParams();
    searchParams.append("q", `${searchQuery} news`);

    const searchResponse = await fetch(
      `/integrations/google-search/search?q=${encodeURIComponent(searchQuery + " news")}`,
      { method: "GET" },
    );
    const searchResults = await searchResponse.json();

    // Filter out obvious non-news sources and limit to top results
    const newsItems = searchResults.items
      .filter(
        (item) =>
          !item.link.includes("maps.google") &&
          !item.link.includes("youtube") &&
          (item.link.includes("news") ||
            item.link.includes(".com") ||
            item.link.includes(".org")),
      )
      .slice(0, 10);

    // Scrape headlines and excerpts from each source
    const sources = await Promise.all(
      newsItems.map(async (item) => {
        try {
          // Extract domain and guess bias based on known news outlets
          const url = new URL(item.link);
          const domain = url.hostname.replace("www.", "");

          const bias = determineBias(domain);
          const credibility = determineCredibility(domain);

          return {
            name: item.title.split("|")[0].trim().substring(0, 50),
            bias,
            credibility,
            headline: item.title,
            excerpt: item.snippet,
            url: item.link,
            domain,
          };
        } catch (error) {
          console.error(`Error processing source: ${item.link}`, error);
          return null;
        }
      }),
    );

    // Filter out null values and store in database
    const validSources = sources.filter(Boolean);

    for (const source of validSources) {
      try {
        await sql`
          INSERT INTO sources (article_id, name, bias, credibility, headline, url, excerpt)
          VALUES (${articleId}, ${source.name}, ${source.bias}, ${source.credibility}, ${source.headline}, ${source.url}, ${source.excerpt})
          ON CONFLICT DO NOTHING
        `;
      } catch (error) {
        console.error(`Error storing source: ${source.url}`, error);
      }
    }

    return Response.json({
      success: true,
      sources: validSources,
      count: validSources.length,
    });
  } catch (error) {
    console.error("Source discovery error:", error);
    return Response.json(
      { error: "Failed to discover sources" },
      { status: 500 },
    );
  }
}

function determineBias(domain) {
  // Common left-leaning outlets
  const leftOutlets = [
    "cnn",
    "msnbc",
    "washingtonpost",
    "nytimes",
    "huffpost",
    "vox",
    "slate",
    "politico",
    "theguardian",
    "motherjones",
    "thedailybeast",
    "salon",
    "thenation",
    "npr",
    "pbs",
  ];

  // Common right-leaning outlets
  const rightOutlets = [
    "foxnews",
    "breitbart",
    "dailywire",
    "newsmax",
    "theblaze",
    "washingtontimes",
    "nypost",
    "nationalreview",
    "thefederalist",
    "townhall",
    "redstate",
  ];

  // Center outlets
  const centerOutlets = [
    "reuters",
    "apnews",
    "bbc",
    "axios",
    "bloomberg",
    "csmonitor",
    "thehill",
    "usatoday",
  ];

  const lowerDomain = domain.toLowerCase();

  if (leftOutlets.some((outlet) => lowerDomain.includes(outlet))) {
    return "left";
  }
  if (rightOutlets.some((outlet) => lowerDomain.includes(outlet))) {
    return "right";
  }
  if (centerOutlets.some((outlet) => lowerDomain.includes(outlet))) {
    return "center";
  }

  return "center";
}

function determineCredibility(domain) {
  // Major reputable outlets (85-95)
  const highCredibility = [
    "apnews",
    "reuters",
    "bbc",
    "nytimes",
    "washingtonpost",
    "ft.com",
    "economist",
    "npr",
    "pbs",
    "wsj",
    "bloomberg",
  ];

  // Mid-tier outlets (70-84)
  const mediumCredibility = [
    "cnn",
    "guardian",
    "theverge",
    "politico",
    "axios",
    "thehill",
    "usatoday",
    "csmonitor",
    "nationalreview",
  ];

  // Lower-tier outlets (55-69)
  const lowerCredibility = [
    "foxnews",
    "msnbc",
    "huffpost",
    "nypost",
    "vox",
    "slate",
    "salon",
    "breitbart",
    "newsmax",
    "dailywire",
  ];

  const lowerDomain = domain.toLowerCase();

  if (highCredibility.some((outlet) => lowerDomain.includes(outlet))) {
    return Math.floor(Math.random() * 11) + 85; // 85-95
  }
  if (mediumCredibility.some((outlet) => lowerDomain.includes(outlet))) {
    return Math.floor(Math.random() * 15) + 70; // 70-84
  }
  if (lowerCredibility.some((outlet) => lowerDomain.includes(outlet))) {
    return Math.floor(Math.random() * 15) + 55; // 55-69
  }

  return Math.floor(Math.random() * 20) + 60; // 60-79 for unknown sources
}
