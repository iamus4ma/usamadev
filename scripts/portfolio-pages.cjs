const fs = require('node:fs');
const path = require('node:path');
const pages = require('../src/components/conversation/pages.json');
const { escape, contentFor } = require('./seo-content.cjs');

const build = path.resolve(__dirname, '../build');
const template = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const origin = 'https://usamahassan.vercel.app';
const navigation = Object.values(pages).map(page => `<a href="${page.path}">${escape(page.title)}</a>`).join(' · ');
const home = {
  path: '/', title: 'Usama Hassan | Software Engineer & Full Stack Developer',
  description: 'Usama Hassan (iamus4ma) is a software engineer and full stack developer in Pakistan building web and mobile apps with React, React Native, TypeScript, and Node.js.',
};
// Preserve an uncanonicalized shell for experiment detail and fullscreen routes.
fs.writeFileSync(path.join(build, 'app-shell.html'), template);

for (const [topic, page] of Object.entries({ home, ...pages })) {
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
  html = html.replace('<div id="root"></div>', `<div id="root"><main><h1>${title}</h1><p>${description}</p>${contentFor(topic)}<nav aria-label="Portfolio pages">${navigation}</nav><p><a href="/">Open Usama Hassan's portfolio</a></p></main></div>`);
  fs.writeFileSync(path.join(build, topic === 'home' ? 'index.html' : `${page.path.slice(1)}.html`), html);
}
const urls = ['/', ...Object.values(pages).map(page => page.path)];
fs.writeFileSync(path.join(build, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${origin}${url}</loc></url>`).join('')}</urlset>\n`);
console.log('Generated portfolio HTML and sitemap from shared content.');
