/** Share the case-study URL without carrying modal state, query strings or fragments. */
export function projectShareLinks(title: string, url: string) {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    x: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };
}
