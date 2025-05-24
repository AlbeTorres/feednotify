export interface Post {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet?: string;
  'content:encodedSnippet'?: string;
  summary?: string;
  guid: string;
  isoDate: string;
  categories: string[];
  creator: string;
  image?: string;
}
