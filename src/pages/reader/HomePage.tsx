import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/PostCard';
import { PostGrid } from '@/components/post/PostGrid';
import { CategoryList } from '@/components/category/CategoryList';
import { NewsletterForm } from '@/components/common/NewsletterForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { usePostStore } from '@/stores';

export const HomePage = () => {
  const {
    posts,
    featuredPosts,
    categories,
    isLoading,
    fetchPosts,
    fetchFeaturedPosts,
    fetchCategories,
  } = usePostStore();

  useEffect(() => {
    fetchPosts({ limit: 6, publishedOnly: true });
    fetchFeaturedPosts();
    fetchCategories();
  }, []);

  const featuredPost = featuredPosts[0];
  const latestPosts = posts.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-40 md:pt-20 md:pb-64 bg-gradient-to-b from-[#FDFBF7] to-[#F1F0EC] dark:from-[#1A1A2E] dark:to-[#12122b] overflow-hidden">
        <div className="relative z-10">
          <div className="text-center max-w-3xl lg:max-w-5xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227]/10 dark:bg-[#C9A227]/20 rounded-full mb-6">
              {/*<Sparkles className="h-4 w-4 text-[#C9A227]" />*/}
              <span className="text-sm text-[#C9A227] font-medium">
                Welcome to Conflict Resolution Institute
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-6 leading-tight">
              A Collection of
              <span className="text-[#C9A227]"> Thoughts</span>,
              <br />
              Researches & Insights
            </h1>
            <p className="text-lg md:text-xl xl:text-2xl text-[#5D6D7E] dark:text-[#B8B8B8] mb-8 max-w-2xl xl:max-w-4xl mx-auto leading-relaxed">
              Discover a world of ideas, narratives, and perspectives.
              Conflict Resolution Institute is your digital sanctuary for meaningful reading.
            </p>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4">
              <Link to="/category/all" className="w-full lg:w-auto">
                <Button
                  size="lg"
                  className="w-full lg:w-auto bg-[#2C3E50] hover:bg-[#1a252f] dark:bg-[#C9A227] dark:hover:bg-[#b8941f] dark:text-[#1A1A2E] px-6 py-4 text-base md:px-8 md:py-6 md:text-lg"
                >
                  Explore Categories
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about" className="w-full lg:w-auto">
                <Button variant="outline" size="lg" className="w-full lg:w-auto px-6 py-4 text-base md:px-8 md:py-6 md:text-lg border-[#2C3E50] text-[#2C3E50] dark:border-[#C9A227] dark:text-[#C9A227]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-0">
              <div className="flex items-center justify-center gap-2 mb-10">
                <Sparkles className="h-6 w-6 text-[#C9A227]" />
                <h2 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
                  Featured Story
                </h2>
              </div>
              <PostCard post={featuredPost} featured />
            </div>
          )}
        </div>

        {/* Cinematic SVG Partition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[300%] h-[100px] md:h-[180px] animate-wave-fast"
            viewBox="0 0 3600 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C400,0 800,120 1200,60 C1600,0 2000,120 2400,60 C2800,0 3200,120 3600,60 V120 H0 Z"
              className="fill-white dark:fill-[#16213E]"
              style={{
                filter: 'drop-shadow(0 -5px 15px rgba(201, 162, 39, 0.4))'
              }}
            />
          </svg>
        </div>

        {/* Centerpiece Partition Emblem */}
        <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#16213E] border border-[#C9A227]/30 flex items-center justify-center shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
          </div>
          <div className="h-20 w-px bg-gradient-to-b from-[#C9A227] to-transparent" />
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="relative pt-0 pb-32 md:pt-0 md:pb-64 bg-white dark:bg-[#16213E] overflow-hidden">
        <div className="w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-[#5D6D7E] dark:text-[#B8B8B8] max-w-2xl mx-auto">
              Fresh perspectives and new narratives from our digital sanctuary.
            </p>
          </div>

          {isLoading ? (
            <div className="py-20">
              <LoadingSpinner message="Loading stories..." />
            </div>
          ) : (
            <PostGrid posts={latestPosts} columns={3} />
          )}

          <div className="mt-16 mb-24 text-center">
            <Link to="/category/all">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white dark:border-[#C9A227] dark:text-[#C9A227] dark:hover:bg-[#C9A227] dark:hover:text-[#1A1A2E] transition-all">
                View All Stories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Cinematic SVG Partition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[300%] h-[100px] md:h-[180px] animate-wave-fast"
            viewBox="0 0 3600 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C400,0 800,120 1200,60 C1600,0 2000,120 2400,60 C2800,0 3200,120 3600,60 V120 H0 Z"
              className="fill-[#FDFBF7] dark:fill-[#1A1A2E]"
              style={{
                filter: 'drop-shadow(0 -5px 15px rgba(201, 162, 39, 0.4))'
              }}
            />
          </svg>
        </div>

        {/* Centerpiece Partition Emblem */}
        <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FDFBF7] dark:bg-[#1A1A2E] border border-[#C9A227]/30 flex items-center justify-center shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
          </div>
          <div className="h-20 w-px bg-gradient-to-b from-[#C9A227] to-transparent" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="pt-0 pb-12 md:pt-0 md:pb-20 bg-[#FDFBF7] dark:bg-[#1A1A2E] relative overflow-hidden">
        <div className="relative z-10 pb-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-4">
              Browse by Category
            </h2>
            <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
              Explore our content organized by themes and topics
            </p>
          </div>

          <CategoryList categories={categories.slice(0, 6)} isLoading={isLoading} />
        </div>
      </section>

      {/* Another Divider if needed, or simple space */}


      {/* Newsletter Section */}
      <section className="pt-6 pb-6 bg-white dark:bg-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 paper-texture opacity-5 pointer-events-none" />
        <div className="w-full relative z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-12 rounded-2xl border border-[#C9A227] bg-[#2C3E50] dark:bg-[#1A1A2E] backdrop-blur-sm shadow-[0_0_50px_rgba(201,162,39,0.1)]">
              {/* Internal decorative border */}
              <div className="absolute inset-2 rounded-[calc(1rem-2px)] border border-[#C9A227]/10 pointer-events-none" />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                  Stay in the Loop
                </h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  Subscribe to our newsletter and never miss a new story.
                  Get the latest posts delivered straight to your inbox.
                </p>
                <div className="max-w-md mx-auto">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
