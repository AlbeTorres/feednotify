import express from 'express';
import { deleteApiKey } from '../../controllers/api-key/deleteApiKey.controller';
import { generateApiKey } from '../../controllers/api-key/generateApiKey.controller';
import { getApiKeysByUserId } from '../../controllers/api-key/getApiKeyByUserId.controller';
import { updateApiKey } from '../../controllers/api-key/updateApiKey.controller';

const router = express.Router();

router.post('/generate-apikey', generateApiKey);
router.post('/update-apikey', updateApiKey);
router.post('/get-apikey', getApiKeysByUserId);
router.post('/delete-apikey', deleteApiKey);

export default router;
