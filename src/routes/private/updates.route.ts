import express from 'express';
import {
  getLastWeekUpdates,
  getUnfilteredUpdates,
  getUpdatesSince,
} from '../../controllers/update.controller';

const router = express.Router();

//obtener todos los updates desde una fecha de actualizacion especifica
// /api/updates?since=2024-12-01
router.get('/', getUpdatesSince);

//obtener todos los updates desde la ultima fecha de actualizacion
router.get('/last-week', getLastWeekUpdates);
//obtener todos los updates desde la ultima fecha de actualizacion
router.get('/unfiltered', getUnfilteredUpdates);

export default router;
