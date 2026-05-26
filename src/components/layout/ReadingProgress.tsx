import { useReadingProgress } from '@/hooks';

export const ReadingProgress = () => {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
