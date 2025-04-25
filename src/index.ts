import { readRssFeeds } from './readers/rssreader';
import { readYoutubeFeeds } from './readers/youtubeReader';

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
  {
    id: 'linus_tech_tips',
    type: 'youtube',
    name: 'Linus Tech Tips',
    url: 'https://www.youtube.com/@linustechtips',
  },
  {
    id: 'cnet',
    type: 'rss',
    name: 'CNET',
    url: 'https://www.cnet.com/rss/all/',
  },
  {
    id: 'ign',
    type: 'rss',
    name: 'IGN',
    url: 'https://www.ign.com/rss/all.ign',
  },
  {
    id: 'gizmodo',
    type: 'rss',
    name: 'Gizmodo',
    url: 'https://gizmodo.com/rss',
  },
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

readRssFeeds(feeds, yesterday).then((rssfeds) => {
  console.log(rssfeds);
});
readYoutubeFeeds(feeds, yesterday).then((youfeds) => {
  console.log(youfeds);
});
