import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import jwt, { JsonWebTokenError, SignOptions } from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/jwt.config';
import { sendTwoFactorTokenMail } from '../../email/sendTwoFactorTokenMail';
import { sendVerificationMail } from '../../email/sendVerificationMail';
import { JwtPayload } from '../../interfaces/jwtPayload.interface';

import { getUserByEmailRepository } from '../../repository/auth/getUserByEmail.repository';
import { deleteTwoFactorConfirmationTokenRepository } from '../../repository/token/deleteTwoFactorConfirmation.repository';
import { generateTwoFactorConfirmation } from '../../repository/token/generateTwoFactorConfirmation.repository';
import { getTwofactorConfirmationByUserId } from '../../repository/token/getTwofactorConfirmation.repository';
import { getTwoFactorTokenByEmail } from '../../repository/token/getTwoFactorTokenByEmail.repository';
import { LoginSchemaType } from '../../validators/auth.schema';
import { generateTwoFactorToken } from '../token/generateTwoFactorToken.service';
import { generateVerificationToken } from '../token/generateVerificationToken.service';

export async function loginService({
  email,
  password,
  code,
}: LoginSchemaType): Promise<{
  token: string;
  user: JwtPayload;
  success: boolean;
  state?: string;
  msg?: string;
}> {
  try {
    const user = await getUserByEmailRepository(email);

    if (!user || !user.email || !user.password) {
      throw new createError.Unauthorized('Invalid Credential: User not Found.'); // Error genérico por seguridad
    }

    // Verificar si el usuario tiene un correo electrónico verificado
    // y si no, enviar un correo de verificación
    if (!user.emailVerified) {
      const verificationToken = await generateVerificationToken(user.email);
      sendVerificationMail(
        user.email,
        verificationToken!.token,
        user!.name || ''
      );
      return {
        token: '',
        user: {
          id: '',
          email: '',
          role: '',
        },
        success: false,
        state: 'unverificated_email',
        msg: 'Confirmation email sent!',
      };
    }

    // Verificar si el usuario tiene habilitada la autenticación de dos factores
    // y si es así, enviar un token de verificación
    if (user.isTwofactorEnabled && user.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

        if (!twoFactorToken || twoFactorToken.token !== code)
          throw new createError.Unauthorized('Invalid 2fa token!');

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired)
          throw new createError.Unauthorized('Invalid 2fa token!: expired');

        const existingConfirmation = await getTwofactorConfirmationByUserId(
          user.id
        );

        if (existingConfirmation) {
          await deleteTwoFactorConfirmationTokenRepository(
            existingConfirmation.id
          );
        }

        await generateTwoFactorConfirmation(user.id);
      } else {
        const twoFactorToken = await generateTwoFactorToken(user.email);
        sendTwoFactorTokenMail(
          user.email,
          twoFactorToken.token,
          user.name || ''
        );

        return {
          token: '',
          user: {
            id: '',
            email: '',
            role: '',
          },
          success: false,
          state: 'two_factor_token_send',
          msg: '2FA token email sent!',
        };
      }
    }

    // Verificar la contraseña
    // Si el usuario no tiene contraseña, no se puede iniciar sesión
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) throw new createError.Unauthorized('Invalid Credential.');

    const signOptions: SignOptions = {
      expiresIn: Number(JWT_EXPIRES_IN), // Tiempo de expiración del token
    };

    // Crear el payload para el JWT
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Firmar el token
    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    return {
      token,
      user: payload,
      success: true,
      state: 'success',
      msg: 'Login successful!',
    };
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    if (err instanceof JsonWebTokenError) {
      throw new createError.InternalServerError('Token Generation Error');
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Login Error]', err);
    throw new createError.InternalServerError(
      'Unespected Error Starting Session'
    );
  }
}
