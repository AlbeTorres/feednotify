import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { updateApiKeyService } from '../../services/api-keys/updateApiKey.service';
import { updateApiKeySchema } from '../../validators/apiKey.schema';

export async function updateApiKey(req: Request, res: Response) {
  const { apiKeyId, status, scopes } = req.body;

  const validatedFields = updateApiKeySchema.safeParse({
    apiKeyId,
    status,
    scopes,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await updateApiKeyService({
      apiKeyId,
      status,
      scopes,
    });

    if (!response.success) {
      throw new createError.InternalServerError(
        'Error al modificar el API Key'
      );
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
