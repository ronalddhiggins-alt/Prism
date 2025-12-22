import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useArticleProcessing(article, articleId) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const queryClient = useQueryClient();

  // Helper to detect if current sources look valid
  const hasOnlyInvalidSources = (() => {
    try {
      const srcs = article?.sources || [];
      if (srcs.length === 0) return false; // handled elsewhere
      return srcs.every((s) => {
        const url = (s?.url || "").trim();
        const hasProtocol = /^https?:\/\//i.test(url);
        const isExample = url.includes("example.com");
        return !hasProtocol || isExample;
      });
    } catch (e) {
      return false;
    }
  })();

  useEffect(() => {
    if (!article || isVerifying || isDiscovering) return;

    const autoProcess = async () => {
      // Run both in parallel
      const verifyPromise = (async () => {
        if (article.factChecks && article.factChecks.length > 0) return;
        setIsVerifying(true);
        try {
          await fetch("/api/fact-check/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: article.id,
              claims: [article.title, article.summary],
            }),
          });
        } catch (err) {
          console.error("Verification failed:", err);
        } finally {
          setIsVerifying(false);
        }
      })();

      const discoverPromise = (async () => {
        const shouldDiscover =
          !article.sources ||
          article.sources.length === 0 ||
          hasOnlyInvalidSources; // re-discover if existing sources look like placeholders

        if (!shouldDiscover) return;

        setIsDiscovering(true);
        try {
          await fetch("/api/sources/discover", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: article.id,
              title: article.title,
            }),
          });
        } catch (err) {
          console.error("Discovery failed:", err);
        } finally {
          setIsDiscovering(false);
        }
      })();

      await Promise.all([verifyPromise, discoverPromise]);

      // Refetch article data
      queryClient.invalidateQueries(["article", articleId]);
    };

    autoProcess();
  }, [article?.id]);

  return { isVerifying, isDiscovering };
}
