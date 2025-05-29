import express from 'express';
import { deleteApiKey } from '../../controllers/api-keys/deleteApiKey.controller';
import { generateApiKey } from '../../controllers/api-keys/generateApiKey.controller';
import { getApiKeysByUserId } from '../../controllers/api-keys/getApiKeyByUserId.controller';
import { updateApiKey } from '../../controllers/api-keys/updateApiKey.controller';

const router = express.Router();

router.post('/generate-apikey', generateApiKey);
router.post('/update-apikey', updateApiKey);
router.post('/get-apikey', getApiKeysByUserId);
router.post('/delete-apikey', deleteApiKey);

export default router;
