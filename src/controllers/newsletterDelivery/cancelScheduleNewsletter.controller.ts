import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { cancelUserNewsletter } from '../../services/newsletterDelivery/cancelScheduledNewsletterByUser.service';

export async function cancelarScheduledNewsletter(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    await cancelUserNewsletter(userId);

    res.json('Newsletter cancellation scheduled successfully');
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest(
        'Internal valiadation error: ' + err.message
      );
    }

    console.error('[Weekly newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error scheduling the newsletter: ' + (err as string)
    );
  }
}
