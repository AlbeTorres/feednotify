import createError from 'http-errors';
import { getAiNewsLetterCreator } from '../../util/AIHelper/aiNewsletterCreator';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';
import { getSourcesByUserRepository } from '../../repository/source/getSourcesByUser.repository';
import { getUserByIdRepository } from '../../repository/auth/getUserbyId.repository';

export async function createAiNewsletterFromSources(
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

    const newletterContent = await getAiNewsLetterCreator({
      rssFeed,
      youtubeFeed,
    });

    return newletterContent;
  } catch (err: unknown) {
    if (err instanceof createError.HttpError) {
      throw err;
    }

    throw new createError.InternalServerError(
      'Error creating newsletter content'
    );
  }
}
