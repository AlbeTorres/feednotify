import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { deleteApiKeyService } from '../../services/api-key/deleteApiKey.service';
import { deleteApiKeySchema } from '../../validators/apiKey.schema';

export async function deleteApiKey(req: Request, res: Response) {
  const { apiKeyId } = req.params;

  const validatedFields = deleteApiKeySchema.safeParse({
    apiKeyId,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await deleteApiKeyService({
      apiKeyId,
    });

    if (!response.success) {
      throw new createError.InternalServerError('Error al eliminar el API Key');
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
