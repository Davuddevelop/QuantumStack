import { Router } from 'express';
import aiRoutes from './ai.routes';
import communityRoutes from './community.routes';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/community', communityRoutes);

export default router;
