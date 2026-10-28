'use client';

import { useRef, useState } from 'react';

export default function PhotoAlbum({ photos }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef(null);
  const photo = photos[index];

  function move(step) { setIndex((current) => (current + step + photos.length) % photos.length); }
  function onKeyDown(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  }

  function navigation() {
    return (
      <div className="album-navigation">
        <button type="button" onClick={() => move(-1)} aria-label="Previous CanSat photo">←</button>
        <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next CanSat photo">→</button>
      </div>
    );
  }

  return (
    <figure className="photo-album" onKeyDown={onKeyDown} aria-label="CanSat photo album">
      <button type="button" className="album-preview" onClick={() => dialog.current.showModal()} aria-label="Open CanSat photo album">
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{ objectPosition: photo.position || 'center' }} />
      </button>
      <figcaption className="album-caption"><span>{photo.label}</span>{navigation()}</figcaption>
      <dialog className="album-dialog" ref={dialog} aria-label="CanSat photographs" onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <div className="album-dialog-content">
          <button type="button" className="album-close" onClick={() => dialog.current.close()} aria-label="Close CanSat photo album">close [esc]</button>
          <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
          <div className="album-caption"><span>{photo.label}</span>{navigation()}</div>
        </div>
      </dialog>
    </figure>
  );
}
