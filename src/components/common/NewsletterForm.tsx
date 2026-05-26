import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsSubmitting(false);
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
        <CheckCircle className="h-5 w-5" />
        <span>Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#95A5A6]" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pl-10 bg-white dark:bg-[#16213E]"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#C9A227] hover:bg-[#b8941f] text-white"
      >
        {isSubmitting ? (
          'Subscribing...'
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Subscribe
          </>
        )}
      </Button>
    </form>
  );
};
