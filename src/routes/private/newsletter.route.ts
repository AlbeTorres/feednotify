import express from 'express';
import { sendAINewsletter } from '../../controllers/newsletterDelivery/aiNewsletter.controller';
import { cancelarScheduledNewsletter } from '../../controllers/newsletterDelivery/cancelScheduleNewsletter.controller';
import { sendNewsletter } from '../../controllers/newsletterDelivery/newsletter.controller';
import { weeklyNewsletter } from '../../controllers/newsletterDelivery/weeklyNewsletter.controller';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.get('/', sendNewsletter);
router.get('/ai', sendAINewsletter);
router.post('/schedule', weeklyNewsletter);
router.post('/schedulecancel', cancelarScheduledNewsletter);

export default router;
