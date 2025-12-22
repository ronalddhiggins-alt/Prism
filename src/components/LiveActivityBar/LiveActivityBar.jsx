import { Users, Clock } from "lucide-react";

export function LiveActivityBar({ liveActivity, formatTimeAgo }) {
  if (!liveActivity) return null;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-green-600">
                  {liveActivity.totalToday}
                </span>{" "}
                investigations today
              </span>
            </div>
            {liveActivity.activeInvestigations > 0 && (
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-500" />
                <span className="text-gray-600">
                  <span className="font-semibold text-blue-600">
                    {liveActivity.activeInvestigations}
                  </span>{" "}
                  active now
                </span>
              </div>
            )}
          </div>
          {liveActivity.recentInvestigations?.length > 0 && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} />
              <span>
                Last: "{liveActivity.recentInvestigations[0].topic}"{" "}
                {formatTimeAgo(
                  liveActivity.recentInvestigations[0].investigated_at,
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
