import { defineConfig } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import react from '@vitejs/plugin-react';
import {
  injectSocialHead,
  defaultOrigin,
  socialPages,
  projectSectionPages,
} from './shared/social-pages.mjs';
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'route-social-metadata',
      async closeBundle() {
        const root = resolve('dist');
        const html = await readFile(resolve(root, 'index.html'), 'utf8');
        const origin =
          process.env.SITE_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : defaultOrigin);
        for (const page of [...socialPages, ...projectSectionPages]) {
          const file = resolve(root, '.' + page.path, 'index.html');
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, injectSocialHead(html, page.path, origin));
        }
        await writeFile(
          resolve(root, '404.html'),
          html.replace('</head>', '<meta name="robots" content="noindex" /></head>'),
        );
        await writeFile(
          resolve(root, 'robots.txt'),
          `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`,
        );
        await writeFile(
          resolve(root, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${socialPages.map((page) => `<url><loc>${new URL(page.path, origin).href}</loc></url>`).join('')}</urlset>`,
        );
      },

      transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
          return injectSocialHead(
            html,
            context.originalUrl || '/',
            process.env.SITE_URL || defaultOrigin,
          );
        },
      },
    },
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            if (
              id.includes('framer-motion') ||
              id.includes('motion-dom') ||
              id.includes('motion-utils')
            )
              return 'motion';
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/'))
              return 'react';
          }
        },
      },
    },
  },
});
