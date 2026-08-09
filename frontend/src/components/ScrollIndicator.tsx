import React from 'react';
import { ArrowDown } from 'lucide-react';

export const ScrollIndicator: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '144px', height: '144px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spin-slow" viewBox="0 0 144 144" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <path
          id="circlePath"
          d="M 72, 72 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
          fill="none"
        />
        <text className="mono-text" style={{ fontSize: '11px', fontWeight: 'bold', fill: 'var(--brand-orange)', textTransform: 'uppercase' }}>
          <textPath href="#circlePath" startOffset="0%">
            SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • 
          </textPath>
        </text>
      </svg>
      <ArrowDown size={32} color="var(--brand-orange)" strokeWidth={3} />
    </div>
  );
};
