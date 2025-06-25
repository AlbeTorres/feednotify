import express from 'express';
import { createNewsletter } from '../../controllers/newsletter/createNewsletter.controller';
import { methodNotAllowed } from '../../util/methodHandler';
import { updateNewsletter } from '../../controllers/newsletter/updateNewsletter.controller';
import { deleteNewsletter } from '../../controllers/newsletter/deleteNewsletter.controller';
import { getNewsletterById } from '../../controllers/newsletter/getNewsletterById.controller';
import { getNewsletterByUser } from '../../controllers/newsletter/getNewsletterByUser.controller';
import { addSourceNewsletter } from '../../controllers/newsletter/addSourcesNewsletter.controller';

const router = express.Router();

router
  .route('/create')
  .post(createNewsletter)
  .all(methodNotAllowed(['POST']));

router
  .route('/update')
  .patch(updateNewsletter)
  .all(methodNotAllowed(['PATCH']));

router
  .route('/delete')
  .delete(deleteNewsletter)
  .all(methodNotAllowed(['DELETE']));

router
  .route('/')
  .get(getNewsletterByUser)
  .all(methodNotAllowed(['GET']));

router
  .route('/:id')
  .get(getNewsletterById)
  .all(methodNotAllowed(['GET']));

router
  .route('/:id/source')
  .post(addSourceNewsletter)
  .all(methodNotAllowed(['POST']));

router
  .route('/:id/source')
  .delete(addSourceNewsletter)
  .all(methodNotAllowed(['DELETE']));

export default router;
