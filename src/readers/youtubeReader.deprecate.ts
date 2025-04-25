import axios from 'axios';
import cheerio from 'cheerio';
require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Obtiene los videos subidos después de una fecha
export async function getRecentVideos(channelUrl: string, lastDate: Date) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&publishedAfter=${dateISO}&maxResults=25`;

  try {
    const { data } = await axios.get(url);
    return data.items.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (err) {
    console.error(
      'Error al obtener videos:',
      err.response?.data || err.message
    );
    return [];
  }
}

// // Ejemplo de uso
// (async () => {
//   const youtubeURL = "https://www.youtube.com/@linustech";
//   const fecha = "2024-01-01T00:00:00Z"; // Cambia a tu fecha

//   const channelId = await getChannelIdFromHandle(youtubeURL);
//   if (!channelId) return;

//   console.log("Channel ID:", channelId);

//   const videos = await getRecentVideos(channelId, fecha);
//   console.log("Videos recientes:\n", videos);
// })();

// Convierte un enlace como https://www.youtube.com/@nombre a channelId
export async function getChannelIdFromHandle(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const scripts = $('script');

    let channelId = null;

    scripts.each((_, el) => {
      const content = $(el).html();
      const match = content?.match(/"channelId":"(UC[\w-]+)"/);
      if (match) {
        channelId = match[1];
      }
    });

    if (!channelId) {
      throw new Error('No se pudo encontrar el channelId');
    }

    return channelId;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al obtener el ID del canal:', error.message);
    } else {
      console.error('Error al obtener el ID del canal:', error);
    }
  }
}
