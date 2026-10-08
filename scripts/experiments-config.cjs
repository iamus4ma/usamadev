const fs = require('node:fs');
const path = require('node:path');

function createConfig(experiments) {
  const slugs = new Set();
  const rewrites = [];
  for (const experiment of experiments) {
    const { slug, name, description, technologies, githubUrl, deploymentUrl, status, upstreamPath } = experiment;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw new Error(`Invalid or duplicate slug: ${slug}`);
    slugs.add(slug);
    if (!name || !description || !Array.isArray(technologies) || !technologies.every(item => typeof item === 'string')) throw new Error(`Missing card content: ${slug}`);
    if (!['example', 'pending', 'ready', 'local', 'inline'].includes(status)) throw new Error(`Invalid status: ${slug}`);
    const github = new URL(githubUrl);
    if (github.protocol !== 'https:' || github.hostname !== 'github.com' || github.username || github.password) throw new Error(`Use a GitHub HTTPS URL: ${slug}`);
    if (status === 'local' || status === 'inline') {
      if (deploymentUrl || upstreamPath) throw new Error(`Local experiments must not have deployment settings: ${slug}`);
      if (status === 'local' && (!Array.isArray(experiment.highlights) || !experiment.highlights.every(item => typeof item === 'string'))) throw new Error(`Missing local project highlights: ${slug}`);
      continue;
    }
    const origin = new URL(deploymentUrl);
    if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error(`Use an HTTPS deployment origin: ${slug}`);
    const prefix = `/experiments/${slug}`;
    if (upstreamPath !== '' && upstreamPath !== prefix) throw new Error(`upstreamPath must be empty or ${prefix}`);
    // Keep the portfolio's full-page player local when this experiment is proxied later.
    if (status === 'pending' || status === 'ready') rewrites.push({ source: `${prefix}/fullscreen`, destination: '/index.html' });
    if (status === 'ready') {
      if (origin.hostname.endsWith('.example.com') || github.pathname.includes('YOUR_USERNAME')) throw new Error(`Replace example URLs before enabling ${slug}`);
      const destination = `${origin.origin}${upstreamPath}`;
      rewrites.push({ source: prefix, destination: `${destination}/` });
      rewrites.push({ source: `${prefix}/:path*`, destination: `${destination}/:path*` });
    }
  }
  // External mounts must precede the portfolio's local experiment pages.
  rewrites.push({ source: '/experiments', destination: '/index.html' });
  rewrites.push({ source: '/experiments/:path*', destination: '/index.html' });
  return { $schema: 'https://openapi.vercel.sh/vercel.json', framework: 'create-react-app', buildCommand: 'npm run build', outputDirectory: 'build', rewrites };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const experiments = JSON.parse(fs.readFileSync(path.join(root, 'src/components/experiments/registry.json'), 'utf8'));
  const output = `${JSON.stringify(createConfig(experiments), null, 2)}\n`;
  const target = path.join(root, 'vercel.json');
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== output) {
      console.error('Experiment routes are out of date. Run npm run experiments:sync and commit vercel.json.');
      process.exitCode = 1;
    }
  } else {
    fs.writeFileSync(target, output);
    console.log('Updated vercel.json from the experiment registry.');
  }
}

module.exports = { createConfig };
