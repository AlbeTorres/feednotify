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
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error(err);
    throw new createError.InternalServerError('Server internal error');
  }
}
