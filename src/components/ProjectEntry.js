import PhotoAlbum from './PhotoAlbum';

export default function ProjectEntry({ project }) {
  return (
    <article className="project-entry" id={project.id}>
      <p className="project-path">./{project.id}</p>
      <div className="project-body">
        <h2>{project.title}</h2>
        {project.role && <p className="project-role">{project.role}</p>}
        <p className="project-description">{project.description}</p>
        {project.photos && <PhotoAlbum photos={project.photos} />}
        <div className="project-bottom">
          <span>{project.stack}</span>
          {project.href && <a href={project.href}>{project.linkText || 'source'} ↗</a>}
        </div>
      </div>
    </article>
  );
}
