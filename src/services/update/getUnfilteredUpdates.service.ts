
import { Source } from '../../Interfaces';
import { readRssUnfilteredFeeds } from '../../util/readers/rssUnFilterReader';

export async function getUpdatesUnFiltered(sourcefeed: Source[]) {
  const rssFeed = await readRssUnfilteredFeeds(sourcefeed);

  return { rssFeed };
}
