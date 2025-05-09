import { Post } from './post.interface';

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  posts: Post[] | [];
  lastRead: Date;
}
