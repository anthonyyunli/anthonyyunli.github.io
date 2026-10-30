import PhotoAlbum from './PhotoAlbum';

export default function ProjectEntry({ project }) {
  const { id, title, href, role, stack, description, image, photos } = project;

  return (
    <article className="project-entry" id={id} aria-labelledby={`${id}-title`}>
      <a className="project-path" href={href} aria-label={`Open ${title}`}>
        {id}/
      </a>
      <h2 id={`${id}-title`}>{title}</h2>
      <dl className="project-meta">
        {role && (
          <>
            <dt>role</dt>
            <dd>{role}</dd>
          </>
        )}
        <dt>stack</dt>
        <dd>{stack}</dd>
      </dl>
      <p className="project-description">{description}</p>
      {image && <img {...image} className="project-image" loading="lazy" decoding="async" />}
      {photos && <PhotoAlbum photos={photos} label={title} />}
    </article>
  );
}
