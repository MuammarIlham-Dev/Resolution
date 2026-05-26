import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { commentsApi } from '@/lib/api';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CommentForm = ({ postId, parentCommentId, onSuccess, onCancel }: CommentFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await commentsApi.addComment({
        post_id: postId,
        parent_comment_id: parentCommentId,
        author_name: name,
        author_email: email,
        content,
      });

      if (!response.success) {
        console.error('Failed to submit comment:', response.error);
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setContent('');

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
          Comment Submitted!
        </h4>
        <p className="text-sm text-green-600 dark:text-green-400">
          Your comment is awaiting moderation and will appear shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white dark:bg-[#16213E]"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white dark:bg-[#16213E]"
          />
        </div>
      </div>

      <Textarea
        placeholder={parentCommentId ? 'Write a reply...' : 'Share your thoughts...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="bg-white dark:bg-[#16213E] resize-none"
      />

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !email.trim() || !content.trim()}
          className="bg-[#2C3E50] hover:bg-[#1a252f] dark:bg-[#C9A227] dark:hover:bg-[#b8941f] dark:text-[#1A1A2E]"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {parentCommentId ? 'Reply' : 'Comment'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
