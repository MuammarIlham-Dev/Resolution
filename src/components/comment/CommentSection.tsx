import { useState, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import type { Comment } from '@/types';
import { commentsApi } from '@/lib/api';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommentSectionProps {
  postId: string;
  allowComments: boolean;
}

export const CommentSection = ({ postId, allowComments }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentsApi.getComments(postId, {
        sort: sortBy,
        page: 1,
        limit: 50,
      });
      if (response.success) {
        setComments((response.data || []) as Comment[]);
        setTotalComments(response.meta?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (allowComments) {
      fetchComments();
    }
  }, [postId, sortBy, allowComments]);

  if (!allowComments) {
    return (
      <section className="mt-16 pt-10 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-[#95A5A6] mb-4" />
          <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
            Comments Disabled
          </h3>
          <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
            Comments are not available for this post.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 pt-10 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-[#C9A227]" />
          <h3 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
            Comments
          </h3>
          <span className="px-3 py-1 text-sm bg-[#F5F5F5] dark:bg-[#2D2D44] text-[#5D6D7E] dark:text-[#B8B8B8] rounded-full">
            {totalComments}
          </span>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comment Form */}
      <div className="mb-10">
        <CommentForm postId={postId} onSuccess={fetchComments} />
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A227]" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">💬</div>
          <h4 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
            No comments yet
          </h4>
          <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={fetchComments}
            />
          ))}
        </div>
      )}
    </section>
  );
};
