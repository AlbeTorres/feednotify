import { Request, Response } from 'express';
import { UpdateSourceNewsletterSchema } from '../../validators/newsletter.schema';
import createError from 'http-errors';
import * as z from 'zod';
import { deleteSourcesNewsletterService } from '../../services/newsletter/deleteSourcesNewsletter.service';

export async function deleteSourcesNewsletter(req: Request, res: Response) {
  const { id, sources } = req.body;

  const userId = req.user?.id;

  const validateFields = UpdateSourceNewsletterSchema.safeParse({
    id,
    sources,
    userId,
  });

  if (!validateFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const response = await deleteSourcesNewsletterService({
      id,
      sources,
      userId,
    });

    if (response.success) {
      res.status(200).json({
        message: response.msg,
        newsletter: response.updatedNewsletter,
      });
    } else {
      throw new createError.InternalServerError('Error updating newsletter');
    }
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest(
        'Internal valiadation error: ' + err.message
      );
    }

    console.error('[Create Updating Error]', err);
    throw new createError.InternalServerError(
      'Unespected error updating Newsletter: ' + (err as string)
    );
  }
}
