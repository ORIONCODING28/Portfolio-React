/** Resolve local assets and route URLs under either a root domain or a Pages subpath. */
export function withBasePath(path: string, base = '/'): string {
  const prefix = `/${base.replace(/^\/+|\/+$/g, '')}`;
  return `${prefix === '/' ? '' : prefix}/${path.replace(/^\/+/, '')}`;
}

export function publicAsset(path: string): string {
  return withBasePath(path, import.meta.env?.BASE_URL || '/');
}
