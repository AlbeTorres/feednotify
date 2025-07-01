import express from 'express';
import { createNewsletter } from '../../controllers/newsletter/createNewsletter.controller';
import { methodNotAllowed } from '../../util/methodHandler';
import { updateNewsletter } from '../../controllers/newsletter/updateNewsletter.controller';
import { deleteNewsletter } from '../../controllers/newsletter/deleteNewsletter.controller';
import { getNewsletterById } from '../../controllers/newsletter/getNewsletterById.controller';
import { getNewsletterByUser } from '../../controllers/newsletter/getNewsletterByUser.controller';
import { addSourceNewsletter } from '../../controllers/newsletter/addSourcesNewsletter.controller';
import { deleteSourcesNewsletter } from '../../controllers/newsletter/deleteSourcesNewsletter.controller';

const router = express.Router();

router
  .route('/')
  .get(getNewsletterByUser)
  .post(createNewsletter)
  .all(methodNotAllowed(['POST', 'GET']));

router
  .route('/:id')
  .patch(updateNewsletter)
  .delete(deleteNewsletter)
  .get(getNewsletterById)
  .all(methodNotAllowed(['GET', 'DELETE', 'PATCH']));

router
  .route('/:id/source')
  .post(addSourceNewsletter)
  .delete(deleteSourcesNewsletter)
  .all(methodNotAllowed(['POST', 'DELETE']));

export default router;
