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
    throw new createError.BadRequest('Invalid Input data'); // Error genérico por seguridad
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    // Asumiendo que el ID del usuario está en req.user.id
    const response = await createSourceService({ type, name, url }, userId);

    if (response.success) {
      res
        .status(201)
        .json({ message: response.msg, source: response.newSource });
    } else {
      throw new createError.InternalServerError('Error creating source');
    }
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    if (err instanceof z.ZodError) {
      // Nunca debería llegar aquí porque lo validamos antes, pero…
      throw new createError.BadRequest('Error de validación interno');
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Create Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating source: ' + (err as string)
    );
  }
}
