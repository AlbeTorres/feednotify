import express from 'express';

import { createSource } from '../../controllers/source/createSource.controller';
import { deleteSource } from '../../controllers/source/deleteSource.controller';
import { getSourceById } from '../../controllers/source/getSourceById.controller';
import { getSourcesByUser } from '../../controllers/source/getSourcesByUser.controller';
import { updateSource } from '../../controllers/source/updateSource.controller';
import { methodNotAllowed } from '../../util/methodHandler';

const router = express.Router();

router
  .route('/create-source')
  .post(createSource)
  .all(methodNotAllowed(['POST']));

router
  .route('/update-source')
  .patch(updateSource)
  .all(methodNotAllowed(['PATCH']));

router
  .route('/get-source-by-id')
  .get(getSourceById)
  .all(methodNotAllowed(['GET']));

router
  .route('/get-sources-by-user')
  .get(getSourcesByUser)
  .all(methodNotAllowed(['GET']));

router
  .route('/delete-source')
  .delete(deleteSource)
  .all(methodNotAllowed(['DELETE']));

export default router;
