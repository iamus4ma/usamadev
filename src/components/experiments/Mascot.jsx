import React, { useEffect, useRef, useState } from 'react';
import './Mascot.css';

const DIRECTIONS = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
const REACTIONS = ['blink', 'heart', 'sparkle', 'surprised', 'starstruck', 'bashful', 'sleepy', 'dizzy', 'delighted'];
const CLOCKWISE = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const PAYOFFS = ['heart', 'sparkle', 'delighted'];
const SQUASH = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function cellPosition(index) {
  return `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`;
}

function wrap(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export default function Mascot({ className = '', interactive = true, idleBlink = false }) {
  const buttonRef = useRef(null);
  const squashRef = useRef(null);
  const timersRef = useRef([]);
  const animationRef = useRef(null);
  const boopsRef = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState('center');
  const [reaction, setReaction] = useState(null);

  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    let sector = -1;
    let pointer = null;
    function aim() {
      if (!buttonRef.current || !pointer) return;
      const box = buttonRef.current.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      if (Math.hypot(dx, dy) < 70) {
        sector = -1;
        setDirection('center');
        return;
      }
      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + 0.12) return;
      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    }
    function onPointerMove(event) {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  useEffect(() => () => {
    timersRef.current.forEach(window.clearTimeout);
    animationRef.current?.cancel();
  }, []);

  useEffect(() => {
    if (!idleBlink) return;
    const touch = window.matchMedia?.('(hover: none) and (pointer: coarse)');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let interval;
    let blinkTimeout;
    function update() {
      window.clearInterval(interval);
      window.clearTimeout(blinkTimeout);
      if (!touch?.matches || reduced?.matches) { setReaction(null); return; }
      interval = window.setInterval(() => {
        if (document.hidden) return;
        setReaction('blink');
        blinkTimeout = window.setTimeout(() => setReaction(null), 160);
      }, 8000);
    }
    update();
    touch?.addEventListener('change', update);
    reduced?.addEventListener('change', update);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(blinkTimeout);
      touch?.removeEventListener('change', update);
      reduced?.removeEventListener('change', update);
    };
  }, [idleBlink]);

  function sayHello() {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    const later = (delay, next) => timersRef.current.push(window.setTimeout(() => setReaction(next), delay));
    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < 1600 ? boops.count + 1 : 1;
    boops.at = now;
    if (boops.count >= 4) {
      boops.count = 0;
      setReaction('dizzy');
      later(1100, null);
    } else {
      setReaction('blink');
      later(120, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(560, null);
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    animationRef.current?.cancel();
    animationRef.current = squashRef.current?.animate?.(SQUASH, { duration: 420, easing: 'linear' });
  }

  const directions = `${process.env.PUBLIC_URL}/characters/usama/directions.png`;
  const reactions = `${process.env.PUBLIC_URL}/characters/usama/reactions.png`;
  const directionStyle = { backgroundImage: `url(${directions})`, backgroundPosition: cellPosition(DIRECTIONS.indexOf(direction)), opacity: reaction ? 0 : 1 };
  const reactionStyle = { backgroundImage: `url(${reactions})`, backgroundPosition: cellPosition(REACTIONS.indexOf(reaction ?? 'blink')), opacity: reaction ? 1 : 0 };

  const sprites = <span ref={squashRef} className="mascot-squash">
    <span className="mascot-sprite" style={directionStyle} aria-hidden="true" />
    {(interactive || idleBlink) && <span className="mascot-sprite" style={reactionStyle} aria-hidden="true" />}
  </span>;

  return interactive ? <button ref={buttonRef} type="button" className={`mascot-button ${className}`.trim()} aria-label="Say hello to Usama" onClick={sayHello}>
    {sprites}
  </button> : <span ref={buttonRef} className={`mascot-button ${className}`.trim()} aria-hidden="true">
    {sprites}
  </span>;
}
