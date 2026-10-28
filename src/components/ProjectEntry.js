import PhotoAlbum from './PhotoAlbum';

export default function ProjectEntry({ project }) {
  return (
    <article className="project-entry" id={project.id} aria-labelledby={`${project.id}-title`}>
      <a className="project-path" href={project.href} aria-label={`Open ${project.title}`}>{project.id}/</a>
      <div className="project-body">
        <h2 id={`${project.id}-title`}>{project.title}</h2>
        <dl className="project-meta">
          {project.role && <><dt>role</dt><dd>{project.role}</dd></>}
          <dt>stack</dt><dd>{project.stack}</dd>
        </dl>
        <p className="project-description">{project.description}</p>
        {project.photos && <PhotoAlbum photos={project.photos} />}
      </div>
    </article>
  );
}
