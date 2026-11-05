import type { AnchorHTMLAttributes } from 'react';
export function ExternalLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>;
}
