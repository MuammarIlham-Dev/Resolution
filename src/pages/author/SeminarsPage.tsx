import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, ExternalLink, Calendar, MapPin, Presentation } from 'lucide-react';
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
import { seminarsApi } from '@/lib/api';
import type { Seminar } from '@/types';

export const SeminarsPage = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null);
  const [deleteSeminarId, setDeleteSeminarId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    date: '',
    time: '',
    venue: '',
    mode: 'online' as 'online' | 'offline' | 'hybrid',
    registration_link: '',
    thumbnail: '',
    capacity: 0,
    is_featured: false,
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    order: 0,
  });

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setIsLoading(true);
      const response = await seminarsApi.getSeminars();
      if (response.success) {
        setSeminars(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSeminar) {
        await seminarsApi.updateSeminar(editingSeminar.id, formData);
      } else {
        await seminarsApi.createSeminar(formData);
      }
      await fetchSeminars();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save seminar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSeminarId) return;

    try {
      await seminarsApi.deleteSeminar(deleteSeminarId);
      await fetchSeminars();
      setDeleteSeminarId(null);
    } catch (error) {
      console.error('Failed to delete seminar:', error);
    }
  };

  const handleEdit = (seminar: Seminar) => {
    setEditingSeminar(seminar);
    setFormData({
      title: seminar.title,
      description: seminar.description || '',
      speaker: seminar.speaker || '',
      date: seminar.date || '',
      time: seminar.time || '',
      venue: seminar.venue || '',
      mode: seminar.mode || 'online',
      registration_link: seminar.registration_link || '',
      thumbnail: seminar.thumbnail || '',
      capacity: seminar.capacity || 0,
      is_featured: seminar.is_featured || false,
      status: seminar.status || 'upcoming',
      order: seminar.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSeminar(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      speaker: '',
      date: '',
      time: '',
      venue: '',
      mode: 'online',
      registration_link: '',
      thumbnail: '',
      capacity: 0,
      is_featured: false,
      status: 'upcoming',
      order: 0,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30">Online</Badge>;
      case 'offline':
        return <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">In-Person</Badge>;
      case 'hybrid':
        return <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30">Hybrid</Badge>;
      default:
        return <Badge variant="outline">{mode}</Badge>;
    }
  };

  return (
    <div className="py-8">
      <div className="w-full px-4 md:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Seminars
            </h1>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Manage your seminars and events
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Seminar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSeminar ? 'Edit Seminar' : 'New Seminar'}
                </DialogTitle>
                <DialogDescription>
                  {editingSeminar
                    ? 'Update the seminar details'
                    : 'Create a new seminar or event'}
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
                    <Label htmlFor="speaker">Speaker</Label>
                    <Input
                      id="speaker"
                      value={formData.speaker}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Room / Link"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>
                    <select
                      id="mode"
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                      className="w-full px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
                    >
                      <option value="online">Online</option>
                      <option value="offline">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seminar-status">Status</Label>
                    <select
                      id="seminar-status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
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
                  <Label htmlFor="registration_link">Registration Link</Label>
                  <Input
                    id="registration_link"
                    value={formData.registration_link}
                    onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    />
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
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {editingSeminar ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Seminars Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A227] mx-auto mb-4" />
            <p className="text-[#95A5A6]">Loading seminars...</p>
          </div>
        ) : seminars.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44]">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              No seminars yet
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-6">
              Create your first seminar to get started
            </p>
            <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#b8941f] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Seminar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seminars.map((seminar) => (
              <div
                key={seminar.id}
                className="bg-white dark:bg-[#16213E] rounded-xl border border-[#E8E4DC] dark:border-[#2D2D44] hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                {seminar.thumbnail ? (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={seminar.thumbnail}
                      alt={seminar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-[#C9A227]/20 to-[#9B59B6]/20 dark:from-[#C9A227]/10 dark:to-[#9B59B6]/10 flex items-center justify-center">
                    <Presentation className="h-16 w-16 text-[#C9A227]/40" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(seminar.status)}
                      {getModeBadge(seminar.mode)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(seminar)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteSeminarId(seminar.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                    {seminar.title}
                  </h3>

                  {seminar.description && (
                    <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-2">
                      {seminar.description}
                    </p>
                  )}

                  <div className="space-y-2 pt-4 border-t border-[#E8E4DC] dark:border-[#2D2D44]">
                    {seminar.speaker && (
                      <div className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8]">
                        🎙️ {seminar.speaker}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-[#95A5A6]">
                        {seminar.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(seminar.date).toLocaleDateString()}
                          </span>
                        )}
                        {seminar.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {seminar.venue}
                          </span>
                        )}
                      </div>
                      {seminar.registration_link && (
                        <a href={seminar.registration_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 text-[#C9A227]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteSeminarId} onOpenChange={() => setDeleteSeminarId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the seminar.
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
