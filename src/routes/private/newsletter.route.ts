import express from 'express';
import { sendNewsletter } from '../../controllers/newsletter.controller';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.get('/', sendNewsletter);

export default router;
