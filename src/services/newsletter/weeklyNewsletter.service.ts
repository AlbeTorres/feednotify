import createError from 'http-errors';

import { Prisma } from '@prisma/client';
import { sendNewsLetterMail } from '../../email/sendFeedNewsletter';
import { getUserByIdRepository } from '../../repository/auth/getUserbyId.repository';
import { getSourcesByUserRepository } from '../../repository/source/getSourcesByUser.repository';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';

export async function weeklyNewsletterFromSourcesService(
  userId: string,
  date: Date
) {
  try {
    const user = await getUserByIdRepository(userId);

    if (!user || !user.email || !user.name) {
      throw new createError.NotFound('User not found');
    }

    const sourcefeed = await getSourcesByUserRepository(userId);
    if (!sourcefeed || sourcefeed.length === 0) {
      throw new createError.NotFound('No sources found for this user');
    }

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
