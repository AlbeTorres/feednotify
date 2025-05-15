import express from 'express';

import { emailVerification } from '../controllers/auth/emailVerification.controller';
import { login } from '../controllers/auth/login.controller';
import { register } from '../controllers/auth/register.controller';
import errorHandler from '../middleware/errorHandler.middleware';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.post('/login', errorHandler, login);
router.post('/register', errorHandler, register);
router.post('/EmailVerification', errorHandler, emailVerification);

export default router;
