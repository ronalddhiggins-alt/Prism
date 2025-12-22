import { ExternalLink, Loader2 } from "lucide-react";
import { getSourceBiasColor } from "@/utils/articleHelpers";

function isValidSourceUrl(url) {
  const raw = (url || "").trim();
  if (!raw) return false;
  const hasProtocol = /^https?:\/\//i.test(raw);
  const isExample = raw.includes("example.com");
  return hasProtocol && !isExample;
}

function getSafeUrl(url) {
  const raw = (url || "").trim();
  if (!raw) return "#";
  const hasProtocol = /^https?:\/\//i.test(raw);
  const finalUrl = hasProtocol ? raw : `https://${raw}`;
  return finalUrl;
}

export function SourceBreakdown({ sources, isDiscovering }) {
  if (!sources?.length && !isDiscovering) return null;

  const validSources = Array.isArray(sources)
    ? sources.filter((s) => isValidSourceUrl(s?.url))
    : [];

  if (!isDiscovering && validSources.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Source Breakdown</h3>
      {isDiscovering ? (
        <div className="flex items-center gap-2 text-gray-500 py-4">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Finding sources...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {validSources.slice(0, 5).map((source) => (
            <a
              key={source.id}
              href={getSafeUrl(source.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {source.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${getSourceBiasColor(source.bias)} text-white text-xs px-2 py-0.5 rounded font-medium`}
                    >
                      {source.bias}
                    </span>
                    <span className="text-xs text-gray-500">
                      {source.credibility}% credible
                    </span>
                  </div>
                </div>
                <ExternalLink
                  size={14}
                  className="text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1"
                />
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {source.headline}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
