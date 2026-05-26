import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/types';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📄',
    color: '#2C3E50',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoriesApi.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, formData);
      } else {
        await categoriesApi.createCategory(formData);
      }
      await fetchCategories();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;

    try {
      await categoriesApi.deleteCategory(deleteCategoryId);
      await fetchCategories();
      setDeleteCategoryId(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '📄',
      color: category.color || '#2C3E50',
      order: category.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '📄',
      color: '#2C3E50',
      order: 0,
    });
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Categories
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Organize your content by topics
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? 'Update the category details'
                    : 'Create a new category for your posts'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A227] mx-auto mb-4" />
            <p className="text-[#95A5A6]">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44]">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No categories yet
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              Create your first category to organize your posts
            </p>
            <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-[#16213E] rounded-xl p-6 border border-[#E8E4DC] dark:border-[#2D2D44] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon || '📄'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteCategoryId(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
                  <span className="text-sm text-[#95A5A6]">
                    {category.post_count} {category.post_count === 1 ? 'post' : 'posts'}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the category. Posts in this category will need to be reassigned.
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
