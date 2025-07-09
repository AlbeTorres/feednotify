import { Request, Response } from 'express';
import createError from 'http-errors';

import { getSourcesByUserService } from '../../services/source/getSourcesByUser.service';
import { GetSourcesByUserSchema } from '../../validators/source.schema';

export async function getSourcesByUser(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  const validatedFields = GetSourcesByUserSchema.safeParse({ userId });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid Input data');
  }

  try {
    const response = await getSourcesByUserService({ userId });

    res
      .status(200)
      .json({ success: true, msg: response.msg, data: response.sources });
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Sources By User Error]', err);
    throw new createError.InternalServerError(
      'Unexpected error retrieving sources: ' + (err as string)
    );
  }
}
