import { useEffect, useMemo } from 'react';
import type { Post } from '@/types';
import { sanitizePostHtml } from '@/lib/sanitize';

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  const safeContent = useMemo(() => sanitizePostHtml(post.content), [post.content]);

  // Add drop cap styling to first paragraph
  useEffect(() => {
    const content = document.querySelector('.post-content');
    if (content) {
      const firstParagraph = content.querySelector('p');
      if (firstParagraph) {
        firstParagraph.classList.add('first-letter');
      }
    }
  }, []);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">{post.category?.icon}</span>
          <span className="text-sm text-[#C9A227] font-medium uppercase tracking-wider">
            {post.category?.name}
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-[#5D6D7E] dark:text-[#B8B8B8] italic mb-6 max-w-2xl mx-auto">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-center gap-6 text-sm text-[#95A5A6]">
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.display_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#E8E4DC] dark:bg-[#2D2D44] flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
            )}
            <span className="text-[#2C3E50] dark:text-[#E8E8E8] font-medium">
              {post.author?.display_name || post.author?.username}
            </span>
          </div>

          <span>•</span>

          <span>
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : 'Draft'}
          </span>

          <span>•</span>

          <span>{post.reading_time} min read</span>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full aspect-[21/9] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="post-content prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-serif prose-headings:text-[#2C3E50] dark:prose-headings:text-[#E8E8E8]
          prose-p:text-[#5D6D7E] dark:prose-p:text-[#B8B8B8] prose-p:leading-relaxed
          prose-a:text-[#C9A227] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#2C3E50] dark:prose-strong:text-[#E8E8E8]
          prose-blockquote:border-l-[#C9A227] prose-blockquote:bg-[#FDFBF7] dark:prose-blockquote:bg-[#16213E]
          prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-code:text-[#C9A227] prose-code:bg-[#F5F5F5] dark:prose-code:bg-[#2D2D44]
          prose-pre:bg-[#2C3E50] dark:prose-pre:bg-[#16213E]
          prose-img:rounded-lg prose-img:shadow-md
          prose-hr:border-[#E8E4DC] dark:prose-hr:border-[#2D2D44]
          [&_.first-letter]:first-letter:text-5xl [&_.first-letter]:first-letter:font-serif
          [&_.first-letter]:first-letter:font-bold [&_.first-letter]:first-letter:text-[#C9A227]
          [&_.first-letter]:first-letter:float-left [&_.first-letter]:first-letter:mr-3
          [&_.first-letter]:first-letter:mt-[-4px]"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#95A5A6]">Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-[#F5F5F5] dark:bg-[#2D2D44] text-[#5D6D7E] dark:text-[#B8B8B8] rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
