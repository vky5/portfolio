export type BlogType = "external" | "native-simple" | "native-book";

export interface Chapter {
  title: string;
  content: string; // Can be a long string or eventually Markdown
}

export interface BlogPost {
  id: string; // slug
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  type: BlogType;
  coverImage?: string;
  image?: string; // Optional cover image
  externalLink?: string; // Required if type === 'external'
  content?: string; // Required if type === 'native-simple', main body text
  bookData?: {
    chapters: Chapter[];
  }; // Required if type === 'native-book'
}
