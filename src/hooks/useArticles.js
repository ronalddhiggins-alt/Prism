import { useQuery } from "@tanstack/react-query";

export function useArticles() {
  const { data: articlesData } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const result = await response.json();
      return result.articles;
    },
  });

  return articlesData || [];
}
