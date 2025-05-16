import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { resetPasswordService } from '../../services/auth/resetPassword.service';
import { ResetPasswordSchema } from '../../validators/auth.schema';

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    const validatedFields = ResetPasswordSchema.safeParse({ token, password });

    if (!validatedFields.success) {
      throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
    }

    const response = await resetPasswordService({ token, password });

    if (response.success) {
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } else {
      throw new createError.InternalServerError(
        'Error al restablecer la contraseña'
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
  }
}
