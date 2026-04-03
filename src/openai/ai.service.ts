import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';

export interface AIResponse {
  [key: string]: any;
}

export const AI_CONFIG = {
  health: {
    system: "You are an expert community health analyst for university clubs. Return ONLY valid JSON.",
    schema: (context: string, desc: string, name: string) => `
      Context: ${context}
      Club: ${name}
      Activity: ${desc}
      Return JSON: { "overallScore": 0-100, "engagementRate": 0-100, "retentionRisk": "Low/Med/High", "breakdown": { "memberEngagement": 0, "eventConsistency": 0, "communication": 0, "leadershipLoad": 0, "newMemberIntegration": 0 }, "risks": [{ "level": "critical/warning/strength", "text": "..." }], "actions": [{ "priority": "HIGH/MEDIUM/LOW", "title": "...", "why": "..." }] }`
  } as { system: string; schema: (context: string, desc: string, name: string) => string },
  planner: {
    system: "You are an AI Event Strategist for university clubs. Return ONLY valid JSON.",
    schema: (context: string, desc: string, name: string) => `
      Context: ${context}
      Club: ${name}
      Idea: ${desc}
      Return JSON: { "title": "...", "headline": "...", "description": "...", "targetAudience": "...", "goals": [], "timeline": [{ "when": "...", "task": "..." }], "checklist": [], "runOfShow": [{ "time": "...", "activity": "...", "owner": "...", "notes": "..." }] }`
  } as { system: string; schema: (context: string, desc: string, name: string) => string },
  connect: {
    system: "You are a Community Connection AI. Return ONLY valid JSON.",
    schema: (context: string, members: any[]) => `
      Context: ${context}
      Members: ${JSON.stringify(members)}
      Return JSON: { "connections": [{ "member1": "...", "member2": "...", "reason": "...", "sharedInterests": [], "introMessage": "..." }] }`
  } as { system: string; schema: (context: string, members: any[]) => string }
};

class AIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MAX_RETRIES = 3;

  public async callOpenAI(systemPrompt: string, userPrompt: string, retryCount = 0): Promise<AIResponse> {
    if (!config.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    try {
      const response = await axios.post(
        AIService.API_URL,
        {
          model: 'gpt-4o',
          max_tokens: 1500,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openai.apiKey}`
          },
          timeout: 30000 // 30s timeout
        }
      );

      const text = response.data.choices[0].message.content;
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error: any) {
      if (retryCount < AIService.MAX_RETRIES && this.shouldRetry(error)) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.warn(`AI Service Retry ${retryCount + 1}/${AIService.MAX_RETRIES} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.callOpenAI(systemPrompt, userPrompt, retryCount + 1);
      }

      const message = error.response?.data?.error?.message || error.message;
      logger.error('AI Service Error: %s', message);
      throw new Error(`AI Processing Failed: ${message}`);
    }
  }

  private shouldRetry(error: any): boolean {
    const status = error.response?.status;
    return status === 429 || (status >= 500 && status <= 599);
  }
}

export const aiService = new AIService();
