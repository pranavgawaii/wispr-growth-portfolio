import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createOneBreathApi } from '../server/one-breath.mjs';

// Exercise separate API instances sharing a durable store, as deployed serverless functions do.
test('rounds survive instance changes and concurrent submissions publish once', async (t) => {
  const sessions = new Map(),
    claimed = new Set(),
    entries = [];
  const store = {
    getSession: async (id) => structuredClone(sessions.get(id)),
    setSession: async (id, value) => sessions.set(id, structuredClone(value)),
    allowRound: async () => true,
    claim: async (id) => {
      if (claimed.has(id)) return false;
      claimed.add(id);
      return true;
    },
    release: async (id) => claimed.delete(id),
    persist: async (entry) => entries.push(entry),
    list: async () => entries,
  };
  let time = 1000000;
  const apis = await Promise.all([
    createOneBreathApi({ store, now: () => time }),
    createOneBreathApi({ store, now: () => time }),
  ]);
  let index = 0;
  const server = http.createServer((req, res) => apis[index++ % 2](req, res));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api/one-breath`;
  const post = (path, body) =>
    fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  const started = await post('/rounds', { mission: 'signal', seconds: 30, method: 'flow' });
  assert.equal(started.status, 201);
  const session = await started.json();
  time += 30000;
  const data = {
    ...session,
    alias: 'Player',
    text: 'The mobile login is stuck on the loading screen. Desktop login still works, so please use that for now. We expect the fix tomorrow and will share another update with the team once it is ready.',
    elapsed: 30,
  };
  const posted = await Promise.all([post('/leaderboard', data), post('/leaderboard', data)]);
  assert.deepEqual(posted.map((r) => r.status).sort(), [201, 409]);
  const board = await (
    await fetch(base + '/leaderboard?mission=signal&seconds=30&method=flow')
  ).json();
  assert.equal(board.entries.length, 1);
  assert.equal(board.entries[0].score, 100);
  assert.ok(!JSON.stringify(entries).includes(data.text));
});
