"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function InvestigatePage({ params }) {
  const topic = decodeURIComponent(params.topic);
  const [expandedPerspective, setExpandedPerspective] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["investigation", topic],
    queryFn: async () => {
      const response = await fetch("/api/investigate/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) throw new Error("Failed to analyze topic");
      const result = await response.json();
      return result.analysis;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const analysis = data || null;

  const getSourceBiasColor = (bias) => {
    if (bias === "left") return "bg-rose-500";
    if (bias === "center") return "bg-gray-500";
    return "bg-blue-600";
  };

  const getPerspectiveColor = (perspective) => {
    if (perspective === "left")
      return {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        icon: "text-rose-600",
        badge: "bg-rose-100 text-rose-700",
      };
    if (perspective === "center")
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        icon: "text-gray-600",
        badge: "bg-gray-100 text-gray-700",
      };
    return {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    };
  };

  const getFactCheckStatus = (status) => {
    if (status === "verified")
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        label: "Verified",
      };
    if (status === "partially-true")
      return {
        icon: AlertTriangle,
        color: "text-amber-600",
        bg: "bg-amber-50",
        label: "Partially True",
      };
    return {
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      label: "False",
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Instrument_Sans'] flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        `}</style>
        <div className="text-center">
          <Loader2
            size={48}
            className="text-blue-600 animate-spin mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Investigating across sources...
          </p>
          <p className="text-gray-500">
            Analyzing coverage from left, center, and right outlets
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Instrument_Sans'] flex items-center justify-center">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        `}</style>
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to analyze topic.</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Instrument_Sans']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>New Investigation</span>
          </a>
        </div>
      </header>

      {/* Topic Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{topic}</h1>
          <p className="text-gray-600 mb-6">
            Analysis of how this story is being covered across the political
            spectrum
          </p>

          {/* Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.coverage_breakdown.total}
              </div>
              <div className="text-sm text-gray-600">Sources Found</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.overall_metrics.average_credibility}%
              </div>
              <div className="text-sm text-gray-600">Avg Credibility</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">
                {analysis.fact_checks.length}
              </div>
              <div className="text-sm text-gray-600">Claims Checked</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 capitalize">
                {analysis.overall_metrics.consensus_level}
              </div>
              <div className="text-sm text-gray-600">Consensus Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Perspectives */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Three Perspectives
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {Object.entries(analysis.perspectives).map(
              ([perspective, data]) => {
                const colors = getPerspectiveColor(perspective);
                const isExpanded = expandedPerspective === perspective;

                return (
                  <div
                    key={perspective}
                    className={`${colors.bg} ${colors.border} border rounded-xl p-6 transition-all`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-bold ${colors.text} capitalize flex items-center gap-2`}
                      >
                        <TrendingUp size={20} className={colors.icon} />
                        {perspective}
                      </h3>
                      <span
                        className={`${colors.badge} text-xs font-semibold px-2 py-1 rounded`}
                      >
                        {data.sources_count} sources
                      </span>
                    </div>

                    <p
                      className={`text-sm ${colors.text} leading-relaxed mb-4 ${isExpanded ? "" : "line-clamp-4"}`}
                    >
                      {data.summary}
                    </p>

                    <button
                      onClick={() =>
                        setExpandedPerspective(isExpanded ? null : perspective)
                      }
                      className={`text-sm font-medium ${colors.text} flex items-center gap-1 mb-4 hover:underline`}
                    >
                      {isExpanded ? (
                        <>
                          Show Less <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show More <ChevronDown size={16} />
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="space-y-2">
                        <p
                          className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}
                        >
                          Key Points:
                        </p>
                        <ul className="space-y-1">
                          {data.key_points.map((point, i) => (
                            <li
                              key={i}
                              className={`text-sm ${colors.text} flex items-start gap-2`}
                            >
                              <span className="mt-1.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        <p className={`text-xs ${colors.text} italic mt-3`}>
                          Tone: {data.tone}
                        </p>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Fact Checks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Fact-Checked Claims
          </h2>
          <div className="space-y-4">
            {analysis.fact_checks.map((check, i) => {
              const status = getFactCheckStatus(check.status);
              const Icon = status.icon;
              return (
                <div
                  key={i}
                  className={`${status.bg} rounded-xl p-6 border border-gray-200`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      size={24}
                      className={`${status.color} flex-shrink-0 mt-0.5`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold ${status.color} uppercase tracking-wide`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-3 text-lg">
                        "{check.claim}"
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {check.explanation}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Sources:
                        </span>
                        {check.sources.map((src, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-white text-xs text-gray-700 rounded border border-gray-200 font-medium"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Breakdown */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Sources ({analysis.sources.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">
                      {source.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`${getSourceBiasColor(source.bias)} text-white text-xs px-2 py-0.5 rounded font-medium capitalize`}
                      >
                        {source.bias}
                      </span>
                      <span className="text-xs text-gray-500">
                        {source.credibility}% credible
                      </span>
                    </div>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-gray-400 group-hover:text-blue-600 flex-shrink-0"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2 line-clamp-2">
                  {source.headline}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {source.excerpt}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
