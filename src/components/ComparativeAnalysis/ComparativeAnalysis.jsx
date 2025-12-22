import { ExternalLink, Eye } from "lucide-react";

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

function CoverageSection({
  title,
  sources,
  color,
  borderColor,
  hoverColor,
  valueDescription,
}) {
  const valid = sources.filter((s) => isValidSourceUrl(s?.url));
  if (valid.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1 h-6 ${color} rounded`}></div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({valid.length} sources)</span>
      </div>
      <p className="text-xs text-gray-600 mb-3 ml-3">{valueDescription}</p>
      <div className="space-y-3">
        {valid.slice(0, 3).map((source) => (
          <div key={source.id} className={`pl-4 border-l-2 ${borderColor}`}>
            <a
              href={getSafeUrl(source.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold text-gray-900 ${hoverColor} flex items-center gap-2 mb-1`}
            >
              {source.name}
              <ExternalLink size={14} className="text-gray-400" />
            </a>
            <p className="text-sm font-medium text-gray-800 mb-1">
              "{source.headline}"
            </p>
            <p className="text-sm text-gray-600">{source.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparativeAnalysis({ sources }) {
  if (!sources || sources.length === 0) return null;

  const filtered = sources.filter((s) => isValidSourceUrl(s?.url));

  const leftSources = filtered.filter((s) => s.bias === "left");
  const centerSources = filtered.filter((s) => s.bias === "center");
  const rightSources = filtered.filter((s) => s.bias === "right");

  if (
    leftSources.length === 0 &&
    centerSources.length === 0 &&
    rightSources.length === 0
  ) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How Each Perspective Covers This Story
        </h2>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Eye size={16} />
          Notice the language, emphasis, and framing choices—these reveal
          underlying political values
        </p>
      </div>

      <div className="space-y-8">
        <CoverageSection
          title="Left-Leaning Coverage"
          sources={leftSources}
          color="bg-rose-500"
          borderColor="border-rose-200"
          hoverColor="hover:text-rose-600"
          valueDescription="Often emphasizes: social justice, environmental protection, collective wellbeing, systemic change"
        />

        <CoverageSection
          title="Center Coverage"
          sources={centerSources}
          color="bg-gray-500"
          borderColor="border-gray-300"
          hoverColor="hover:text-gray-600"
          valueDescription="Often emphasizes: factual reporting, multiple viewpoints, pragmatic analysis, institutional perspective"
        />

        <CoverageSection
          title="Right-Leaning Coverage"
          sources={rightSources}
          color="bg-blue-600"
          borderColor="border-blue-200"
          hoverColor="hover:text-blue-600"
          valueDescription="Often emphasizes: individual liberty, economic freedom, traditional values, limited government"
        />
      </div>

      {/* Reflection Prompt */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-700 italic">
          💡 <strong>Reflection:</strong> Which framing resonates most with your
          values? Which perspective challenges your assumptions? Understanding
          these differences helps you recognize your own political ethics and
          empathize with different viewpoints.
        </p>
      </div>
    </div>
  );
}
