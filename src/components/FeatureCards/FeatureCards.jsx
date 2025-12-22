import { TrendingUp, Shield, Eye, Compass, ArrowRight } from "lucide-react";

export function FeatureCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
          <TrendingUp className="text-rose-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Three Perspectives
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          See how left, center, and right outlets frame the same story—spot the
          differences in language and emphasis.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <Shield className="text-blue-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Fact Verification
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          AI-powered fact-checking across all perspectives with credibility
          scores and source verification.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <Eye className="text-purple-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Source Analysis
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Discover which outlets are covering the story, with bias ratings and
          credibility assessments.
        </p>
      </div>

      <a
        href="/guide"
        className="bg-white rounded-xl p-6 border-2 border-blue-300 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all group relative"
      >
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-3">
          Essential Reading
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
          <Compass className="text-emerald-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
          How It Works
          <ArrowRight className="text-blue-600" size={16} />
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Learn about Prism's approach to understanding political ethics and
          news coverage across perspectives.
        </p>
      </a>
    </div>
  );
}
