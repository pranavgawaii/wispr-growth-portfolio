import { createHash } from 'node:crypto';

/** Durable round state and scores shared by all Vercel function instances. */
export function createRedisStore({ url, token, fetch: request = globalThis.fetch }) {
  if (!url || !token || new URL(url).protocol !== 'https:')
    throw new Error('Configure an HTTPS Redis REST URL and token.');
  const command = async (...args) => {
    const response = await request(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Leaderboard storage unavailable');
    const data = await response.json();
    if (data.error) throw new Error('Leaderboard storage command failed');
    return data.result;
  };
  const sessionKey = (id) => `ob:round:${id}`;
  const boardKey = ({ mission, seconds, method }) => `ob:board:${mission}:${seconds}:${method}`;
  return {
    async getSession(id) {
      if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) return undefined;
      const value = await command('GET', sessionKey(id));
      return value ? JSON.parse(value) : undefined;
    },
    async setSession(id, session) {
      await command('SET', sessionKey(id), JSON.stringify(session), 'EX', 900);
    },
    async allowRound(ip) {
      const key = 'ob:rate:' + createHash('sha256').update(ip).digest('hex').slice(0, 24);
      const count = await command(
        'EVAL',
        "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 600) end; return n",
        1,
        key,
      );
      return count <= 30;
    },
    async claim(id) {
      return (await command('SET', `ob:claim:${id}`, '1', 'NX', 'EX', 900)) === 'OK';
    },
    async release(id) {
      await command('DEL', `ob:claim:${id}`);
    },
    async list(filter) {
      const rows = await command('ZRANGE', boardKey(filter), 0, -1);
      return (rows || []).map((value) => JSON.parse(value));
    },
    async persist(entry) {
      // One atomic operation prevents duplicate submissions even across function instances.
      await command(
        'EVAL',
        "redis.call('ZADD', KEYS[1], ARGV[1], ARGV[2]); redis.call('ZREMRANGEBYRANK', KEYS[1], 0, -2001); redis.call('EXPIRE', KEYS[1], 7776000); return 1",
        1,
        boardKey(entry),
        entry.score,
        JSON.stringify(entry),
      );
    },
  };
}
