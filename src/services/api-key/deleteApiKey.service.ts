import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { deleteApiKeyRepository } from '../../repository/api-key/deleteApikey.repository';
import { DeleteApiKeySchemaType } from '../../validators/apiKey.schema';

export async function deleteApiKeyService({
  apiKeyId,
}: DeleteApiKeySchemaType) {
  try {
    // Aquí iría la lógica para eliminar el API Key en la base de datos
    // Por ejemplo, usando Prisma:
    await deleteApiKeyRepository(apiKeyId);

    return { success: true, msg: 'API Key deleted successfully' };
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
