import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import { resetPasswordRepository } from '../../repository/auth/resetPassword.repository';
import { deleteResetTokenRepository } from '../../repository/token/deleteResetToken.repository';
import { getResetTokenByToken } from '../../repository/token/getResetTokenByToken.repository';
import { ResetPasswordSchemaType } from '../../validators/auth.schema';

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

    await resetPasswordRepository({
      email: isValid.email,
      data: { password: bcryptjs.hashSync(password) },
    });

    await deleteResetTokenRepository(isValid.id);

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
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Email verification Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
