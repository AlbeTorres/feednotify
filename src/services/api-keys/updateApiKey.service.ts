import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { UpdateApiKeyStatusSchemaType } from '../../validators/apiKey.schema';

export async function updateApiKeyStatus({
  apiKeyId,
  scopes,
  status,
}: UpdateApiKeyStatusSchemaType) {
  try {
    // Aquí iría la lógica para actualizar el estado del API Key en la base de datos
    // Por ejemplo, usando Prisma:
    const updatedApiKey = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        isActive: status,
        scopes,
      },
    });

    const { hashed_key: _, ...rest } = updatedApiKey; // eslint-disable-line @typescript-eslint/no-unused-vars

    return { rest }; // Excluimos el hashed_key por seguridad
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
    console.error('[Update API Key Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al modificar la info del API Key'
    );
  }
}
