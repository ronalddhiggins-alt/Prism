import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

export function useQuickSummary() {
  const [quickQuery, setQuickQuery] = useState("");
  const quickInputRef = useRef(null);

  const summaryMutation = useMutation({
    mutationFn: async (topic) => {
      const response = await fetch("/api/investigate/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) {
        throw new Error(
          `When fetching /api/investigate/analyze, the response was [${response.status}] ${response.statusText}`,
        );
      }
      return response.json();
    },
  });

  const clearQuickSummary = () => {
    setQuickQuery("");
    summaryMutation.reset();
    if (quickInputRef.current) {
      quickInputRef.current.focus();
    }
  };

  const handleQuickSummaryKeyDown = (e) => {
    if (e.key === "Enter") {
      handleQuickSummary();
    }
    if (e.key === "Escape") {
      clearQuickSummary();
    }
  };

  const handleQuickSummary = async () => {
    const t = quickQuery;
    if (!t.trim() || summaryMutation.isPending) return;
    try {
      await summaryMutation.mutateAsync(t.trim());
    } catch (error) {
      console.error(error);
    }
  };

  return {
    quickQuery,
    setQuickQuery,
    quickInputRef,
    isSummarizing: summaryMutation.isPending,
    summaryData: summaryMutation.data?.analysis || null,
    summaryError: summaryMutation.isError,
    handleQuickSummary,
    clearQuickSummary,
    handleQuickSummaryKeyDown,
  };
}
