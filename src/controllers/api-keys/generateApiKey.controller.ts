import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { generateApiKeyService } from '../../services/api-keys/generatedApiKey.service';
import { generateApiKeySchema } from '../../validators/apiKey.schema';

export async function generateApiKey(req: Request, res: Response) {
  const { client_name, userId, scopes } = req.body;

  const validatedFields = generateApiKeySchema.safeParse({
    client_name,
    userId,
    scopes,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await generateApiKeyService({
      client_name,
      userId,
      scopes,
    });

    if (!response.success) {
      throw new createError.InternalServerError('Error al generar el API Key');
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
