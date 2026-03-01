import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge"; // Use Edge Runtime for speed

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return new Response("Topic required", { status: 400 });
        }

        // 1. Current date context — keeps AI grounded in 2026 reality
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateContext = `TEMPORAL CONTEXT (very important): Today is ${today}. Donald Trump's second presidential term began January 20, 2025 and is currently ongoing. Joe Biden's presidency ended January 20, 2025. Use this context when analyzing any claim that involves timelines, current events, or "who is president." Do NOT rely on your training cutoff for dates — use the date above.`;

        // 2. Define Perspective System Prompt
        const getPerspectivePrompt = (perspective: string) => `
${dateContext}

You are a highly skilled media analyst. Your goal is to analyze the topic "${topic}" from a ${perspective.toUpperCase()} political perspective.
Return a valid JSON object with this structure:
{
  "summary": "1-2 sentence summary of how this side views the topic.",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "tone": "2-3 words describing the emotional tone (e.g. Skeptical, Urgent)",
  "likely_sources": [
     { "name": "Name of a typical outlet for this view", "credibility": 85 }
  ]
}
`;

        // 3. Define Fact Checker System Prompt
        const getFactCheckPrompt = () => `
${dateContext}

You are an impartial Fact Checker. Identify the most controversial claim related to "${topic}" and verify it.

CRITICAL RULE: If the topic involves specific events that occurred AFTER your training data (events you have no knowledge of), do NOT invent facts. Instead, set verdict to "Unverifiable" and explain that this event is too recent for your training data, and suggest the user try the Narrative Auditor for live search results on breaking news.

Return a valid JSON object:
{
  "claim": "The specific claim being debated",
  "verdict": "True, False, Nuanced, or Unverifiable",
  "reasoning": "2-3 sentence explanation. If unverifiable, explain why and note your training data limitation.",
  "sources": ["Source 1 or 'Use Narrative Auditor for live sources on recent events'"]
}
`;


        // 3. Launch 4 Parallel Requests
        const perspectives = [
            { id: "left", label: "Left (Progressive)", prompt: getPerspectivePrompt },
            { id: "center", label: "Center (Neutral)", prompt: getPerspectivePrompt },
            { id: "right", label: "Right (Conservative)", prompt: getPerspectivePrompt }
        ];

        // Perspective Promises
        const perspectivePromises = perspectives.map(async (p) => {
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: p.prompt(p.label) },
                        { role: "user", content: `Analyze: ${topic}` }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                });
                const content = completion.choices[0].message.content;
                return { [p.id]: JSON.parse(content || "{}") };
            } catch (err: any) {
                return { [p.id]: { summary: `Error: ${err.message}`, key_points: [], tone: "Error", likely_sources: [] } };
            }
        });

        // Fact Check Promise
        const factCheckPromise = (async () => {
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: getFactCheckPrompt() },
                        { role: "user", content: `Verify: ${topic}` }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.3, // Lower temp for facts
                });
                return JSON.parse(completion.choices[0].message.content || "{}");
            } catch (err: any) {
                return { claim: "Error checking facts", verdict: "Error", reasoning: err.message, sources: [] };
            }
        })();

        const [perspectiveResults, factCheckResult] = await Promise.all([
            Promise.all(perspectivePromises),
            factCheckPromise
        ]);

        // Combine perspective results
        const combinedPerspectives = perspectiveResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return Response.json({
            perspectives: combinedPerspectives,
            fact_check: factCheckResult
        });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
