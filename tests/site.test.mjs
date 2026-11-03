import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createStaticHandler } from '../server/static.mjs';

test('static hosting serves clean paths, route metadata and rejects missing assets', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-site-'));
  await writeFile(
    join(root, 'index.html'),
    '<html><head><title>Old</title></head><body>App</body></html>',
  );
  await writeFile(join(root, '404.html'), '<html><head></head><body>Page not found</body></html>');
  const server = http.createServer(createStaticHandler(root));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, image] of [
    ['/', 'portfolio'],
    ['/one-breath/', 'one-breath'],
    ['/projects/auren/problem/', 'project-auren'],
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(`/social/${image}.webp`));
  }
  const missing = await fetch(base + '/not-a-page/');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Page not found/);
  assert.equal((await fetch(base + '/missing.js')).status, 404);
  assert.equal((await fetch(base + '/', { method: 'HEAD' })).status, 200);
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
});
