import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import experiments from './registry.json';
import './Experiments.css';

const DeveloperExperiment = React.lazy(() => import('./DeveloperExperiment'));

export default function Experiments({ pathname = '/experiments', embedded = false, onSelect }) {
  const slug = pathname.replace(/\/$/, '').split('/')[2];
  const selected = experiments.find(experiment => experiment.slug === slug);
  const title = slug ? (selected ? selected.name : 'Experiment not found') : 'Small ideas. Room to play.';

  if (embedded) return <div className="experiments-reply">
    {!slug ? <>
      <h2>{title}</h2>
      <p>A space for curious ideas, focused prototypes, and things I’m learning by building. Pick one to explore.</p>
      <div className="experiments-reply-list">{experiments.map(experiment => <article key={experiment.slug} className="experiments-reply-item">
        <div><span className="experiment-status">{experiment.status === 'local' ? 'Local project · no live demo' : 'Interactive demo'}</span><h3>{experiment.name}</h3><p>{experiment.description}</p><ul className="tech-tags" aria-label={`${experiment.name} technologies`}>{experiment.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
        <button type="button" onClick={() => onSelect(experiment)}>{experiment.status === 'local' ? 'View project' : 'Explore demo'} <span aria-hidden="true">↗</span></button>
      </article>)}</div>
    </> : <>
      <h2>{title}</h2>
      {selected ? <>
        <p>{selected.description}</p>
        {selected.status === 'pending' && <div className="experiment-player"><iframe className="experiment-frame" src={selected.deploymentUrl} title={`${selected.name} live experiment`} allow="fullscreen" sandbox="allow-scripts allow-same-origin" /><div className="experiment-actions"><a className="conversation-link" href={`/experiments/${selected.slug}/fullscreen`}>Open full page ↗</a><a className="conversation-link" href={selected.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div>}
        {selected.status === 'inline' && <Suspense fallback={<p>Loading 3D model…</p>}><DeveloperExperiment /></Suspense>}
        {selected.status === 'local' && <><p className="experiment-status">Local project · no live demo</p><ul className="experiment-highlights">{selected.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><p>Setup instructions are in the repository.</p><a className="conversation-link" href={selected.githubUrl} target="_blank" rel="noopener noreferrer">View source and setup ↗</a></>}
      </> : <p>There is no experiment at this address.</p>}
      <button className="experiments-back" type="button" onClick={() => onSelect(null)}>Explore all experiments ↗</button>
    </>}
  </div>;

  return <section className="experiments-page" aria-labelledby="experiments-title">
    <Helmet>
      <title>{slug ? title : 'Experiments'} | Usama Hassan</title>
      <meta name="description" content="A collection of small experiments in interfaces, local AI, and browser automation by Usama Hassan." />
      <meta property="og:title" content={`${slug ? title : 'Experiments'} | Usama Hassan`} />
      <meta property="og:url" content={`https://usama.dev${slug && selected ? `/experiments/${selected.slug}` : '/experiments'}`} />
      {slug && <meta name="robots" content="noindex" />}
    </Helmet>
    <a className="conversation-link" href={slug ? '/experiments' : '/'}>{slug ? '← All experiments' : '← Back to the conversation'}</a>
    <p className="experiments-eyebrow">Usama’s lab / Experiments</p>
    <h1 id="experiments-title">{title}</h1>
    {slug ? <div className={`experiment-placeholder ${['pending', 'inline'].includes(selected?.status) ? 'experiment-player' : ''}`}>
      <p>{selected ? selected.description : 'There is no experiment at this address.'}</p>
      {selected?.status === 'pending' ? <><iframe className="experiment-frame" src={selected.deploymentUrl} title={`${selected.name} live experiment`} allow="fullscreen" sandbox="allow-scripts allow-same-origin" /><div className="experiment-actions"><a className="conversation-link" href={`/experiments/${selected.slug}/fullscreen`}>Open full page ↗</a><a className="conversation-link" href={selected.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></div></> : selected?.status === 'inline' ? <Suspense fallback={<p>Loading 3D model…</p>}><DeveloperExperiment /></Suspense> : selected?.status === 'local' ? <><p className="experiment-status">Local project: No live demo</p><ul className="experiment-highlights">{selected.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><p>This companion runs on your computer with its own Chrome session and local API. Setup instructions are in the repository.</p><a className="conversation-link" href={selected.githubUrl} target="_blank" rel="noopener noreferrer">View source and setup</a></> : selected && <><p className="experiment-status">{selected.status === 'example' ? 'Example · not connected yet' : 'Available through the deployed portfolio'}</p><p>{selected.status === 'example' ? 'This is a preview entry. The working experiment will appear here once its independent deployment is connected.' : 'The local development server does not proxy this experiment. Open this path on the Vercel deployment to use it.'}</p></>}
    </div> : <>
      <p className="experiments-intro">A space for curious ideas, focused prototypes, and things I’m learning by building.</p>
      <div className="experiments-grid">{experiments.map((experiment, index) => <article className="experiment-card" key={experiment.slug}>
        <div className="experiment-card-top"><span className="experiment-number">{String(index + 1).padStart(2, '0')}</span><span className="experiment-status">{experiment.status === 'inline' ? 'Interactive demo' : experiment.status === 'local' ? 'Local project' : experiment.status === 'example' ? 'Example' : 'Live experiment'}</span></div>
        <h2>{experiment.name}</h2>
        <p>{experiment.description}</p>
        <ul className="tech-tags" aria-label={`${experiment.name} technologies`}>{experiment.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
        <div className="experiment-actions"><a className="experiment-open" href={`/experiments/${experiment.slug}`}>{experiment.status === 'local' ? 'View project' : 'Open Experiment'} <span aria-hidden="true">↗</span></a>{experiment.status !== 'example' ? <a className="conversation-link" href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a> : <span className="experiment-source-pending">GitHub soon</span>}</div>
      </article>)}</div>
    </>}
  </section>;
}
