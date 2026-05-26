import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { postsApi, categoriesApi } from '@/lib/api';
import type { Category } from '@/types';

export const EditPostPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingSlug, setExistingSlug] = useState<string | undefined>();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    is_featured: false,
    allow_comments: true,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await postsApi.getPostById(id!);
      const post = response.data;
      if (post) {
        setExistingSlug(post.slug);
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          category: typeof post.category === 'string' ? post.category : post.category.id,
          tags: post.tags?.join(', ') || '',
          status: post.status,
          featured_image: post.featured_image || '',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          is_featured: post.is_featured,
          allow_comments: post.allow_comments,
        });
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      tags: formData.tags,
      status: (publish ? 'published' : formData.status) as 'draft' | 'published' | 'archived',
    };

    try {
      const response = isEditing
        ? await postsApi.updatePost(id!, payload, existingSlug)
        : await postsApi.createPost(payload);

      if (!response.success) {
        console.error('Failed to save post:', response.error);
        return;
      }
      navigate('/author/posts');
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A227]" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/author/posts')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
              <p className="text-sm text-[#95A5A6]">
                {isEditing ? 'Update your story' : 'Create a new story'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSaving}
              className="bg-[#C9A227] hover:bg-[#b8941f] text-white"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Articulate your thoughts..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={15}
              className="font-mono text-sm resize-y"
            />
            <p className="text-xs text-[#95A5A6]">
              HTML tags are supported for formatting
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of your post..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                placeholder="https://example.com/image.jpg"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t border-[#E8E4DC] dark:border-[#2D2D44] pt-6">
            <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8] mb-4">
              SEO Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  placeholder="SEO title..."
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  id="meta_description"
                  placeholder="SEO description..."
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border-t border-[#E8E4DC] dark:border-[#2D2D44] pt-6">
            <h3 className="font-medium text-[#2C3E50] dark:text-[#E8E8E8] mb-4">
              Post Settings
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured Post
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="allow_comments"
                  checked={formData.allow_comments}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, allow_comments: checked })
                  }
                />
                <Label htmlFor="allow_comments" className="cursor-pointer">
                  Allow Comments
                </Label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
