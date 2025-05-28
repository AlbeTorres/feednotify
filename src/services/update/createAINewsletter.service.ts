import createError from 'http-errors';
import { SourceFeedItem } from '../../interfaces';
import { getAiNewsLetterCreator } from '../../util/AIHelper/aiNewsletterCreator';
import { readRssFeeds } from '../../util/readers/rssreader';
import { readYoutubeFeeds } from '../../util/readers/youtubeReader';

export async function createAiNewsletterFromSources(
  sourcefeed: SourceFeedItem[],
  date: Date
) {
  try {
    const rssFeed = await readRssFeeds(sourcefeed, date);
    const youtubeFeed = await readYoutubeFeeds(sourcefeed, date);

    const newletterContent = await getAiNewsLetterCreator({
      rssFeed,
      youtubeFeed,
    });

    return newletterContent;
  } catch (err: unknown) {
    // —— Errores conocidos ——
    if (err instanceof createError.HttpError) {
      // Ya viene con status y mensaje adecuados
      throw err;
    }

    throw new createError.InternalServerError(
      'Error creating newsletter content'
    );
  }
}
