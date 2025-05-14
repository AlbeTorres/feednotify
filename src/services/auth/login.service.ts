import { Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import createError from 'http-errors';
import jwt, { JsonWebTokenError, SignOptions } from 'jsonwebtoken';
import * as z from 'zod';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/jwt.config.js';
import prisma from '../../config/prisma.js';
import { sendTwoFactorTokenMail } from '../../email/sendTwoFactorTokenMail.js';
import { sendVerificationMail } from '../../email/sendVerificationMail.js';
import { JwtPayload } from '../../Interfaces/jwtPayload.interface.js';
import { LoginSchema, LoginSchemaType } from '../../validators/auth.schema.js';
import { generateTwoFactorToken } from '../token/generateTwoFactorToken.service.js';
import { generateVerificationToken } from '../token/generateVerificationToken.service.js';
import { getTwofactorConfirmationByUserId } from '../token/getTwofactorConfirmation.service.js';
import { getTwoFactorTokenByEmail } from '../token/getTwoFactorTokenByEmail.service.js';

export async function loginService({
  email,
  password,
  code,
}: LoginSchemaType): Promise<{
  token: string;
  user: JwtPayload;
  state?: string;
  msg?: string;
}> {
  const validatedFields = LoginSchema.safeParse({ email, password, code });

  if (!validatedFields.success) {
    throw new createError.BadRequest('Datos de entrada inválidos'); // Error genérico por seguridad
  }

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
          throw new createError.Unauthorized('Invalid token!');

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) throw new createError.Unauthorized('Invalid token!');

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

    return { token, user: payload };
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
