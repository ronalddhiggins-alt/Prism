"use client";

export default function SessionSummaryPage() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const downloadHref = "/api/session-summary";
  const viewHref = "/api/session-summary?inline=1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-['Instrument_Sans']">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Session Summary
        </h1>
        <p className="text-gray-600 mb-6">
          Generated on {yyyy}-{mm}-{dd}
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-800 mb-4">
            This is a clean recap of what this project includes and what we set
            up during our sessions. You can download it as plain text or view it
            in your browser first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={downloadHref}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Download summary (.txt)
            </a>
            <a
              href={viewHref}
              target="_blank"
              className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-900 px-4 py-2 hover:bg-gray-200"
            >
              View inline (opens new tab)
            </a>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Tip: The summary avoids listing any secret values. It’s safe to
            share if you need to get feedback.
          </p>
          <p>
            You can always grab the project outline at <code>/project-log</code>{" "}
            as well.
          </p>
        </div>
      </main>
    </div>
  );
}
