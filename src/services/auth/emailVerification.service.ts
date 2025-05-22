import createError from 'http-errors';
import { emailVerificationRepository } from '../../repository/auth/emailVerification.repository';
import { deleteVerificationTokenRepository } from '../../repository/token/deleteVerificationToken.repository';
import { getVerificationTokenByToken } from '../../repository/token/getVerificationTokenByToken.repository';
import { email } from '../../util/data';
import { EmailVerificationSchemaType } from '../../validators/auth.schema';

export async function emailVerificationService({
  token,
}: EmailVerificationSchemaType) {
  try {
    const isValid = await getVerificationTokenByToken(token);
    if (!isValid) throw new createError.Unauthorized('Invalid token');

    const hasExpired = new Date(isValid.expires) < new Date();

    if (hasExpired)
      throw new createError.Unauthorized('Invalid token: Expired token');

    await emailVerificationRepository({
      email,
      data: { emailVerified: new Date() },
    });

    await deleteVerificationTokenRepository(isValid.id);

    return {
      success: true,
      msg: 'Email verified',
    };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Email verification Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
