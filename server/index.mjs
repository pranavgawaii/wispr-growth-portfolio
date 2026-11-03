import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createStaticHandler } from './static.mjs';
import { createOneBreathApi } from './one-breath.mjs';
import { createRedisStore } from './redis-store.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const production = process.argv.includes('--production');
const server = http.createServer();
let vite;
let servePage;
if (production) {
  servePage = createStaticHandler(root + 'dist', { origin: process.env.SITE_URL });
} else {
  const { createServer } = await import('vite');
  vite = await createServer({
    root,
    configFile: root + 'vite.config.ts',
    server: { middlewareMode: true, hmr: { server, path: '/__portfolio_hmr' } },
    appType: 'spa',
  });
  servePage = (req, res) => vite.middlewares(req, res);
}
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const api = await createOneBreathApi(
  redisUrl && redisToken
    ? { store: createRedisStore({ url: redisUrl, token: redisToken }) }
    : { file: resolve(process.env.DATA_DIR || root + '.data', 'one-breath/leaderboard.json') },
);
server.on('request', async (req, res) => {
  try {
    if (await api(req, res)) return;
    servePage(req, res);
  } catch {
    if (!res.headersSent) res.writeHead(500);
    res.end('Unable to load this page.');
  }
});
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || (production ? '0.0.0.0' : '127.0.0.1');
server.listen(port, host, () => {
  console.log(`Portfolio: http://localhost:${port}/`);
  console.log(`One Breath: http://localhost:${port}/one-breath/`);
});
const shutdown = () => {
  server.close();
  void vite?.close();
};
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
