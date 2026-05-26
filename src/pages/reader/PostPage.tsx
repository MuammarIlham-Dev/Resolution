import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostContent } from '@/components/post/PostContent';
import { PostCard } from '@/components/post/PostCard';
import { CommentSection } from '@/components/comment/CommentSection';
import { ShareButtons } from '@/components/common/ShareButtons';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { usePostStore } from '@/stores';
import { postsApi } from '@/lib/api';

export const PostPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { currentPost, relatedPosts, isLoading, fetchPostBySlug, fetchRelatedPosts } =
    usePostStore();

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
      fetchRelatedPosts(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (currentPost?.id) {
      postsApi.incrementViews(currentPost.id);
    }
  }, [currentPost?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="w-full">
          <LoadingSpinner message="Loading story..." />
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen py-16">
        <div className="w-full">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              Post Not Found
            </h2>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              The story you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen py-8 md:py-12">
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
            <Link
              to={`/category/${currentPost.category?.slug}`}
              className="text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors"
            >
              {currentPost.category?.name}
            </Link>
            <span className="text-[#95A5A6] mx-2">/</span>
            <span className="text-sm text-[#2C3E50] dark:text-[#E8E8E8] truncate max-w-[200px] inline-block align-bottom">
              {currentPost.title}
            </span>
          </div>

          {/* Post Content */}
          <PostContent post={currentPost} />

          {/* Share Section */}
          <div className="max-w-3xl mx-auto mt-10 pt-6 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
            <ShareButtons title={currentPost.title} url={postUrl} />
          </div>

          {/* Comments Section */}
          <div className="max-w-3xl mx-auto">
            <CommentSection
              postId={currentPost.id}
              allowComments={currentPost.allow_comments}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="h-6 w-6 text-[#C9A227]" />
                <h3 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                  You Might Also Like
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
