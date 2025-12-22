"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart3, User, Users } from "lucide-react";

export default function VisitsAdminPage() {
  const qc = useQueryClient();
  const [isOwnerDevice, setIsOwnerDevice] = useState(false);

  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )prism_owner=([^;]*)/);
    setIsOwnerDevice(m ? decodeURIComponent(m[1]) === "1" : false);
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/summary");
      if (!res.ok) {
        throw new Error(
          `When fetching /api/analytics/summary, the response was [${res.status}] ${res.statusText}`,
        );
      }
      return res.json();
    },
  });

  const markMe = () => {
    document.cookie = "prism_owner=1; Path=/; SameSite=Lax; Max-Age=31536000"; // 1 year
    setIsOwnerDevice(true);
    refetch();
  };
  const unmarkMe = () => {
    document.cookie = "prism_owner=; Path=/; SameSite=Lax; Max-Age=0";
    setIsOwnerDevice(false);
    refetch();
  };

  const totals = data?.totals || { visits: 0, uniqueSessions: 0 };
  const me = data?.me || { visits: 0 };
  const others = data?.others || { visits: 0 };

  const recent = data?.recent || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={22} className="text-blue-600" />
            Traffic Overview
          </h1>
          <div className="flex items-center gap-2">
            {isOwnerDevice ? (
              <button
                onClick={unmarkMe}
                className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                This device: Me (click to unmark)
              </button>
            ) : (
              <button
                onClick={markMe}
                className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Mark this device as Me
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading…</p>
        ) : error ? (
          <p className="text-red-600 text-sm">Could not load analytics.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Total visits</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totals.visits}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Unique sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totals.uniqueSessions}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Me vs Others (visits)</p>
                <div className="flex items-end gap-3 mt-1">
                  <div className="flex items-center gap-1 text-gray-800">
                    <User size={16} />{" "}
                    <span className="text-lg font-semibold">{me.visits}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users size={16} />{" "}
                    <span className="text-lg font-semibold">
                      {others.visits}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Last 30 days
              </p>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-500">No data yet.</p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <div className="flex items-end gap-2 h-32">
                    {recent.map((d) => {
                      const height = Math.min(100, d.count * 8); // simple scale
                      return (
                        <div
                          key={d.day}
                          className="flex flex-col items-center justify-end"
                          style={{ width: 16 }}
                        >
                          <div
                            className="w-3 rounded bg-blue-500"
                            style={{ height }}
                          />
                          <span className="text-[10px] text-gray-500 mt-1">
                            {d.day.slice(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 mt-6">
          Tip: Visits are counted when a page loads. Use the "Mark this device
          as Me" button so we can split your traffic from everyone else.
        </p>
      </div>
    </div>
  );
}
