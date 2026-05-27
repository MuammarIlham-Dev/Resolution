import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUIStore, useAuthStore } from '@/stores';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/category/all', label: 'Categories' },
  { to: '/courses', label: 'Courses' },
  { to: '/seminars', label: 'Seminars' },
  { to: '/about', label: 'About' },
] as const;

const navLinkClass =
  'block py-3 text-base text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8] border-b border-[#E8E4DC] dark:border-[#2D2D44] last:border-0';

export const Header = () => {
  const { theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const closeSidebar = () => setMobileMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      closeSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[#FDFBF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDFBF7]/60 dark:bg-[#1A1A2E]/95 dark:border-[#2D2D44]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 h-16 flex items-center justify-between gap-3">
        {/* Menu + compact logo area (sm/md) */}
        <div className="flex items-center gap-2 lg:gap-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link
            to="/"
            className="flex items-center group shrink-0 py-2 transition-opacity hover:opacity-80 lg:ml-0"
          >
            <span className="hidden lg:inline font-serif text-xl lg:text-[22px] font-bold text-[#C9A227] leading-none">
              Conflict Resolution Institute
            </span>
            <span className="sr-only lg:hidden">Conflict Resolution Institute</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-[#2C3E50] hover:text-[#2C3E50] dark:text-[#E8E8E8] dark:hover:text-[#FFFFFF] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
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
                <Search className="h-4 w-4" />
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

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

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
        </div>
      </div>

      {/* Sidebar for sm and smaller (< md) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[min(100vw-3rem,20rem)] border-[#E8E4DC] bg-[#FDFBF7] dark:border-[#2D2D44] dark:bg-[#1A1A2E] p-0"
        >
          <SheetHeader className="border-b border-[#E8E4DC] px-6 py-5 text-left dark:border-[#2D2D44]">
            <SheetTitle className="font-serif text-lg font-bold text-[#C9A227] text-left">
              Conflict Resolution Institute
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col px-6 py-4">
            <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <nav className="flex flex-col">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={navLinkClass} onClick={closeSidebar}>
                  {label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/author/login"
                  className={navLinkClass}
                  onClick={closeSidebar}
                >
                  Author Login
                </Link>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
