import { Request, Response } from 'express';
import createError from 'http-errors';

import { GetNewsletterByUserSchema } from '../../validators/newsletter.schema';
import { getNewsletterByUserService } from '../../services/newsletter/getNewsletterByUser.service';

export async function getNewsletterByUser(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  const validatedFields = GetNewsletterByUserSchema.safeParse({ userId });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  try {
    const response = await getNewsletterByUserService({ userId });

    res.status(200).json(response);
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Newsletter By User Error]', err);
    throw new createError.InternalServerError(
      'Unexpected error retrieving newsletter: ' + (err as string)
    );
  }
}
