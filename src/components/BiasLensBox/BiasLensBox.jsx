import { Eye, Search, XCircle, RotateCcw } from "lucide-react";

export function BiasLensBox({
  biasInput,
  setBiasInput,
  isLoading,
  result,
  error,
  submit,
  clear,
  biasInputRef,
  onKeyDown,
  // add tone controls
  tone,
  setTone,
}) {
  // Compute when we can clear (either there's input or a result, and we're not loading)
  const canClear =
    (!!(biasInput && biasInput.trim()) || !!result) && !isLoading;

  // Compute dynamic read time when we have a result; default to 2 minutes
  let readTimeLabel = "2-minute read";
  if (result) {
    const text = [
      result.paragraphs?.left,
      result.paragraphs?.center,
      result.paragraphs?.right,
      result.combined_summary,
      result.analysis,
    ]
      .filter(Boolean)
      .join(" ");
    const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    readTimeLabel = `${minutes}-minute${minutes > 1 ? "s" : ""} read`;
  }

  // Precompute classes for tone buttons and clear button
  const baseToneBtn = "px-2 py-1 rounded-full text-xs font-medium border";
  const neutralBtnClass =
    (tone === "neutral"
      ? "bg-purple-600 text-white border-purple-600"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50") +
    " " +
    baseToneBtn;
  const directBtnClass =
    (tone === "direct"
      ? "bg-purple-600 text-white border-purple-600"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50") +
    " " +
    baseToneBtn;
  const punchyBtnClass =
    (tone === "punchy"
      ? "bg-purple-600 text-white border-purple-600"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50") +
    " " +
    baseToneBtn;
  const clearBtnClass =
    (canClear
      ? "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
      : "bg-white border border-gray-100 text-gray-400 cursor-not-allowed") +
    " px-4 py-3 font-medium rounded-xl transition-all flex items-center gap-2 w-full md:w-auto"; // make responsive width

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 mb-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Eye size={18} className="text-purple-600" />
          <p className="text-sm font-semibold text-gray-700">Bias Lens</p>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {readTimeLabel}
          </span>
          {/* tone switch */}
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={() => setTone && setTone("neutral")}
              className={neutralBtnClass}
              aria-pressed={tone === "neutral"}
              title="Neutral tone"
            >
              Neutral
            </button>
            <button
              type="button"
              onClick={() => setTone && setTone("direct")}
              className={directBtnClass}
              aria-pressed={tone === "direct"}
              title="Direct tone"
            >
              Direct
            </button>
            <button
              type="button"
              onClick={() => setTone && setTone("punchy")}
              className={punchyBtnClass}
              aria-pressed={tone === "punchy"}
              title="Punchy tone"
            >
              Punchy
            </button>
          </div>
        </div>
        {result?.topic && (
          <a
            href={`/investigate/${encodeURIComponent(result.topic)}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            See full comparison →
          </a>
        )}
      </div>

      {/* Make controls stack on small screens to give the input full width */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl relative min-w-0">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            // Shorter placeholder so it fits on medium screens too
            placeholder="Paste a headline or URL — see Left · Center · Right"
            value={biasInput}
            onChange={(e) => setBiasInput(e.target.value)}
            onKeyDown={onKeyDown}
            ref={biasInputRef}
            className="bg-transparent text-base flex-1 focus:outline-none text-gray-900 placeholder-gray-400 placeholder:text-sm md:placeholder:text-base pr-20"
            title="Paste a headline or URL — see Left · Center · Right"
            disabled={isLoading}
          />
          {(biasInput || result) && !isLoading && (
            <button
              onClick={clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Clear"
              aria-label="Clear Bias Lens"
              type="button"
            >
              <XCircle size={16} className="text-gray-500" />
            </button>
          )}
        </div>

        <button
          onClick={submit}
          disabled={!biasInput.trim() || isLoading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow w-full md:w-auto"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Getting perspectives...</span>
            </>
          ) : (
            <>
              <span>Get Perspectives</span>
            </>
          )}
        </button>
        {/* Clear button: always visible, disabled when there's nothing to clear or while loading */}
        <button
          onClick={clear}
          disabled={!canClear}
          className={clearBtnClass}
          title="Clear Bias Lens"
          aria-disabled={!canClear}
          type="button"
        >
          <XCircle
            size={18}
            className={canClear ? "text-gray-500" : "text-gray-300"}
          />
          <span>Clear</span>
        </button>
      </div>
      {/* hint row */}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Press Enter to run · Esc to clear
      </div>

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-center justify-between">
          <p className="text-sm">
            Could not get perspectives. Please try again.
          </p>
          <button
            onClick={submit}
            disabled={isLoading}
            className="text-sm inline-flex items-center gap-1 px-2 py-1 bg-white border border-red-200 rounded-md hover:bg-red-100"
            type="button"
            title="Retry"
          >
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="mt-4 animate-pulse space-y-4">
          <div className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
          <div className="grid md:grid-cols-3 gap-3">
            <div className="h-40 bg-gray-100 rounded-xl border border-gray-200" />
            <div className="h-40 bg-gray-100 rounded-xl border border-gray-200" />
            <div className="h-40 bg-gray-100 rounded-xl border border-gray-200" />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <p className="text-sm text-gray-900 leading-relaxed">
              {result.combined_summary}
            </p>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Analysis
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.analysis}
              </p>
            </div>
          </div>

          {/* Order changed to Left · Center · Right */}
          <div className="grid md:grid-cols-3 gap-3">
            {/* Left */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Left</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {result.paragraphs.left}
              </p>
              {result.citations.left?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] text-gray-500 mb-1">Citations</p>
                  <ul className="space-y-1">
                    {result.citations.left.map((c, idx) => (
                      <li key={`l-${idx}`}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-700"
                          title={c.headline}
                        >
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Center */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Center</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {result.paragraphs.center}
              </p>
              {result.citations.center?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] text-gray-500 mb-1">Citations</p>
                  <ul className="space-y-1">
                    {result.citations.center.map((c, idx) => (
                      <li key={`c-${idx}`}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-700"
                          title={c.headline}
                        >
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-600 mb-1">Right</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {result.paragraphs.right}
              </p>
              {result.citations.right?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] text-gray-500 mb-1">Citations</p>
                  <ul className="space-y-1">
                    {result.citations.right.map((c, idx) => (
                      <li key={`r-${idx}`}>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-700"
                          title={c.headline}
                        >
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
