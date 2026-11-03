import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createOneBreathApi } from '../server/one-breath.mjs';
import { scoreRound, matchReference, missions } from '../src/features/onebreath/game.mjs';
const answer =
  'The mobile login is stuck on the loading screen. Desktop login still works, so please use that for now. We expect the fix tomorrow and will share another update with the team once it is ready.';
test('mission scoring rewards relevant details and concision, not speed or word spam', () => {
  assert.equal(scoreRound('signal', answer, 30).score, 100);
  assert.equal(scoreRound('signal', answer, 120).score, 100);
  assert.equal(scoreRound('signal', '', 30).score, 0);
  assert.equal(
    scoreRound('signal', 'immobile logistics working tomorrows fixes '.repeat(10), 30).coverage,
    0,
  );
  assert.ok(scoreRound('signal', 'word '.repeat(200), 30).score < 25);
  assert.equal(
    scoreRound(
      'signal',
      'Mobile login is stuck. Desktop is not working. A fix may arrive tomorrow.',
      30,
    ).checked[1].passed,
    false,
  );
});
test('read-back comparison handles punctuation and penalizes omissions, additions and wrong order', () => {
  const reference = missions.find((m) => m.id === 'readback').reference;
  assert.equal(matchReference(reference, reference.toUpperCase()).percent, 100);
  assert.ok(matchReference(reference, reference + ' invented detail').percent < 100);
  assert.ok(matchReference(reference, 'Desktop works.').percent < 100);
  assert.equal(matchReference('one two three', 'three two one').matched, 1);
  assert.equal(matchReference('hello', '').percent, 0);
});
test('honor board recomputes scores, partitions rounds, prevents duplicate posts and persists no transcript', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'one-breath-'));
  const file = join(directory, 'board.json');
  let time = 1_000_000;
  const api = await createOneBreathApi({ file, now: () => time });
  const server = http.createServer(async (req, res) => {
    if (!(await api(req, res))) {
      res.writeHead(404);
      res.end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}/api/one-breath`;
  const post = (path, data) =>
    fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  const session = await (
    await post('/rounds', { mission: 'signal', seconds: 30, method: 'flow' })
  ).json();
  assert.equal(
    (await post('/leaderboard', { ...session, alias: 'player', text: answer, elapsed: 8 })).status,
    400,
  );
  time += 30_000;
  assert.equal(
    (
      await post('/leaderboard', {
        ...session,
        token: 'bad',
        alias: 'player',
        text: answer,
        elapsed: 30,
      })
    ).status,
    401,
  );
  const response = await post('/leaderboard', {
    ...session,
    alias: 'Player one',
    text: answer,
    elapsed: 30,
    score: 999,
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).entry.score, 100);
  assert.equal(
    (await post('/leaderboard', { ...session, alias: 'again', text: answer, elapsed: 30 })).status,
    409,
  );
  const board = await (
    await fetch(base + '/leaderboard?mission=signal&seconds=30&method=flow')
  ).json();
  assert.equal(board.entries.length, 1);
  assert.equal(board.entries[0].alias, 'Player one');
  assert.equal(
    (await (await fetch(base + '/leaderboard?mission=signal&seconds=30&method=type')).json())
      .entries.length,
    0,
  );
  const stored = await readFile(file, 'utf8');
  assert.ok(!stored.includes(answer));
  assert.ok(!stored.includes(session.token));
  const sessions = await Promise.all([
    post('/rounds', { mission: 'signal', seconds: 30, method: 'flow' }).then((r) => r.json()),
    post('/rounds', { mission: 'signal', seconds: 30, method: 'flow' }).then((r) => r.json()),
  ]);
  time += 10_000;
  const results = await Promise.all(
    sessions.map((item, i) =>
      post('/leaderboard', { ...item, alias: `Player ${i + 2}`, text: answer, elapsed: 10 }),
    ),
  );
  assert.ok(results.every((result) => result.status === 201));
  assert.equal(JSON.parse(await readFile(file, 'utf8')).length, 3);
  assert.equal(
    (await post('/rounds', { mission: 'bad', seconds: 30, method: 'flow' })).status,
    400,
  );
  const badOrigin = await fetch(base + '/rounds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://unrelated.example' },
    body: JSON.stringify({ mission: 'signal', seconds: 30, method: 'flow' }),
  });
  assert.equal(badOrigin.status, 403);
});

test('serverless parsed request bodies work and keep the size limit', async () => {
  const api = await createOneBreathApi();
  const invoke = async (body) => {
    let status, output;
    const req = {
      url: '/api/one-breath/rounds/',
      method: 'POST',
      headers: { host: 'example.com' },
      socket: { remoteAddress: 'local' },
      body,
    };
    const res = {
      writeHead(code) {
        status = code;
      },
      end(value) {
        output = JSON.parse(value);
      },
    };
    await api(req, res);
    return { status, output };
  };
  const result = await invoke({ mission: 'signal', seconds: 30, method: 'type' });
  assert.equal(result.status, 201);
  assert.ok(result.output.id);
  assert.equal((await invoke({ text: 'x'.repeat(17000) })).status, 413);
  assert.equal((await invoke('{invalid')).status, 400);
});
