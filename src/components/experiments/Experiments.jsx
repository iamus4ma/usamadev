import React, { Suspense } from 'react';
import experiments from './registry.json';
import './Experiments.css';

const DeveloperExperiment = React.lazy(() => import('./DeveloperExperiment'));
const MascotExperiment = React.lazy(() => import('./MascotExperiment'));

function ExperimentCatalog({ onSelect }) {
  return <div className="experiments-reply">
    <h2>Small ideas. Room to play.</h2>
    <p>A space for curious ideas, focused prototypes, and things I’m learning by building. Pick one to explore.</p>
    <div className="experiments-reply-list">{experiments.map(experiment => <article key={experiment.slug} className="experiments-reply-item">
      <div>
        <span className="experiment-status">{experiment.status === 'local' ? 'Local project · no live demo' : 'Interactive demo'}</span>
        <h3>{experiment.name}</h3>
        <p>{experiment.description}</p>
        <ul className="tech-tags" aria-label={`${experiment.name} technologies`}>{experiment.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>
      </div>
      <button type="button" onClick={() => onSelect(experiment)}>{experiment.status === 'local' ? 'View project' : 'Explore demo'} <span aria-hidden="true">↗</span></button>
    </article>)}</div>
  </div>;
}

function ExperimentContent({ experiment }) {
  switch (experiment.status) {
    case 'pending':
      return <div className="experiment-player">
        <iframe className="experiment-frame" src={experiment.deploymentUrl} title={`${experiment.name} live experiment`} allow="fullscreen" sandbox="allow-scripts allow-same-origin" />
        <div className="experiment-actions"><a className="conversation-link" href={`/experiments/${experiment.slug}/fullscreen`}>Open full page ↗</a><a className="conversation-link" href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
      </div>;
    case 'inline':
      return <Suspense fallback={<p>Loading experiment…</p>}>
        {experiment.slug === 'meet-usama' ? <MascotExperiment /> : <DeveloperExperiment />}
      </Suspense>;
    case 'local':
      return <>
        <p className="experiment-status">Local project · no live demo</p>
        <ul className="experiment-highlights">{experiment.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
        <p>Setup instructions are in the repository.</p>
        <a className="conversation-link" href={experiment.githubUrl} target="_blank" rel="noopener noreferrer">View source and setup ↗</a>
      </>;
    default:
      return <p>This experiment is not available to play here yet.</p>;
  }
}

function ExperimentDetail({ experiment, onSelect }) {
  return <div className="experiments-reply">
    {experiment?.slug !== 'meet-usama' && <h2>{experiment?.name || 'Experiment not found'}</h2>}
    {experiment ? <>{experiment.slug !== 'meet-usama' && <p>{experiment.description}</p>}<ExperimentContent experiment={experiment} /></> : <p>There is no experiment at this address.</p>}
    <button className="experiments-back" type="button" onClick={() => onSelect(null)}>Explore all experiments ↗</button>
  </div>;
}

export default function Experiments({ pathname = '/experiments', onSelect }) {
  const slug = pathname.replace(/\/$/, '').split('/')[2];
  if (!slug) return <ExperimentCatalog onSelect={onSelect} />;
  const selected = experiments.find(experiment => experiment.slug === slug);
  return <ExperimentDetail experiment={selected} onSelect={onSelect} />;
}
