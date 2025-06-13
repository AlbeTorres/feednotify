import createError from 'http-errors';
import { getNewsletterByUserRepository } from '../../repository/newsletter/getNewslettersByUser.repository';
import { GetNewsletterByUserSchemaType } from '../../validators/newsletter.schema';

export async function getNewsletterByUserService({
  userId,
}: GetNewsletterByUserSchemaType) {
  try {
    const response = await getNewsletterByUserRepository(userId);

    if (!response || response.length === 0) {
      throw new createError.NotFound('No Newsletter found for this user');
    }

    return {
      sources: response,
      success: true,
      msg: 'Newsletter retrieved successfully!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Newsletter By Id Error]', err);
    throw new createError.InternalServerError(
      'Unespected error retreiving Newsletter: ' + (err as string)
    );
  }
}
