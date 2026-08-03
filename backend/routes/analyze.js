import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// POST /api/analyze — AI Fact Checking powered by Groq API
router.post('/', async (req, res) => {
  try {
    const { text, lang } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Text input is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GROQ_API_KEY missing in backend process.env');
      return res.status(500).json({ success: false, error: 'GROQ_API_KEY is missing on backend.' });
    }

    const groqResponse = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content: `You are an expert AI Fact Checker, News Verification Engine, and Logical Consistency Analyzer.
Your job is NOT to judge grammar or writing quality. Your job is to determine whether the CLAIM itself is TRUE or FALSE.
Strict Rules:
1. Analyze exact meaning. Every word matters.
2. Negation words (not, no, never, does not, did not, cannot, isn't, wasn't, without, false) completely change the claim meaning.
3. Opposite claims ("ends strike" vs "does not end strike") MUST NEVER receive the same verdict.
4. Compare against reliable facts. Return FAKE if contradictory, UNVERIFIED if unproven, VERIFIED only if strong proof exists.

Return ONLY valid JSON format:
{
  "score": <number 0-100>,
  "verdict": "VERIFIED" | "MISLEADING" | "FAKE" | "SATIRE" | "UNVERIFIED",
  "summary": "<Two sentence explanation.>",
  "signals": [
    { "label": "Meaning Checked", "type": "green" | "amber" | "red" },
    { "label": "Fact Verified", "type": "green" | "amber" | "red" },
    { "label": "Negation Detected", "type": "green" | "amber" | "red" },
    { "label": "Evidence Strength", "type": "green" | "amber" | "red" }
  ]
}`
          },
          {
            role: 'user',
            content: `Language: ${lang || 'English'}. Analyze: "${text.trim()}"`
          }
        ]
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API response error:', errText);
      return res.status(groqResponse.status).json({ success: false, error: 'Groq API request failed' });
    }

    const data = await groqResponse.json();
    const raw = data?.choices?.[0]?.message?.content || '';
    let result = null;

    if (raw) {
      let clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) clean = jsonMatch[0];
      result = JSON.parse(clean);
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error('Analyze route error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
