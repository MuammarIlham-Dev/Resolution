import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore, useAuthStore } from '@/stores';
import { useState } from 'react';

export const Header = () => {
  const { theme, toggleTheme, mobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[#FDFBF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDFBF7]/60 dark:bg-[#1A1A2E]/95 dark:border-[#2D2D44]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group shrink-0 py-2 transition-opacity hover:opacity-80">

          <div className="flex items-baseline flex-wrap gap-x-1.5 leading-none">
            <span className="font-serif text-xl lg:text-[22px] font-bold text-[#C9A227]">
              Peace-building and Conflict Resolution Institute
            </span>
          </div>
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/category/all"
            className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/courses"
            className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
          >
            Courses
          </Link>
          <Link
            to="/seminars"
            className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
          >
            Seminars
          </Link>
          <Link
            to="/about"
            className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-9"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Author Link */}
          {isAuthenticated ? (
            <Link to="/author/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/author/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                Author Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E4DC] dark:border-[#2D2D44] bg-[#FDFBF7] dark:bg-[#1A1A2E]">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Link
              to="/"
              className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/category/all"
              className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
              onClick={toggleMobileMenu}
            >
              Categories
            </Link>
            <Link
              to="/courses"
              className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
              onClick={toggleMobileMenu}
            >
              Courses
            </Link>
            <Link
              to="/seminars"
              className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
              onClick={toggleMobileMenu}
            >
              Seminars
            </Link>
            <Link
              to="/about"
              className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link
                to="/author/login"
                className="py-2 text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8]"
                onClick={toggleMobileMenu}
              >
                Author Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
