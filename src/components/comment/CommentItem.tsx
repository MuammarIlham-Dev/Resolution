import { useState } from 'react';
import { ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import type { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { CommentForm } from './CommentForm';
import { formatDistanceToNow } from '@/lib/utils';
import { commentsApi } from '@/lib/api';
import { getCommentVoterId } from '@/lib/comment-voter';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply?: () => void;
  isReply?: boolean;
}

export const CommentItem = ({ comment, postId, onReply, isReply = false }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    try {
      const voterId = getCommentVoterId();
      const response = await commentsApi.likeComment(comment.id, voterId);
      setLikes(response.data?.likes || likes + (hasLiked ? -1 : 1));
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReply?.();
  };

  return (
    <div className={`${isReply ? 'ml-8 pl-6 border-l-2 border-[#C9A227]/30' : ''}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author_avatar ? (
            <img
              src={comment.author_avatar}
              alt={comment.author_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A227] to-[#D4AF37] flex items-center justify-center text-white font-medium">
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#FDFBF7] dark:bg-[#16213E] rounded-lg p-4 border border-[#E8E4DC] dark:border-[#2D2D44]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                  {comment.author_name}
                </span>
                {comment.status === 'pending' && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <span className="text-xs text-[#95A5A6] flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(comment.created_at))}
              </span>
            </div>

            {/* Content */}
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`text-xs ${hasLiked ? 'text-[#C9A227]' : 'text-[#95A5A6]'}`}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {likes > 0 && likes}
              </Button>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs text-[#95A5A6]"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                parentCommentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReply={onReply}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
