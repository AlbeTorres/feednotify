import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { GenerateApiKeySchemaType } from '../../validators/apiKey.schema';

export async function generateApiKey({
  client_name,
  userId,
  scopes,
}: GenerateApiKeySchemaType) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new createError.NotFound('User not found');
    }

    const apiKey = crypto.randomBytes(32).toString('hex'); // 64 caracteres hexadecimales
    const hashedApiKey = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    await prisma.apiKey.create({
      data: {
        client_name,
        userId,
        scopes: scopes ?? ['read'],
        hashed_key: hashedApiKey,
        createdAt: new Date(),
      },
    });

    return {
      apiKey,
      client_name,
      userId,
      scopes: scopes ?? ['read'],
      createdAt: new Date(),
    };
  } catch (err) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Error de base de datos');
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Generate API Key Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al generar la API Key'
    );
  }
}
