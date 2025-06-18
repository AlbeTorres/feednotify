import { Request, Response } from 'express';
import createError from 'http-errors';

import { sendNewsLetterAIMail } from '../../email/senders/sendNewsLetterAiMail';
import { createAiNewsletterFromSources } from '../../services/newsletterDelivery/createAINewsletter.service';
import { email, name } from '../../util/data';

export async function sendAINewsletter(req: Request, res: Response) {
  // Implementación de la función para enviar el boletín
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const userId = req.user?.id;

   if (!userId) {
      throw new createError.Unauthorized('User ID is required');
    }

  try {
    const feedUpdates = await createAiNewsletterFromSources(userId,lastWeek);

    await sendNewsLetterAIMail(email, feedUpdates, name);
    console.log('Enviando boletín...');

    res.json('Boletín enviado con éxito');
  } catch (error) {
    console.error('Error obteniendo actualizaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}
