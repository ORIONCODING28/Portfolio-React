import { writeFile } from 'node:fs/promises';
const base = `/${(process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '')}`;
const root = base === '/' ? '/' : `${base}/`;
// Only restore same-origin routes in this deployment. Query/hash are preserved.
await writeFile(new URL('../dist/404.html', import.meta.url), `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Giuseppe Cairone</title>
<script>location.replace(${JSON.stringify(root)}+'?__route='+encodeURIComponent(location.pathname+location.search+location.hash));</script>
</head><body><p><a href="${root}">Torna al portfolio / Back to portfolio</a></p></body></html>`);
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
