import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import projects from '../projects/Data';
import { Data as testimonials } from '../testimonials/Data';
import portrait from '../../assets/profile1.jpg';
import resume from '../../assets/usamaDev.pdf';
import { certifications, education, experience, matchTopic, skillGroups, topics, tourSteps } from './content';
import './Conversation.css';
import { gsap } from 'gsap';
import AnimatedResponse, { ResponseText, useReducedMotion } from './AnimatedResponse';
import ProjectGallery from './ProjectGallery';
import Experiments from '../experiments/Experiments';
import Mascot from '../experiments/Mascot';
import experiments from '../experiments/registry.json';
import { Helmet } from 'react-helmet';

const paths = {
  plus: 'M12 5v14M5 12h14',
  arrow: 'M12 19V5m-6 6 6-6 6 6',
  external: 'M7 17 17 7M7 7h10v10',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  lab: 'M8 3h8M10 3v7L4.3 19A2 2 0 0 0 6 22h12a2 2 0 0 0 1.7-3L14 10V3M7 16h10',
  case: 'M9 6V3h6v3M3 6h18v14H3zM3 11c6 4 12 4 18 0M12 11v4',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
  chat: 'M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z',
  file: 'M14 2H5v20h14V7ZM14 2v5h5M8 12h8M8 16h6',
  mail: 'M3 5h18v14H3zM3 5l9 8 9-8',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
};

function isTouchDevice() {
  return window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ?? false;
}

function Icon({ name, ...props }) {
  const iconRef = useRef(null);

  useLayoutEffect(() => {
    const icon = iconRef.current;
    const trigger = icon.closest('button, a, .conversation-welcome, .reply-note, .conversation-composer');
    if (!trigger) return;
    const motion = {
      plus: { rotation: 90 },
      arrow: { y: -3 },
      external: { x: 2, y: -2 },
      download: { y: 3 },
      person: { y: -2, rotation: -6 },
      grid: { rotation: 8, scale: 1.08 },
      code: { scale: 1.12 },
      lab: { rotation: -8, y: -2 },
      case: { rotation: -8, y: -1 },
      spark: { rotation: 35, scale: 1.1 },
      chat: { rotation: -8, scale: 1.08 },
      file: { rotation: -7, y: -2 },
      mail: { x: 2, rotation: -8 },
      sun: { rotation: 45 },
      moon: { rotation: -20 },
      menu: { scaleX: .85 },
      close: { rotation: 90 },
    };
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', context => {
      gsap.set(icon, { transformOrigin: '50% 50%' });
      context.add('enter', () => {
        if (trigger.matches(':disabled') || trigger.closest('[inert]')) return;
        gsap.to(icon, { ...motion[name], duration: .24, ease: 'power2.out', overwrite: true });
      });
      context.add('leave', () => {
        gsap.to(icon, { x: 0, y: 0, rotation: 0, scale: 1, duration: .18, ease: 'power2.out', overwrite: true });
      });
      trigger.addEventListener('pointerenter', context.enter);
      trigger.addEventListener('pointerleave', context.leave);
      trigger.addEventListener('pointercancel', context.leave);
      return () => {
        trigger.removeEventListener('pointerenter', context.enter);
        trigger.removeEventListener('pointerleave', context.leave);
        trigger.removeEventListener('pointercancel', context.leave);
      };
    });
    return () => media.revert();
  }, [name]);

  return <svg ref={iconRef} data-icon={name} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.chat} /></svg>;
}

function ExternalLink({ href, children, className = '' }) {
  return <a className={`conversation-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">{children}<Icon name="external" /></a>;
}

function Timeline({ items }) {
  return <ol className="conversation-timeline">{items.map(item => <li key={item.place}><div><h4>{item.role}</h4><p>{item.place}</p>{item.location && <p className="timeline-location">{item.location}</p>}{item.description && <p className="timeline-description">{item.description}</p>}{item.highlights && <ul className="timeline-highlights">{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>}</div><span>{item.period}</span></li>)}</ol>;
}

function Reply({ topic, featured = false, onExperimentSelect }) {
  if (topic === 'experiments' || topic.startsWith('experiment:')) return <Experiments pathname={topic === 'experiments' ? '/experiments' : `/experiments/${topic.slice(11)}`} onSelect={onExperimentSelect} />;
  switch (topic) {
    case 'about': return <>
      <ResponseText as="h2">A little about Usama.</ResponseText>
      <div className="about-profile">
        <figure className="about-photo">
          <div className="about-mascot"><Mascot className="about-mascot-button" /></div>
          <figcaption><strong>Usama Hassan</strong><span>Full Stack Developer</span><span className="about-mascot-hint">Tap to say hello.</span></figcaption>
        </figure>
        <div className="about-profile-info">
          <ResponseText>I’m Usama Hassan, a software engineer and full stack developer based in Faisalabad, Pakistan. I build scalable web and mobile applications with React, React Native, Expo, and the MERN stack.</ResponseText>
          <ResponseText>My experience spans healthcare products, admin dashboards, e-commerce platforms, and business management systems. I focus on performance, reusable architecture, and clean, maintainable code.</ResponseText>
          <ResponseText>I also share what I learn through technical articles and LinkedIn posts, while exploring cloud architecture, system design, AI, and LLMs.</ResponseText><div className="reply-note"><Icon name="code" /><span>Web and mobile. Full stack thinking.</span></div>
        </div>
      </div>
    </>;
    case 'projects': return <><ResponseText as="h2">Ideas turned into working products.</ResponseText><ResponseText>{featured ? 'Start with three projects spanning real estate, messaging, and commerce. Open a case study to see the problem, build, and technical decisions.' : `Explore ${projects.length} projects through screenshots, feature overviews, and expandable case studies.`}</ResponseText><ProjectGallery featured={featured} /></>;
    case 'skills': return <><ResponseText as="h2">The tools behind the work.</ResponseText><ResponseText>I work with JavaScript and TypeScript across React web applications, React Native and Expo mobile apps, and Node.js, Express, and MongoDB backends. The technologies I’m currently exploring are listed separately below.</ResponseText><div className="skill-groups">{skillGroups.map(group => <section key={group.title}><h3>{group.title}</h3><ul className="tech-tags">{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section>)}</div></>;
    case 'experience': return <><ResponseText as="h2">My journey so far.</ResponseText><ResponseText>From MERN stack training to building healthcare products across web and mobile.</ResponseText><Timeline items={experience} /><h3 className="reply-subheading">Education</h3><Timeline items={education} /></>;
    case 'certifications': return <><ResponseText as="h2">Learning put into practice.</ResponseText><ResponseText>My certifications cover web fundamentals, React applications, and backend API development.</ResponseText><ul className="certification-list">{certifications.map(title => <li key={title}><Icon name="file" /><h3>{title}</h3></li>)}</ul></>;
    case 'services': return <><ResponseText as="h2">Let’s build something useful.</ResponseText><ResponseText>I help build web and mobile products, from reusable interfaces to API integration and backend services.</ResponseText><dl className="conversation-services"><dt>Web development</dt><dd>End-to-end web applications, backend architecture, and APIs.</dd><dt>Frontend development</dt><dd>Responsive interfaces and React-based frontend architecture.</dd><dt>Mobile development</dt><dd>React Native and Expo applications, with TypeScript and API integration.</dd><dt>UI/UX design</dt><dd>Intuitive interfaces, product design, and prototyping.</dd></dl><a className="conversation-link" href="mailto:usama.0.vip@gmail.com">Tell me about your project<Icon name="external" /></a></>;
    case 'testimonials': return <><ResponseText as="h2">A few words from clients.</ResponseText><div className="conversation-quotes">{testimonials.map(item => <figure key={item.id}><blockquote>“{item.description}”</blockquote><figcaption><img src={item.image} alt="" width="32" height="32" loading="lazy" />{item.title}</figcaption></figure>)}</div></>;
    case 'resume': return <><ResponseText as="h2">Take the details with you.</ResponseText><ResponseText>Download my résumé for a closer look at my background and experience.</ResponseText><a className="resume-download" href={resume} download="Usama-Hassan-Resume.pdf"><Icon name="file" /><span><strong>Usama Hassan</strong><small>Résumé · PDF</small></span><Icon name="download" /></a></>;
    case 'contact': return <><ResponseText as="h2">Start a real conversation.</ResponseText><ResponseText>Have a project in mind, a role to discuss, or just want to say hello? Get in touch directly.</ResponseText><a className="contact-email" href="mailto:usama.0.vip@gmail.com">usama.0.vip@gmail.com<Icon name="external" /></a><div className="contact-details"><span>Faisalabad, Pakistan</span><a className="conversation-link" href="tel:+923414958199">+92 341 4958199<Icon name="external" /></a></div><div className="contact-socials"><ExternalLink href="https://www.linkedin.com/in/iamus4ma/">LinkedIn</ExternalLink><ExternalLink href="https://github.com/iamus4ma">GitHub</ExternalLink></div></>;
    default: return <><ResponseText as="h2">Let’s stay with what I know.</ResponseText><ResponseText>This is a portfolio with prepared replies, so I don’t have an answer to that question. Try asking about my projects, tech stack, experience, certifications, services, résumé, or contact details.</ResponseText></>;
  }
}

export default function Conversation() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const isExperiments = pathname === '/experiments' || pathname.startsWith('/experiments/');
  const routeMessage = path => {
    const slug = path.match(/^\/experiments\/([a-z0-9-]+)\/?$/)?.[1];
    if (slug) return [{ id: `route-${slug}`, prompt: `Tell me about ${experiments.find(item => item.slug === slug)?.name || 'this experiment'}`, topic: `experiment:${slug}` }];
    return /^\/experiments\/?$/.test(path) ? [{ id: 'route-experiments', prompt: 'Show me Usama’s experiments', topic: 'experiments' }] : [];
  };
  useEffect(() => {
    const onPopState = () => { setPathname(window.location.pathname); setMessages(routeMessage(window.location.pathname)); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const [messages, setMessages] = useState(() => routeMessage(window.location.pathname));
  const nextMessageId = useRef(0);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourStep, setTourStep] = useState(null);
  const tourNextRef = useRef(null);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark'; } catch { return false; }
  });
  const inputRef = useRef(null);
  const latestRef = useRef(null);
  const mainRef = useRef(null);
  const menuButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const appRef = useRef(null);
  const reduced = useReducedMotion();
  const hasMessages = messages.length > 0;
  const activeTopic = messages[messages.length - 1]?.topic;

  useEffect(() => {
    if (tourStep !== null) tourNextRef.current?.focus({ preventScroll: true });
  }, [tourStep]);

  // Composer affordance: show a subtle pulse on touch devices to invite interaction
  const [showAffordance, setShowAffordance] = useState(false);

  useEffect(() => {
    if (!isTouchDevice()) return;
    // Start affordance after a short delay so it doesn't clash with initial page animations
    const id = setTimeout(() => setShowAffordance(true), 800);
    return () => clearTimeout(id);
  }, []);
  useLayoutEffect(() => {
    if (hasMessages || reduced) return;
    const context = gsap.context(() => {
      gsap.from('.welcome-avatar, .welcome-intro, .conversation-welcome h1, .welcome-description, .suggested-prompts button', {
        opacity: 0, y: 10, duration: .35, stagger: .045, ease: 'power2.out', clearProps: 'opacity,transform',
      });
    }, appRef);
    return () => context.revert();
  }, [hasMessages, reduced]);

  useLayoutEffect(() => {
    if (!menuOpen || reduced) return;
    const context = gsap.context(() => {
      gsap.from(sidebarRef.current, { x: -24, opacity: 0, duration: .22, ease: 'power2.out', clearProps: 'opacity,transform' });
      gsap.from('.navigation-backdrop', { opacity: 0, duration: .16, clearProps: 'opacity' });
    }, appRef);
    return () => context.revert();
  }, [menuOpen, reduced]);

  useEffect(() => {
    const main = mainRef.current;
    const latest = latestRef.current;
    if (!messages.length || !main || !latest) return;

    // Scroll only the conversation; scrollIntoView can also move the document.
    const inset = Number.parseFloat(window.getComputedStyle(main).scrollPaddingTop) || 0;
    main.scrollTop += latest.getBoundingClientRect().top - main.getBoundingClientRect().top - inset;
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Theme still works without browser storage. */ }
  }, [dark]);

  useEffect(() => {
    if (menuOpen) sidebarRef.current?.querySelector('button')?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia?.('(min-width: 769px)');
    const closeOnDesktop = event => { if (event.matches) setMenuOpen(false); };
    desktop?.addEventListener('change', closeOnDesktop);
    return () => desktop?.removeEventListener('change', closeOnDesktop);
  }, []);

  function ask(prompt, topic = matchTopic(prompt), nextTourStep = null) {
    if (!prompt.trim()) return;
    if (topic === 'tour') { startTour(); return; }
    let nextPath = '/';
    if (topic === 'experiments') nextPath = '/experiments';
    else if (topic.startsWith('experiment:')) nextPath = `/experiments/${topic.slice(11)}`;
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    setPathname(nextPath);
    setTourStep(nextTourStep);
    setMessages(previous => [...previous, { id: nextMessageId.current++, prompt: prompt.trim(), topic, tourStep: nextTourStep }]);
    setInput('');
    setMenuOpen(false);
    if (nextTourStep === null && !isTouchDevice()) inputRef.current?.focus({ preventScroll: true });
  }

  function startTour() {
    ask(tourSteps[0].prompt, tourSteps[0].topic, 0);
  }

  function endTour() {
    setTourStep(null);
    if (!isTouchDevice()) inputRef.current?.focus({ preventScroll: true });
  }

  function nextTourStop() {
    if (tourStep === tourSteps.length - 1) { endTour(); return; }
    const next = tourStep + 1;
    ask(tourSteps[next].prompt, tourSteps[next].topic, next);
  }

  function reset() {
    if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
    setPathname('/');
    setTourStep(null);
    setMessages([]);
    setInput('');
    setMenuOpen(false);
    if (!isTouchDevice()) inputRef.current?.focus({ preventScroll: true });
  }

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  function selectExperiment(experiment) {
    ask(experiment ? `Tell me about ${experiment.name}` : 'Show me Usama’s experiments', experiment ? `experiment:${experiment.slug}` : 'experiments');
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleNavigationKeys(event) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus(); return; }
      if (event.key !== 'Tab') return;
      const controls = sidebarRef.current.querySelectorAll('a[href], button');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', handleNavigationKeys);
    return () => document.removeEventListener('keydown', handleNavigationKeys);
  }, [menuOpen]);

  const selectedExperiment = experiments.find(item => pathname === `/experiments/${item.slug}`);
  const pageTitle = isExperiments ? `${selectedExperiment?.name || 'Experiments'} | Usama Hassan` : 'Usama Hassan | Full Stack Developer';

  return <div ref={appRef} className="conversation-app" data-chat-theme={dark ? 'dark' : 'light'}>
    <Helmet><title>{pageTitle}</title></Helmet>
    <a className="conversation-skip" href="#conversation-main">Skip to conversation</a>
    {menuOpen && <button type="button" className="navigation-backdrop" onClick={closeMenu} aria-label="Close navigation" />}
    <aside ref={sidebarRef} id="portfolio-sidebar" className={`conversation-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Portfolio navigation">
      <div className="sidebar-brand"><img className="brand-favicon" src={`${process.env.PUBLIC_URL}/favicon.png`} alt="" width="36" height="36" /><span>usama<span className="brand-muted">Dev</span></span><button className="icon-button mobile-close" onClick={closeMenu} aria-label="Close navigation"><Icon name="close" /></button></div>
      <button className="new-conversation" onClick={reset}><Icon name="plus" />New conversation</button>
      <button className="sidebar-tour" onClick={startTour}><Icon name="spark" />Quick tour<Icon name="external" /></button>
      <nav aria-label="Explore portfolio"><p className="sidebar-label">Explore</p>{topics.map(topic => <button key={topic.id} className={`topic-nav ${activeTopic === topic.id || (topic.id === 'experiments' && activeTopic?.startsWith('experiment:')) ? 'is-active' : ''}`} aria-current={activeTopic === topic.id || (topic.id === 'experiments' && activeTopic?.startsWith('experiment:')) ? 'true' : undefined} onClick={() => ask(topic.prompt, topic.id)}><Icon name={topic.icon} /><span>{topic.label}</span>{topic.id === 'projects' && <small>{projects.length}</small>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-socials"><ExternalLink href="https://github.com/iamus4ma">GitHub</ExternalLink><ExternalLink href="https://www.linkedin.com/in/iamus4ma/">LinkedIn</ExternalLink></div><div className="sidebar-profile"><img src={portrait} alt="Usama Hassan" width="38" height="38" /><div><strong>Usama Hassan</strong><span>Full Stack Developer</span></div><button className="icon-button" onClick={() => setDark(value => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}><Icon name={dark ? 'sun' : 'moon'} /></button></div></div>
    </aside>
    <div className="conversation-workspace">
      <header className="conversation-header"><div><button ref={menuButtonRef} className="icon-button mobile-menu" aria-expanded={menuOpen} aria-controls="portfolio-sidebar" aria-label="Toggle navigation" onClick={() => setMenuOpen(value => !value)}><Icon name="menu" /></button><span>Usama’s portfolio <span className="header-divider">/</span> <span className="header-muted">{isExperiments ? 'Experiments' : 'A conversation'}</span></span></div><a href="mailto:usama.0.vip@gmail.com">Let’s talk<Icon name="external" /></a></header>
      <main ref={mainRef} id="conversation-main" className={`conversation-main ${messages.length || isExperiments ? 'has-messages' : ''}`} tabIndex="-1">
        {!messages.length ? <section className="conversation-welcome"><div className="welcome-avatar"><Mascot className="welcome-mascot" idleBlink /></div><p className="welcome-intro">A different way to get to know me.</p><h1>Hi, I’m Usama.<br /><span>What would you like to explore?</span></h1><p className="welcome-description">Full stack developer. Thoughtful interfaces.<br className="desktop-break" /> Web and mobile, from interface to API.</p><button className="tour-invitation" onClick={startTour}><Icon name="spark" /><span>Take a quick tour</span><small>4 stops</small><Icon name="external" /></button><div className="suggested-prompts">{['projects', 'skills', 'about', 'contact'].map(id => { const topic = topics.find(item => item.id === id); return <button key={id} onClick={() => ask(topic.prompt, id)}><Icon name={topic.icon} /><strong>{topic.prompt}</strong><span>{topic.hint}</span><Icon name="external" className="prompt-arrow" /></button>; })}</div></section> : <div className="conversation-thread" role="log" aria-label="Portfolio conversation" aria-live="polite" aria-relevant="additions">{messages.map((message, index) => <section className="conversation-turn" key={message.id} ref={index === messages.length - 1 ? latestRef : null}><div className="visitor-message"><span className="sr-only">You asked: </span>{message.prompt}</div><div className="portfolio-message"><div className="reply-author"><img className="reply-avatar" src={`${process.env.PUBLIC_URL}/favicon.png`} alt="" width="40" height="40" /><strong>Usama’s portfolio</strong><span>Prepared response</span></div><AnimatedResponse active={index === messages.length - 1}><Reply topic={message.topic} featured={message.tourStep === 1} onExperimentSelect={selectExperiment} /></AnimatedResponse></div></section>)}<div className="follow-up-prompts" aria-label="Explore next">{topics.filter(topic => topic.id !== activeTopic).slice(0, 4).map(topic => <button key={topic.id} onClick={() => ask(topic.prompt, topic.id)}>{topic.label}<Icon name="external" /></button>)}</div></div>}
      </main>
      <footer className={`conversation-composer ${showAffordance ? 'composer-afford' : ''}`}>{tourStep !== null && <section className="tour-controls" aria-label="Guided tour"><div className="tour-progress"><span aria-live="polite">{tourStep + 1} / {tourSteps.length} <strong>{tourSteps[tourStep].label}</strong></span><div className="tour-progress-track" aria-hidden="true">{tourSteps.map((step, index) => <i key={step.topic} className={index <= tourStep ? 'is-complete' : ''} />)}</div></div><div className="tour-actions"><button onClick={endTour}>Skip tour</button><button ref={tourNextRef} className="tour-next" onClick={nextTourStop}>{tourStep === tourSteps.length - 1 ? 'Finish tour' : 'Next'}<Icon name="external" /></button></div></section>}<form onSubmit={event => { event.preventDefault(); ask(input); }}><label className="sr-only" htmlFor="portfolio-question">Ask about Usama’s portfolio</label><textarea id="portfolio-question" ref={inputRef} rows="2" maxLength="500" value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about my work, skills, or experience…" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); ask(input); } }} /><div className="composer-bottom"><span><Icon name="chat" />A little curiosity goes a long way.</span><button type="submit" className="send-question" disabled={!input.trim()} aria-label="Send question"><Icon name="arrow" /></button></div></form><p>Prepared by Usama. No AI, just a more personal portfolio.</p></footer>
    </div>
  </div>;
}
