import { SourceFeedItem } from '../../interfaces';
import { readRssUnfilteredFeeds } from '../../util/readers/rssUnFilterReader';

export async function getUpdatesUnFiltered(sourcefeed: SourceFeedItem[]) {
  const rssFeed = await readRssUnfilteredFeeds(sourcefeed);

  return { rssFeed };
}
