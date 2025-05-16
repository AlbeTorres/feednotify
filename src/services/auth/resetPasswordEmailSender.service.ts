import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { sendResetMail } from '../../email/sendResetPasswordMail';
import { ResetPasswordEmailSenderSchemaType } from '../../validators/auth.schema';
import { generateResetToken } from '../token/generateResetToken.service';

export async function resetPasswordEmailSenderService({
  email,
}: ResetPasswordEmailSenderSchemaType) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.email || !user.name) {
      throw new createError.Unauthorized(
        'Credenciales no válidas: Usuario no encontrado.'
      ); // Error genérico por seguridad
    }

    const resetPasswordToken = await generateResetToken(user.email || '');
    sendResetMail(user.email, resetPasswordToken!.token, user.name || '');

    return {
      success: true,
      state: 'reset_email',
      msg: 'Reset email sent!',
    };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 sería “registro no encontrado”, aunque en login ya lo cubrimos
      throw new createError.InternalServerError('Error de base de datos');
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Reset Password Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
