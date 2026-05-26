import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { coursesApi } from '@/lib/api';
import type { Course } from '@/types';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    thumbnail: '',
    link: '',
    is_featured: false,
    status: 'draft' as 'draft' | 'published' | 'archived',
    order: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await coursesApi.getCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCourse) {
        await coursesApi.updateCourse(editingCourse.id, formData);
      } else {
        await coursesApi.createCourse(formData);
      }
      await fetchCourses();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCourseId) return;

    try {
      await coursesApi.deleteCourse(deleteCourseId);
      await fetchCourses();
      setDeleteCourseId(null);
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      level: course.level || 'beginner',
      thumbnail: course.thumbnail || '',
      link: course.link || '',
      is_featured: course.is_featured || false,
      status: course.status || 'draft',
      order: course.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      level: 'beginner',
      thumbnail: '',
      link: '',
      is_featured: false,
      status: 'draft',
      order: 0,
    });
  };

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

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30">Advanced</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Courses
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Manage your educational courses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'New Course'}
                </DialogTitle>
                <DialogDescription>
                  {editingCourse
                    ? 'Update the course details'
                    : 'Create a new course'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8] min-h-[80px] resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g. 8 weeks"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Course Link</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-7">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingCourse ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A227] mx-auto mb-4" />
            <p className="text-[#95A5A6]">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44]">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No courses yet
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              Create your first course to get started
            </p>
            <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44] hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                {course.thumbnail ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-[#C9A227]/20 to-[#2C3E50]/20 dark:from-[#C9A227]/10 dark:to-[#2C3E50]/10 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-[#C9A227]/40" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(course.status)}
                      {getLevelBadge(course.level)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteCourseId(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
                    <div className="text-sm text-[#95A5A6]">
                      {course.instructor && <span>{course.instructor}</span>}
                      {course.duration && <span> · {course.duration}</span>}
                    </div>
                    {course.link && (
                      <a href={course.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-[#C9A227]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteCourseId} onOpenChange={() => setDeleteCourseId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the course.
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
