import { Router } from 'express';

import authMiddleware from '../middleware/auth.middleware';
import apiKeyRoutes from './private/apikey.route';
import newsletterRoutes from './private/newsletter.route';
import sourceRoutes from './private/source.route';
import updatesRoutes from './private/updates.route';
import authRoutes from './public/auth.route';

const router = Router();

// Rutas públicas (acceso por API Key o abiertas)
router.use('/auth', authRoutes);

// Rutas privadas (requieren JWT)
router.use('/newsletter', authMiddleware, newsletterRoutes);
router.use('/update', authMiddleware, updatesRoutes);
router.use('/source', authMiddleware, sourceRoutes);
router.use('/apikey', authMiddleware, apiKeyRoutes);

export default router;
