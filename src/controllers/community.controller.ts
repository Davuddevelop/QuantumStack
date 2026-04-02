import { Request, Response, NextFunction } from 'express';
import { communityService } from '../services/community.service';
import logger from '../utils/logger';

export class CommunityController {
  public static async getCommunityData(req: Request, res: Response, next: NextFunction) {
    try {
      const communityId = req.query.id as string;
      const data = await communityService.getFullCommunityData(communityId);

      if (!data) {
        return res.status(404).json({ error: 'Community not found' });
      }

      res.json(data);
    } catch (error) {
      logger.error('Community Controller Error: %s', (error as Error).message);
      next(error);
    }
  }
}
