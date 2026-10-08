import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Developer from '../about/Developer';
import CanvasLoader from '../Loading';
import portrait from '../../assets/profile1.jpg';
import { useReducedMotion } from '../conversation/AnimatedResponse';

const animations = [
  { id: 'idle', label: 'Idle', detail: 'A calm resting pose' },
  { id: 'salute', label: 'Salute', detail: 'A quick greeting' },
  { id: 'clapping', label: 'Clapping', detail: 'A little celebration' },
];

export default function DeveloperExperiment() {
  const reducedMotion = useReducedMotion();
  const [selection, setSelection] = useState({ name: 'idle', replayKey: 0 });
  const [paused, setPaused] = useState(reducedMotion);
  const [visible, setVisible] = useState(true);
  const stageRef = useRef(null);
  const controlsRef = useRef(null);
  const active = animations.find(animation => animation.id === selection.name);
  const stopped = paused || !visible;

  useEffect(() => { if (reducedMotion) setPaused(true); }, [reducedMotion]);
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const handleComplete = useCallback((name, replayKey) => {
    setSelection(current => current.name === name && current.replayKey === replayKey
      ? { name: 'idle', replayKey: current.replayKey + 1 } : current);
  }, []);

  function chooseAnimation(name) {
    setSelection(current => ({ name, replayKey: current.replayKey + 1 }));
    setPaused(false);
  }

  return <div className="developer-experiment">
    <div ref={stageRef} className="developer-stage" aria-label="Interactive 3D developer model">
      <Canvas camera={{ position: [0, 3, 10], fov: 40 }} dpr={[1, 1.5]} frameloop={stopped ? 'demand' : 'always'} fallback={<div className="developer-static"><img src={portrait} alt="Usama Hassan" /><p>3D is unavailable on this device.</p></div>}>
        <ambientLight intensity={7} /> {/* NOSONAR: React Three Fiber light props are valid Three.js props. */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> {/* NOSONAR: React Three Fiber light props are valid Three.js props. */}
        <directionalLight position={[10, 10, 10]} intensity={1} /> {/* NOSONAR: React Three Fiber light props are valid Three.js props. */}
        <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} enableDamping />
        <Suspense fallback={<CanvasLoader />}>
          <Developer position-y={-3} scale={3} animationName={selection.name} replayKey={selection.replayKey} playOnce paused={stopped} onAnimationComplete={handleComplete} />
        </Suspense>
      </Canvas>
    </div>
    <fieldset className="developer-controls" aria-label="Model animations">
      {animations.map(animation => <button
        key={animation.id}
        type="button"
        className={selection.name === animation.id ? 'is-active' : ''}
        aria-pressed={selection.name === animation.id}
        onClick={() => chooseAnimation(animation.id)}
      >{animation.label}</button>)}
      <span className="developer-controls-divider" aria-hidden="true" />
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Play' : 'Pause'}</button>
      <button type="button" onClick={() => controlsRef.current?.reset()}>Reset view</button>
    </fieldset>
    <p className="developer-hint" aria-live="polite">{paused ? 'Paused' : active.detail}{selection.name !== 'idle' && !paused ? ' · plays once' : ''}. Drag to rotate the model.</p>
  </div>;
}
