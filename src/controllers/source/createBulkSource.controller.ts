import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { createBulkSourceService } from '../../services/source/createBulkSource.service';
import {
  CreateBulkSourceArraySchema,
  CreateBulkSourceSchemaType,
} from '../../validators/source.schema';

export async function createBulkSource(req: Request, res: Response) {
  const sources: CreateBulkSourceSchemaType[] = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  const validatedFields = CreateBulkSourceArraySchema.safeParse(sources);

  if (!validatedFields.success) {
    console.log(validatedFields);
    throw new createError.BadRequest('Invalid Input data');
  }

  try {
    const response = await createBulkSourceService(sources, userId);

    if (response.success) {
      res
        .status(201)
        .json({
          success: true,
          message: response.msg,
          data: response.newSources,
        });
    } else {
      throw new createError.InternalServerError('Error creating sources');
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

    console.error('[Create Sources Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating sources: ' + (err as string)
    );
  }
}
