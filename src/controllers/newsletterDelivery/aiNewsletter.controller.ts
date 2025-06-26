import { Request, Response } from 'express';
import createError from 'http-errors';

import { sendAiNewsletterService } from '../../services/newsletterDelivery/sendAINewsletter.service';

import { NewsletterSchema } from '../../validators/newsletter.schema';
import z from 'zod';

export async function sendAINewsletter(req: Request, res: Response) {
  const { newsletterId } = req.body;
  const userId = req.user?.id;

  const validatedFields = NewsletterSchema.safeParse({
    newsletterId,
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
    const response = await sendAiNewsletterService(
      userId,
      lastWeek,
      newsletterId
    );

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

    console.error('[AINewsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error sending the Ai newsletter: ' + (err as string)
    );
  }
}
