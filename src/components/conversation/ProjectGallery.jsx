import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import projects from '../projects/Data';
import { featuredProjectIds, projectStories } from './projectStories';
import './ProjectGallery.css';

function ProjectCard({ project, onPreview }) {
  const story = projectStories[project.id];
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="project-story">
    {story.image && !imageFailed ? <button className="project-preview" onClick={event => onPreview(project, event.currentTarget)} aria-label={`Preview ${project.title}`}>
      <img src={story.image} alt={`${project.title}: ${story.imageLabel}`} width="1280" height="800" loading="lazy" onError={() => setImageFailed(true)} />
      <span>{story.imageLabel}<span aria-hidden="true">↗</span></span>
    </button> : <div className="project-overview" aria-label={`${project.title} feature overview`}>
      <span className="project-overview-label">Project overview</span>
      <ol>{story.steps.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
    </div>}
    <div className="project-story-heading"><span>{story.category}</span><span>{project.period}</span></div>
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <ul className="tech-tags" aria-label={`${project.title} technologies`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
    <details className="project-case-study">
      <summary>Read case study<span aria-hidden="true">+</span></summary>
      <dl>{[['The problem', story.problem], ['What I built', story.contribution], ['Technical decisions', story.decisions], ['The result', story.result]].map(([label, text]) => <React.Fragment key={label}><dt>{label}</dt><dd>{text}</dd></React.Fragment>)}</dl>
    </details>
    <div className="project-story-links">
      {project.demo !== '#' && !story.demoUnavailable && <a href={project.demo} target="_blank" rel="noopener noreferrer">Open live project <span aria-hidden="true">↗</span></a>}
      {story.demoUnavailable && <span>Live demo currently unavailable</span>}
      {project.github !== '#' && <a href={project.github} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>}
    </div>
  </article>;
}

export default function ProjectGallery({ featured = false }) {
  const [preview, setPreview] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const titleId = useId();
  const selected = featured ? featuredProjectIds.map(id => projects.find(project => project.id === id)) : [...projects].reverse();

  useEffect(() => {
    if (preview) dialogRef.current?.showModal();
  }, [preview]);

  const closePreview = useCallback(() => {
    dialogRef.current?.close();
    setPreview(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    function closeOnBackdrop(event) {
      if (event.target === dialog) closePreview();
    }
    dialog.addEventListener('click', closeOnBackdrop);
    return () => dialog.removeEventListener('click', closeOnBackdrop);
  }, [closePreview]);

  return <div className="project-gallery">
    <div className="project-gallery-list">{selected.map(project => <ProjectCard key={project.id} project={project} onPreview={(item, opener) => { openerRef.current = opener; setPreview(item); }} />)}</div>
    <dialog ref={dialogRef} className="project-preview-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); closePreview(); }}>
      {preview && <div className="project-preview-dialog-body"><header><div><h2 id={titleId}>{preview.title}</h2><p>{projectStories[preview.id].imageLabel}</p></div><button autoFocus onClick={closePreview} aria-label="Close project preview">×</button></header><img src={projectStories[preview.id].image} alt={`${preview.title}: ${projectStories[preview.id].imageLabel}`} width="1280" height="800" /><a href={preview.demo} target="_blank" rel="noopener noreferrer">Open live project <span aria-hidden="true">↗</span></a></div>}
    </dialog>
  </div>;
}
