import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSavedArticles(userIdentifier) {
  const queryClient = useQueryClient();

  const { data: savedData } = useQuery({
    queryKey: ["saved", userIdentifier],
    queryFn: async () => {
      const response = await fetch(`/api/saved?userId=${userIdentifier}`);
      if (!response.ok) throw new Error("Failed to fetch saved articles");
      const result = await response.json();
      return result.articles;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (article) => {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, userIdentifier }),
      });
      if (!response.ok) throw new Error("Failed to save article");
      return response.json();
    },
    onMutate: async (article) => {
      await queryClient.cancelQueries(["saved", userIdentifier]);
      const previousSaved = queryClient.getQueryData(["saved", userIdentifier]);

      queryClient.setQueryData(["saved", userIdentifier], (old) =>
        old ? [...old, article] : [article],
      );

      return { previousSaved };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["saved", userIdentifier],
        context.previousSaved,
      );
      console.error("Error saving article:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["saved", userIdentifier]);
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (article) => {
      const response = await fetch(
        `/api/saved?articleId=${article.id}&userId=${userIdentifier}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to unsave article");
      return response.json();
    },
    onMutate: async (article) => {
      await queryClient.cancelQueries(["saved", userIdentifier]);
      const previousSaved = queryClient.getQueryData(["saved", userIdentifier]);

      queryClient.setQueryData(["saved", userIdentifier], (old) =>
        old ? old.filter((item) => item.id !== article.id) : [],
      );

      return { previousSaved };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["saved", userIdentifier],
        context.previousSaved,
      );
      console.error("Error unsaving article:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["saved", userIdentifier]);
    },
  });

  const isSaved = (article) => {
    return savedData?.some((saved) => saved.id === article?.id) || false;
  };

  const toggleSave = (article) => {
    if (isSaved(article)) {
      unsaveMutation.mutate(article);
    } else {
      saveMutation.mutate(article);
    }
  };

  return {
    savedArticles: savedData,
    isSaved,
    toggleSave,
    saveMutation,
    unsaveMutation,
  };
}
