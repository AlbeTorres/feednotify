import { Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { ResetPasswordSchemaType } from '../../validators/auth.schema';
import { getResetTokenByToken } from '../token/getResetTokenByToken.service';

export async function resetPasswordService({
  password,
  token,
}: ResetPasswordSchemaType) {
  try {
    const isValid = await getResetTokenByToken(token);
    if (!isValid) throw new createError.Unauthorized('Invalid token');

    const hasExpired = new Date(isValid.expires) < new Date();

    if (hasExpired)
      throw new createError.Unauthorized('Invalid token: Expired token');

    await prisma.user.update({
      where: {
        email: isValid.email,
      },
      data: {
        password: bcryptjs.hashSync(password),
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: isValid.id,
      },
    });

    return {
      success: true,
      msg: 'Password changed',
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
    console.error('[Email verification Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
