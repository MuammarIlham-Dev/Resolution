-- ============================================
-- RESOLUTION BLOG - COMPLETE SUPABASE SCHEMA
-- ============================================
-- This is the single, consolidated backend file.
-- It is fully IDEMPOTENT — safe to run multiple times.
-- All tables, policies, functions, triggers, indexes,
-- storage, realtime, and seed data are included.
-- ============================================

-- ============================================
-- 1. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================
-- 2. TABLES
-- ============================================

-- USERS TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar TEXT,
  bio TEXT,
  role TEXT DEFAULT 'author' CHECK (role IN ('admin', 'author')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📄',
  color TEXT DEFAULT '#2C3E50',
  post_count INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  views INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name TEXT DEFAULT 'Resolution',
  site_description TEXT,
  logo TEXT,
  favicon TEXT,
  primary_color TEXT DEFAULT '#2C3E50',
  accent_color TEXT DEFAULT '#C9A227',
  posts_per_page INTEGER DEFAULT 10,
  comments_per_page INTEGER DEFAULT 20,
  enable_comments BOOLEAN DEFAULT true,
  moderate_comments BOOLEAN DEFAULT true,
  social_links JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration TEXT,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  thumbnail TEXT,
  link TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEMINARS TABLE
CREATE TABLE IF NOT EXISTS seminars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  speaker TEXT,
  date DATE,
  time TIME,
  venue TEXT,
  mode TEXT DEFAULT 'online' CHECK (mode IN ('online', 'offline', 'hybrid')),
  registration_link TEXT,
  thumbnail TEXT,
  capacity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminars ENABLE ROW LEVEL SECURITY;


-- ============================================
-- 4. RLS POLICIES (with DROP IF EXISTS guards)
-- ============================================

-- ---- USERS POLICIES ----
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public can view author profiles" ON users;
DROP POLICY IF EXISTS "Anon can view active author profiles" ON users;
CREATE POLICY "Anon can view active author profiles" ON users
  FOR SELECT TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage users" ON users;
CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- CATEGORIES POLICIES ----
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins and authors can manage categories" ON categories;
CREATE POLICY "Admins and authors can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'author')
    )
  );

-- ---- POSTS POLICIES ----
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authors can view own posts" ON posts;
CREATE POLICY "Authors can view own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authors can create posts" ON posts;
CREATE POLICY "Authors can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own posts" ON posts;
CREATE POLICY "Authors can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete own posts" ON posts;
CREATE POLICY "Authors can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can manage all posts" ON posts;
CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- COMMENTS POLICIES ----
DROP POLICY IF EXISTS "Anyone can view approved comments" ON comments;
CREATE POLICY "Anyone can view approved comments" ON comments
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can create comments" ON comments;
CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and authors can moderate comments" ON comments;
CREATE POLICY "Admins and authors can moderate comments" ON comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'author')
    )
  );

-- ---- SETTINGS POLICIES ----
DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
DROP POLICY IF EXISTS "Admins can view settings" ON settings;
CREATE POLICY "Admins can view settings" ON settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update settings" ON settings;
CREATE POLICY "Only admins can update settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- COURSES POLICIES ----
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins and authors can manage courses" ON courses;
CREATE POLICY "Admins and authors can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'author')
    )
  );

-- ---- SEMINARS POLICIES ----
DROP POLICY IF EXISTS "Anyone can view seminars" ON seminars;
CREATE POLICY "Anyone can view seminars" ON seminars
  FOR SELECT USING (status != 'cancelled');

DROP POLICY IF EXISTS "Admins and authors can manage seminars" ON seminars;
CREATE POLICY "Admins and authors can manage seminars" ON seminars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'author')
    )
  );


-- ============================================
-- 5. FUNCTIONS (CREATE OR REPLACE = safe)
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup (auto-profile sync; role always author)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, display_name, avatar, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'author'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prevent non-admins from changing their role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- URL-safe slug from title
CREATE OR REPLACE FUNCTION public.generate_post_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := lower(trim(regexp_replace(regexp_replace(title, '[^\w\s-]', '', 'g'), '[\s_]+', '-', 'g')));
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'post';
  END IF;
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Reading time from HTML content
CREATE OR REPLACE FUNCTION public.calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
BEGIN
  word_count := array_length(
    regexp_split_to_array(regexp_replace(COALESCE(content, ''), '<[^>]+>', ' ', 'g'), '\s+'),
    1
  );
  IF word_count IS NULL OR word_count < 1 THEN
    RETURN 1;
  END IF;
  RETURN GREATEST(1, CEIL(word_count::numeric / 200));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto slug + reading time on posts
CREATE OR REPLACE FUNCTION public.posts_before_insert_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
    NEW.slug := public.generate_post_slug(NEW.title);
  END IF;
  NEW.reading_time := public.calculate_reading_time(NEW.content);
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
    IF NEW.published_at IS NULL THEN
      NEW.published_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comment spam rate limit (5 per email per hour)
CREATE OR REPLACE FUNCTION public.check_comment_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.comments
  WHERE author_email = NEW.author_email
    AND created_at > NOW() - INTERVAL '1 hour';
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Comment rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Full-text search on posts
CREATE OR REPLACE FUNCTION public.search_posts(
  search_query TEXT,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID,
  category_id UUID,
  tags TEXT[],
  status TEXT,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  views INTEGER,
  reading_time INTEGER,
  is_featured BOOLEAN,
  allow_comments BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT
) AS $$
DECLARE
  ts_query tsquery;
  offset_val INTEGER;
BEGIN
  ts_query := plainto_tsquery('english', COALESCE(search_query, ''));
  offset_val := GREATEST(0, (page_num - 1) * page_size);
  RETURN QUERY
  WITH matched AS (
    SELECT p.*, COUNT(*) OVER() AS cnt
    FROM posts p
    WHERE p.status = 'published'
      AND p.search_vector @@ ts_query
    ORDER BY ts_rank(p.search_vector, ts_query) DESC, p.created_at DESC
    OFFSET offset_val
    LIMIT page_size
  )
  SELECT
    m.id, m.title, m.slug, m.excerpt, m.content, m.featured_image,
    m.author_id, m.category_id, m.tags, m.status, m.published_at,
    m.meta_title, m.meta_description, m.views, m.reading_time,
    m.is_featured, m.allow_comments, m.created_at, m.updated_at, m.cnt
  FROM matched m;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update post_count on categories
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'published' AND NEW.status = 'published' THEN
      UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    ELSIF OLD.status = 'published' AND NEW.status != 'published' THEN
      UPDATE categories SET post_count = post_count - 1 WHERE id = NEW.category_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- 6. TRIGGERS (DROP IF EXISTS + CREATE)
-- ============================================

-- updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seminars_updated_at ON seminars;
CREATE TRIGGER update_seminars_updated_at BEFORE UPDATE ON seminars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auth user created -> auto profile sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Post count tracking
DROP TRIGGER IF EXISTS update_post_count ON posts;
CREATE TRIGGER update_post_count AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- Role escalation guard
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON users;
CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Post slug + reading time
DROP TRIGGER IF EXISTS posts_before_insert_update_trigger ON posts;
CREATE TRIGGER posts_before_insert_update_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_before_insert_update();

-- Comment rate limit
DROP TRIGGER IF EXISTS check_comment_rate_limit_trigger ON comments;
CREATE TRIGGER check_comment_rate_limit_trigger
  BEFORE INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION public.check_comment_rate_limit();


-- ============================================
-- 6b. PUBLIC VIEWS (safe columns for anon)
-- ============================================
CREATE OR REPLACE VIEW public_site_settings AS
SELECT
  site_name,
  site_description,
  logo,
  favicon,
  primary_color,
  accent_color,
  social_links,
  enable_comments,
  posts_per_page,
  comments_per_page
FROM settings
ORDER BY updated_at DESC
LIMIT 1;

GRANT SELECT ON public_site_settings TO anon, authenticated;

-- Column-level grants: hide user email from anonymous clients
GRANT SELECT (id, username, display_name, avatar, bio) ON users TO anon;

GRANT EXECUTE ON FUNCTION public.search_posts(TEXT, INTEGER, INTEGER) TO anon, authenticated;

-- Increment view count (public readers cannot UPDATE posts directly)
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = post_id AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.increment_post_views(UUID) TO anon, authenticated;


-- ============================================
-- 7. INDEXES (IF NOT EXISTS = safe)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured) WHERE is_featured = true;

-- Full-text search vector (add column if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE posts ADD COLUMN search_vector tsvector;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.posts_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', regexp_replace(COALESCE(NEW.content, ''), '<[^>]+>', ' ', 'g')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_search_vector_trigger ON posts;
CREATE TRIGGER posts_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, excerpt, content ON posts
  FOR EACH ROW EXECUTE FUNCTION public.posts_search_vector_update();

CREATE INDEX IF NOT EXISTS idx_posts_search_vector ON posts USING GIN (search_vector);

-- Backfill search vectors
UPDATE posts SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', regexp_replace(COALESCE(content, ''), '<[^>]+>', ' ', 'g')), 'C')
WHERE search_vector IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_seminars_status ON seminars(status);
CREATE INDEX IF NOT EXISTS idx_seminars_date ON seminars(date);
CREATE INDEX IF NOT EXISTS idx_seminars_featured ON seminars(is_featured) WHERE is_featured = true;


-- ============================================
-- 8. STORAGE BUCKETS & POLICIES
-- ============================================

-- Create storage buckets (ON CONFLICT = safe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true),
       ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (DROP IF EXISTS guards)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'posts'));

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Authors can upload post images" ON storage.objects;
CREATE POLICY "Authors can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'author')
    )
  );


-- ============================================
-- 9. REAL-TIME PUBLICATION
-- ============================================
-- Safely add tables to realtime (no-op if already added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
  END IF;
END $$;


-- ============================================
-- 10. SEED DATA (ON CONFLICT = safe)
-- ============================================

-- Default settings (single row; idempotent)
INSERT INTO settings (id, site_name, site_description)
SELECT uuid_generate_v4(), 'Resolution', 'A collection of thoughts, stories, and insights'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

-- Default categories
INSERT INTO categories (name, slug, description, icon, color, "order") VALUES
  ('General', 'general', 'General topics and miscellaneous content', '📝', '#2C3E50', 1),
  ('Technology', 'technology', 'Tech news, tutorials, and insights', '💻', '#3498DB', 2),
  ('Lifestyle', 'lifestyle', 'Life tips, habits, and wellness', '🌿', '#27AE60', 3),
  ('Creative', 'creative', 'Stories, poetry, and creative writing', '✨', '#9B59B6', 4)
ON CONFLICT (slug) DO NOTHING;


-- ============================================
-- ✅ DONE — Schema is fully deployed.
-- You can safely re-run this entire file at any time.
-- ============================================
