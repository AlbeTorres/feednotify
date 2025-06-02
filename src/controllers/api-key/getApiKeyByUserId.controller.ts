import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { getApiKeysByUserIdService } from '../../services/api-key/getApiKeysByUserId.service';
import { getApiKeysByUserIdSchema } from '../../validators/apiKey.schema';

export async function getApiKeysByUserId(req: Request, res: Response) {
  const userId = req.user?.id; // userId viene del middleware de autenticación

  if (!userId) {
    throw new createError.Unauthorized('No se ha proporcionado un userId');
  }

  const validatedFields = getApiKeysByUserIdSchema.safeParse({
    userId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await getApiKeysByUserIdService({
      userId,
    });

    if (!response.success) {
      throw new createError.InternalServerError('Error al obtener el API Key');
    }

    res.status(200).json(response);
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
  }
}
