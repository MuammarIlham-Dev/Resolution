// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'author';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  post_count: number;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Post Types
export type PostStatus = 'draft' | 'published' | 'archived';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author: User;
  category: Category;
  tags: string[];
  status: PostStatus;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  views: number;
  reading_time: number;
  is_featured: boolean;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
}

// Comment Types
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'deleted';

export interface CommentAuthor {
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_comment_id?: string;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
  likes: number;
  liked_by: string[];
  status: CommentStatus;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  link?: string;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  order: number;
  created_at: string;
  updated_at: string;
}

// Seminar Types
export interface Seminar {
  id: string;
  title: string;
  description?: string;
  speaker?: string;
  date?: string;
  time?: string;
  venue?: string;
  mode: 'online' | 'offline' | 'hybrid';
  registration_link?: string;
  thumbnail?: string;
  capacity: number;
  is_featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  order: number;
  created_at: string;
  updated_at: string;
}

// Settings Types
export interface Settings {
  id: string;
  site_name: string;
  site_description?: string;
  logo?: string;
  favicon?: string;
  primary_color?: string;
  accent_color?: string;
  posts_per_page: number;
  comments_per_page: number;
  enable_comments: boolean;
  moderate_comments: boolean;
  social_links: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
  seo: {
    default_meta_title?: string;
    default_meta_description?: string;
    google_analytics_id?: string;
  };
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

// Form Types
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  status: PostStatus;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
}

export interface CommentFormData {
  post_id: string;
  parent_comment_id?: string;
  author_name: string;
  author_email: string;
  content: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}
