import axios from 'axios';
import { google } from 'googleapis';
import { SourceFeedItem, YoutubeVideo } from '../../interfaces';

require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // <== Esta línea es importante
});

export async function readYoutubeFeeds(
  feeds: SourceFeedItem[],
  pubDateThreshold: Date
) {
  const youtubeFeeds = feeds.filter((feed) => feed.type === 'youtube');

  const feedResponse = await Promise.all(
    youtubeFeeds.map(async (feed) => {
      try {
        const channelId = await getChannelIdFromHandle(feed.url);
        if (!channelId) {
          console.error(`Invalid YouTube URL for feed ${feed.name}`);
          return null;
        }

        const response = await youtube.search.list({
          channelId: channelId,
          part: ['snippet'],
          order: 'date',
          maxResults: 25,
          publishedAfter: pubDateThreshold.toISOString(),
        });

        const videos = response.data.items?.map((item) => ({
          title: item.snippet?.title || '',
          link: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
          publishedAt: item.snippet?.publishedAt || '',
          description: item.snippet?.description || '',
          channelId: item.snippet?.channelId || '',
          channelTitle: item.snippet?.channelTitle || '',
          thumbnail: item.snippet?.thumbnails?.medium?.url || '',
        })) as YoutubeVideo[];

        return {
          id: feed.id,
          name: feed.name,
          url: feed.url,
          videos: videos || [],
          lastRead: new Date(0), // Initialize with a date far in the past
        };
      } catch (error) {
        console.error(`Error fetching YouTube feed ${feed.name}:`, error);
        return null;
      }
    })
  );

  return feedResponse.filter((feed) => feed !== null);
}

/**
 * Extrae el channelId desde el código fuente HTML buscando "browse_id"
 */
export async function getChannelIdFromHandle(
  url: string
): Promise<string | null> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const browseIdMatch = data.match(/"key":"browse_id","value":"(UC[\w-]+)"/);
    if (browseIdMatch) {
      return browseIdMatch[1];
    } else {
      console.error('No se encontró el browse_id en el HTML.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el ID del canal:', error);
    return null;
  }
}
