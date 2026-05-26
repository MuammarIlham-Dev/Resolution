import type { Category } from '@/types';
import { CategoryCard } from './CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryListProps {
  categories: Category[];
  isLoading?: boolean;
}

export const CategoryList = ({ categories, isLoading = false }: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-12 relative flex flex-col items-center text-center"
          >
            <div
              className="absolute inset-0 bg-[#C9A227]/5 animate-blob-morph -z-0"
              style={{ borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%' }}
            />
            <Skeleton
              className="h-20 w-20 mb-6 animate-blob-morph relative z-10"
              style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
            />
            <Skeleton className="h-8 w-32 mb-4 relative z-10" />
            <Skeleton className="h-4 w-48 mb-2 relative z-10" />
            <Skeleton className="h-4 w-24 relative z-10" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="font-serif text-xl font-semibold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
          No categories yet
        </h3>
        <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
          Categories will appear here once created
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};
