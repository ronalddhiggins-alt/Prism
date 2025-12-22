import { useState } from "react";

export function useInvestigation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInvestigate = async (topicQuery, query) => {
    const searchTopic = topicQuery || query;
    if (!searchTopic.trim()) return;

    setIsAnalyzing(true);

    try {
      // Log the investigation
      await fetch("/api/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTopic }),
      });
    } catch (error) {
      console.error("Failed to log investigation:", error);
    }

    // Navigate to investigation page
    window.location.href = `/investigate/${encodeURIComponent(searchTopic)}`;
  };

  return {
    isAnalyzing,
    handleInvestigate,
  };
}
