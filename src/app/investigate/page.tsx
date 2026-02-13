"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Types for our analysis data
type AnalysisResult = {
    perspectives: {
        left: PerspectiveData;
        center: PerspectiveData;
        right: PerspectiveData;
    };
    fact_check: {
        claim: string;
        verdict: string;
        reasoning: string;
        sources: string[];
    };
};

type PerspectiveData = {
    summary: string;
    key_points: string[];
    tone: string;
    likely_sources?: { name: string; credibility: number }[];
};

export default function InvestigatePage() {
    const searchParams = useSearchParams();
    const topic = searchParams.get("topic");

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!topic) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic }),
                });

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to analyze topic.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [topic]);

    if (!topic) return <div className="p-10">No topic selected.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">New Investigation</span>
                    </Link>
                    <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                        {topic}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        {topic}
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Analysis of how this story is being covered across the political spectrum.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-gray-500 animate-pulse">Consulting the oracle...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center text-red-800">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-bold">Analysis Failed</h3>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Left Perspective */}
                            <PerspectiveCard
                                type="left"
                                data={data?.perspectives.left}
                            />
                            {/* Center Perspective */}
                            <PerspectiveCard
                                type="center"
                                data={data?.perspectives.center}
                            />
                            {/* Right Perspective */}
                            <PerspectiveCard
                                type="right"
                                data={data?.perspectives.right}
                            />
                        </div>

                        {/* Fact Check Section */}
                        {data?.fact_check && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-emerald-600">✓</span> Fact Check
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">"{data.fact_check.claim}"</h3>
                                            <p className="text-gray-700 leading-relaxed">{data.fact_check.reasoning}</p>
                                        </div>
                                        <div className={cn("px-4 py-2 rounded-lg font-bold text-sm uppercase self-start whitespace-nowrap",
                                            data.fact_check.verdict.toLowerCase().includes("true") ? "bg-emerald-100 text-emerald-800" :
                                                data.fact_check.verdict.toLowerCase().includes("false") ? "bg-red-100 text-red-800" :
                                                    "bg-amber-100 text-amber-800"
                                        )}>
                                            {data.fact_check.verdict}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}

function PerspectiveCard({ type, data }: { type: "left" | "center" | "right", data?: PerspectiveData }) {
    const styles = {
        left: "bg-blue-50 border-blue-200 text-blue-900",
        center: "bg-gray-50 border-gray-200 text-gray-900",
        right: "bg-rose-50 border-rose-200 text-rose-900"
    };

    const titles = {
        left: "Left Perspective",
        center: "Center Perspective",
        right: "Right Perspective"
    };

    if (!data) return null;

    return (
        <div className={cn("p-6 rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full", styles[type])}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs opacity-70">
                {titles[type]}
            </h3>
            <p className="text-lg font-medium leading-relaxed mb-6 flex-grow">
                {data.summary}
            </p>

            <div className="space-y-6">
                <div className="space-y-3">
                    {data.key_points.map((point, i) => (
                        <div key={i} className="flex gap-3 text-sm opacity-90">
                            <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                            {point}
                        </div>
                    ))}
                </div>

                {/* Sources & Tone */}
                <div className="pt-4 border-t border-black/5 space-y-3">
                    <div className="text-xs font-semibold opacity-60 uppercase">
                        Tone: {data.tone}
                    </div>

                    {data.likely_sources && data.likely_sources.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-semibold opacity-60 uppercase">Likely Sources:</p>
                            <div className="flex flex-wrap gap-2">
                                {data.likely_sources.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/50 rounded text-xs border border-black/5 flex items-center gap-1">
                                        {s.name}
                                        <span className={cn("text-[10px] font-bold", s.credibility > 80 ? "text-emerald-600" : "text-amber-600")}>
                                            {s.credibility}%
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
