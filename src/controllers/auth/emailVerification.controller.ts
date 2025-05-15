import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { emailVerificationService } from '../../services/auth/emailVerification.service';
import { EmailVerificationSchema } from '../../validators/auth.schema';

export async function emailVerification(req: Request, res: Response) {
  const { token } = req.body;
  const validatedFields = EmailVerificationSchema.safeParse({ token });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

  try {
    const response = await emailVerificationService({ token });

    if (response.success) {
      res.status(200).json(response);
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
  }
}
