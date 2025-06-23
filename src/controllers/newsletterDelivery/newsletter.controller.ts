import { Request, Response } from 'express';
import { sendNewsLetterMail } from '../../email/templates/sendFeedNewsletter';

import { getUpdatesByDate } from '../../services/update/getUpdates.service';
import { email, feeds, name } from '../../util/data';

export async function sendNewsletter(req: Request, res: Response) {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  try {
    const feedUpdates = await getUpdatesByDate(feeds, lastWeek);

    await sendNewsLetterMail(
      email,
      { rss: feedUpdates.rssFeed, youtube: feedUpdates.youtubeFeed },
      name
    );
    console.log('Enviando boletín...');

    res.json('Boletín enviado con éxito');
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
