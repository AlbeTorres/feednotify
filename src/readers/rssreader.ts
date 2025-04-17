import Parser from 'rss-parser';

type Feed = {
  id: string;
  type: string;
  name: string;
  url: string;
};

const parser = new Parser();

export async function readRssFeeds(feeds: Feed[]) {
  const rssFeeds = feeds.filter(feed => feed.type === 'rss');

  for (const feed of rssFeeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      console.log(`📥 Feed: ${feed.name}`);
      parsed.items?.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.title}`);
        console.log(`     ${item.link}`);
      });
    } catch (error) {
      console.error(`❌ Error leyendo feed "${feed.name}":`, error);
    }
  }
}
