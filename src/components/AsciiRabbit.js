'use client';

import { useEffect, useRef, useState } from 'react';

export default function AsciiRabbit() {
  const viewport = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const abort = new AbortController();
    const host = viewport.current;

    async function start() {
      try {
        const { createAsciiRabbit } = await import('../lib/ascii-rabbit');
        if (abort.signal.aborted) return;
        await createAsciiRabbit(host, abort.signal);
        if (!abort.signal.aborted) setStatus('ready');
      } catch (error) {
        if (!abort.signal.aborted) {
          console.error('Unable to load the ASCII rabbit.', error);
          setStatus('unavailable');
        }
      }
    }

    start();
    // The viewer owns its listeners and GPU resources; abort tears it all down.
    return () => abort.abort();
  }, []);

  return (
    <div className="ascii-rabbit" data-state={status}>
      <div
        className="rabbit-viewport"
        ref={viewport}
        tabIndex={0}
        role="region"
        aria-label="Animated monochrome ASCII rabbit. Drag to orbit the camera."
        aria-busy={status === 'loading'}
      >
        {status !== 'ready' && (
          <p className="rabbit-status" role="status">
            {status === 'loading' ? 'loading rabbit…' : 'ASCII viewer unavailable.'}
          </p>
        )}
      </div>
    </div>
  );
}
