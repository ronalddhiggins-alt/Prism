"use client";

export default function ProjectLogPage() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  // Removed download/view links

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-['Instrument_Sans']">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Log</h1>
        <p className="text-gray-600 mb-6">
          Generated on {yyyy}-{mm}-{dd}
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-800 mb-4">
            Project Log downloads have been disabled for this app.
          </p>
          <p className="text-gray-600">
            If you need a summary of the current session instead, visit the
            <a
              href="/session-summary"
              className="text-blue-600 hover:underline"
            >
              {" "}
              Session Summary
            </a>{" "}
            page.
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Tip: You can always revisit the Session Summary page to view a
            snapshot of the latest activity.
          </p>
        </div>
      </main>
    </div>
  );
}
