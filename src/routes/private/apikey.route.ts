import express from 'express';
import { deleteApiKey } from '../../controllers/api-keys/deleteApiKey.controller';
import { generateApiKey } from '../../controllers/api-keys/generateApiKey.controller';
import { getApiKeysByUserId } from '../../controllers/api-keys/getApiKeyByUserId.controller';
import { updateApiKey } from '../../controllers/api-keys/updateApiKey.controller';
import authMiddleware from '../../middleware/auth.middleware';
import errorHandler from '../../middleware/errorHandler.middleware';

const router = express.Router();

router.post('/generateapikey', authMiddleware, errorHandler, generateApiKey);
router.post('/updateapikey', authMiddleware, errorHandler, updateApiKey);
router.post('/getapikey', authMiddleware, errorHandler, getApiKeysByUserId);
router.post('/deleteapikey', authMiddleware, errorHandler, deleteApiKey);

export default router;
