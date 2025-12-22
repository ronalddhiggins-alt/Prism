import { Activity } from "lucide-react";

export function RecentActivity({ liveActivity, formatTimeAgo }) {
  if (!liveActivity?.recentInvestigations?.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-green-500" />
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Live Activity
        </p>
      </div>
      <div className="space-y-2">
        {liveActivity.recentInvestigations
          .slice(0, 5)
          .map((investigation, index) => (
            <div
              key={index}
              className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 truncate flex-1 mr-2">
                  "{investigation.topic}"
                </span>
                <span className="text-gray-500 text-xs whitespace-nowrap">
                  {formatTimeAgo(investigation.investigated_at)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
