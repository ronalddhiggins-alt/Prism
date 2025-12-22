import { Search, ArrowRight } from "lucide-react";

export function SearchBox({ query, setQuery, isAnalyzing, onInvestigate }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 mb-8">
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <Search size={22} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Enter a news topic to investigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onInvestigate()}
            className="bg-transparent text-base flex-1 focus:outline-none text-gray-900 placeholder-gray-400"
            disabled={isAnalyzing}
          />
        </div>
        <button
          onClick={onInvestigate}
          disabled={!query.trim() || isAnalyzing}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Uncover the Full Story</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
