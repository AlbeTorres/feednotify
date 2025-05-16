import { Request, Response } from 'express';
import createError from 'http-errors';
import * as z from 'zod';
import { resetPasswordEmailSenderService } from '../../services/auth/resetPasswordEmailSender.service';
import { ResetPasswordEmailSenderSchema } from '../../validators/auth.schema';

export async function resetPasswordEmailSender(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const validatedFields = ResetPasswordEmailSenderSchema.safeParse({ email });

    if (!validatedFields.success) {
      throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
    }

    const response = await resetPasswordEmailSenderService({ email });

    if (response.success) {
      res.status(200).json({ message: 'Email de restablecimiento enviado' });
    } else {
      throw new createError.InternalServerError(
        'Error al enviar el email de restablecimiento'
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
