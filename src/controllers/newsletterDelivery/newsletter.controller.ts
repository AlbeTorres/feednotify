import { Request, Response } from 'express';

import { NewsletterSchema } from '../../validators/newsletter.schema';
import createError from 'http-errors';
import { sendNewsletterService } from '../../services/newsletterDelivery/sendNewsletter.service';
import z from 'zod';

export async function sendNewsletter(req: Request, res: Response) {
  const { id } = req.body;
  const userId = req.user?.id;

  const validatedFields = NewsletterSchema.safeParse({
    id,
    userId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  try {
    const response = await sendNewsletterService(userId, id, lastWeek);

    res.status(200).json(response);
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest(
        'Internal valiadation error: ' + err.message
      );
    }

    console.error('[Newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error sending the newsletter: ' + (err as string)
    );
  }
}
