import express from 'express';
import { emailVerification } from '../../controllers/auth/emailVerification.controller';
import { googleOAuth } from '../../controllers/auth/googleOAuth.controller';
import { login } from '../../controllers/auth/login.controller';
import { register } from '../../controllers/auth/register.controller';
import { resetPassword } from '../../controllers/auth/resetPassword.controller';
import { resetPasswordEmailSender } from '../../controllers/auth/resetPasswordEmailSender.controller';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.post('/register', register);
router.post('/login', login);
router.post('/email-verification', emailVerification);
router.post('/reset-password-email-sender', resetPasswordEmailSender);
router.post('/reset-password', resetPassword);
router.post('/google-oauth', googleOAuth);

export default router;
