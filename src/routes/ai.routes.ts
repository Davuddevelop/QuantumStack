import { Router } from 'express';
import { AIController } from '../api_controllers/ai.controller';
import { validate } from '../middleware/validate.middleware';
import { AIRequestSchema } from '../openai/ai.schema';

const router = Router();

router.post('/', validate(AIRequestSchema), AIController.processRequest);

export default router;
