import Parser from 'rss-parser';

type Feed = {
  id: string;
  type: string;
  name: string;
  url: string;
};

const parser = new Parser();

export async function readRssFeeds(feeds: Feed[], pubDateThreshold: Date, itemLinkThreshold: string) {
  const rssFeeds = feeds.filter(feed => feed.type === 'rss');

  for (const feed of rssFeeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      console.log(`📥 Feed: ${feed.name}`);
      console.log(parsed.items[0])

      //Check if the feed has items 
      if (!parsed.items || parsed.items.length === 0) {
        console.log('  No hay artículos en este feed.');
        return;
      }

      const filteredItems = filterItems(parsed.items, pubDateThreshold, itemLinkThreshold);

      filteredItems.slice(0, 3).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.title}`); 
        console.log(`     ${item.link}`);
      });

      if (filteredItems.length === 0) {
        console.log('  No hay artículos nuevos desde la última vez que se leyó este feed.');
      } else {
        console.log(`  ${filteredItems.length} artículos nuevos desde la última vez que se leyó este feed.`);
      }
    } catch (error) {
      console.error(`❌ Error leyendo feed "${feed.name}":`, error);
    }
  }
}

function filterItems(parsedItems: any[], pubDateThreshold: Date, itemLinkThreshold: string):any[] {

   //Check if the feed has a pubDate property
   //TODO: if the feed has no pubDate property, filter by the link property, take the items before the item with the same link property as itemLinkThreshold

  parsedItems.filter(item => {
   
    if (!item.pubDate){
    

    }else {
      const itemDate = new Date(item.pubDate);
      return !isNaN(itemDate.getTime()) && itemDate > pubDateThreshold;
    }
  });

  return []
}