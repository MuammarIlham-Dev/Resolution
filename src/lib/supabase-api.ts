import { supabase } from './supabase';
import type { ApiResponse, CommentFormData } from '@/types';
import { POST_LIST_SELECT, POST_DETAIL_SELECT } from './api-constants';
import { mapPostFormToDb, escapeIlikePattern } from './post-utils';
import { sanitizeCommentText } from './sanitize';

const handleResponse = <T>(data: T | null, error: { message: string } | null): ApiResponse<T> => {
    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }
    return {
        success: true,
        data: data as T,
    };
};

export const authApi = {
    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return handleResponse(null, error);

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (userError) return handleResponse(null, userError);
        if (user && user.is_active === false) {
            await supabase.auth.signOut();
            return handleResponse(null, { message: 'Account is deactivated' });
        }

        return handleResponse({ user }, null);
    },
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return handleResponse(null, error);
        return { success: true };
    },
    getMe: async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return { success: false, error: 'Not authenticated' };

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (error) return handleResponse(null, error);
        if (profile?.is_active === false) {
            await supabase.auth.signOut();
            return { success: false, error: 'Account is deactivated' };
        }

        return handleResponse({ user: profile }, null);
    },
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) return handleResponse(null, error);
        return handleResponse({ session }, null);
    },
};

export const postsApi = {
    getPosts: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        status?: string;
        publishedOnly?: boolean;
    }) => {
        if (params?.search?.trim()) {
            return postsApi.searchPosts(params.search.trim(), params.page, params.limit);
        }

        let query = supabase
            .from('posts')
            .select(POST_LIST_SELECT, { count: 'exact' });

        if (params?.category) query = query.eq('category_id', params.category);
        if (params?.status) query = query.eq('status', params.status);
        else if (params?.publishedOnly) query = query.eq('status', 'published');

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        const response = handleResponse(data, error);
        if (response.success && count !== null) {
            response.meta = {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            };
        }
        return response;
    },

    searchPosts: async (searchQuery: string, page = 1, limit = 20) => {
        const { data, error } = await supabase.rpc('search_posts', {
            search_query: searchQuery,
            page_num: page,
            page_size: limit,
        });

        if (error) {
            const escaped = escapeIlikePattern(searchQuery);
            let query = supabase
                .from('posts')
                .select(POST_LIST_SELECT, { count: 'exact' })
                .eq('status', 'published')
                .or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`);

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            const fallback = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            const response = handleResponse(fallback.data, fallback.error);
            if (response.success && fallback.count !== null) {
                response.meta = {
                    page,
                    limit,
                    total: fallback.count,
                    totalPages: Math.ceil(fallback.count / limit),
                };
            }
            return response;
        }

        const rows = (data || []) as Array<Record<string, unknown>>;
        const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
        const posts = rows.map(({ total_count: _tc, ...post }) => post);

        const response = handleResponse(posts, null);
        response.meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 0,
        };
        return response;
    },

    getPostBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select(POST_DETAIL_SELECT)
            .eq('slug', slug)
            .single();
        return handleResponse(data, error);
    },

    getPostById: async (id: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select(POST_DETAIL_SELECT)
            .eq('id', id)
            .single();
        return handleResponse(data, error);
    },

    createPost: async (formData: Parameters<typeof mapPostFormToDb>[0]) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return handleResponse(null, { message: 'Not authenticated' });

        const postData = { ...mapPostFormToDb(formData), author_id: user.id };
        const { data: post, error } = await supabase
            .from('posts')
            .insert(postData)
            .select()
            .single();
        return handleResponse(post, error);
    },

    updatePost: async (id: string, formData: Parameters<typeof mapPostFormToDb>[0], existingSlug?: string) => {
        const postData = mapPostFormToDb(formData, { existingSlug });
        const { data: post, error } = await supabase
            .from('posts')
            .update(postData)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(post, error);
    },

    deletePost: async (id: string) => {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        return handleResponse(null, error);
    },

    togglePublish: async (id: string) => {
        const { data: post } = await supabase.from('posts').select('status').eq('id', id).single();
        const newStatus = post?.status === 'published' ? 'draft' : 'published';
        const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

        const { data: updated, error } = await supabase
            .from('posts')
            .update({ status: newStatus, published_at: publishedAt })
            .eq('id', id)
            .select()
            .single();
        return handleResponse(updated, error);
    },

    getFeaturedPosts: async (limit: number = 5) => {
        const { data, error } = await supabase
            .from('posts')
            .select(POST_LIST_SELECT)
            .eq('status', 'published')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return handleResponse(data, error);
    },

    getRelatedPosts: async (slug: string, limit: number = 3) => {
        const { data: currentPost } = await supabase.from('posts').select('category_id').eq('slug', slug).single();

        if (!currentPost) return { success: true, data: [] };

        const { data, error } = await supabase
            .from('posts')
            .select(POST_LIST_SELECT)
            .eq('status', 'published')
            .eq('category_id', currentPost.category_id)
            .neq('slug', slug)
            .order('created_at', { ascending: false })
            .limit(limit);
        return handleResponse(data, error);
    },

    incrementViews: async (id: string) => {
        const { error } = await supabase.rpc('increment_post_views', { post_id: id });
        return { success: !error };
    },
};

export const categoriesApi = {
    getCategories: async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('order', { ascending: true });
        return handleResponse(data, error);
    },

    getCategoryBySlug: async (slug: string, params?: { page?: number; limit?: number }) => {
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (catError || !category) return handleResponse(null, catError);

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: posts, error: postsError, count } = await supabase
            .from('posts')
            .select(`*, author:users(id, username, display_name, avatar, bio)`, { count: 'exact' })
            .eq('category_id', category.id)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .range(from, to);

        const response = handleResponse({ category, posts }, postsError);
        if (response.success && count !== null) {
            response.meta = {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            };
        }
        return response;
    },

    createCategory: async (data: Record<string, unknown>) => {
        const { data: category, error } = await supabase
            .from('categories')
            .insert(data)
            .select()
            .single();
        return handleResponse(category, error);
    },

    updateCategory: async (id: string, data: Record<string, unknown>) => {
        const { data: category, error } = await supabase
            .from('categories')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(category, error);
    },

    deleteCategory: async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        return handleResponse(null, error);
    },
};

function buildCommentTree(flat: Array<Record<string, unknown>>) {
    const map = new Map<string, Record<string, unknown> & { replies: unknown[] }>();
    const roots: unknown[] = [];

    flat.forEach((c) => {
        map.set(c.id as string, { ...c, replies: [] });
    });

    map.forEach((comment) => {
        const parentId = comment.parent_comment_id as string | null;
        if (parentId && map.has(parentId)) {
            map.get(parentId)!.replies.push(comment);
        } else {
            roots.push(comment);
        }
    });

    return roots;
}

export const commentsApi = {
    getComments: async (postId: string, params?: { page?: number; limit?: number; sort?: string }) => {
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('post_id', postId)
            .eq('status', 'approved')
            .is('parent_comment_id', null);

        if (params?.sort === 'oldest') {
            query = query.order('created_at', { ascending: true });
        } else if (params?.sort === 'popular') {
            query = query.order('likes', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data: topLevel, error, count } = await query.range(from, to);
        if (error) return handleResponse(null, error);

        const topIds = (topLevel || []).map((c) => c.id);
        let replies: typeof topLevel = [];

        if (topIds.length > 0) {
            const { data: replyData, error: replyError } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .eq('status', 'approved')
                .in('parent_comment_id', topIds)
                .order('created_at', { ascending: true });

            if (replyError) return handleResponse(null, replyError);
            replies = replyData || [];
        }

        const tree = buildCommentTree([...(topLevel || []), ...replies]);
        const response = handleResponse(tree, null);
        if (count !== null) {
            response.meta = { page, limit, total: count, totalPages: Math.ceil(count / limit) };
        }
        return response;
    },

    getAllComments: async (params?: { page?: number; limit?: number; status?: string }) => {
        let query = supabase.from('comments').select('*, post:posts(title, slug)', { count: 'exact' });

        if (params?.status) query = query.eq('status', params.status);

        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        const response = handleResponse(data, error);
        if (response.success && count !== null) {
            response.meta = {
                page, limit, total: count, totalPages: Math.ceil(count / limit),
            };
        }
        return response;
    },

    addComment: async (input: CommentFormData | Record<string, unknown>) => {
        const raw = input as Record<string, unknown>;
        const postId = (raw.post_id ?? raw.postId) as string;
        const parentId = (raw.parent_comment_id ?? raw.parentCommentId) as string | undefined;
        const author = raw.author as { name?: string; email?: string } | undefined;

        const authorName = sanitizeCommentText(
            String(raw.author_name ?? author?.name ?? '')
        );
        const authorEmail = String(raw.author_email ?? author?.email ?? '').trim().toLowerCase();
        const content = sanitizeCommentText(String(raw.content ?? ''));

        if (!postId || !authorName || !authorEmail || !content) {
            return handleResponse(null, { message: 'Missing required comment fields' });
        }

        const row = {
            post_id: postId,
            parent_comment_id: parentId || null,
            author_name: authorName,
            author_email: authorEmail,
            content,
            status: 'pending',
        };

        const { data: comment, error } = await supabase
            .from('comments')
            .insert(row)
            .select()
            .single();
        return handleResponse(comment, error);
    },

    updateComment: async (id: string, data: Record<string, unknown>) => {
        const { data: comment, error } = await supabase
            .from('comments')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(comment, error);
    },

    deleteComment: async (id: string) => {
        const { error } = await supabase.from('comments').delete().eq('id', id);
        return handleResponse(null, error);
    },

    approveComment: async (id: string) => {
        const { data: comment, error } = await supabase
            .from('comments')
            .update({ status: 'approved' })
            .eq('id', id)
            .select()
            .single();
        return handleResponse(comment, error);
    },

    markAsSpam: async (id: string) => {
        const { data: comment, error } = await supabase
            .from('comments')
            .update({ status: 'spam' })
            .eq('id', id)
            .select()
            .single();
        return handleResponse(comment, error);
    },

    likeComment: async (id: string, voterId: string) => {
        const { data: current } = await supabase.from('comments').select('likes, liked_by').eq('id', id).single();

        const likedBy: string[] = current?.liked_by || [];
        if (likedBy.includes(voterId)) {
            const { data, error } = await supabase
                .from('comments')
                .update({
                    likes: Math.max(0, (current?.likes || 1) - 1),
                    liked_by: likedBy.filter((i: string) => i !== voterId),
                })
                .eq('id', id)
                .select()
                .single();
            return handleResponse(data, error);
        }

        const { data, error } = await supabase
            .from('comments')
            .update({
                likes: (current?.likes || 0) + 1,
                liked_by: [...likedBy, voterId],
            })
            .eq('id', id)
            .select()
            .single();
        return handleResponse(data, error);
    },
};

export const settingsApi = {
    getSettings: async () => {
        const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
        return handleResponse(data, error);
    },

    getSiteInfo: async () => {
        const { data, error } = await supabase.from('public_site_settings').select('*').maybeSingle();
        return handleResponse(data, error);
    },

    updateSettings: async (data: Record<string, unknown>) => {
        const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
        if (!existing?.id) {
            return handleResponse(null, { message: 'No settings row found' });
        }
        const { data: settings, error } = await supabase
            .from('settings')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single();
        return handleResponse(settings, error);
    },
};

export const coursesApi = {
    getCourses: async (params?: { page?: number; limit?: number }) => {
        const page = params?.page || 1;
        const limit = params?.limit || 50;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('courses')
            .select('*', { count: 'exact' })
            .order('order', { ascending: true })
            .range(from, to);

        const response = handleResponse(data, error);
        if (count !== null) {
            response.meta = { page, limit, total: count, totalPages: Math.ceil(count / limit) };
        }
        return response;
    },

    getPublishedCourses: async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('status', 'published')
            .order('order', { ascending: true });
        return handleResponse(data, error);
    },

    getCourseById: async (id: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();
        return handleResponse(data, error);
    },

    createCourse: async (data: Record<string, unknown>) => {
        const { data: course, error } = await supabase
            .from('courses')
            .insert(data)
            .select()
            .single();
        return handleResponse(course, error);
    },

    updateCourse: async (id: string, data: Record<string, unknown>) => {
        const { data: course, error } = await supabase
            .from('courses')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(course, error);
    },

    deleteCourse: async (id: string) => {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        return handleResponse(null, error);
    },
};

export const seminarsApi = {
    getSeminars: async () => {
        const { data, error } = await supabase
            .from('seminars')
            .select('*')
            .order('order', { ascending: true });
        return handleResponse(data, error);
    },

    getPublishedSeminars: async () => {
        const { data, error } = await supabase
            .from('seminars')
            .select('*')
            .not('status', 'eq', 'cancelled')
            .order('date', { ascending: true });
        return handleResponse(data, error);
    },

    getSeminarById: async (id: string) => {
        const { data, error } = await supabase
            .from('seminars')
            .select('*')
            .eq('id', id)
            .single();
        return handleResponse(data, error);
    },

    createSeminar: async (data: Record<string, unknown>) => {
        const { data: seminar, error } = await supabase
            .from('seminars')
            .insert(data)
            .select()
            .single();
        return handleResponse(seminar, error);
    },

    updateSeminar: async (id: string, data: Record<string, unknown>) => {
        const { data: seminar, error } = await supabase
            .from('seminars')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        return handleResponse(seminar, error);
    },

    deleteSeminar: async (id: string) => {
        const { error } = await supabase.from('seminars').delete().eq('id', id);
        return handleResponse(null, error);
    },
};

export default supabase;
