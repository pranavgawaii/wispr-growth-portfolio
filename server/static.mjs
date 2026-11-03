import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import {
  injectSocialHead,
  defaultOrigin,
  socialPages,
  projectSectionPages,
} from '../shared/social-pages.mjs';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
};
export function createStaticHandler(directory, { origin = defaultOrigin } = {}) {
  const root = resolve(directory);
  return async (req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405);
        return res.end('Method not allowed.');
      }
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(403);
        return res.end('Forbidden.');
      }
      let status = 200;
      try {
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      } catch {
        if (extname(pathname)) {
          res.writeHead(404);
          return res.end('Not found.');
        }
        const path = pathname.replace(/\/+$/, '') + '/';
        const known =
          [...socialPages, ...projectSectionPages].some((page) => page.path === path) ||
          ['/main/', '/hero/'].includes(path);
        file = resolve(root, known ? 'index.html' : '404.html');
        status = known ? 200 : 404;
      }
      let content = await readFile(file);
      if (extname(file) === '.html')
        content = Buffer.from(injectSocialHead(content.toString(), req.url, origin));
      res.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      res.end('Unable to load this page.');
    }
  };
}
