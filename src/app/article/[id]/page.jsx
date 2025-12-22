"use client";

import { useArticle } from "@/hooks/useArticle";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useArticleProcessing } from "@/hooks/useArticleProcessing";
import {
  generateNarrativeSummary,
  generateKeyDifferences,
} from "@/utils/narrativeGenerator";
import { ArticleHeader } from "@/components/ArticleHeader/ArticleHeader";
import { ArticleHero } from "@/components/ArticleHero/ArticleHero";
import { ArticleImage } from "@/components/ArticleImage/ArticleImage";
import { KeyDifferences } from "@/components/KeyDifferences/KeyDifferences";
import { ComparativeAnalysis } from "@/components/ComparativeAnalysis/ComparativeAnalysis";
import { FactChecks } from "@/components/FactChecks/FactChecks";
import { SourceBreakdown } from "@/components/SourceBreakdown/SourceBreakdown";

export default function ArticlePage({ params }) {
  const userIdentifier = "guest";

  const { data: article, isLoading, error } = useArticle(params.id);
  const { isSaved, toggleSave, saveMutation, unsaveMutation } =
    useSavedArticles(userIdentifier);
  const { isVerifying, isDiscovering } = useArticleProcessing(
    article,
    params.id,
  );

  const handleToggleSave = () => {
    if (article) {
      toggleSave(article);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-['Instrument_Sans'] flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        `}</style>
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white font-['Instrument_Sans'] flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        `}</style>
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load article.</p>
          <a href="/" className="text-[#2962FF] hover:text-[#1e4dbf]">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  const narrativeSummary = generateNarrativeSummary(article);
  const keyDifferences = generateKeyDifferences(article);
  const isArticleSaved = isSaved(article);
  const isSaveLoading = saveMutation.isPending || unsaveMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 font-['Instrument_Sans']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      `}</style>

      <ArticleHeader
        isSaved={isArticleSaved}
        onToggleSave={handleToggleSave}
        isLoading={isSaveLoading}
      />

      <ArticleHero article={article} narrativeSummary={narrativeSummary} />

      <ArticleImage imageUrl={article.image_url} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <KeyDifferences keyDifferences={keyDifferences} />

            <ComparativeAnalysis sources={article.sources} />

            <FactChecks
              factChecks={article.factChecks}
              isVerifying={isVerifying}
            />
          </div>

          <div className="lg:col-span-1">
            <SourceBreakdown
              sources={article.sources}
              isDiscovering={isDiscovering}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
