const projects = require('../src/components/projects/projects.json');
const profile = require('../src/components/conversation/profile.json');
const experiments = require('../src/components/experiments/registry.json');

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const paragraph = text => text ? `<p>${escape(text)}</p>` : '';
const list = items => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
const timeline = items => items.map(item => `<section><h3>${escape(item.role)}</h3>${paragraph(item.place)}${paragraph(item.period)}${paragraph(item.location)}${paragraph(item.description)}${item.highlights ? list(item.highlights) : ''}</section>`).join('');
const projectContent = () => projects.map(item => `<article><h2>${escape(item.title)}</h2>${paragraph(item.description)}${paragraph(item.period)}${list(item.technologies)}${item.demo.startsWith('https://') ? `<a href="${escape(item.demo)}">Open ${escape(item.title)}</a>` : ''}</article>`).join('');

function contentFor(topic) {
  switch (topic) {
    case 'about': return paragraph('I build web and mobile applications with React, React Native, Expo, and the MERN stack. My experience spans healthcare products, admin dashboards, e-commerce platforms, and business management systems.') + paragraph('I focus on performance, reusable architecture, and clean, maintainable code. I also share what I learn through technical articles and LinkedIn posts.') + '<h2>Technical skills</h2>' + profile.skillGroups.map(group => `<section><h3>${escape(group.title)}</h3>${list(group.skills)}</section>`).join('');
    case 'projects': return projectContent();
    case 'experience': return '<h2>Professional experience</h2>' + timeline(profile.experience) + '<h2>Education</h2>' + timeline(profile.education);
    case 'experiments': return experiments.map(item => `<article><h2><a href="/experiments/${item.slug}">${escape(item.name)}</a></h2>${paragraph(item.description)}${list(item.technologies)}</article>`).join('');
    default: return paragraph('You may know me online as @iamus4ma. Explore my projects, experience, and interactive experiments through a portfolio with prepared conversation responses.') + '<p><a href="https://github.com/iamus4ma">GitHub: iamus4ma</a> · <a href="https://www.linkedin.com/in/iamus4ma/">LinkedIn: Usama Hassan</a></p>';
  }
}

module.exports = { escape, contentFor };
