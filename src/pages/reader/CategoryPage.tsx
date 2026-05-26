import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostGrid } from '@/components/post/PostGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CategoryList } from '@/components/category/CategoryList';
import { usePostStore } from '@/stores';

export const CategoryPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const {
    posts,
    categories,
    currentCategory,
    isLoading,
    fetchCategoryBySlug,
    fetchCategories,
    fetchPosts,
  } = usePostStore();

  useEffect(() => {
    fetchCategories();
    if (slug && slug !== 'all') {
      fetchCategoryBySlug(slug);
    } else if (slug === 'all') {
      fetchPosts({ limit: 12, publishedOnly: true });
    }
  }, [slug]);

  const isAllCategories = slug === 'all';

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="w-full">
          <LoadingSpinner message="Loading category..." />
        </div>
      </div>
    );
  }

  // All categories view
  if (isAllCategories) {
    return (
      <div className="min-h-screen py-16">
        <div className="w-full">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/"
              className="text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#95A5A6] mx-2">/</span>
            <span className="text-sm text-[#2C3E50] dark:text-[#E8E8E8]">
              All Categories
            </span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
              <FolderOpen className="h-8 w-8 text-[#C9A227]" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-4">
              All Categories
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Browse all our content organized by themes and topics
            </p>
          </div>

          <CategoryList categories={categories} />

          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-8">
              Latest Stories
            </h2>
            {isLoading ? (
              <LoadingSpinner message="Loading posts..." />
            ) : posts.length > 0 ? (
              <PostGrid posts={posts} columns={3} />
            ) : (
              <p className="text-center text-[#5D6D7E] dark:text-[#B8B8B8]">
                No published posts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Single category view
  if (!currentCategory) {
    return (
      <div className="min-h-screen py-16">
        <div className="w-full">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              Category Not Found
            </h2>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link to="/category/all">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors"
          >
            Home
          </Link>
          <span className="text-[#95A5A6] mx-2">/</span>
          <Link
            to="/category/all"
            className="text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors"
          >
            Categories
          </Link>
          <span className="text-[#95A5A6] mx-2">/</span>
          <span className="text-sm text-[#2C3E50] dark:text-[#E8E8E8]">
            {currentCategory.name}
          </span>
        </div>

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 flex items-center justify-center text-3xl shadow-sm animate-blob-morph"
              style={{
                backgroundColor: `${currentCategory.color}20`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
              }}
            >
              {currentCategory.icon || '📄'}
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                {currentCategory.name}
              </h1>
              <p className="text-[#95A5A6]">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>

          {currentCategory.description && (
            <p className="text-lg text-[#5D6D7E] dark:text-[#B8B8B8] max-w-2xl">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No posts yet
            </h2>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Check back later for new content in this category
            </p>
          </div>
        ) : (
          <PostGrid posts={posts} columns={3} />
        )}
      </div>
    </div>
  );
};
