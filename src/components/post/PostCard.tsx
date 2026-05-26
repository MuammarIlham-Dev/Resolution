import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import type { Post } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard = ({ post, featured = false }: PostCardProps) => {
  const category = post.category;
  const author = post.author;

  if (featured) {
    return (
      <article className="group relative bg-white dark:bg-[#16213E] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E8E4DC] dark:border-[#2D2D44]">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2C3E50] to-[#5D6D7E] flex items-center justify-center">
                <span className="text-6xl">{category?.icon || '📄'}</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#C9A227] text-white hover:bg-[#b8941f]">
                Featured
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-[#C9A227] border-[#C9A227]">
                {category?.icon} {category?.name}
              </Badge>
              <span className="text-sm text-[#95A5A6] flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time} min read
              </span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-4 group-hover:text-[#C9A227] transition-colors">
              {post.title}
            </h2>

            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.display_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E8E4DC] dark:bg-[#2D2D44] flex items-center justify-center">
                    <User className="h-5 w-5 text-[#5D6D7E]" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    {author?.display_name || author?.username}
                  </p>
                  <p className="text-xs text-[#95A5A6] flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.published_at
                      ? formatDistanceToNow(new Date(post.published_at))
                      : 'Draft'}
                  </p>
                </div>
              </div>

              <Link
                to={`/post/${post.slug}`}
                className="flex items-center gap-2 text-[#C9A227] font-medium hover:gap-3 transition-all"
              >
                Read <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white dark:bg-[#16213E] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#E8E4DC] dark:border-[#2D2D44]">
      {/* Image */}
      <Link to={`/post/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2C3E50] to-[#5D6D7E] flex items-center justify-center">
            <span className="text-5xl">{category?.icon || '📄'}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="outline" className="text-xs text-[#C9A227] border-[#C9A227]">
            {category?.icon} {category?.name}
          </Badge>
          <span className="text-xs text-[#95A5A6] flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.reading_time} min
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
          <div className="flex items-center gap-2">
            {author?.avatar ? (
              <img
                src={author.avatar}
                alt={author.display_name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#E8E4DC] dark:bg-[#2D2D44] flex items-center justify-center">
                <User className="h-3 w-3 text-[#5D6D7E]" />
              </div>
            )}
            <span className="text-xs text-[#5D6D7E] dark:text-[#B8B8B8]">
              {author?.display_name || author?.username}
            </span>
          </div>

          <span className="text-xs text-[#95A5A6]">
            {post.published_at
              ? formatDistanceToNow(new Date(post.published_at))
              : 'Draft'}
          </span>
        </div>
      </div>
    </article>
  );
};
