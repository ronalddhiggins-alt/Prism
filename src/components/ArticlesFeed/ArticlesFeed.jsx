import { Shield, Eye } from "lucide-react";

export function ArticlesFeed({ articles, getBiasColor }) {
  if (!articles.length) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Recent Articles</h3>
        {/* Removed inline Refresh action per request */}
      </div>
      <div className="grid gap-4">
        {articles.slice(0, 10).map((article) => (
          <a
            key={article.id}
            href={`/article/${article.id}`}
            className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex gap-4">
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt=""
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded uppercase">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.published_date}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {article.credibility_score}% credible
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${getBiasColor(article.bias_score)}`}
                    />
                    <span className="text-xs text-gray-600">
                      Bias: {article.bias_score}/100
                    </span>
                  </div>
                  {article.sources?.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {article.sources.length} sources
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
