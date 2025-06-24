import express from 'express';
import { sendAINewsletter } from '../../controllers/newsletterDelivery/aiNewsletter.controller';
import { cancelarScheduledNewsletter } from '../../controllers/newsletterDelivery/cancelScheduleNewsletter.controller';
import { sendNewsletter } from '../../controllers/newsletterDelivery/newsletter.controller';
import { weeklyScheduleNewsletter } from '../../controllers/newsletterDelivery/weeklyScheduleNewsletter.controller';
import { methodNotAllowed } from '../../util/methodHandler';

const router = express.Router();

router
  .route('/')
  .get(sendNewsletter)
  .all(methodNotAllowed(['GET']));

router
  .route('/ai')
  .get(sendAINewsletter)
  .all(methodNotAllowed(['GET']));

router
  .route('/schedule')
  .post(weeklyScheduleNewsletter)
  .all(methodNotAllowed(['POST']));

router
  .route('/schedulecancel')
  .post(cancelarScheduledNewsletter)
  .all(methodNotAllowed(['POST']));

export default router;
