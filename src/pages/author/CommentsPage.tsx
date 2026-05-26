import { useEffect, useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { commentsApi } from '@/lib/api';
import type { Comment } from '@/types';

export const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentsApi.getAllComments({ limit: 100 });
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await commentsApi.approveComment(id);
      await fetchComments();
    } catch (error) {
      console.error('Failed to approve comment:', error);
    }
  };

  const handleSpam = async (id: string) => {
    try {
      await commentsApi.markAsSpam(id);
      await fetchComments();
    } catch (error) {
      console.error('Failed to mark as spam:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteCommentId) return;

    try {
      await commentsApi.deleteComment(deleteCommentId);
      await fetchComments();
      setDeleteCommentId(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (activeTab === 'all') return true;
    return comment.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    all: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    spam: comments.filter((c) => c.status === 'spam').length,
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Comments
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Moderate and manage comments
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({stats.all})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="spam">
              Spam ({stats.spam})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[#C9A227] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#95A5A6]">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44]">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No comments
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              {activeTab === 'all'
                ? 'No comments yet'
                : `No ${activeTab} comments`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-[#16213E] rounded-xl p-6 border border-[#E8E4DC] dark:border-[#2D2D44]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                        {comment.author_name}
                      </p>
                      <p className="text-sm text-[#95A5A6]">{comment.author_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(comment.status)}
                  </div>
                </div>

                <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 whitespace-pre-wrap">
                  {comment.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
                  <div className="flex items-center gap-4 text-sm text-[#95A5A6]">
                    <span>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{comment.likes} likes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {comment.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {comment.status !== 'spam' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpam(comment.id)}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Spam
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteCommentId(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
