import createError from 'http-errors';
import { deleteNewsletterRepository } from '../../repository/newsletter/deleteNewsletter.repository';
import { DeleteNewsletterSchemaType } from '../../validators/newsletter.schema';

export async function deleteNewsletterService({
  newsletterId,
  userId,
}: DeleteNewsletterSchemaType) {
  try {
    await deleteNewsletterRepository({ newsletterId, userId });

    return { success: true, msg: 'Newsletter deleted successfully!' };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Delete Newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error deleting newsletter: ' + (err as string)
    );
  }
}
