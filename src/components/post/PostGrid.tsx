import type { Post } from '@/types';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export const PostGrid = ({ posts, isLoading = false, columns = 3 }: PostGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} xl:grid-cols-${columns === 3 ? 4 : columns} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#16213E] rounded-xl overflow-hidden border border-[#E8E4DC] dark:border-[#2D2D44]">
            <Skeleton className="aspect-[16/10]" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
          No posts found
        </h3>
        <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
          Check back later for new content
        </p>
      </div>
    );
  }

  const gridCols = {
    2: 'md:grid-cols-2 xl:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    4: 'md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
