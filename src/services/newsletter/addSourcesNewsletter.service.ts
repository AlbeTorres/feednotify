import createError from 'http-errors';
import { UpdateSourceNewsletterSchemaType } from '../../validators/newsletter.schema';
import { addSourcesNewsletterRepository } from '../../repository/newsletter/addSourcesNewsletter.repository';

export async function addSourcesNewsletterService({
  id,
  userId,
  sources,
}: UpdateSourceNewsletterSchemaType) {
  try {
    const updatedNewsletter = await addSourcesNewsletterRepository({
      newsletterId: id,
      sources,
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
