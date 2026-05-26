import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner = ({ size = 'md', message }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <BookOpen className={`${sizes[size]} text-[#C9A227] animate-pulse`} />
        <div className="absolute inset-0 animate-spin">
          <div className="h-full w-full border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full" />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-[#5D6D7E] dark:text-[#B8B8B8] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
