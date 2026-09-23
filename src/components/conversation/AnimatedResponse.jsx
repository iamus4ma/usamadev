import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = event => setReduced(event.matches);
    media?.addEventListener('change', update);
    return () => media?.removeEventListener('change', update);
  }, []);
  return reduced;
}

// React owns the word spans, so cancelling a reveal never leaves mutated text behind.
export function ResponseText({ as: Tag = 'p', children }) {
  return <Tag className="response-text">{React.Children.map(children, (child, part) =>
    typeof child === 'string' ? child.split(/(\s+)/).map((word, index) =>
      /^\s+$/.test(word) ? word : <span className="response-word" key={`${part}-${index}`}>{word}</span>
    ) : child
  )}</Tag>;
}

export default function AnimatedResponse({ active, children }) {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const reduced = useReducedMotion();
  const [complete, setComplete] = useState(reduced);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const body = root.querySelector('.response-body');
    const typing = root.querySelector('.response-typing');
    const words = body.querySelectorAll(':scope > .response-text .response-word, .about-profile-info > .response-text .response-word');
    const details = [...body.querySelectorAll(':scope > :not(.response-text)')].flatMap(element =>
      element.matches('.about-profile') ? [...element.querySelectorAll('.about-photo, .reply-note')] :
      element.matches('.conversation-projects, .conversation-quotes, .conversation-timeline, .skill-groups, .conversation-services, .certification-list')
        ? [...element.children] : [element]
    );
    let pulse;
    const context = gsap.context(() => {
      const finish = () => {
        hasCompletedRef.current = true;
        pulse?.kill();
        body.hidden = false;
        body.removeAttribute('inert');
        gsap.set(body, { clearProps: 'display' });
        gsap.set([...words, ...details], { clearProps: 'opacity,visibility,transform' });
        setComplete(true);
      };
      if (reduced || hasCompletedRef.current) { finish(); return; }

      setComplete(false);
      body.setAttribute('inert', '');
      gsap.set(body, { display: 'none' });
      gsap.set(words, { opacity: 0 });
      gsap.set(details, { autoAlpha: 0, y: 7 });
      pulse = gsap.to(root.querySelectorAll('.typing-dot'), {
        opacity: .35, y: -3, duration: .28, stagger: .1, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      const timeline = gsap.timeline({ onComplete: finish });
      timelineRef.current = timeline;
      timeline.to(typing, { opacity: 0, duration: .12, delay: .35 })
        .set(typing, { display: 'none' })
        .set(body, { clearProps: 'display' })
        .call(() => {
          if (!activeRef.current) return;
          const main = root.closest('main');
          const turn = root.closest('.conversation-turn');
          if (!main || !turn) return;
          const inset = parseFloat(window.getComputedStyle(main).scrollPaddingTop) || 0;
          main.scrollTop += turn.getBoundingClientRect().top - main.getBoundingClientRect().top - inset;
        });
      if (words.length) timeline.to(words, {
        opacity: 1, duration: .12, stagger: { amount: Math.min(words.length * .014, 1.15) }, ease: 'none',
      });
      if (details.length) timeline.to(details, {
        autoAlpha: 1, y: 0, duration: .24, stagger: .07, ease: 'power2.out',
      }, '-=0.04');
    }, root);
    return () => { context.revert(); body.removeAttribute('inert'); timelineRef.current = null; };
  }, [reduced]);

  // A new question completes the previous reply instead of leaving overlapping streams.
  useEffect(() => { if (!active) timelineRef.current?.progress(1); }, [active]);

  function showNow() {
    timelineRef.current?.progress(1);
    rootRef.current.closest('.conversation-app')?.querySelector('textarea')?.focus({ preventScroll: true });
  }

  return <div className="animated-response" ref={rootRef}>
    <div className="response-stream" aria-busy={!complete}>
      {!complete && <div className="response-typing" aria-hidden="true"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /><span>Preparing reply</span></div>}
      <div className="reply-content response-body">{children}</div>
    </div>
    {!complete && <button className="reveal-now" onClick={showNow}>Show full response<span aria-hidden="true"> ↗</span></button>}
  </div>;
}
