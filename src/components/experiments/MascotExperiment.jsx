import React from 'react';
import Mascot from './Mascot';

export default function MascotExperiment() {
  return <div className="mascot-stage">
    <div className="mascot-stage-intro"><h2>iamus4ma</h2><p><span className="mascot-pointer-hint">Move your cursor to look around. Click to say hello.</span><span className="mascot-touch-hint">Tap to say hello.</span></p></div>
    <Mascot />
  </div>;
}
