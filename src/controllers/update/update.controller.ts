import { Request, Response } from 'express';
import { getUpdatesUnFiltered } from '../../services/update/getUnfilteredUpdates.service';
import { getUpdatesByDate } from '../../services/update/getUpdates.service';
import { feeds } from '../../util/data';

export async function getUpdatesSince(req: Request, res: Response) {
  try {
    const { date } = req.params;

    const feedUpdates = await getUpdatesByDate(feeds, new Date(date));

    res.json(feedUpdates);
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getLastWeekUpdates(req: Request, res: Response) {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  try {
    const feedUpdates = await getUpdatesByDate(feeds, lastWeek);

    res.json(feedUpdates);
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getUnfilteredUpdates(req: Request, res: Response) {
  try {
    const feedUpdates = await getUpdatesUnFiltered(feeds);

    res.json(feedUpdates);
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
