import createError from 'http-errors';
import { createNewsletterRepository } from '../../repository/newsletter/createNewsletter.repository';
import { CreateNewsletterSchemaType } from '../../validators/newsletter.schema';

export async function createNewsletterService({
  category,
  name,
  sources,
  userId,
}: CreateNewsletterSchemaType) {
  try {
    const newNewsletter = await createNewsletterRepository({
      category,
      name,
      sources,
      userId: userId,
    });

    if (!newNewsletter) {
      throw new createError.InternalServerError('Error creating newsletter');
    }

    return {
      newNewsletter,
      success: true,
      msg: 'Newsletter create successful!',
    };
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    console.error('[Create Newsletter Error]', err);
    throw new createError.InternalServerError(
      'Unespected error creating newsletter: ' + (err as string)
    );
  }
}
