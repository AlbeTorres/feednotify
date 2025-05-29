import express from 'express';

import { createSource } from '../../controllers/source/createSource.controller';
import { deleteSource } from '../../controllers/source/deleteSource.controller';
import { getSourceById } from '../../controllers/source/getSourceById.controller';
import { getSourcesByUser } from '../../controllers/source/getSourcesByUser.controller';
import { updateSource } from '../../controllers/source/updateSource.controller';

const router = express.Router();

router.post('/create-source', createSource);
router.post('/update-source', updateSource);
router.post('/get-source-By-Id', getSourceById);
router.post(
  '/get-sources-By-User',

  getSourcesByUser
);
router.post('/delete-source', deleteSource);

export default router;
