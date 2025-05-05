import Parser from 'rss-parser';
import { Post, SourceFeedItem } from '../../Interfaces';

const { htmlToText } = require('html-to-text'); // eslint-disable-line @typescript-eslint/no-require-imports

const parser = new Parser();

export async function readRssFeeds(
  feeds: SourceFeedItem[],
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

function filterItems(parsedItems: Post[], pubDateThreshold: Date): Post[] {
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
    .map((item) => ({
      title: item.title,
      link: item.link,
      content: getContent(item),
      pubDate: item.pubDate,
      guid: item.guid,
      isoDate: item.isoDate,
      categories: item.categories,
      creator: item.creator,
    }));
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
