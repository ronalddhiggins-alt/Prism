import { TrendingUp, ArrowRight } from "lucide-react";

const defaultTrendingTopics = [
  "Climate policy changes",
  "Tech regulation proposals",
  "Healthcare reform",
  "Immigration policy",
  "Economic stimulus",
];

export function TrendingTopics({ liveActivity, isAnalyzing, onInvestigate }) {
  const topics =
    liveActivity?.popularTopics?.length > 0
      ? liveActivity.popularTopics
      : defaultTrendingTopics.slice(0, 5);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-orange-500" />
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {liveActivity?.popularTopics?.length > 0
            ? "Hot Right Now"
            : "Trending Investigations"}
        </p>
      </div>
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <button
            key={typeof topic === "string" ? topic : topic.topic}
            onClick={() =>
              onInvestigate(typeof topic === "string" ? topic : topic.topic)
            }
            disabled={isAnalyzing}
            className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-50 flex items-center justify-between group"
          >
            <span>{typeof topic === "string" ? topic : topic.topic}</span>
            <div className="flex items-center gap-2">
              {typeof topic === "object" && topic.investigation_count && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {topic.investigation_count} searches
                </span>
              )}
              <ArrowRight
                size={14}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
