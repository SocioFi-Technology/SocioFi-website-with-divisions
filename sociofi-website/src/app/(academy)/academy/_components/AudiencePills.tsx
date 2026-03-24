'use client';

import { useState } from 'react';

export default function AudiencePills() {
  const [active, setActive] = useState<'founder' | 'leader' | 'team'>('founder');

  return (
    <div className="audience-pills" style={{ justifyContent: 'center' }}>
      {(['founder', 'leader', 'team'] as const).map((a) => (
        <button
          key={a}
          className={`audience-pill${active === a ? ' active' : ''}`}
          onClick={() => setActive(a)}
        >
          {a === 'founder' ? "I'm a Founder" : a === 'leader' ? "I'm a Leader" : "I'm on a Team"}
        </button>
      ))}
    </div>
  );
}
