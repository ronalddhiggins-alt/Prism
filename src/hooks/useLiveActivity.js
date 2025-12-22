import { useQuery } from "@tanstack/react-query";

export function useLiveActivity() {
  const { data: liveActivity } = useQuery({
    queryKey: ["live-activity"],
    queryFn: async () => {
      const response = await fetch("/api/investigations");
      if (!response.ok) throw new Error("Failed to fetch live activity");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return liveActivity;
}
