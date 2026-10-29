'use client';

import { useEffect, useRef, useState } from 'react';

const lines = [
  '/bin/bash', '/etc/passwd', '/usr/lib/libc.so.6',
  ...Array.from({ length: 96 }, (_, index) => `/usr/lib/libuniverse-${String(index).padStart(3, '0')}.so`),
  '/dev/null', '/var/log/universe.log', '/home/anthony/.coffee',
].map((path) => `removing ${path}...`);

export default function FakeRemoval() {
  const [visible, setVisible] = useState(0);
  const [finished, setFinished] = useState(false);
  const log = useRef(null);

  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight;
    let timer;

    if (finished) {
      timer = setTimeout(() => window.location.reload(), 1600);
    } else if (visible === lines.length) {
      timer = setTimeout(() => setFinished(true), 350);
    } else {
      const delay = visible === 0 ? 350 : visible <= 3 ? 450 : 45;
      const count = Math.min(lines.length, visible + (visible < 3 ? 1 : 12));
      timer = setTimeout(() => setVisible(count), delay);
    }

    return () => clearTimeout(timer);
  }, [visible, finished]);

  return (
    <div className="terminal-removal">
      <pre ref={log} aria-live="off">
        {lines.slice(0, visible).join('\n')}
      </pre>
      {finished && <div role="status">jk. Rebooting universe</div>}
    </div>
  );
}
