import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { EmailVerificationSchemaType } from '../../validators/auth.schema';
import { getVerificationTokenByToken } from '../token/getVerificationTokenByToken.service';

export async function emailVerificationService({
  token,
}: EmailVerificationSchemaType) {
  try {
    const isValid = await getVerificationTokenByToken(token);
    if (!isValid) throw new createError.Unauthorized('Invalid token');

    const hasExpired = new Date(isValid.expires) < new Date();

    if (hasExpired)
      throw new createError.Unauthorized('Invalid token: Expired token');

    const verifiedUser = await prisma.user.update({
      where: {
        email: isValid.email,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        id: isValid.id,
      },
    });
    const { password: _, ...rest } = verifiedUser; // eslint-disable-line @typescript-eslint/no-unused-vars

    return {
      success: true,
      status: 200,
      msg: 'Email verified',
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
    console.error('[Login Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
