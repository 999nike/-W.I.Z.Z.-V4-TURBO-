const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const question = req.query.question || 'Hello Wizz';
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ answer: "Wizz: OPENROUTER_API_KEY not set." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://cloud-wizz.vercel.app"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      const reply = data?.choices?.[0]?.message?.content?.trim();
      return res.status(200).json({ answer: reply || "Wizz: No reply received." });
    } catch {
      return res.status(500).json({ answer: "Wizz: Could not parse response:\n" + text });
    }

  } catch (err) {
    return res.status(500).json({ answer: "Wizz: Failed to contact OpenRouter." });
  }
};