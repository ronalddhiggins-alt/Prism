import { Info } from "lucide-react";

export function KeyDifferences({ keyDifferences }) {
  return (
    <>
      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Info className="text-white" size={20} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">
              Why This Analysis Matters
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Prism analyzes coverage across the political spectrum. Here's how
              different outlets approach this story:
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Prism isn't just rewriting news—it's helping you{" "}
              <strong>understand how political ethics shape coverage</strong>.
              Different outlets emphasize different aspects of the same story
              based on their underlying values and priorities.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              <strong>This analysis helps you:</strong>
            </p>
            <ul className="text-sm text-gray-700 space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Spot framing differences</strong> – See how the same
                  event becomes "Green Energy Victory" (left) vs "New Business
                  Regulations" (right)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Understand coverage gaps</strong> – When only one side
                  reports something, ask why the other side is silent
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Make informed decisions</strong> – Compare actual
                  sources, don't just trust one aggregated version
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Map political ethics</strong> – Understand which
                  values each perspective prioritizes (equity vs freedom,
                  collective vs individual, change vs tradition)
                </span>
              </li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              By seeing <em>how</em> news is reported across the spectrum, you
              can identify your own political ethics, understand others'
              perspectives more deeply, and see the bigger picture beyond any
              single narrative.
            </p>
            <a
              href="/guide"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3"
            >
              Learn more about using Prism
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Key Differences Content */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Key Differences Across Perspectives
        </h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {keyDifferences.split("\n").map((para, i) => (
            <p key={i} className="mb-4">
              {para.split("**").map((part, j) =>
                j % 2 === 0 ? (
                  <span key={j}>{part}</span>
                ) : (
                  <strong key={j} className="font-semibold text-gray-900">
                    {part}
                  </strong>
                ),
              )}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
