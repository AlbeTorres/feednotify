import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';

import { getSourceByIdService } from '../../services/source/getSourcebyId.service';
import { GetSourceByIdSchema } from '../../validators/source.schema';

export async function getSourceById(req: Request, res: Response) {
  const { sourceId } = req.params;

  const validatedFields = GetSourceByIdSchema.safeParse({
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
    const response = await getSourceByIdService({ sourceId, userId });

    if (response) {
      res.status(200).json(response);
    } else {
      throw new createError.NotFound('Source not found');
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

    console.error('[Get Source By Id Error]', err);
    throw new createError.InternalServerError(
      'Unexpected error retrieving source: ' + (err as string)
    );
  }
}
