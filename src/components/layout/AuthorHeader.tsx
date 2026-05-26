import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, LayoutDashboard, FileText, FolderTree, MessageSquare, GraduationCap, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore, useAuthStore } from '@/stores';

export const AuthorHeader = () => {
    const { theme, toggleTheme } = useUIStore();
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/author/login');
    };

    const navLinks = [
        { to: '/author/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/author/posts', icon: FileText, label: 'Posts' },
        { to: '/author/categories', icon: FolderTree, label: 'Categories' },
        { to: '/author/courses', icon: GraduationCap, label: 'Courses' },
        { to: '/author/seminars', icon: Presentation, label: 'Seminars' },
        { to: '/author/comments', icon: MessageSquare, label: 'Comments' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[#FDFBF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FDFBF7]/60 dark:bg-[#1A1A2E]/95 dark:border-[#2D2D44]">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-8 xl:gap-12">
                    <Link to="/" className="flex items-center group shrink-0 py-2 transition-opacity hover:opacity-80">
                        <div className="flex flex-col justify-center">
                            <div className="flex items-baseline flex-wrap gap-x-1.5 leading-none">
                                <span className="font-serif text-lg sm:text-xl font-bold text-[#C9A227]">
                                    Peace-building
                                </span>
                                <span className="font-serif hidden sm:inline text-sm text-[#2C3E50] dark:text-[#E8E8E8]">
                                    and Conflict Resolution
                                </span>
                            </div>
                            <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] text-[#C9A227] font-medium uppercase mt-1">
                                Institute
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#5D6D7E] hover:text-[#2C3E50] dark:text-[#B8B8B8] dark:hover:text-[#E8E8E8] transition-colors rounded-md hover:bg-[#E8E4DC]/20 dark:hover:bg-[#2D2D44]/40"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* User Info */}
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs font-medium text-[#2C3E50] dark:text-[#E8E8E8]">
                            {user?.display_name || user?.username}
                        </span>
                        <span className="text-[10px] text-[#95A5A6] uppercase tracking-wider">
                            {user?.role}
                        </span>
                    </div>

                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Logout */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        title="Logout"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation (Scrollable list for small screens) */}
            <div className="md:hidden border-t border-[#E8E4DC] dark:border-[#2D2D44] bg-[#FDFBF7]/50 dark:bg-[#1A1A2E]/50 overflow-x-auto">
                <div className="flex items-center px-4 md:px-6 py-2 gap-4 min-w-max">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="flex items-center gap-1.5 text-xs font-medium text-[#5D6D7E] dark:text-[#B8B8B8] whitespace-nowrap"
                        >
                            <link.icon className="h-3.5 w-3.5" />
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};
