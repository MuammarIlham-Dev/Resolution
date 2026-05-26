# Resolution Blog - Supabase Setup Guide

This guide will help you set up Supabase as the backend for the Resolution blog.

### ⚡ Existing Users: Apply Security Patch
If you already deployed an older schema, run [supabase-security-patch.sql](supabase-security-patch.sql) in the SQL Editor, then re-run the full [supabase-schema.sql](supabase-schema.sql) (idempotent) to apply RLS, FTS search, rate limits, and views.

## 🚀 Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter your project details:
   - Name: `resolution-blog`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Click "Create New Project"

### 2. Get Your API Keys

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **URL**: `https://your-project.supabase.co`
   - **anon/public** key: `eyJhbGciOiJIUzI1NiIs...`

### 3. Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run"

This will create all tables, indexes, triggers, and policies.

### 5. Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - Confirm email: Disabled (for easier testing)
   - Secure email change: Enabled
   - Mailer OTP Expiration: 3600

### 6. Create Your First Author Account

You can create a user directly via the Supabase Dashboard:

1.  Go to **Authentication** → **Users**
2.  Click **Add User** → **Create new user**
3.  Enter the email and password
4.  Toggle **Auto-confirm User** to **ON** (to avoid needing email provider setup)
5.  Click **Create User**

> [!NOTE]
> Thanks to the `on_auth_user_created` trigger in our schema, a corresponding entry in the `users` (profile) table will be created automatically.

### 7. Enable Profile Sync and Real-time

To automate user profile creation and enable live comment updates, run the SQL found in [supabase-extras.sql](file:///c:/Users/Lenovo/Downloads/Resolution/Resolution/app/supabase-extras.sql) in your Supabase SQL Editor.

This script performs two critical tasks:
1.  **Auth Sync**: Automatically creates a record in the `users` table when you add a user in **Authentication** → **Users**.
2.  **Real-time**: Enables the comments section to update instantly for readers.

## 📊 Database Schema

### Tables Created

| Table | Description |
|-------|-------------|
| `users` | Extended user profiles (linked to auth.users) |
| `categories` | Blog categories with icons and colors |
| `posts` | Blog posts with full content |
| `comments` | User comments with moderation |
| `courses` | Educational courses with levels and instructors |
| `seminars` | Seminars and events with scheduling |
| `settings` | Site-wide configuration |

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public users**: Can read published posts, approved comments, active categories
- **Authenticated authors**: Can create posts, manage their own content
- **Admins**: Full access to all resources

## 🔧 Features

### Authentication
- Email/password authentication via Supabase Auth
- JWT tokens handled automatically
- User profiles extended in `users` table

### Database Features
- Automatic slug generation
- Reading time calculation
- Post count tracking per category
- Comment threading (nested replies)
- Full-text search on posts

### Real-time (Optional)
To enable real-time updates for comments:

1. Go to **Database** → **Replication**
2. Enable real-time for the `comments` table

## 📱 API Usage

The frontend uses the Supabase client directly:

```typescript
import { supabase } from '@/lib/supabase';
import { postsApi, categoriesApi, commentsApi } from '@/lib/supabase-api';

// Fetch posts
const { data: posts } = await postsApi.getPosts({ limit: 10 });

// Create post (authenticated)
const newPost = await postsApi.createPost({
  title: 'My Post',
  content: '<p>Content here</p>',
  category: 'category-uuid'
});
```

## 🛠️ Customization

### Adding Social Login

1. Go to **Authentication** → **Providers**
2. Enable providers like Google, GitHub, etc.
3. Add credentials from each provider
4. Update the `social_links` column in settings

### Storage for Images

To enable image uploads:

1. Go to **Storage** → **New Bucket**
2. Create bucket: `blog-images`
3. Set public access policy
4. Update the upload logic in the frontend

## 🔒 Security Notes

1. **Never** expose the `service_role` key in frontend code
2. Use RLS policies to control data access
3. Enable email confirmation for production
4. Set up proper CORS in Supabase settings

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check your `VITE_SUPABASE_URL` is correct
- Ensure CORS is configured in Supabase

### RLS policy errors
- Verify you're authenticated before making write requests
- Check that your user has the correct role

### Missing data
- Run the schema SQL again to ensure all tables exist
- Check the Supabase logs for errors

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 You're Done!

Your Resolution blog is now powered by Supabase! The frontend will automatically connect to your Supabase project and all CRUD operations will work through the Supabase client.
