import createError from 'http-errors';
import { getApiKeysByUserIdRepository } from '../../repository/api-key/getApiKeyByUserId.repository';
import { GetApiKeysByUserIdSchemaType } from '../../validators/apiKey.schema';

export async function getApiKeysByUserIdService({
  userId,
}: GetApiKeysByUserIdSchemaType) {
  try {
    const user = await getApiKeysByUserIdRepository(userId);

    if (!user) {
      throw new createError.NotFound('User not found');
    }

    return { success: true, user };
  } catch (err) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    // —— Falla desconocida ——
    // Log interno útil para debugging (evitar mostrarlo al usuario)
    console.error(err);
    throw new createError.InternalServerError('Error interno del servidor');
  }
}
