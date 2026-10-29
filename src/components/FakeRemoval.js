'use client';

import { useEffect, useRef, useState } from 'react';

const paths = [
  '/bin/bash', '/etc/passwd', '/usr/lib/libc.so.6',
  ...Array.from({ length: 96 }, (_, index) => `/usr/lib/libuniverse-${String(index).padStart(3, '0')}.so`),
  '/dev/null', '/var/log/universe.log', '/home/anthony/.coffee',
];

export default function FakeRemoval() {
  const [visible, setVisible] = useState(0);
  const [finished, setFinished] = useState(false);
  const log = useRef(null);

  useEffect(() => {
    let count = 0;
    let timer = setTimeout(tick, 350);

    function tick() {
      count = Math.min(paths.length, count + (count < 3 ? 1 : 12));
      setVisible(count);
      if (count < paths.length) {
        timer = setTimeout(tick, count <= 3 ? 450 : 45);
      } else {
        timer = setTimeout(() => {
          setFinished(true);
          timer = setTimeout(() => window.location.reload(), 1600);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight;
  }, [visible]);

  return (
    <div className="terminal-removal">
      <pre ref={log} aria-live="off">
        {paths.slice(0, visible).map((path) => `removing ${path}...`).join('\n')}
      </pre>
      {finished && <div role="status">jk. Rebooting universe</div>}
    </div>
  );
}
