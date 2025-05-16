import { Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import jwt, { JsonWebTokenError, SignOptions } from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/jwt.config';
import prisma from '../../config/prisma';
import { sendTwoFactorTokenMail } from '../../email/sendTwoFactorTokenMail';
import { sendVerificationMail } from '../../email/sendVerificationMail';
import { JwtPayload } from '../../Interfaces/jwtPayload.interface';
import { LoginSchemaType } from '../../validators/auth.schema';
import { generateTwoFactorToken } from '../token/generateTwoFactorToken.service';
import { generateVerificationToken } from '../token/generateVerificationToken.service';
import { getTwofactorConfirmationByUserId } from '../token/getTwofactorConfirmation.service';
import { getTwoFactorTokenByEmail } from '../token/getTwoFactorTokenByEmail.service';

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
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.email || !user.password) {
      throw new createError.Unauthorized(
        'Credenciales no válidas: Usuario no encontrado.'
      ); // Error genérico por seguridad
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
          await prisma.twoFactorConfirmation.delete({
            where: {
              id: existingConfirmation.id,
            },
          });
        }

        await prisma.twoFactorConfirmation.create({
          data: {
            userId: user.id,
          },
        });
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
    if (!valid) throw new createError.Unauthorized('Credenciales no válidas.');

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
      msg: 'Login successful!',
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
    if (err instanceof JsonWebTokenError) {
      throw new createError.InternalServerError('Error al generar token');
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Login Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
