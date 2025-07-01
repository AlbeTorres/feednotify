import createError from 'http-errors';
import { updateNewsletterRepository } from '../../repository/newsletter/updateNewsletter.repository';
import { UpdateNewsletterSchemaType } from '../../validators/newsletter.schema';

export async function updateNewsletterService({
  name,
  id,
  category,
  userId,
}: UpdateNewsletterSchemaType) {
  try {
    const updatedNewsletter = await updateNewsletterRepository({
      name,
      newsletterId: id,
      category,
      userId,
    });

    if (!updatedNewsletter) {
      throw new createError.InternalServerError('Error updating newsletter');
    }

    return {
      updatedNewsletter,
      success: true,
      msg: 'Newsletter update successful!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    console.error('[Update Newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error updating newsletter: ' + (err as string)
    );
  }
}
