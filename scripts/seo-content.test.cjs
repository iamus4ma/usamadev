const { test } = require('node:test');
const assert = require('node:assert/strict');
const { escape, contentFor } = require('./seo-content.cjs');
const projects = require('../src/components/projects/projects.json');
const profile = require('../src/components/conversation/profile.json');
const { createConfig } = require('./experiments-config.cjs');
const registry = require('../src/components/experiments/registry.json');

test('static content includes every project and employment record', () => {
  for (const item of projects) assert.ok(contentFor('projects').includes(escape(item.title)));
  for (const item of profile.experience) assert.ok(contentFor('experience').includes(escape(item.place)));
  assert.ok(!contentFor('projects').includes('href="#"'));
});

test('HTML content is escaped', () => {
  assert.equal(escape('<script>"A&B"</script>'), '&lt;script&gt;&quot;A&amp;B&quot;&lt;/script&gt;');
});

test('generated pages have clean routes and standalone embeds stay out of search', () => {
  const config = createConfig(registry);
  for (const page of Object.values(require('../src/components/conversation/pages.json'))) {
    assert.ok(config.rewrites.some(rule => rule.source === page.path && rule.destination === `${page.path}.html`));
    assert.ok(config.redirects.some(rule => rule.source === `${page.path}.html` && rule.destination === page.path));
  }
  assert.equal(config.headers[0].headers[0].value, 'noindex');
});
