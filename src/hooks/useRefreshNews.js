import { useState } from "react";

export function useRefreshNews() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/news/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "breaking news" }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully added ${data.count} new articles!`);
        // Refresh articles list
        window.location.reload();
      } else {
        throw new Error("Failed to refresh news");
      }
    } catch (error) {
      console.error("Error refreshing news:", error);
      alert("Failed to refresh news. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    handleRefreshNews,
  };
}
