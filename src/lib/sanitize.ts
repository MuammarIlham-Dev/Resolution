import DOMPurify from 'dompurify';

const POST_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'hr', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption',
];

const POST_ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id',
  'width', 'height', 'colspan', 'rowspan',
];

/** Sanitize HTML for blog post body (storage and display). */
export function sanitizePostHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: POST_ALLOWED_TAGS,
    ALLOWED_ATTR: POST_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

/** Plain text for comments (no HTML). */
export function sanitizeCommentText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}
