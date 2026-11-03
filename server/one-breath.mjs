import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import { missions, durations, methods, scoreRound } from '../src/features/onebreath/game.mjs';

export async function createOneBreathApi({ file, store, now = Date.now } = {}) {
  let entries = [];
  if (file) {
    try {
      entries = JSON.parse(await readFile(file, 'utf8'));
      if (!Array.isArray(entries)) throw new Error('Invalid leaderboard');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const sessions = new Map(),
    limits = new Map();
  let persistence = Promise.resolve();
  const persist = (entry) => {
    const work = persistence.then(async () => {
      const next = [...entries, entry].slice(-2000);
      if (file) {
        await mkdir(dirname(file), { recursive: true });
        const temp = `${file}.tmp`;
        await writeFile(temp, JSON.stringify(next));
        await rename(temp, file);
      }
      entries = next;
    });
    persistence = work.catch(() => {});
    return work;
  };
  const send = (res, code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  };
  const body = async (req) => {
    const chunks = [];
    let size = 0;
    if (req.body !== undefined) {
      const value = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
      chunks.push(value);
      size = value.length;
    } else {
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16000) break;
        chunks.push(chunk);
      }
    }
    if (size > 16000) {
      const error = new Error('Request too large');
      error.status = 413;
      throw error;
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      const error = new Error('Invalid JSON');
      error.status = 400;
      throw error;
    }
  };
  return async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    url.pathname = url.pathname.replace(/\/+$/, '');
    if (!url.pathname.startsWith('/api/one-breath/')) return false;
    try {
      if (
        req.headers.origin &&
        req.headers.origin !== `http://${req.headers.host}` &&
        req.headers.origin !== `https://${req.headers.host}`
      )
        return (send(res, 403, { error: 'Use this site to submit a run.' }), true);
      for (const [key, session] of sessions)
        if (now() - session.started > 15 * 60_000) sessions.delete(key);
      for (const [key, limit] of limits)
        if (now() - limit.started > 10 * 60_000) limits.delete(key);
      if (url.pathname === '/api/one-breath/leaderboard' && req.method === 'GET') {
        const mission = url.searchParams.get('mission'),
          seconds = Number(url.searchParams.get('seconds')),
          method = url.searchParams.get('method');
        if (
          !missions.some((item) => item.id === mission) ||
          !durations.includes(seconds) ||
          !methods.includes(method)
        ) {
          send(res, 400, { error: 'Choose valid leaderboard filters.' });
          return true;
        }
        const saved = store ? await store.list({ mission, seconds, method }) : entries;
        const rows = saved
          .filter(
            (entry) =>
              entry.mission === mission && entry.seconds === seconds && entry.method === method,
          )
          .sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt))
          .slice(0, 20);
        send(res, 200, { entries: rows, kind: 'honor-board' });
        return true;
      }
      if (req.method !== 'POST') {
        send(res, 405, { error: 'Method not allowed' });
        return true;
      }
      const input = await body(req);
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        send(res, 400, { error: 'Invalid request' });
        return true;
      }
      if (url.pathname === '/api/one-breath/rounds') {
        if (
          !missions.some((m) => m.id === input.mission) ||
          !durations.includes(input.seconds) ||
          !methods.includes(input.method)
        ) {
          send(res, 400, { error: 'Choose a mission, duration and input method.' });
          return true;
        }
        const ip =
            (process.env.VERCEL
              ? req.headers['x-forwarded-for']?.split(',')[0]?.trim()
              : req.socket.remoteAddress) || 'local',
          limit = limits.get(ip) || { started: now(), count: 0 };
        if (store ? !(await store.allowRound(ip)) : limit.count >= 30) {
          send(res, 429, { error: 'Take a short break before starting another round.' });
          return true;
        }
        limit.count++;
        limits.set(ip, limit);
        const id = randomUUID(),
          token = randomBytes(24).toString('hex');
        const session = {
          token,
          started: now(),
          mission: input.mission,
          seconds: input.seconds,
          method: input.method,
          posted: false,
        };
        if (store) await store.setSession(id, session);
        else sessions.set(id, session);
        send(res, 201, { id, token });
        return true;
      }
      if (url.pathname === '/api/one-breath/leaderboard') {
        const session = store ? await store.getSession(input.id) : sessions.get(input.id);
        const supplied =
          typeof input.token === 'string' ? Buffer.from(input.token) : Buffer.alloc(0);
        const expected = Buffer.from(session?.token || '');
        if (
          !session ||
          now() - session.started > 15 * 60_000 ||
          supplied.length !== expected.length ||
          !timingSafeEqual(supplied, expected)
        ) {
          send(res, 401, { error: 'This round has expired. Play a new round.' });
          return true;
        }
        if (session.posted || session.pending) {
          send(res, 409, { error: 'This round is already on the board.' });
          return true;
        }
        if (
          typeof input.text !== 'string' ||
          input.text.length > 5000 ||
          !Number.isFinite(input.elapsed) ||
          input.elapsed < 5 ||
          input.elapsed > session.seconds + 1 ||
          input.elapsed > (now() - session.started) / 1000 + 2
        ) {
          send(res, 400, {
            error: 'Play a round for at least five seconds before sharing a score.',
          });
          return true;
        }
        const alias =
          typeof input.alias === 'string' ? input.alias.trim().replace(/\s+/g, ' ') : '';
        if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,23}$/u.test(alias)) {
          send(res, 400, {
            error: 'Use a 2–24 character nickname with letters, numbers, spaces or underscores.',
          });
          return true;
        }
        const result = scoreRound(session.mission, input.text, input.elapsed);
        if (result.words < 3) {
          send(res, 400, { error: 'Capture at least three words first.' });
          return true;
        }
        const entry = {
          id: input.id,
          alias,
          score: result.score,
          words: result.words,
          elapsed: result.elapsed,
          mission: session.mission,
          seconds: session.seconds,
          method: session.method,
          createdAt: new Date(now()).toISOString(),
        };
        if (store && !(await store.claim(input.id))) {
          send(res, 409, { error: 'This round is already on the board.' });
          return true;
        }
        session.pending = true;
        // Keep a bounded, genuine board. Transcripts and audio are never persisted.
        try {
          if (store) await store.persist(entry);
          else await persist(entry);
          session.posted = true;
          if (store) await store.setSession(input.id, { ...session, pending: false });
        } catch (error) {
          if (store && !session.posted) await store.release(input.id);
          throw error;
        } finally {
          session.pending = false;
        }
        send(res, 201, { entry });
        return true;
      }
      send(res, 404, { error: 'Not found' });
      return true;
    } catch (error) {
      send(res, error.status || 500, {
        error: error.status
          ? error.message
          : 'Could not save right now. Your result is still here.',
      });
      return true;
    }
  };
}
