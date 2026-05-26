import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';

export const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postsApi.getPosts({ limit: 100 });
      if (response.success) {
        setPosts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      await postsApi.deletePost(deletePostId);
      setPosts(posts.filter((p) => p.id !== deletePostId));
      setDeletePostId(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const response = await postsApi.togglePublish(post.id);
      const updatedPost = response.data;
      if (updatedPost) {
        setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Posts
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Manage your blog posts
            </p>
          </div>
          <Link to="/author/posts/new">
            <Button className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#95A5A6]" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#95A5A6]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Posts Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[#C9A227] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#95A5A6]">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44]">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No posts found
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Create your first post to get started'}
            </p>
            {!searchQuery && (
              <Link to="/author/posts/new">
                <Button className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FDFBF7] dark:bg-[#1A1A2E] border-b border-[#E8E4DC] dark:border-[#2D2D44]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#5D6D7E]">
                      Post
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#5D6D7E]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#5D6D7E]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#5D6D7E]">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#5D6D7E]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#5D6D7E]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC] dark:divide-[#2D2D44]">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#FDFBF7] dark:hover:bg-[#1A1A2E]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-[#E8E4DC] dark:bg-[#2D2D44] flex items-center justify-center">
                              <span className="text-lg">{post.category?.icon}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                              {post.title}
                            </p>
                            <p className="text-sm text-[#95A5A6]">
                              by {post.author?.display_name || post.author?.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                      <td className="px-6 py-4">
                        <span className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                          {post.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                          {post.views}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/post/${post.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/author/posts/${post.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(post)}>
                              {post.status === 'published' ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletePostId(post.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the post.
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
