// File: api/wizz.js
export default async function handler(req, res) {
  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: "Missing question parameter." });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",  // Change to claude-3-opus, meta-llama-3, etc. if desired
      messages: [{ role: "user", content: question }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(500).json({ error: "API call failed", details: errorText });
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "⚠️ No response from model.";

  res.status(200).json({ answer });
}
