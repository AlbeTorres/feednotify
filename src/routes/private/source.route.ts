import express from 'express';

import { createBulkSource } from '../../controllers/source/createBulkSource.controller';
import { createSource } from '../../controllers/source/createSource.controller';
import { deleteSource } from '../../controllers/source/deleteSource.controller';
import { getSourceById } from '../../controllers/source/getSourceById.controller';
import { getSourcesByUser } from '../../controllers/source/getSourcesByUser.controller';
import { updateSource } from '../../controllers/source/updateSource.controller';
import { methodNotAllowed } from '../../util/methodHandler';

const router = express.Router();

router
  .route('/')
  .post(createSource)
  .get(getSourcesByUser)
  .all(methodNotAllowed(['POST', 'GET']));

router
  .route('/create-bulk')
  .post(createBulkSource)
  .all(methodNotAllowed(['POST']));

router
  .route('/:id')
  .patch(updateSource)
  .delete(deleteSource)
  .get(getSourceById)
  .all(methodNotAllowed(['GET', 'DELETE', 'PATCH']));

export default router;
