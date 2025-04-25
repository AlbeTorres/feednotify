import axios from 'axios';
import { google } from 'googleapis';
require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

type Feed = {
  id: string;
  type: string;
  name: string;
  url: string;
};

type Video = {
  title: string;
  link: string;
  publishedAt: string;
  description: string;
  channelId: string;
  channelTitle: string;
};

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // <== Esta línea es importante
});

export async function readYoutubeFeeds(feeds: Feed[], pubDateThreshold: Date) {
  const youtubeFeeds = feeds.filter((feed) => feed.type === 'youtube');

  return await Promise.all(
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

        console.log(response.data.items);

        const videos = response.data.items?.map((item) => ({
          title: item.snippet?.title || '',
          link: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
          publishedAt: item.snippet?.publishedAt || '',
          description: item.snippet?.description || '',
          channelId: item.snippet?.channelId || '',
          channelTitle: item.snippet?.channelTitle || '',
          thumbnail: item.snippet?.thumbnails?.medium?.url || '',
        })) as Video[];

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
}

// // Convierte un enlace como https://www.youtube.com/@nombre a channelId
// export async function getChannelIdFromHandle(url: string) {
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);
//     const scripts = $('script');
//     console.log($);

//     let channelId = null;

//     scripts.each((_, el) => {
//       const content = $(el).html();
//       const match = content?.match(/"channelId":"(UC[\w-]+)"/);
//       if (match) {
//         channelId = match[1];
//       }
//     });

//     if (!channelId) {
//       throw new Error('No se pudo encontrar el channelId');
//     }

//     return channelId;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error al obtener el ID del canal:', error.message);
//     } else {
//       console.error('Error al obtener el ID del canal:', error);
//     }
//   }
// }

// function extractChannelId(url: string): string | null {
//   const match = url.match(
//     /(?:youtube\.com\/channel\/|youtube\.com\/user\/|youtube\.com\/c\/|youtube\.com\/@)([^/?]+)/
//   );
//   return match ? match[1] : null;
// }

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
