import createError from 'http-errors';

import { Prisma } from '@prisma/client';
import { sendNewsLetterMail } from '../../email/templates/sendFeedNewsletter';
import { getUserByIdRepository } from '../../repository/auth/getUserbyId.repository';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';
import { getNewsletterByIdRepository } from '../../repository/newsletter/getNewsletterById.repository';

export async function weeklyScheduleNewsletterService(
  userId: string,
  newsletterId: string,
  date: Date
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
      throw new createError.NotFound('No sources found for this user');
    }

    const sourcefeed = newsletter.source;

    const rssFeed = await readRssFeeds(sourcefeed, date);
    const youtubeFeed = await readYoutubeFeeds(sourcefeed, date);

    const newletterContent = {
      rssFeed,
      youtubeFeed,
    };

    await sendNewsLetterMail(
      user.email,
      { rss: rssFeed, youtube: youtubeFeed },
      user.name
    );

    return newletterContent;
  } catch (err) {
    if (err instanceof createError.HttpError) {
      throw err;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createError.InternalServerError('Database error');
    }

    console.error('[Weekly newsletter error]', err);
    throw new createError.InternalServerError(
      'Unspecified error while sending weekly newsletter'
    );
  }
}
