import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/author/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    const success = await login(email, password);

    if (success) {
      navigate('/author/dashboard');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#1A1A2E] py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <BookOpen className="h-8 w-8 text-[#C9A227]" />
            <span className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8]">
              Resolution
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#2C3E50] dark:text-[#E8E8E8] mb-2">
            Author Portal
          </h1>
          <p className="text-[#5D6D7E] dark:text-[#B8B8B8]">
            Sign in to manage your content
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#16213E] rounded-xl shadow-sm border border-[#E8E4DC] dark:border-[#2D2D44] p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#95A5A6]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="author@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#95A5A6]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#95A5A6] hover:text-[#2C3E50] dark:hover:text-[#E8E8E8]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2C3E50] hover:bg-[#1a252f] dark:bg-[#C9A227] dark:hover:bg-[#b8941f] dark:text-[#1A1A2E]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-[#95A5A6] hover:text-[#C9A227] transition-colors"
          >
            ← Back to Resolution
          </Link>
        </div>
      </div>
    </div>
  );
};
