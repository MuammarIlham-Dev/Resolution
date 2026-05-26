import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative block rounded-2xl bg-white dark:bg-[#1e1e38] px-6 py-5 transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(201,162,39,0.18)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_12px_40px_rgba(201,162,39,0.25)] border border-[#E8E4DC]/60 dark:border-[#2D2D44]/60 overflow-hidden"
    >
      {/* Subtle colored accent bar on left */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1 transition-all duration-500 group-hover:w-1.5"
        style={{ backgroundColor: category.color }}
      />

      <div className="relative z-10 flex items-center gap-5">
        <div
          className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: `${category.color}18`,
            border: `1px solid ${category.color}30`,
          }}
        >
          {category.icon || '📄'}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-bold text-[#2C3E50] dark:text-[#E8E8E8] group-hover:text-[#C9A227] transition-colors duration-300">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-sm text-[#5D6D7E] dark:text-[#B8B8B8] line-clamp-1 leading-relaxed mt-0.5">
              {category.description}
            </p>
          )}
        </div>

        <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
      </div>
    </Link>
  );
};
