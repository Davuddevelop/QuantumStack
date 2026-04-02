import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { validate } from '../middleware/validate.middleware';
import { AIRequestSchema } from '../models/ai.schema';

const router = Router();

router.post('/', validate(AIRequestSchema), AIController.processRequest);

export default router;
