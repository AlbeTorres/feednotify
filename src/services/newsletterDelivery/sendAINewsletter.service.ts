import createError from 'http-errors';
import { getAiNewsLetterCreator } from '../../util/AIHelper/aiNewsletterCreator';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';
import { getUserByIdRepository } from '../../repository/auth/getUserbyId.repository';
import { getNewsletterByIdRepository } from '../../repository/newsletter/getNewsletterById.repository';
import { sendNewsLetterAIMail } from '../../email/senders/sendNewsLetterAiMail';
import { Prisma } from '@prisma/client';

export async function sendAiNewsletterService(
  userId: string,
  date: Date,
  newsletterId: string
) {
  try {
    const user = await getUserByIdRepository(userId);

    if (!user || !user.email || !user.name) {
      throw new createError.NotFound('User not found');
    }

    const newsletter = await getNewsletterByIdRepository({
      newsletterId,
      userId,
    });

    if (!newsletter || newsletter.source.length === 0) {
      throw new createError.NotFound('No newsletter found for this user');
    }

    const sourcefeed = newsletter.source;

    const rssFeed = await readRssFeeds(sourcefeed, date);
    const youtubeFeed = await readYoutubeFeeds(sourcefeed, date);

    if (rssFeed.length === 0 && youtubeFeed.length === 0) {
      throw new createError.NotFound('No new content found for the newsletter');
    }

    const newletterContent = await getAiNewsLetterCreator({
      rssFeed,
      youtubeFeed,
    });

    await sendNewsLetterAIMail(user.email, newletterContent, user.name);

    return {
      success: true,
      username: user.name,
      email: user.email,
      rssFeed: rssFeed,
      youtubeFeed: youtubeFeed,
      newsletterId: newsletter.id,
      content: newletterContent,
    };
  } catch (err) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Database error');
    }

    console.error('[AINewsletter sending error]', err);
    throw new createError.InternalServerError(
      'Unspecified error while sending AI newsletter'
    );
  }
}
