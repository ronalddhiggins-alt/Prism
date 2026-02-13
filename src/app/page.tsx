"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    // Navigate to the investigation page
    router.push(`/investigate?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">

      <div className="w-full max-w-2xl text-center space-y-8">

        {/* Logo / Brand */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 pb-2">
            Prism
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            See the whole picture.
          </p>
        </div>

        {/* Search Box */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-rose-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to understand?"
              className="w-full px-6 py-5 text-lg bg-white dark:bg-neutral-800 border-0 rounded-xl shadow-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder:text-gray-400 text-gray-900 dark:text-white transition-all"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {["AI Safety", "Universal Basic Income", "Climate Change", "Social Media Regulation"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                // Optional: auto-search on click
                // router.push(`/investigate?topic=${encodeURIComponent(t)}`);
              }}
              className="px-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full hover:border-gray-300 dark:hover:border-neutral-600 transition-colors text-gray-600 dark:text-gray-300"
            >
              {t}
            </button>
          ))}
        </div>

      </div>


    </main>
  );
}
