import { readRssFeeds } from './readers/rssreader';

const feeds = [
  {
    id: 'Playstation_Blog',
    type: 'rss',
    name: 'Playstation Blog',
    url: 'https://blog.playstation.com/feed',
  },
  {
    id: 'techcrunch',
    type: 'rss',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
  },
  {
    id: 'verge',
    type: 'rss',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
  },
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

readRssFeeds(feeds, yesterday).then((rssfeds) => {
  console.log(rssfeds);
});
