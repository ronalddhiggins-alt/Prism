export async function GET(request) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const url = new URL(request.url);
  const inline = url.searchParams.get("inline") === "1";

  const filename = `prism-session-summary-${yyyy}-${mm}-${dd}.txt`;

  const summary = `PRISM SESSION SUMMARY\nGenerated: ${yyyy}-${mm}-${dd}\n\nOverview\n- Project: News analysis and bias exploration app (web + Expo mobile)\n- Purpose: Explore media bias, summarize articles, show multiple viewpoints, and track saved items.\n- Status: Active. Preview gate controlled by NEXT_PUBLIC_PREVIEW_TOKEN (optional).\n\nKey Pages (Web)\n- Home: / (headline feed, quick summary, live activity)\n- Article: /article/[id] (hero, source breakdown, fact checks, comparisons)\n- Investigate: /investigate/[topic] (analysis of a topic with sources)\n- Saved: /saved (your saved articles)\n- Guide: /guide (how it works)\n- Unlock: /unlock/[token] (preview gate)\n- Project Log: /project-log (downloadable outline of the project)\n- Session Summary: /session-summary (this human-friendly recap)\n\nBackend Routes (selected)\n- /api/articles, /api/articles/[id]\n- /api/investigate/analyze, /api/fact-check/verify\n- /api/news/refresh, /api/sources/discover\n- /api/investigations, /api/saved\n- /api/project-log (outline)\n- NEW: /api/session-summary (this summary)\n\nDatabase (Postgres: News Articles DB)\n- articles(id, title, summary, content, category, bias_score, credibility_score, published_date, image_url, left_coverage, center_coverage, right_coverage, created_at)\n- sources(id, article_id→articles, name, bias{left|center|right}, credibility, headline, url, excerpt, created_at, discovered_at)\n- fact_checks(id, article_id→articles, claim, status{verified|partially-true|false}, explanation, sources[], verification_data jsonb, ai_verified_at, created_at)\n- investigations(id, topic, user_identifier, investigated_at, ip_address, user_agent)\n- saved_articles(id, article_id→articles, user_identifier, saved_at) unique(article_id, user_identifier)\n\nEnvironment Variables (names only)\n- Platform: APP_URL, ENV, EXPO_PUBLIC_* , NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, NODE_ENV, STRIPE_SECRET_KEY, AUTH_SECRET, AUTH_URL, REVENUE_CAT_API_KEY\n- User: DATABASE_URL, NEXT_PUBLIC_PREVIEW_TOKEN\n(Note: Never log secret values; only reference via process.env.NAME)\n\nRecent Additions (this session)\n- Project Log endpoint and page for easy download (/api/project-log, /project-log).\n- Session Summary endpoint and page for one-click human-readable recap (/api/session-summary, /session-summary).\n- Header button and footer links to quickly download the Project Log and view the Session Summary.\n\nNotes & Tips\n- Authentication is not enabled via the platform; features should allow anonymous usage.\n- File uploads use the provided upload hooks; store returned URLs if you need persistence.\n- React Query is set up in the root layout for API data fetching.\n- Preview gate via NEXT_PUBLIC_PREVIEW_TOKEN can be provided to share pre-release previews.\n\nHow to Resume Later\n- Open the project in the Anything dashboard.\n- Visit /project-log to download the outline, or /session-summary for this recap.\n- All pages and routes listed here are a quick index for navigation.\n\nEnd of summary.`;

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Disposition": `${inline ? "inline" : "attachment"}; filename=\"${filename}\"`,
    "Cache-Control": "no-store",
  });

  return new Response(summary, { status: 200, headers });
}
