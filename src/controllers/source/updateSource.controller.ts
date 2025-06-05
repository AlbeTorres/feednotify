import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { updateSourceService } from '../../services/source/updateSource.service';
import { UpdateSourceSchema } from '../../validators/source.schema';
export async function updateSource(req: Request, res: Response) {
  const { sourceId, name, type, url } = req.body;
  const userId = req.user?.id;

  const validatedFields = UpdateSourceSchema.safeParse({
    sourceId,
    name,
    type,
    url,
    userId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid input data');
  }

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    const updatedSource = await updateSourceService({
      sourceId,
      name,
      type,
      url,
      userId,
    });

    res.status(200).json(updatedSource);
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    if (err instanceof z.ZodError) {
      throw new createError.BadRequest('Internal validation error');
    }

    console.error('[Update Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error updating source: ' + (err as string)
    );
  }
}
