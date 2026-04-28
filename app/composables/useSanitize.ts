import DOMPurify from 'isomorphic-dompurify'

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'u', 's', 'a', 'p', 'br', 'span',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
    'blockquote', 'code', 'pre', 'img', 'hr', 'div',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
    'width', 'height', 'data-align',
  ],
  ALLOW_DATA_ATTR: false,
}

export function useSanitize() {
  function sanitizeHTML(dirty: string | null | undefined): string {
    if (!dirty) return ''
    return DOMPurify.sanitize(dirty, SANITIZE_CONFIG)
  }

  return { sanitizeHTML }
}
