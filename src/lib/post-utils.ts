import { sanitizePostHtml } from './sanitize';

/** URL-safe slug from title; mirrors DB generate_post_slug logic. */
export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'post';
}

/** Approximate reading time in minutes from HTML content. */
export function computeReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Escape special chars for PostgREST ilike patterns. */
export function escapeIlikePattern(term: string): string {
  return term.replace(/[%_\\,().]/g, (c) => `\\${c}`);
}

export type PostFormPayload = {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[] | string;
  status?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured?: boolean;
  allow_comments?: boolean;
  slug?: string;
};

/** Map editor form data to DB columns for posts insert/update. */
export function mapPostFormToDb(
  data: PostFormPayload,
  options?: { existingSlug?: string }
): Record<string, unknown> {
  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === 'string'
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  const content = sanitizePostHtml(data.content);
  const title = data.title.trim();
  const slug = data.slug?.trim() || options?.existingSlug || slugifyTitle(title);

  const row: Record<string, unknown> = {
    title,
    slug,
    content,
    excerpt: data.excerpt?.trim() || null,
    category_id: data.category || null,
    tags,
    status: data.status || 'draft',
    featured_image: data.featured_image?.trim() || null,
    meta_title: data.meta_title?.trim() || null,
    meta_description: data.meta_description?.trim() || null,
    is_featured: data.is_featured ?? false,
    allow_comments: data.allow_comments ?? true,
    reading_time: computeReadingTime(content),
  };

  if (row.status === 'published') {
    row.published_at = new Date().toISOString();
  }

  return row;
}
