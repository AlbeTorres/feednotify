import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { updateSourceService } from '../../services/source/updateSource.service';
import { UpdateSourceSchema } from '../../validators/source.schema';
export async function updateSource(req: Request, res: Response) {
  const { id, name, type, url } = req.body;

  const validatedFields = UpdateSourceSchema.safeParse({ id, name, type, url });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid input data');
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new createError.Unauthorized('User ID is required');
  }

  try {
    // Validar el cuerpo de la solicitud

    // Llamar al servicio para actualizar la fuente
    const updatedSource = await updateSourceService(
      { id, name, type, url },
      userId
    );

    // Responder con el resultado
    res.status(200).json(updatedSource);
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    if (err instanceof z.ZodError) {
      // Nunca debería llegar aquí porque lo validamos antes, pero…
      throw new createError.BadRequest('Internal validation error');
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Update Source Error]', err);
    throw new createError.InternalServerError(
      'Unespected error updating source: ' + (err as string)
    );
  }
}
