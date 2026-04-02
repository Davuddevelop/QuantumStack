"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AI_CONFIG = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../utils/logger"));
exports.AI_CONFIG = {
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
class AIService {
    static API_URL = 'https://api.openai.com/v1/chat/completions';
    async callOpenAI(systemPrompt, userPrompt) {
        if (!config_1.config.openai.apiKey) {
            throw new Error('OPENAI_API_KEY is not defined');
        }
        try {
            const response = await axios_1.default.post(AIService.API_URL, {
                model: 'gpt-4o',
                max_tokens: 1500,
                temperature: 0.7,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config_1.config.openai.apiKey}`
                }
            });
            const text = response.data.choices[0].message.content;
            const cleanJson = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanJson);
        }
        catch (error) {
            const message = error.response?.data?.error?.message || error.message;
            logger_1.default.error('AI Service Error: %s', message);
            throw new Error(`AI Processing Failed: ${message}`);
        }
    }
}
exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map