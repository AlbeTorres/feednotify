import { SourceFeedItem } from '../Interfaces';
import { readRssFeeds } from '../util/readers/rssreader';
import { readYoutubeFeeds } from '../util/readers/youtubeReader';

export async function getUpdatesByDate(
  sourcefeed: SourceFeedItem[],
  date: Date
) {
  const rssFeed = await readRssFeeds(sourcefeed, date);
  const youtubeFeed = await readYoutubeFeeds(sourcefeed, date);

  return { rssFeed, youtubeFeed };
}
