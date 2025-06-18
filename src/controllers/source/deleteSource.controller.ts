import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';

import { deleteSourceService } from '../../services/source/deleteSource.service';
import { DeleteSourceSchema } from '../../validators/source.schema';
export async function deleteSource(req: Request, res: Response) {
  const { id } = req.body;
  const userId = req.user?.id;

  const validatedFields = DeleteSourceSchema.safeParse({
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
    const response = await deleteSourceService({ id, userId });

    if (response.success) {
      res.status(200).json({ message: response.msg });
    } else {
      throw new createError.InternalServerError('Error deleting source');
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

    console.error('[Delete Source Error]', err);
    throw new createError.InternalServerError(
      'Unexpected error deleting source: ' + (err as string)
    );
  }
}
