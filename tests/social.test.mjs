import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  socialPages,
  renderSocialHead,
  injectSocialHead,
  getSocialPage,
} from '../shared/social-pages.mjs';

test('every share route has a unique 1200 by 630 WebP and complete metadata', async () => {
  assert.equal(new Set(socialPages.map((page) => page.image)).size, socialPages.length);
  for (const page of socialPages) {
    const image = await readFile(new URL(`../public/social/${page.image}.webp`, import.meta.url));
    assert.equal(image.toString('ascii', 0, 4), 'RIFF');
    assert.equal(image.toString('ascii', 8, 12), 'WEBP');
    const frame = image.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
    assert.ok(frame > 0);
    assert.equal(image.readUInt16LE(frame + 3) & 0x3fff, 1200);
    assert.equal(image.readUInt16LE(frame + 5) & 0x3fff, 630);
    const head = renderSocialHead(page.path, 'https://example.com');
    assert.ok(head.includes(`https://example.com/social/${page.image}.webp`));
    assert.ok(head.includes('summary_large_image'));
    assert.ok(head.includes('rel="canonical"'));
  }
});
test('invitation names and scores are never reflected in public metadata', () => {
  const head = renderSocialHead(
    '/one-breath/challenge/?from=PrivateName&score=987&name=SecretName',
  );
  assert.ok(!head.includes('PrivateName'));
  assert.ok(!head.includes('987'));
  assert.ok(!head.includes('SecretName'));
  assert.equal(getSocialPage('/hero/').path, '/');
  assert.equal(getSocialPage('/?product').path, '/one-breath/');
});
test('replaces old metadata without duplicating tags', () => {
  const html = injectSocialHead(
    '<html><head><title>Old</title><meta name="description" content="Old"><meta property="og:image" content="old"></head><body>App</body></html>',
    '/voice-lab/',
  );
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/property="og:image" /g) || []).length, 1);
  assert.ok(html.includes('/social/voice-lab.webp'));
  assert.throws(() => renderSocialHead('/', 'javascript:alert(1)'));
});

test('project links and subsections have clean canonical URLs', () => {
  for (const slug of ['auren', 'mnemo', 'travio', 'placepro', 'fahh-alert']) {
    assert.equal(getSocialPage(`/?work=${slug}`).path, `/projects/${slug}/`);
    assert.equal(getSocialPage(`/projects/${slug}/problem/`).path, `/projects/${slug}/problem/`);
    const head = renderSocialHead(`/projects/${slug}/problem/`, 'https://example.com');
    assert.ok(head.includes(`https://example.com/projects/${slug}/problem/`));
    assert.ok(head.includes(`/social/project-${slug}.webp?v=6`));
    assert.ok(!head.includes('?work='));
  }
  assert.equal(getSocialPage('/?work=all').path, '/projects/all/');
});
