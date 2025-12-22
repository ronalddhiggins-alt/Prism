import { Clock, Shield, TrendingUp, Eye, Info } from "lucide-react";
import {
  getBiasColor,
  getBiasLabel,
  getCredibilityColor,
  getCredibilityLabel,
} from "@/utils/articleHelpers";

export function ArticleHero({ article, narrativeSummary }) {
  const biasInfo = getBiasColor(article.bias_score);
  const credInfo = getCredibilityColor(article.credibility_score);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>{article.published_date}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {article.summary}
        </p>

        {/* Narrative Analysis */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-3">
            <Info size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <h3 className="text-lg font-bold text-gray-900">
              Verification Summary
            </h3>
          </div>
          <div className="text-gray-700 leading-relaxed pl-8">
            {narrativeSummary.split("**").map((part, i) =>
              i % 2 === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <strong key={i} className="font-semibold text-gray-900">
                  {part}
                </strong>
              ),
            )}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`${credInfo.bg} ${credInfo.text} p-4 rounded-xl ring-1 ${credInfo.bg === "bg-emerald-50" ? "ring-emerald-500/20" : credInfo.bg === "bg-amber-50" ? "ring-amber-500/20" : "ring-rose-500/20"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className={credInfo.icon} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Credibility
              </span>
            </div>
            <div className="text-2xl font-bold">
              {article.credibility_score}%
            </div>
            <div className="text-xs mt-1">
              {getCredibilityLabel(article.credibility_score)}
            </div>
          </div>

          <div
            className={`${biasInfo.bg} ${biasInfo.text} p-4 rounded-xl ring-1 ${biasInfo.ring}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Bias Analysis
              </span>
            </div>
            <div className="text-2xl font-bold">{article.bias_score}/100</div>
            <div className="text-xs mt-1">
              {getBiasLabel(article.bias_score)}
            </div>
          </div>

          <div className="bg-gray-50 text-gray-700 p-4 rounded-xl ring-1 ring-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Eye size={18} className="text-gray-600" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Coverage
              </span>
            </div>
            <div className="text-2xl font-bold">
              {article.sources?.length || 0}
            </div>
            <div className="text-xs mt-1">Independent Sources</div>
          </div>
        </div>
      </div>
    </div>
  );
}
