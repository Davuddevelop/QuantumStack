const https = require('https');

/**
 * AI Service Configuration and Helper
 * This module follows the Single Responsibility Principle by encapsulating 
 * all AI communication and prompt engineering logic.
 */

const callOpenAI = async (systemPrompt, userPrompt) => {
  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables.');
  }

  const payload = JSON.stringify({
    model: 'gpt-4o',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const text = parsed.choices[0].message.content;
          const clean = text.replace(/```json|```/g, '').trim();
          resolve(JSON.parse(clean));
        } catch (e) {
          reject(new Error(`AI Parse Error: ${e.message}`));
        }
      });
    });
    req.on('error', err => reject(new Error(`Network Error: ${err.message}`)));
    req.write(payload);
    req.end();
  });
};

const AI_CONFIG = {
  health: {
    system: "You are an expert community health analyst for university clubs. Return ONLY valid JSON.",
    schema: (context, desc, name) => `
      Context: ${context}
      Club: ${name}
      Activity: ${desc}
      Return JSON: { "overallScore": 0-100, "engagementRate": 0-100, "retentionRisk": "Low/Med/High", "breakdown": { "memberEngagement": 0, "eventConsistency": 0, "communication": 0, "leadershipLoad": 0, "newMemberIntegration": 0 }, "risks": [{ "level": "critical/warning/strength", "text": "..." }], "actions": [{ "priority": "HIGH/MEDIUM/LOW", "title": "...", "why": "..." }] }`
  },
  planner: {
    system: "You are an AI Event Strategist for university clubs. Return ONLY valid JSON.",
    schema: (context, desc, name) => `
      Context: ${context}
      Club: ${name}
      Idea: ${desc}
      Return JSON: { "title": "...", "headline": "...", "description": "...", "targetAudience": "...", "goals": [], "timeline": [{ "when": "...", "task": "..." }], "checklist": [], "runOfShow": [{ "time": "...", "activity": "...", "owner": "...", "notes": "..." }] }`
  },
  connect: {
    system: "You are a Community Connection AI. Return ONLY valid JSON.",
    schema: (context, members) => `
      Context: ${context}
      Members: ${JSON.stringify(members)}
      Return JSON: { "connections": [{ "member1": "...", "member2": "...", "reason": "...", "sharedInterests": [], "introMessage": "..." }] }`
  }
};

module.exports = {
  callOpenAI,
  AI_CONFIG
};
