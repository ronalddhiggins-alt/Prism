import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
        <Zap size={16} />
        <span>AI-Powered News Investigation</span>
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Understand Every Side
        <br />
        <span className="text-blue-600">Of Every Story</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Enter any news topic and instantly see how left, center, and right
        outlets are covering it—with fact-checks and source analysis.
      </p>
    </div>
  );
}
