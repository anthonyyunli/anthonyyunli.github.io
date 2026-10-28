'use client';

import { useRef, useState } from 'react';

export default function PhotoAlbum({ photos, label = 'Project' }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef(null);
  const photo = photos[index];

  function move(step) {
    setIndex((current) => (current + step + photos.length) % photos.length);
  }

  function onKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  }

  const navigation = (
    <div className="album-navigation">
      <button type="button" onClick={() => move(-1)} aria-label={`Previous ${label} photo`}>
        ←
      </button>
      <span aria-live="polite" aria-atomic="true">
        {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
      </span>
      <button type="button" onClick={() => move(1)} aria-label={`Next ${label} photo`}>
        →
      </button>
    </div>
  );

  return (
    <figure className="photo-album" onKeyDown={onKeyDown} aria-label={`${label} photo album`}>
      <button
        type="button"
        className="album-preview"
        onClick={() => dialog.current.showModal()}
        aria-label={`Open ${label} photo album`}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: photo.position || 'center', objectFit: photo.fit }}
        />
      </button>
      <figcaption className="album-caption">
        <span>{photo.label}</span>
        {navigation}
      </figcaption>
      <dialog
        className="album-dialog"
        ref={dialog}
        aria-label={`${label} photographs`}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="album-dialog-content">
          <button
            type="button"
            className="album-close"
            onClick={() => dialog.current.close()}
            aria-label={`Close ${label} photo album`}
          >
            close [esc]
          </button>
          <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
          <div className="album-caption">
            <span>{photo.label}</span>
            {navigation}
          </div>
        </div>
      </dialog>
    </figure>
  );
}
