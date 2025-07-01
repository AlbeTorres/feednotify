import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';

import { DeleteNewsletterSchema } from '../../validators/newsletter.schema';
import { deleteNewsletterService } from '../../services/newsletter/deleteNewsletter.service';


export async function deleteNewsletter(req: Request, res: Response) {
  const { id } = req.body;
  const userId = req.user?.id;

  const validatedFields = DeleteNewsletterSchema.safeParse({
    id,
    userId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const response = await deleteNewsletterService({ id, userId });

    if (response.success) {
      res.status(200).json({ message: response.msg });
    } else {
      throw new createError.InternalServerError('Error deleting newsletter');
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest(
        'Internal validation error: ' + err.message
      );
    }

    console.error('[Delete newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unexpected error deleting newsletter: ' + (err as string)
    );
  }
}
