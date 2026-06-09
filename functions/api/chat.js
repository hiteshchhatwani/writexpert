// Cloudflare Pages Function — secure proxy to Groq (Llama).
// The API key is read from an encrypted environment variable (GROQ_API_KEY)
// set in Cloudflare Pages → Settings → Variables and Secrets.
// It is NEVER stored in this file or shipped to the browser.

const SYSTEM_PROMPT = `You are Xara, the friendly AI assistant for writeXpert, an AI-enabled technology consultancy.
writeXpert designs and ships digital products for businesses: web platforms & SaaS, mobile apps (iOS/Android),
AI-powered systems (LLM integrations, copilots, agents), workflow automation, cloud & DevOps, and solution architecture.
The team is remote-first and works on a project or retainer basis across industries (e-commerce, fintech, logistics, healthcare, education and more).
The fastest way for a visitor to start is the "Start a project" button or WhatsApp via the contact page.

Guidelines:
- Introduce yourself as Xara if asked your name. Be concise, friendly and professional. Keep answers to 2-4 short sentences unless asked for detail.
- Only answer about writeXpert, technology, software, and the visitor's project needs. Politely redirect off-topic questions.
- Never invent specific prices, timelines, client names, or guarantees. For quotes, suggest starting a project / messaging on WhatsApp.
- You do not have access to private data, accounts, or the ability to take actions.`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  if (!env.GROQ_API_KEY) {
    return json({ error: "The AI assistant isn't configured yet. Please reach us on WhatsApp." }, 200);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  // sanitise: only role/content, cap length, keep last 10
  const safe = incoming
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (safe.length === 0) return json({ error: "No message provided." }, 400);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safe],
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      return json({ error: "The assistant is busy right now. Please try again or reach us on WhatsApp." }, 200);
    }
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return json({ reply: reply || "Sorry, I couldn't generate a response. Please try again." });
  } catch {
    return json({ error: "Something went wrong reaching the assistant." }, 200);
  }
}

// Optional: respond to non-POST politely
export async function onRequestGet() {
  return new Response(JSON.stringify({ status: "ok", info: "POST { messages } to chat." }), {
    headers: { "Content-Type": "application/json" },
  });
}
