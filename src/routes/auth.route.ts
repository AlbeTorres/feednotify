import express from 'express';
import { login, register } from '../controllers/auth/auth.controller';
import errorHandler from '../middleware/errorHandler.middleware';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.post('/login', errorHandler, login);
router.post('/register', errorHandler, register);

export default router;
