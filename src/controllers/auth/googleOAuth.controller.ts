import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { googleOAuthService } from '../../services/auth/googleOAuth.service';
import { GoogleOAuthSchema } from '../../validators/auth.schema';

export async function googleOAuth(req: Request, res: Response) {
  const { googleIdToken, accessToken } = req.body;

  const validatedFields = GoogleOAuthSchema.safeParse({
    googleIdToken,
    accessToken,
  });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Invalid input data');
  }

  try {
    const response = await googleOAuthService({ googleIdToken, accessToken });

    if (response) {
      res.status(200).json(response);
    } else {
      throw new createError.InternalServerError(
        'Error al autenticar el usuario'
      );
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
    console.error('[Google OAuth Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
