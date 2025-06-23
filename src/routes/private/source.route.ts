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
  .route('/create')
  .post(createSource)
  .all(methodNotAllowed(['POST']));

router
  .route('/create-bulk')
  .post(createBulkSource)
  .all(methodNotAllowed(['POST']));

router
  .route('/update')
  .patch(updateSource)
  .all(methodNotAllowed(['PATCH']));

router
  .route('/:id')
  .get(getSourceById)
  .all(methodNotAllowed(['GET']));

router
  .route('/')
  .get(getSourcesByUser)
  .all(methodNotAllowed(['GET']));

router
  .route('/delete')
  .delete(deleteSource)
  .all(methodNotAllowed(['DELETE']));

export default router;
