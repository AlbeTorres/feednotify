import createError from 'http-errors';
import { getSourcesByUserRepository } from '../../repository/source/getSourcesByUser.repository';
import { GetSourcesByUserSchemaType } from '../../validators/source.schema';
export async function getSourcesByUserService({
  userId,
}: GetSourcesByUserSchemaType) {
  try {
    const response = await getSourcesByUserRepository(userId);

    if (!response || response.length === 0) {
      throw new createError.NotFound('No sources found for this user');
    }

    return {
      sources: response,
      success: true,
      msg: 'Sources retrieved successfully!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Source By Id Error]', err);
    throw new createError.InternalServerError(
      'Unespected error retreiving source: ' + (err as string)
    );
  }
}
