import { Request, Response, NextFunction } from 'express';
import { aiService, AI_CONFIG } from '../ai/ai.service';
import { communityService } from '../services/community.service';
import logger from '../utils/logger';

export class AIController {
  public static async processRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { feature, data, communityId } = req.body;
      const config = AI_CONFIG[feature as keyof typeof AI_CONFIG];

      let context = "No specific club context provided.";

      if (communityId) {
        const fullData = await communityService.getFullCommunityData(communityId);
        if (fullData) {
          const { community, members } = fullData;
          const memberDetails = members.map(m => `${m.name} (${m.interests.join(", ")})`);
          context = `Club: ${community.name}. Description: ${community.description}. Members: ${memberDetails.join(", ")}.`;
        }
      }

      let prompt: string;
      if (feature === 'connect') {
        const connectConfig = config as { system: string; schema: (context: string, members: any[]) => string };
        prompt = connectConfig.schema(context, data.members || []);
      } else {
        const standardConfig = config as { system: string; schema: (context: string, desc: string, name: string) => string };
        prompt = standardConfig.schema(context, data.description || '', data.clubName || '');
      }

      const result = await aiService.callOpenAI(config.system, prompt);
      res.json(result);
    } catch (error) {
      logger.error('AI Controller Error: %s', (error as Error).message);
      next(error);
    }
  }
}
