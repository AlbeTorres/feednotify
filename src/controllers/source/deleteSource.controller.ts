import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';

import { deleteSourceService } from '../../services/source/deleteSource.service';
import { DeleteSourceSchema } from '../../validators/source.schema';
export async function deleteSource(req: Request, res: Response) {
  const { sourceId } = req.params;

  const validatedFields = DeleteSourceSchema.safeParse({
    sourceId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const response = await deleteSourceService({ sourceId, userId });

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
