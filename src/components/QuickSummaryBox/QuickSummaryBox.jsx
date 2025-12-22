import { Search, Zap, XCircle } from "lucide-react";

export function QuickSummaryBox({
  quickQuery,
  setQuickQuery,
  isSummarizing,
  summaryData,
  summaryError,
  onSubmit,
  onClear,
  quickInputRef,
  onKeyDown,
}) {
  const quickSummaryTitle = summaryData
    ? `Quick Summary: ${summaryData.topic}`
    : null;
  const leftPoint = summaryData?.perspectives?.left?.key_points?.[0] || null;
  const centerPoint =
    summaryData?.perspectives?.center?.key_points?.[0] || null;
  const rightPoint = summaryData?.perspectives?.right?.key_points?.[0] || null;
  const coverage = summaryData?.coverage_breakdown || null;
  const avgCred = summaryData?.overall_metrics?.average_credibility || null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 mb-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-orange-500" />
          <p className="text-sm font-semibold text-gray-700">Quick Summary</p>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
            60-second read
          </span>
        </div>
        {summaryData && (
          <a
            href={`/investigate/${encodeURIComponent(summaryData.topic)}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            See full comparison →
          </a>
        )}
      </div>
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl relative">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Get a concise summary of any topic..."
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            onKeyDown={onKeyDown}
            ref={quickInputRef}
            className="bg-transparent text-base flex-1 focus:outline-none text-gray-900 placeholder-gray-400 pr-8"
            disabled={isSummarizing}
          />
          {(quickQuery || summaryData) && !isSummarizing && (
            <button
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 transition-colors"
              title="Clear"
              aria-label="Clear quick summary"
            >
              <XCircle size={16} className="text-gray-500" />
            </button>
          )}
        </div>
        <button
          onClick={onSubmit}
          disabled={!quickQuery.trim() || isSummarizing}
          className="px-6 py-3 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow"
        >
          {isSummarizing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Summarizing...</span>
            </>
          ) : (
            <>
              <span>Get Summary</span>
            </>
          )}
        </button>
        {(quickQuery || summaryData) && (
          <button
            onClick={onClear}
            className="px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2"
            title="Clear summary"
          >
            <XCircle size={18} className="text-gray-500" />
            <span>Clear</span>
          </button>
        )}
      </div>
      {summaryError && (
        <p className="text-sm text-red-600 mt-3">
          Could not get summary. Please try again.
        </p>
      )}
      {summaryData && (
        <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-white">
          <h4 className="text-base font-semibold text-gray-900 mb-3">
            {quickSummaryTitle}
          </h4>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-800 leading-relaxed">
              {summaryData.concise_summary ||
                `${leftPoint || ""} ${centerPoint || ""} ${rightPoint || ""}`}
            </p>
          </div>

          {summaryData.quick_analysis && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Analysis
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {summaryData.quick_analysis}
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {coverage && (
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                Coverage L/C/R: {coverage.left}/{coverage.center}/
                {coverage.right}
              </span>
            )}
            {typeof avgCred === "number" && (
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                Avg. credibility: {avgCred}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
