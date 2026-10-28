'use client';

import { useEffect, useRef, useState } from 'react';

export default function AsciiRabbit() {
  const viewport = useRef(null);
  const viewer = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const abort = new AbortController();

    async function start() {
      try {
        const { createAsciiRabbit } = await import('../lib/ascii-rabbit');
        if (abort.signal.aborted) return;
        const controls = await createAsciiRabbit(viewport.current, abort.signal);
        if (abort.signal.aborted) { controls.dispose(); return; }
        viewer.current = controls;
        setStatus('ready');
      } catch (error) {
        if (!abort.signal.aborted) {
          console.error('Unable to load the ASCII rabbit.', error);
          setStatus('unavailable');
        }
      }
    }

    start();
    return () => {
      abort.abort();
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);

  function onKeyDown(event) {
    if (viewer.current?.handleKey(event.key)) event.preventDefault();
  }

  return (
    <div className="ascii-rabbit" data-state={status}>
      <div className="rabbit-viewport" ref={viewport} tabIndex={0} role="region" aria-label="Animated monochrome ASCII rabbit. Drag or use arrow keys to orbit the camera." aria-busy={status === 'loading'} onKeyDown={onKeyDown}>
        {status !== 'ready' && <p className="rabbit-status" role="status">{status === 'loading' ? 'loading rabbit…' : 'ASCII viewer unavailable.'}</p>}
      </div>
    </div>
  );
}
