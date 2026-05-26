import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostGrid } from '@/components/post/PostGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await postsApi.getPosts({ search: searchTerm, limit: 20 });
      if (response.success) {
        setPosts(response.data || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setPosts([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="w-full">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
            <Search className="h-8 w-8 text-[#C9A227]" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6">
            Search Stories
          </h1>

          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search by title, content, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-5 pr-14 text-lg bg-white dark:bg-[#16213E] border-[#E8E4DC] dark:border-[#2D2D44]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-[#95A5A6] hover:text-[#2C3E50] dark:hover:text-[#E8E8E8]"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C9A227] hover:bg-[#b8941f]"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner message="Searching..." />
        ) : hasSearched ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8]">
                Search Results
              </h2>
              <span className="text-[#95A5A6]">
                {posts.length} {posts.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
                  No results found
                </h3>
                <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
                  Try adjusting your search terms or browse our categories
                </p>
              </div>
            ) : (
              <PostGrid posts={posts} columns={3} />
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
              Start Searching
            </h3>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Enter keywords above to find stories that interest you
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
