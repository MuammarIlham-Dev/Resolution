import { create } from 'zustand';
import type { Post, Category } from '@/types';
import { postsApi, categoriesApi } from '@/lib/api';

interface PostState {
  // Posts
  posts: Post[];
  featuredPosts: Post[];
  currentPost: Post | null;
  relatedPosts: Post[];

  // Categories
  categories: Category[];
  currentCategory: Category | null;

  // Pagination
  totalPosts: number;
  currentPage: number;
  totalPages: number;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Actions
  fetchPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
    publishedOnly?: boolean;
  }) => Promise<void>;
  fetchFeaturedPosts: () => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  fetchRelatedPosts: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string, page?: number) => Promise<void>;
  clearCurrentPost: () => void;
  clearError: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  featuredPosts: [],
  currentPost: null,
  relatedPosts: [],
  categories: [],
  currentCategory: null,
  totalPosts: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  fetchPosts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await postsApi.getPosts(params);
      if (response.success) {
        set({
          posts: response.data || [],
          totalPosts: response.meta?.total || 0,
          currentPage: response.meta?.page || 1,
          totalPages: response.meta?.totalPages || 1,
          isLoading: false,
        });
      } else {
        throw new Error(response.error || 'Failed to fetch posts');
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch posts',
        isLoading: false,
      });
    }
  },

  fetchFeaturedPosts: async () => {
    try {
      const response = await postsApi.getFeaturedPosts(5);
      set({ featuredPosts: response.data || [] });
    } catch (error) {
      console.error('Failed to fetch featured posts:', error);
    }
  },

  fetchPostBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await postsApi.getPostBySlug(slug);
      set({
        currentPost: response.data || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch post',
        isLoading: false,
      });
    }
  },

  fetchRelatedPosts: async (slug: string) => {
    try {
      const response = await postsApi.getRelatedPosts(slug, 4);
      set({ relatedPosts: response.data || [] });
    } catch (error) {
      console.error('Failed to fetch related posts:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await categoriesApi.getCategories();
      set({ categories: response.data || [] });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchCategoryBySlug: async (slug: string, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriesApi.getCategoryBySlug(slug, { page, limit: 10 });
      if (response.success && response.data) {
        const { category, posts } = response.data;
        set({
          currentCategory: category,
          posts: posts || [],
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch category',
        isLoading: false,
      });
    }
  },

  clearCurrentPost: () => set({ currentPost: null, relatedPosts: [] }),
  clearError: () => set({ error: null }),
}));
