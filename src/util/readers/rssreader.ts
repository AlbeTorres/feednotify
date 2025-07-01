import Parser from 'rss-parser';
import { Post, Source } from '../../Interfaces';
import { sourcePost } from '../../Interfaces/post.interface';


const { htmlToText } = require('html-to-text'); // eslint-disable-line @typescript-eslint/no-require-imports

const parser = new Parser();

export async function readRssFeeds(
  feeds: Source[],
  pubDateThreshold: Date
) {
  const rssFeeds = feeds.filter((feed) => feed.type === 'rss');

  const feedResponse = await Promise.all(
    rssFeeds.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);

        const filteredItems = filterItems(
          parsed.items as Post[],
          pubDateThreshold
        );

        return {
          image: parsed.image?.url,
          id: feed.id,
          name: feed.name,
          url: feed.url,
          posts: filteredItems,
          lastRead: new Date(0), // Initialize with a date far in the past
        };
      } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error);
      }
    })
  );

  return feedResponse.filter((feed) => feed !== undefined);
}

function filterItems(
  parsedItems: sourcePost[],
  pubDateThreshold: Date
): Post[] {
  //Check if the feed has items
  if (!parsedItems || parsedItems.length === 0) {
    return [];
  }

  // Check if the feed has a pubDate property
  // TODO: if the feed has no pubDate property, filter by the link property, take the items before the item with the same link property as itemLinkThreshold

  return parsedItems
    .filter((item) => {
      const itemDate = new Date(item.pubDate);
      return !isNaN(itemDate.getTime()) && itemDate > pubDateThreshold;
    })
    .map((item) => {
      let img = item.enclosure?.url || null;

      if (!img) {
        img = extractImageFromHTML(
          item['content:encoded'] || item.content || item.summary || ''
        );
      }

      return {
        title: item.title,
        link: item.link,
        content: getContent(item),
        pubDate: item.pubDate,
        guid: item.guid,
        isoDate: item.isoDate,
        categories: item.categories,
        creator: item.creator,
        image: img,
      };
    });
}

function getContent(item: Post): string {
  if (item['content:encodedSnippet']) {
    return htmlToText(item['content:encodedSnippet']);
  } else if (item.contentSnippet) {
    return item.contentSnippet;
  } else if (item.content) {
    return item.content;
  } else {
    return item.summary || '';
  }
}

// 2. ESTRATEGIA: Extraer de HTML content/description
export function extractImageFromHTML(htmlContent: string): string | null {
  if (!htmlContent) return null;

  // Buscar la primera imagen en el HTML
  const imgRegex = /<img[^>]+src\s*=\s*['"']([^'"']+)['"'][^>]*>/i;
  const match = htmlContent.match(imgRegex);

  if (match && match[1]) {
    let imageUrl = match[1];

    // Convertir URLs relativas a absolutas si es necesario
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      // Necesitarías el dominio base del blog
      // imageUrl = 'https://blogdomain.com' + imageUrl;
    }

    return imageUrl;
  }

  return null;
}
