import createError from 'http-errors';
import { getNewsletterByIdRepository } from '../../repository/newsletter/getNewsletterById.repository';
import { GetNewsletterByIdSchemaType } from '../../validators/newsletter.schema';

export async function getNewsletterByIdService({
  newsletterId,
  userId,
}: GetNewsletterByIdSchemaType) {
  try {
    const response = await getNewsletterByIdRepository({
      newsletterId,
      userId,
    });
    if (!response) {
      throw new createError.NotFound('Newsletter not found');
    }

    return {
      source: response,
      success: true,
      msg: 'Newsletter retrieved successfully!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Get Newsletter By Id Error]', err);
    throw new createError.InternalServerError(
      'Unespected error retreiving newsletter: ' + (err as string)
    );
  }
}
