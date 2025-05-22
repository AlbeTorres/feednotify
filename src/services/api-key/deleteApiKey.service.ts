import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../../config/prisma';
import { DeleteApiKeySchemaType } from '../../validators/apiKey.schema';

export async function deleteApiKeyService({
  apiKeyId,
}: DeleteApiKeySchemaType) {
  try {
    // Aquí iría la lógica para eliminar el API Key en la base de datos
    // Por ejemplo, usando Prisma:
    const deletedApiKey = await prisma.apiKey.delete({
      where: { id: apiKeyId },
    });

    return { success: true, deletedApiKey };
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
    console.error('[Delete API Key Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al eliminar el API Key'
    );
  }
}
