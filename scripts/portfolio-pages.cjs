const fs = require('node:fs');
const path = require('node:path');
const pages = require('../src/components/conversation/pages.json');

const build = path.resolve(__dirname, '../build');
const template = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const origin = 'https://usamahassan.vercel.app';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const navigation = Object.values(pages).map(page => `<a href="${page.path}">${escape(page.title)}</a>`).join(' · ');

for (const page of Object.values(pages)) {
  const title = escape(page.title);
  const description = escape(page.description);
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  for (const [attribute, key, value] of [
    ['name', 'description', description],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', `${origin}${page.path}`],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]) {
    const tag = new RegExp(`<meta\\b[^>]*${attribute}="${key}"[^>]*>`);
    html = html.replace(tag, `<meta data-react-helmet="true" ${attribute}="${key}" content="${value}"/>`);
  }
  html = html.replace('</head>', `<link data-react-helmet="true" rel="canonical" href="${origin}${page.path}"/></head>`);
  // A readable introduction while React loads, also available without JavaScript.
  html = html.replace('<div id="root"></div>', `<div id="root"><main><h1>${title}</h1><p>${description}</p><nav aria-label="Portfolio pages">${navigation}</nav><p><a href="/">Open Usama Hassan's portfolio</a></p></main></div>`);
  fs.writeFileSync(path.join(build, `${page.path.slice(1)}.html`), html);
}
console.log('Generated About, Projects, and Experience pages.');
