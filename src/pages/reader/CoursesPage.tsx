import { useEffect, useState } from 'react';
import { GraduationCap, Clock, User, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { coursesApi } from '@/lib/api';
import type { Course } from '@/types';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await coursesApi.getPublishedCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-[#FDFBF7] to-[#F1F0EC] dark:from-[#1A1A2E] dark:to-[#12122b]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
            <GraduationCap className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm text-[#C9A227] font-medium">
              Knowledge Hub
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 leading-tight">
            Our <span className="text-[#C9A227]">Courses</span>
          </h1>
          <p className="text-lg md:text-xl text-[#2C3E50] dark:text-[#E8E8E8] max-w-3xl mx-auto mb-2 leading-relaxed">
            <strong className="text-[#2C3E50] dark:text-[#E8E8E8]">One-month Course Schedule</strong>{' '}          
          </p>
          <p className="text-lg md:text-xl text-[#2C3E50] dark:text-[#E8E8E8] max-w-3xl mx-auto mb-2 leading-relaxed">
            Classes are typically arranged on <strong className="text-[#2C3E50] dark:text-[#E8E8E8]">Fridays & Saturdays</strong>{' '}
            (20 hours total).
          </p>
          <p className="text-lg md:text-xl text-[#2C3E50] dark:text-[#E8E8E8] max-w-3xl mx-auto leading-relaxed">
            Expand your knowledge with our curated collection of educational courses.
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
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#95A5A6]" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border border-[#E8E4DC] dark:border-[#2D2D44] rounded-md bg-white dark:bg-[#16213E] text-[#2C3E50] dark:text-[#E8E8E8]"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner message="Loading courses..." />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                No courses found
              </h3>
              <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                {searchQuery ? 'Try adjusting your search or filters' : 'Courses will be available soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white dark:bg-[#1A1A2E] rounded-2xl border border-[#E8E4DC] dark:border-[#2D2D44] hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  {course.thumbnail ? (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-[#C9A227]/20 to-[#2C3E50]/20 dark:from-[#C9A227]/10 dark:to-[#2C3E50]/10 flex items-center justify-center">
                      <GraduationCap className="h-20 w-20 text-[#C9A227]/30 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {getLevelBadge(course.level)}
                      {course.is_featured && (
                        <Badge className="bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/30">⭐ Featured</Badge>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-3 group-hover:text-[#C9A227] transition-colors">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-[#5D6D7E] dark:text-[#B8B8B8] mb-4 line-clamp-3 text-sm leading-relaxed">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-[#95A5A6] mb-4">
                      {course.instructor && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {course.instructor}
                        </span>
                      )}
                      {course.duration && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration}
                        </span>
                      )}
                    </div>

                    {course.link && (
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#2C3E50] hover:bg-[#1a252f] dark:bg-[#C9A227] dark:hover:bg-[#b8941f] dark:text-[#1A1A2E]">
                          View Course
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
