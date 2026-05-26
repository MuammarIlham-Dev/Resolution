/** Public author fields (excludes email). */
export const AUTHOR_PUBLIC_FIELDS = 'id, username, display_name, avatar, bio';

export const POST_LIST_SELECT = `*, author:users(${AUTHOR_PUBLIC_FIELDS}), category:categories(*)`;

export const POST_DETAIL_SELECT = POST_LIST_SELECT;
