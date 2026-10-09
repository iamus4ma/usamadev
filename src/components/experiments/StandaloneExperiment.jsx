import React from 'react';
import { Helmet } from 'react-helmet';
import './Experiments.css';

export default function StandaloneExperiment({ experiment }) {
  return <main className="experiment-standalone">
    <Helmet>
      <title>{experiment.name} | Usama Hassan</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <iframe
      className="experiment-standalone-frame"
      src={experiment.deploymentUrl}
      title={`${experiment.name} live experiment`}
      allow="fullscreen"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
    <a className="experiment-return" href={`/experiments/${experiment.slug}`} aria-label={`Back to ${experiment.name} in the portfolio`}>← Back to portfolio</a>
  </main>;
}
