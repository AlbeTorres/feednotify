import createError from 'http-errors';

import { Prisma } from '@prisma/client';
import { sendNewsLetterMail } from '../../email/sendFeedNewsletter';
import { getUserByIdRepository } from '../../repository/auth/getUserbyId.repository';
import { getSourcesByUserRepository } from '../../repository/source/getSourcesByUser.repository';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';

const WEEKDAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
type Weekday = keyof typeof WEEKDAYS;

export async function weeklyNewsletterFromSources(
  userId: string,
  date: Date,
  day: Weekday = 'Monday' // Default to Monday if not provided
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
      day: WEEKDAYS[day],
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
