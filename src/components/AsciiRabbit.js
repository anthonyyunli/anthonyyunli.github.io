'use client';

import { useEffect, useRef, useState } from 'react';

export default function AsciiRabbit() {
  const viewport = useRef(null);
  const viewer = useRef(null);
  const [status, setStatus] = useState('loading');
  const [editing, setEditing] = useState(false);
  const [view, setView] = useState(null);
  const [values, setValues] = useState('');
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (!editing || !viewer.current) return;
    viewer.current.setEditing(true);
    const refresh = () => setView(viewer.current?.getView() ?? null);
    refresh();
    const timer = setInterval(refresh, 150);
    return () => {
      clearInterval(timer);
      viewer.current?.setEditing(false);
    };
  }, [editing]);

  function changeView(property, value) {
    const next = { ...viewer.current.getView(), [property]: Number(value) };
    viewer.current.setView(next);
    setView(next);
    setValues('');
    setCopied(false);
  }

  async function copyValues() {
    try {
      await navigator.clipboard.writeText(values);
      setCopied(true);
    } catch {
      document.getElementById('camera-values')?.select();
    }
  }

  function onKeyDown(event) {
    if (viewer.current?.handleKey(event.key)) event.preventDefault();
  }

  return (
    <div className="ascii-rabbit" data-state={status}>
      <div className="rabbit-viewport" ref={viewport} tabIndex={0} role="region" aria-label="Animated monochrome ASCII rabbit. Drag or use arrow keys to orbit the camera." aria-busy={status === 'loading'} onKeyDown={onKeyDown}>
        {status !== 'ready' && <p className="rabbit-status" role="status">{status === 'loading' ? 'loading rabbit…' : 'ASCII viewer unavailable.'}</p>}
      </div>
      {status === 'ready' && <div className="camera-setup">
        <button type="button" className="camera-toggle" aria-expanded={editing} aria-controls="camera-panel" onClick={() => setEditing(!editing)}>[{editing ? 'close camera setup' : 'camera setup'}]</button>
        {editing && <div id="camera-panel" className="camera-panel">
          <p>Temporary camera setup</p>
          {view && <>
            <label htmlFor="camera-azimuth">rotation <output>{view.azimuth}°</output></label>
            <input id="camera-azimuth" type="range" min="0" max="360" step=".1" value={view.azimuth} onChange={e => changeView('azimuth', e.target.value)} />
            <label htmlFor="camera-elevation">elevation <output>{view.elevation}°</output></label>
            <input id="camera-elevation" type="range" min="-15" max="65" step=".1" value={view.elevation} onChange={e => changeView('elevation', e.target.value)} />
            <label htmlFor="camera-distance">zoom / distance <output>{view.distance}</output></label>
            <input id="camera-distance" type="range" min="2.4" max="12" step=".05" value={view.distance} onChange={e => changeView('distance', e.target.value)} />
            <button type="button" onClick={() => { setValues(JSON.stringify(viewer.current.getView(), null, 2)); setCopied(false); }}>get camera values</button>
          </>}
          {values && <>
            <textarea id="camera-values" aria-label="Camera values to paste back" readOnly value={values} rows={5} onFocus={e => e.target.select()} />
            <button type="button" onClick={copyValues}>{copied ? 'copied' : 'copy values'}</button>
          </>}
        </div>}
      </div>}
    </div>
  );
}
