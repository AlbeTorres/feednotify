import { readRssFeeds } from "./readers/rssreader";


const feeds = [
  {
    "id": "Playstation_Blog",
    "type": "rss",
    "name": "Playstation Blog",
    "url": "https://blog.playstation.com/feed"
  },
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

readRssFeeds(feeds, yesterday, "https://blog.playstation.com/2023/10/02/ps5-system-software-update-23-02-01-00-now-live/");