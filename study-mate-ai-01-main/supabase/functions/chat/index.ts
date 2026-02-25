import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are StudyMate AI — an intelligent exam preparation and self-study assistant.

Your main goals:
1. Explain concepts simply and clearly
2. Focus on exam preparation and important topics
3. Provide step-by-step explanations
4. Use real-world examples and analogies
5. Provide code examples for technical/programming topics
6. Summarize knowledge from trusted sources (W3Schools, GeeksforGeeks, Wikipedia)
7. Detect weak areas and suggest improvements
8. Generate practice questions after every explanation
9. Support multilingual explanations (English, Tamil, Telugu, Hindi, etc.)
10. Provide quick revision summaries and exam tips

Always structure your output with these sections (use markdown headers):
## 📖 Simple Explanation
## 🔢 Step-by-step Breakdown
## 💡 Example
## 🎯 Key Points for Exams
## 📝 Practice Questions
## ⚠️ Common Mistakes to Avoid
## 📚 Suggested Next Topics

If the student asks for revision, provide short summaries with key formulas, definitions, and frequently asked exam questions.
If the student asks for practice, generate MCQs, short answers, and long questions with answers at the end.
If the student requests another language, explain in both English and the requested language.

Keep explanations clear, concise, structured, and student-friendly.
Always motivate the student and encourage learning. Use emojis sparingly for engagement.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
