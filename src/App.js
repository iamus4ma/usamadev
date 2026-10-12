import React from 'react';
import './App.css';
import Conversation from './components/conversation/Conversation';
import StandaloneExperiment from './components/experiments/StandaloneExperiment';
import experiments from './components/experiments/registry.json';

function App() {
  const standaloneSlug = /^\/experiments\/([a-z0-9-]+)\/fullscreen\/?$/.exec(window.location.pathname)?.[1];
  const standaloneExperiment = experiments.find(experiment => experiment.slug === standaloneSlug && ['pending', 'ready'].includes(experiment.status));

  return (
    standaloneExperiment ? <StandaloneExperiment experiment={standaloneExperiment} /> : <Conversation />
  );
}

export default App;
