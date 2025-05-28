import { Post } from './post.interface';
import { YoutubeVideo } from './youtubeVideo.interface';

export interface feedResponse {
  rssFeed: {
    image: string | undefined;
    id: string;
    name: string;
    url: string;
    posts: Post[];
    lastRead: Date;
  }[];
  youtubeFeed: {
    id: string;
    name: string;
    url: string;
    videos: YoutubeVideo[];
    lastRead: Date;
  }[];
}
