// import { getYoutubeVideoResume } from './AIHelper/youtubeSumariser';
import { readRssFeeds } from './readers/rssreader';
import { readYoutubeFeeds } from './readers/youtubeReader';

const feeds = [
  {
    id: 'Playstation_Blog',
    type: 'rss',
    category: 'Games',
    name: 'Playstation Blog',
    url: 'https://blog.playstation.com/feed',
  },
  {
    id: 'XBOX_Blog',
    type: 'rss',
    name: 'XBOX Blog',
    category: 'Games',
    url: 'https://news.xbox.com/en-us/feed/',
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
    id: 'cnet',
    type: 'rss',
    name: 'CNET',
    url: 'https://www.cnet.com/rss/all/',
  },
  {
    id: 'ign_game',
    type: 'rss',
    name: 'IGN Games',
    category: 'Games',
    url: 'https://feeds.feedburner.com/ign/games-all',
  },
  {
    id: 'The Gamer',
    type: 'rss',
    name: 'The Gamer originals',
    category: 'Games',
    url: 'https://www.thegamer.com/feed/category/tg-originals/',
  },
  {
    id: 'ign_movies',
    type: 'rss',
    name: 'IGN Movies',
    url: 'https://feeds.feedburner.com/ign/movies-articles',
  },
  {
    id: 'gizmodo',
    type: 'rss',
    name: 'Gizmodo',
    url: 'https://gizmodo.com/rss',
  },
  {
    id: 'Harvard_Business_Review',
    type: 'rss',
    name: 'Harvard Business Review',
    category: 'Business',
    url: 'http://feeds.hbr.org/harvardbusiness',
  },
  {
    id: 'linus_tech_tips',
    type: 'youtube',
    name: 'Linus Tech Tips',
    url: 'https://www.youtube.com/@linustechtips',
  },
];

export async function Main() {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const rssFeed = await readRssFeeds(feeds, lastWeek);
  const youtubeFeed = await readYoutubeFeeds(feeds, lastWeek);

  const feed = {
    rssFeed,
    youtubeFeed,
  };

  console.log(feed);

  // getYoutubeVideoResume('https://www.youtube.com/watch?v=IZKLmp2oqTY');
}

Main();
