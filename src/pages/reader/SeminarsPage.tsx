import { useEffect, useState } from 'react';
import { Presentation, Calendar, MapPin, User, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { seminarsApi } from '@/lib/api';
import type { Seminar } from '@/types';

export const SeminarsPage = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setIsLoading(true);
      const response = await seminarsApi.getPublishedSeminars();
      if (response.success) {
        setSeminars(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seminar.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seminar.speaker || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seminar.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500 text-white">Ongoing</Badge>;
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-[#FDFBF7] to-[#F1F0EC] dark:from-[#1A1A2E] dark:to-[#12122b]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
            <Presentation className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm text-[#C9A227] font-medium">
              Events & Talks
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 leading-tight">
            Our <span className="text-[#C9A227]">Seminars</span>
          </h1>
          <p className="text-lg md:text-xl text-[#5D6D7E] dark:text-[#B8B8B8] max-w-2xl mx-auto leading-relaxed">
            Join our expert-led seminars and events to deepen your understanding.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-[#16213E]">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#95A5A6]" />
              <Input
                placeholder="Search seminars..."
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
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Seminars Grid */}
          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner message="Loading seminars..." />
            </div>
          ) : filteredSeminars.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎤</div>
              <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                No seminars found
              </h3>
              <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                {searchQuery ? 'Try adjusting your search or filters' : 'Seminars will be announced soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSeminars.map((seminar) => (
                <div
                  key={seminar.id}
                  className="group bg-white dark:bg-[#1A1A2E] rounded-2xl border border-[#E8E4DC] dark:border-[#2D2D44] hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  {seminar.thumbnail ? (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={seminar.thumbnail}
                        alt={seminar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-[#C9A227]/20 to-[#9B59B6]/20 dark:from-[#C9A227]/10 dark:to-[#9B59B6]/10 flex items-center justify-center">
                      <Presentation className="h-20 w-20 text-[#C9A227]/30 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {getStatusBadge(seminar.status)}
                      {getModeBadge(seminar.mode)}
                      {seminar.is_featured && (
                        <Badge className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30">⭐ Featured</Badge>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-3 group-hover:text-[#C9A227] transition-colors">
                      {seminar.title}
                    </h3>

                    {seminar.description && (
                      <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-3 text-sm leading-relaxed">
                        {seminar.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 text-sm text-[#95A5A6]">
                      {seminar.speaker && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {seminar.speaker}
                        </div>
                      )}
                      {seminar.date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(seminar.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          {seminar.time && ` at ${seminar.time}`}
                        </div>
                      )}
                      {seminar.venue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {seminar.venue}
                        </div>
                      )}
                      {seminar.capacity > 0 && (
                        <div className="text-xs text-[#95A5A6]/70">
                          Capacity: {seminar.capacity} seats
                        </div>
                      )}
                    </div>

                    {seminar.registration_link && seminar.status !== 'completed' && seminar.status !== 'cancelled' && (
                      <a
                        href={seminar.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#2C3E50] hover:bg-[#1a252f] dark:bg-[#C9A227] dark:hover:bg-[#b8941f] dark:text-[#1A1A2E]">
                          Register Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
