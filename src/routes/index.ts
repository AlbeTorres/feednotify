import { Router } from 'express';

import authMiddleware from '../middleware/auth.middleware';
import newsletterRoutes from './private/newsletter.route';
import updatesRoutes from './private/updates.route';
import authRoutes from './public/auth.route';

const router = Router();

// Rutas públicas (acceso por API Key o abiertas)
router.use('/auth', authRoutes);

// Rutas privadas (requieren JWT)
router.use('/newsletter', authMiddleware, newsletterRoutes);
router.use('/updates', authMiddleware, updatesRoutes);

export default router;
