import express from 'express';
import { sendAINewsletter } from '../../controllers/aiNewsletter.controller';
import { sendNewsletter } from '../../controllers/newsletter.controller';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.get('/', sendNewsletter);
router.get('/ai', sendAINewsletter);

export default router;
