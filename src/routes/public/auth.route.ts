import express from 'express';
import { emailVerification } from '../../controllers/auth/emailVerification.controller';
import { googleOAuth } from '../../controllers/auth/googleOAuth.controller';
import { login } from '../../controllers/auth/login.controller';
import { register } from '../../controllers/auth/register.controller';
import { resetPassword } from '../../controllers/auth/resetPassword.controller';
import { resetPasswordEmailSender } from '../../controllers/auth/resetPasswordEmailSender.controller';
import errorHandler from '../../middleware/errorHandler.middleware';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.post('/login', errorHandler, login);
router.post('/register', errorHandler, register);
router.post('/emailverification', errorHandler, emailVerification);
router.post(
  '/resetpasswordemailsender',
  errorHandler,
  resetPasswordEmailSender
);
router.post('/resetpassword', errorHandler, resetPassword);
router.post('/googleoauth', errorHandler, googleOAuth);

export default router;
