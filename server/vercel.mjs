import { createOneBreathApi } from './one-breath.mjs';
import { createRedisStore } from './redis-store.mjs';

let handler;
export default async function oneBreath(req, res) {
  if (!handler) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(
        JSON.stringify({
          error: 'The shared leaderboard is not connected yet. Your local practice still works.',
        }),
      );
      return;
    }
    handler = await createOneBreathApi({ store: createRedisStore({ url, token }) });
  }
  if (!(await handler(req, res))) {
    res.writeHead(404);
    res.end('Not found.');
  }
}
