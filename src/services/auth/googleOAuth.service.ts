import createError from 'http-errors';
import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { verifyGoogleToken } from '../../util/verifyGoogleToken';

import { Prisma } from '@prisma/client';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/jwt.config';
import { GoogleOAuthSchemaType } from '../../validators/auth.schema';

export async function googleOAuthService({
  googleIdToken,
  accessToken,
}: GoogleOAuthSchemaType) {
  try {
    // Verificar el token de Google
    const payload = await verifyGoogleToken(googleIdToken);

    // Si el token no es válido, payload será null
    if (!payload) {
      throw new createError.Unauthorized('Invalid Google ID token');
    }

    // Verificar si el correo electrónico está verificado
    if (!payload.email_verified) {
      throw new createError.Unauthorized('Email no verificado con Google');
    }

    const { email, name, sub, picture, exp } = payload;

    // Si no hay correo electrónico, lanzar un error
    let user = await prisma.user.findUnique({ where: { email } });

    // Si no existe el usuario, crearlo
    // Si existe, verificar si ya tiene una cuenta de Google asociada
    // Si no tiene, crear la cuenta de Google asociada
    // Si tiene, no hacer nada
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name ?? '',
          image: picture ?? '',
          account: {
            create: {
              provider: 'google',
              providerAccountId: sub,
              type: 'oidc',
              expires_at: exp,
              id_token: googleIdToken,
              access_token: accessToken,
            },
          },
        },
      });
    } else {
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: 'google',
          providerAccountId: sub,
        },
      });

      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'google',
            providerAccountId: sub,
            type: 'oidc',
            expires_at: exp,
            id_token: googleIdToken,
            access_token: accessToken,
          },
        });
      }
    }

    const signOptions: SignOptions = {
      expiresIn: Number(JWT_EXPIRES_IN), // Tiempo de expiración del token
    };

    // Crear el payload para el JWT
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Firmar el token
    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    return {
      token,
      user: jwtPayload,
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
    console.error('[GoogleOAuth Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al iniciar sesión'
    );
  }
}
