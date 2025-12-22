import { useState, useRef, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export function useBiasLens() {
  const [biasInput, setBiasInput] = useState("");
  const [tone, setTone] = useState("neutral");
  const biasInputRef = useRef(null);

  const biasLensMutation = useMutation({
    mutationFn: async (input) => {
      const topic = input;

      // Build queries for each side
      const leftQuery = `${topic} site:theguardian.com OR site:msnbc.com OR site:huffpost.com OR site:npr.org`;
      const centerQuery = `${topic} site:reuters.com OR site:apnews.com OR site:bbc.com OR site:pbs.org`;
      const rightQuery = `${topic} site:wsj.com OR site:nationalreview.com OR site:foxnews.com OR site:nypost.com`;

      const [leftRes, centerRes, rightRes] = await Promise.all([
        fetch(
          `/integrations/google-search/search?q=${encodeURIComponent(leftQuery)}`,
        ),
        fetch(
          `/integrations/google-search/search?q=${encodeURIComponent(centerQuery)}`,
        ),
        fetch(
          `/integrations/google-search/search?q=${encodeURIComponent(rightQuery)}`,
        ),
      ]);

      if (!leftRes.ok || !centerRes.ok || !rightRes.ok) {
        throw new Error(
          `Google search failed [L:${leftRes.status}] [C:${centerRes.status}] [R:${rightRes.status}]`,
        );
      }

      const [leftData, centerData, rightData] = await Promise.all([
        leftRes.json(),
        centerRes.json(),
        rightRes.json(),
      ]);

      // Increase source depth to support longer, more detailed writing
      const pickTop = (items) =>
        Array.isArray(items) ? items.slice(0, 5) : [];
      const leftItems = pickTop(leftData.items || []);
      const centerItems = pickTop(centerData.items || []);
      const rightItems = pickTop(rightData.items || []);

      const toCitations = (items) =>
        items.map((it) => {
          let name = it.displayLink || "";
          try {
            if (!name && it.link) {
              name = new URL(it.link).hostname;
            }
          } catch (_) {}
          name = (name || "").replace(/^www\./, "");
          return {
            name,
            headline: it.title || "No title",
            url: it.link || "#",
          };
        });

      const leftCitations = toCitations(leftItems);
      const centerCitations = toCitations(centerItems);
      const rightCitations = toCitations(rightItems);

      const listSide = (label, items) => {
        if (!items.length) return `${label} sources: none found`;
        const lines = items
          .map((it) => {
            const outlet = (it.displayLink || "").replace(/^www\./, "");
            const title = it.title || "(no title)";
            const snippet = it.snippet || "";
            return `- Outlet: ${outlet}\n  Title: ${title}\n  Snippet: ${snippet}`;
          })
          .join("\n");
        return `${label} sources:\n${lines}`;
      };

      // tone-specific guidance
      const toneInstruction =
        tone === "direct"
          ? "Tone: clear, concise, and to the point. Favor short, factual sentences. Avoid adjectives and rhetorical language."
          : tone === "punchy"
            ? "Tone: energetic but factual. Use strong, crisp sentences without slant. No hype, no speculation."
            : "Tone: neutral and measured. Avoid charged adjectives and speculation. Attribute claims to outlets when helpful.";

      // Ask ChatGPT for structured, longer paragraphs based on tone
      const messages = [
        {
          role: "system",
          content: `${toneInstruction} Use only the provided source snippets. Each LEFT/CENTER/RIGHT paragraph should be 6-8 sentences with context, claims, and caveats. The combined_summary should be 6-8 sentences. The analysis should be 4-6 sentences focusing on coverage balance, framing, potential omissions, and uncertainty. Do not include markdown or headings in the output. Return ONLY JSON per the schema.`,
        },
        {
          role: "user",
          content: `Topic/headline or URL: "${topic}"

Write:
1) paragraphs.center — a balanced, detailed paragraph grounded in the center outlets (6-8 sentences, follow tone);
2) paragraphs.right — a detailed paragraph reflecting right-leaning framing described neutrally (6-8 sentences, follow tone);
3) paragraphs.left — a detailed paragraph reflecting left-leaning framing described neutrally (6-8 sentences, follow tone);
4) combined_summary — one synthesis paragraph across outlets (6-8 sentences, follow tone);
5) analysis — one paragraph (4-6 sentences, follow tone) noting coverage balance, framing differences, what is emphasized/omitted, and any uncertainties.

Use only what is supported by the sources below. If a side has few or no sources, say so neutrally.

${listSide("Left", leftItems)}

${listSide("Center", centerItems)}

${listSide("Right", rightItems)}

Return JSON only.`,
        },
      ];

      const json_schema = {
        name: "bias_lens_output",
        schema: {
          type: "object",
          properties: {
            paragraphs: {
              type: "object",
              properties: {
                center: { type: "string" },
                right: { type: "string" },
                left: { type: "string" },
              },
              required: ["center", "right", "left"],
              additionalProperties: false,
            },
            combined_summary: { type: "string" },
            analysis: { type: "string" },
          },
          required: ["paragraphs", "combined_summary", "analysis"],
          additionalProperties: false,
        },
        strict: true,
      };

      const chatRes = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, json_schema }),
      });

      if (!chatRes.ok) {
        throw new Error(
          `ChatGPT request failed [${chatRes.status}] ${chatRes.statusText}`,
        );
      }

      const chatJson = await chatRes.json();
      const content = chatJson?.choices?.[0]?.message?.content || "";

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse ChatGPT JSON:", content);
        throw new Error("AI returned an unexpected format");
      }

      return {
        topic,
        paragraphs: parsed.paragraphs,
        combined_summary: parsed.combined_summary,
        analysis: parsed.analysis,
        citations: {
          left: leftCitations,
          center: centerCitations,
          right: rightCitations,
        },
      };
    },
    onError: (error) => {
      console.error("Bias lens error:", error);
    },
    retry: false,
  });

  const clearBiasLens = useCallback(() => {
    setBiasInput("");
    biasLensMutation.reset();
    if (biasInputRef.current) {
      biasInputRef.current.focus();
    }
  }, [biasLensMutation]);

  const handleBiasLensKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      handleBiasLens();
    }
    if (e.key === "Escape") {
      clearBiasLens();
    }
  }, []);

  const handleBiasLens = useCallback(async () => {
    const t = biasInput;
    if (!t.trim() || biasLensMutation.isPending) return;

    try {
      await biasLensMutation.mutateAsync(t.trim());
    } catch (error) {
      console.error("Bias lens submission error:", error);
    }
  }, [biasInput, biasLensMutation]);

  // persist tone in localStorage
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined" &&
        window.localStorage.getItem("biasLensTone");
      if (saved) setTone(saved);
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("biasLensTone", tone);
      }
    } catch (_) {}
  }, [tone]);

  return {
    biasInput,
    setBiasInput,
    biasInputRef,
    tone,
    setTone,
    isLoading: biasLensMutation.isPending,
    result: biasLensMutation.data || null,
    error: biasLensMutation.isError,
    submit: handleBiasLens,
    clear: clearBiasLens,
    onKeyDown: handleBiasLensKeyDown,
  };
}
