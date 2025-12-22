import { RefreshCw } from "lucide-react";

export function RefreshNewsButton({ isRefreshing, onRefresh }) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50"
      >
        <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        <span>{isRefreshing ? "Refreshing..." : "Refresh Latest News"}</span>
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Pull fresh articles from real news sources
      </p>
    </div>
  );
}
