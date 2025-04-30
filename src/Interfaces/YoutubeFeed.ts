import { YoutubeVideo } from './YoutubeVideo';

export interface YoutubeFeed {
  id: string;
  name: string;
  url: string;
  videos: YoutubeVideo[] | [];
  lastRead: Date; // Initialize with a date far in the past
}
