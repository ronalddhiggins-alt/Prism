"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import { LiveActivityBar } from "@/components/LiveActivityBar/LiveActivityBar";
import { HeroSection } from "@/components/HeroSection/HeroSection";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { QuickSummaryBox } from "@/components/QuickSummaryBox/QuickSummaryBox";
import { TrendingTopics } from "@/components/TrendingTopics/TrendingTopics";
import { RecentActivity } from "@/components/RecentActivity/RecentActivity";
import { ArticlesFeed } from "@/components/ArticlesFeed/ArticlesFeed";
import { FeatureCards } from "@/components/FeatureCards/FeatureCards";
import { Footer } from "@/components/Footer/Footer";
import { useArticles } from "@/hooks/useArticles";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { useQuickSummary } from "@/hooks/useQuickSummary";
import { useInvestigation } from "@/hooks/useInvestigation";
import { getBiasColor, formatTimeAgo } from "@/utils/formatters";
// --- new imports for Bias Lens ---
import { BiasLensBox } from "@/components/BiasLensBox/BiasLensBox";
import { useBiasLens } from "@/hooks/useBiasLens";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const articles = useArticles();
  const liveActivity = useLiveActivity();
  const { isAnalyzing, handleInvestigate } = useInvestigation();
  const {
    quickQuery,
    setQuickQuery,
    quickInputRef,
    isSummarizing,
    summaryData,
    summaryError,
    handleQuickSummary,
    clearQuickSummary,
    handleQuickSummaryKeyDown,
  } = useQuickSummary();
  // --- Bias Lens hook usage (new) ---
  const {
    biasInput,
    setBiasInput,
    biasInputRef,
    isLoading: isBiasLoading,
    result: biasResult,
    error: biasError,
    submit: submitBiasLens,
    clear: clearBiasLens,
    onKeyDown: onBiasKeyDown,
    tone,
    setTone,
  } = useBiasLens();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-['Instrument_Sans']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      `}</style>

      <Header />

      <LiveActivityBar
        liveActivity={liveActivity}
        formatTimeAgo={formatTimeAgo}
      />

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <HeroSection />

        <SearchBox
          query={query}
          setQuery={setQuery}
          isAnalyzing={isAnalyzing}
          onInvestigate={() => handleInvestigate(null, query)}
        />

        <QuickSummaryBox
          quickQuery={quickQuery}
          setQuickQuery={setQuickQuery}
          isSummarizing={isSummarizing}
          summaryData={summaryData}
          summaryError={summaryError}
          onSubmit={handleQuickSummary}
          onClear={clearQuickSummary}
          quickInputRef={quickInputRef}
          onKeyDown={handleQuickSummaryKeyDown}
        />

        {/* Bias Lens Box (new) */}
        <BiasLensBox
          biasInput={biasInput}
          setBiasInput={setBiasInput}
          isLoading={isBiasLoading}
          result={biasResult}
          error={biasError}
          submit={submitBiasLens}
          clear={clearBiasLens}
          biasInputRef={biasInputRef}
          onKeyDown={onBiasKeyDown}
          tone={tone}
          setTone={setTone}
        />

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <TrendingTopics
            liveActivity={liveActivity}
            isAnalyzing={isAnalyzing}
            onInvestigate={(topic) => handleInvestigate(topic, query)}
          />

          <RecentActivity
            liveActivity={liveActivity}
            formatTimeAgo={formatTimeAgo}
          />
        </div>

        <ArticlesFeed articles={articles} getBiasColor={getBiasColor} />

        <FeatureCards />
      </main>

      <Footer />
    </div>
  );
}
