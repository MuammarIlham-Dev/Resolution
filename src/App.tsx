import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OfflineIndicator } from '@/components/layout/OfflineIndicator';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/stores';

// Reader Pages
import { HomePage } from '@/pages/reader/HomePage';
import { CategoryPage } from '@/pages/reader/CategoryPage';
import { PostPage } from '@/pages/reader/PostPage';
import { SearchPage } from '@/pages/reader/SearchPage';
import { AboutPage } from '@/pages/reader/AboutPage';
import { CoursesPage } from '@/pages/reader/CoursesPage';
import { SeminarsPage } from '@/pages/reader/SeminarsPage';

// Author Pages
import { LoginPage } from '@/pages/author/LoginPage';
import { DashboardPage } from '@/pages/author/DashboardPage';
import { PostsPage } from '@/pages/author/PostsPage';
import { EditPostPage } from '@/pages/author/EditPostPage';
import { CategoriesPage } from '@/pages/author/CategoriesPage';
import { CommentsPage } from '@/pages/author/CommentsPage';
import { CoursesPage as AuthorCoursesPage } from '@/pages/author/CoursesPage';
import { SeminarsPage as AuthorSeminarsPage } from '@/pages/author/SeminarsPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#C9A227] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/author/login" replace />;
  }

  return <>{children}</>;
};

// Public Layout
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#1A1A2E]">
    <Header />
    <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 xl:px-8">{children}</main>
    <Footer />
    <OfflineIndicator />
  </div>
);

import { AuthorHeader } from '@/components/layout/AuthorHeader';

// Author Layout
const AuthorLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1A2E] flex flex-col">
      {isAuthenticated && <AuthorHeader />}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 xl:px-8">
        {children}
      </main>
      <OfflineIndicator />
    </div>
  );
};

function App() {
  const { theme } = useUIStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <PublicLayout>
              <CategoryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/post/:slug"
          element={
            <PublicLayout>
              <PostPage />
            </PublicLayout>
          }
        />
        <Route
          path="/search"
          element={
            <PublicLayout>
              <SearchPage />
            </PublicLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <PublicLayout>
              <CoursesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/seminars"
          element={
            <PublicLayout>
              <SeminarsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />

        {/* Author Routes */}
        <Route
          path="/author/login"
          element={<LoginPage />}
        />
        <Route
          path="/author/dashboard"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <DashboardPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/posts"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <PostsPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/posts/new"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <EditPostPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/posts/:id/edit"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <EditPostPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/categories"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <CategoriesPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/courses"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <AuthorCoursesPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/seminars"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <AuthorSeminarsPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/comments"
          element={
            <ProtectedRoute>
              <AuthorLayout>
                <CommentsPage />
              </AuthorLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
