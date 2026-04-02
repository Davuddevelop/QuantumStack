import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { validate } from '../middleware/validate.middleware';
import { CommunityRequestSchema } from '../models/ai.schema';

const router = Router();

router.get('/', validate(CommunityRequestSchema), CommunityController.getCommunityData);

export default router;
