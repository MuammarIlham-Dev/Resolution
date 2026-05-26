import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#95A5A6] mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => window.open(shareUrls.facebook, '_blank', 'width=600,height=400')}
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={() => window.open(shareUrls.linkedin, '_blank', 'width=600,height=400')}
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full"
        onClick={copyLink}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};
