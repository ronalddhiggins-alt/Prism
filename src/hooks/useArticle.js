import { useQuery } from "@tanstack/react-query";

export function useArticle(articleId) {
  return useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      const result = await response.json();
      return result.article;
    },
  });
}
