export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time: number;
  published: boolean;
}
