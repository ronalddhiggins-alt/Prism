"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient outside of component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Preview token available in env (frontend-safe)
const envToken = process.env.NEXT_PUBLIC_PREVIEW_TOKEN;

export default function RootLayout({ children }) {
  // Preview gate state
  const [checked, setChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // One-time token check via URL (?t=TOKEN) OR /unlock/TOKEN with localStorage persistence
  useEffect(() => {
    try {
      // If no token configured, treat as unlocked (useful for local/dev)
      if (!envToken || envToken.length === 0) {
        setUnlocked(true);
        setChecked(true);
        return;
      }

      const url = new URL(window.location.href);
      const path = url.pathname || "";

      // Accept token either as query (?t=TOKEN) or as path (/unlock/TOKEN)
      let urlToken = url.searchParams.get("t");
      if (!urlToken && path.startsWith("/unlock/")) {
        const parts = path.split("/");
        // parts: ["", "unlock", "<token>", ...]
        urlToken = decodeURIComponent(parts[2] || "");
      }

      const stored = localStorage.getItem("preview_unlocked");

      if (urlToken && urlToken === envToken) {
        localStorage.setItem("preview_unlocked", "true");
        setUnlocked(true);

        // If token came from query, clean it from the URL
        if (url.searchParams.get("t")) {
          url.searchParams.delete("t");
          const qs = url.searchParams.toString();
          const clean = url.pathname + (qs ? `?${qs}` : "") + url.hash;
          window.history.replaceState({}, "", clean);
        }

        // If token came from /unlock/<token>, bounce to home cleanly
        if (path.startsWith("/unlock/")) {
          window.location.replace("/");
        }
      } else if (stored === "true") {
        setUnlocked(true);
      } else {
        setUnlocked(false);
      }
    } catch (err) {
      console.error("Preview gate error", err);
      setUnlocked(false);
    } finally {
      setChecked(true);
    }
  }, []);

  // Helper: copy token to clipboard
  const copyToken = () => {
    try {
      if (!envToken) return;
      navigator.clipboard?.writeText(envToken);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

  // Helper: lock this browser (clear unlock flag)
  const relock = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.removeItem("preview_unlocked");
    } catch {}
    // Soft relock without full navigation if possible
    setUnlocked(false);
    // Also reload to ensure consistent state across pages
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // --- Lightweight analytics: log a page view ---
  useEffect(() => {
    if (!checked || !unlocked) return;
    try {
      const getCookie = (name) => {
        const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return m ? decodeURIComponent(m[1]) : null;
      };
      const setCookie = (name, value, maxAgeSeconds) => {
        const parts = [
          `${name}=${encodeURIComponent(value)}`,
          "Path=/",
          "SameSite=Lax",
        ];
        if (maxAgeSeconds) parts.push(`Max-Age=${maxAgeSeconds}`);
        document.cookie = parts.join("; ");
      };

      // Ensure a session id cookie exists for uniqueness
      let sid = getCookie("pv_session");
      if (!sid) {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        sid = Array.from(arr)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        // 180 days
        setCookie("pv_session", sid, 60 * 60 * 24 * 180);
      }

      const payload = {
        path: window.location.pathname,
        referrer: document.referrer || "",
        sessionId: sid,
      };

      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/visit", blob);
      } else {
        fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.error("analytics beacon error", e);
    }
  }, [checked, unlocked]);

  return (
    <html lang="en">
      <head>
        {/* Prevent indexing while in preview: only add noindex when a preview token is set */}
        {envToken ? <meta name="robots" content="noindex,nofollow" /> : null}
        {/* Basic viewport for proper sizing */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Prism</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {/* Show nothing until we've checked */}
          {!checked ? null : unlocked ? (
            <>
              {/* Preview ribbon & feedback only if preview is enabled via env token */}
              {envToken ? (
                <>
                  <div className="fixed top-3 left-3 z-50">
                    <span className="text-[11px] px-2 py-1 rounded-md bg-amber-500 text-white font-semibold shadow">
                      Preview
                    </span>
                  </div>
                  <a
                    href="mailto:ron.higgins47@yahoo.com?subject=Prism%20preview%20feedback"
                    className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white shadow-md text-sm px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Send feedback
                  </a>
                  {/* Removed fixed relock link to avoid duplication with footer link */}
                </>
              ) : null}
              {children}
            </>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm text-center shadow-sm">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Private Preview
                </p>
                <p className="text-sm text-gray-600">
                  This preview requires a tokenized link. Please use the link
                  you were sent.
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Tip: Open /unlock/your-token or add ?t=your-token to the URL
                </p>
                {/* --- Unlock help with prefilled token --- */}
                {envToken ? (
                  <div className="mt-4 text-left">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Unlock help
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        value={envToken}
                        readOnly
                        aria-label="Preview token"
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 bg-gray-50"
                      />
                      <button
                        onClick={copyToken}
                        className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                        aria-label="Copy token"
                      >
                        Copy
                      </button>
                    </div>
                    <a
                      href={`/unlock/${encodeURIComponent(envToken)}`}
                      className="mt-3 inline-flex items-center justify-center w-full text-xs font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-md px-3 py-2"
                    >
                      Unlock now
                    </a>
                    <p className="text-[11px] text-gray-500 mt-2 break-all">
                      Or append to URL: ?t={envToken}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
