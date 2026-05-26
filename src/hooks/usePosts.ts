import { useEffect } from 'react';
import { usePostStore } from '@/stores';

export const usePosts = (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
  const {
    posts,
    featuredPosts,
    currentPost,
    relatedPosts,
    categories,
    currentCategory,
    totalPosts,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchPosts,
    fetchFeaturedPosts,
    fetchPostBySlug,
    fetchRelatedPosts,
    fetchCategories,
    fetchCategoryBySlug,
    clearCurrentPost,
    clearError,
  } = usePostStore();

  useEffect(() => {
    fetchPosts(params);
  }, [params?.page, params?.limit, params?.category, params?.search]);

  return {
    posts,
    featuredPosts,
    currentPost,
    relatedPosts,
    categories,
    currentCategory,
    totalPosts,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchPosts,
    fetchFeaturedPosts,
    fetchPostBySlug,
    fetchRelatedPosts,
    fetchCategories,
    fetchCategoryBySlug,
    clearCurrentPost,
    clearError,
  };
};

export const usePost = (slug?: string) => {
  const {
    currentPost,
    relatedPosts,
    isLoading,
    error,
    fetchPostBySlug,
    fetchRelatedPosts,
    clearCurrentPost,
    clearError,
  } = usePostStore();

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
      fetchRelatedPosts(slug);
    }
    return () => {
      clearCurrentPost();
    };
  }, [slug]);

  return {
    post: currentPost,
    relatedPosts,
    isLoading,
    error,
    clearError,
  };
};

export const useCategories = () => {
  const { categories, fetchCategories } = usePostStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories };
};
