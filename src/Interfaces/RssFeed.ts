import { Post } from './Post';

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  posts: Post[] | [];
  lastRead: Date;
}
