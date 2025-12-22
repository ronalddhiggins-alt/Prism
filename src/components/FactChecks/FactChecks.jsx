import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { getFactCheckStatus } from "@/utils/articleHelpers";

export function FactChecks({ factChecks, isVerifying }) {
  if (!factChecks?.length && !isVerifying) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case "CheckCircle":
        return CheckCircle;
      case "XCircle":
        return XCircle;
      case "AlertTriangle":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Fact Checks</h2>
      {isVerifying ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <Loader2 size={20} className="animate-spin" />
          <span>Verifying claims...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {factChecks.map((check, i) => {
            const status = getFactCheckStatus(check.status);
            const Icon = getIcon(status.icon);
            return (
              <div
                key={i}
                className={`${status.bg} rounded-lg p-5 border border-gray-200`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    size={22}
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
                    <p className="font-semibold text-gray-900 mb-2">
                      "{check.claim}"
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {check.explanation}
                    </p>
                    {check.sources?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {check.sources.map((src, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-white/50 text-xs text-gray-600 rounded border border-gray-200"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
