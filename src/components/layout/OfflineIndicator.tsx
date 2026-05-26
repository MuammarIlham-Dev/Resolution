import { WifiOff } from 'lucide-react';
import { useOffline } from '@/hooks';

export const OfflineIndicator = () => {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#2C3E50] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-2">
      <WifiOff className="h-5 w-5" />
      <div>
        <p className="font-medium text-sm">You&apos;re offline</p>
        <p className="text-xs text-white/70">Some features may be limited</p>
      </div>
    </div>
  );
};
