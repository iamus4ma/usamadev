const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createConfig } = require('./experiments-config.cjs');
const registry = require('../src/components/experiments/registry.json');
const local = registry.find(item => item.slug === 'linkedin-companion');
const ready = { ...registry[0], slug: 'sample', status: 'ready', deploymentUrl: 'https://sample-test.vercel.app', githubUrl: 'https://github.com/iamus4ma/sample' };

test('Pixel Pong stays local until its deployed assets support the prefix', () => {
  const pong = registry.find(item => item.slug === 'pixel-pong');
  assert.equal(pong.status, 'pending');
  assert.ok(!createConfig([pong]).rewrites.some(rule => rule.destination.startsWith('https:')));
  assert.equal(createConfig([{ ...pong, status: 'ready' }]).rewrites[2].destination, 'https://pixel-pong-six.vercel.app/:path*');
  assert.deepEqual(createConfig([pong]).rewrites[0], { source: '/experiments/pixel-pong/fullscreen', destination: '/index.html' });
});

test('local-only projects do not create external or standalone routes', () => {
  assert.deepEqual(createConfig([local]).rewrites, [
    { source: '/experiments', destination: '/index.html' },
    { source: '/experiments/:path*', destination: '/index.html' },
  ]);
});

test('the in-app 3D model needs no external rewrite', () => {
  const model = registry.find(item => item.slug === 'animated-developer');
  assert.deepEqual(createConfig([model]).rewrites, [
    { source: '/experiments', destination: '/index.html' },
    { source: '/experiments/:path*', destination: '/index.html' },
  ]);
  const mascot = registry.find(item => item.slug === 'meet-usama');
  assert.deepEqual(createConfig([mascot]).rewrites, createConfig([model]).rewrites);
});

test('root-mounted origins receive both exact and nested routes ahead of SPA fallback', () => {
  const routes = createConfig([ready]).rewrites;
  assert.deepEqual(routes.slice(0, 3), [
    { source: '/experiments/sample/fullscreen', destination: '/index.html' },
    { source: '/experiments/sample', destination: 'https://sample-test.vercel.app/' },
    { source: '/experiments/sample/:path*', destination: 'https://sample-test.vercel.app/:path*' },
  ]);
  // These requests all stay in the experiment origin, never the portfolio bundle.
  for (const path of ['some-route', 'assets/main.js', 'static/css/main.css', 'favicon.ico', 'api/example']) {
    assert.equal(routes[2].destination.replace(':path*', path), `https://sample-test.vercel.app/${path}`);
  }
  assert.equal(routes[3].destination, '/index.html');
});

test('prefix-mounted origins preserve their prefix for nested assets and routes', () => {
  const routes = createConfig([{ ...ready, upstreamPath: '/experiments/sample' }]).rewrites;
  assert.equal(routes[1].destination, 'https://sample-test.vercel.app/experiments/sample/');
  assert.equal(routes[2].destination, 'https://sample-test.vercel.app/experiments/sample/:path*');
});

test('invalid or duplicated configuration fails early', () => {
  assert.throws(() => createConfig([ready, ready]), /duplicate/);
  assert.throws(() => createConfig([{ ...ready, slug: '../assets' }]), /slug/);
  assert.throws(() => createConfig([{ ...ready, deploymentUrl: 'http://localhost:3000' }]), /HTTPS/);
  assert.throws(() => createConfig([{ ...ready, deploymentUrl: 'https://host.test/subpath' }]), /origin/);
  assert.throws(() => createConfig([{ ...ready, upstreamPath: '/wrong' }]), /upstreamPath/);
  assert.throws(() => createConfig([{ ...local, deploymentUrl: 'https://example.com' }]), /Local experiments/);
  assert.throws(() => createConfig([{ ...ready, deploymentUrl: 'https://placeholder.example.com' }]), /example URLs/);
});
