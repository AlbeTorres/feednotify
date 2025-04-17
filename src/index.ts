import { readRssFeeds } from "./readers/rssreader";


const feeds = [
  {
    id: '1',
    type: 'rss',
    name: 'Dev.to',
    url: 'https://dev.to/feed',
  },
  {
    id: '2',
    type: 'rss',
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com/feed/',
  },
];

readRssFeeds(feeds);