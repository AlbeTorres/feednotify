import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { createSourceService } from '../../services/source/createSource.service';
import { CreateSourceSchema } from '../../validators/source.schema';

export async function createSource(req: Request, res: Response) {
  const { name, type, url } = req.body;

  const validatedFields = CreateSourceSchema.safeParse({
    type,
    url,
    name,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const response = await createSourceService({ type, name, url, userId });

    if (response.success) {
      res
        .status(201)
        .json({ message: response.msg, source: response.newSource });
    } else {
      throw new createError.InternalServerError('Error creating source');
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

    console.error('[Create Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating source: ' + (err as string)
    );
  }
}
