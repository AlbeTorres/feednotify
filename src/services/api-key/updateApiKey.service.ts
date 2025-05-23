import createError from 'http-errors';
import { updateApiKeyRepository } from '../../repository/api-key/updateApikey.repository';
import { UpdateApiKeySchemaType } from '../../validators/apiKey.schema';

export async function updateApiKeyService({
  apiKeyId,
  scopes,
  status,
}: UpdateApiKeySchemaType) {
  try {
    // Aquí iría la lógica para actualizar el estado del API Key en la base de datos
    // Por ejemplo, usando Prisma:

    const updatedApiKey = await updateApiKeyRepository({
      apiKeyId,
      isActive: status,
      scopes,
    });

    const { hashed_key: _, ...rest } = updatedApiKey; // eslint-disable-line @typescript-eslint/no-unused-vars

    return { success: true, rest }; // Excluimos el hashed_key por seguridad
  } catch (err) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }
    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error('[Update API Key Error]', err);
    throw new createError.InternalServerError(
      'Error inesperado al modificar la info del API Key'
    );
  }
}
