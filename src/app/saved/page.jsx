"use client";

import { Bookmark, ArrowLeft, Clock, Eye, Shield, X } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function SavedPage() {
  const userIdentifier = "guest";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["saved", userIdentifier],
    queryFn: async () => {
      const response = await fetch(`/api/saved?userId=${userIdentifier}`);
      if (!response.ok) throw new Error("Failed to fetch saved articles");
      const result = await response.json();
      return result.articles;
    },
  });

  const savedArticles = data || [];

  // Unsave mutation
  const unsaveMutation = useMutation({
    mutationFn: async (articleId) => {
      const response = await fetch(
        `/api/saved?articleId=${articleId}&userId=${userIdentifier}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to unsave article");
      return response.json();
    },
    onMutate: async (articleId) => {
      await queryClient.cancelQueries(["saved", userIdentifier]);
      const previousSaved = queryClient.getQueryData(["saved", userIdentifier]);

      queryClient.setQueryData(["saved", userIdentifier], (old) =>
        old ? old.filter((item) => item.id !== articleId) : [],
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

  const handleUnsave = (e, articleId) => {
    e.preventDefault(); // Prevent navigation to article
    e.stopPropagation();
    unsaveMutation.mutate(articleId);
  };

  const getBiasColor = (score) => {
    if (score < 30) return "bg-emerald-100 text-emerald-700";
    if (score < 60) return "bg-amber-100 text-amber-700";
    return "bg-rose-100 text-rose-700";
  };

  const getCredibilityColor = (score) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-['Instrument_Sans']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </a>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Bookmark className="text-blue-600" size={20} />
              <h1 className="text-xl font-bold text-gray-900">
                Saved Articles
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 hidden md:block">
            {savedArticles.length} saved{" "}
            {savedArticles.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500">Loading saved articles...</p>
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No saved articles yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start bookmarking articles to build your reading list
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Explore Articles
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {savedArticles.map((article) => (
              <div key={article.id} className="relative group/card">
                <a
                  href={`/article/${article.id}`}
                  className="block bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-start gap-6">
                    {/* Article Image */}
                    {article.image_url && (
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={article.image_url}
                          alt=""
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="flex-1 min-w-0">
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock size={14} />
                          <span>{article.published_date}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover/card:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Shield
                            size={16}
                            className={getCredibilityColor(
                              article.credibility_score,
                            )}
                          />
                          <span className="font-semibold text-gray-900">
                            {article.credibility_score}%
                          </span>
                          <span className="text-gray-500">credible</span>
                        </div>

                        <div
                          className={`px-2 py-1 rounded text-xs font-semibold ${getBiasColor(article.bias_score)}`}
                        >
                          Bias: {article.bias_score}/100
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Eye size={16} />
                          <span className="font-semibold">
                            {article.sources || 0}
                          </span>
                          <span className="text-gray-500">sources</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Unsave Button */}
                <button
                  onClick={(e) => handleUnsave(e, article.id)}
                  disabled={unsaveMutation.isPending}
                  className="absolute top-4 right-4 p-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 opacity-0 group-hover/card:opacity-100"
                  title="Remove bookmark"
                >
                  <X size={18} className="text-gray-600 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
