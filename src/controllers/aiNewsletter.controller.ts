import { Request, Response } from 'express';

import { sendNewsLetterAIMail } from '../email/sendNewsLetterAiMail';
import { createAiNewsletterFromSources } from '../services/update/createAINewsletter.service';
import { email, feeds, name } from '../util/data';

export async function sendAINewsletter(req: Request, res: Response) {
  // Implementación de la función para enviar el boletín
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  try {
    const feedUpdates = await createAiNewsletterFromSources(feeds, lastWeek);

    await sendNewsLetterAIMail(email, feedUpdates, name);
    console.log('Enviando boletín...');

    res.json('Boletín enviado con éxito');
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
