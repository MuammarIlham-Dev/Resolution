import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  Settings,
  Users,
  ArrowRight,
  GraduationCap,
  Presentation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { postsApi, commentsApi } from '@/lib/api';
import type { Post, Comment } from '@/types';
import { useAuth } from '@/hooks';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    pendingComments: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [postsResponse, postsTotalsResponse, commentsResponse, pendingResponse] =
        await Promise.all([
          postsApi.getPosts({ limit: 5 }),
          postsApi.getPosts({ limit: 1, page: 1 }),
          commentsApi.getAllComments({ limit: 5 }),
          commentsApi.getAllComments({ limit: 1, status: 'pending' }),
        ]);

      const posts = postsResponse.data || [];
      setRecentPosts(posts);
      setRecentComments(commentsResponse.data || []);

      const statsPostsResponse = await postsApi.getPosts({ limit: 500 });
      const allPosts = statsPostsResponse.data || [];
      const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0);

      setStats({
        totalPosts: postsTotalsResponse.meta?.total || 0,
        totalComments: commentsResponse.meta?.total || 0,
        totalViews,
        pendingComments: pendingResponse.meta?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Comments',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Pending Comments',
      value: stats.pendingComments,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Dashboard
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Welcome back, {user?.display_name || user?.username}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/author/posts/new">
              <Button className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 gap-4 mb-10">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#95A5A6] mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                      {isLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:gap-8 gap-4 mb-10">
          <Link to="/author/posts">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    Manage Posts
                  </h3>
                  <p className="text-sm text-[#95A5A6]">View and edit your posts</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#95A5A6]" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/author/categories">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    Categories
                  </h3>
                  <p className="text-sm text-[#95A5A6]">Organize your content</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#95A5A6]" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/author/courses">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    Courses
                  </h3>
                  <p className="text-sm text-[#95A5A6]">Manage your courses</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#95A5A6]" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/author/seminars">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
                  <Presentation className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    Seminars
                  </h3>
                  <p className="text-sm text-[#95A5A6]">Manage your events</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#95A5A6]" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/author/comments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                    Comments
                  </h3>
                  <p className="text-sm text-[#95A5A6]">Moderate discussions</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#95A5A6]" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">Recent Posts</CardTitle>
              <Link to="/author/posts">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentPosts.length === 0 ? (
                <p className="text-center text-[#95A5A6] py-4">No posts yet</p>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 bg-[#FDFBF7] dark:bg-[#1A1A2E] rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#2C3E50] dark:text-[#E8E8E8] truncate">
                          {post.title}
                        </p>
                        <p className="text-sm text-[#95A5A6]">
                          {post.status} • {post.views} views
                        </p>
                      </div>
                      <Link to={`/author/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg">Recent Comments</CardTitle>
              <Link to="/author/comments">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentComments.length === 0 ? (
                <p className="text-center text-[#95A5A6] py-4">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {recentComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-center justify-between p-3 bg-[#FDFBF7] dark:bg-[#1A1A2E] rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                          {comment.author_name}
                        </p>
                        <p className="text-sm text-[#95A5A6] truncate">
                          {comment.content}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${comment.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : comment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {comment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
