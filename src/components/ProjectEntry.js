export default function ProjectEntry({ project }) {
  return (
    <article className="project-entry" id={project.id}>
      <div className="project-bar"><span>~/projects/{project.id}</span><span aria-hidden="true">—</span></div>
      <div className="project-body">
        <h2>{project.title}</h2>
        {project.role && <p className="project-role">{project.role}</p>}
        <p className="project-description">{project.description}</p>
        <div className="project-bottom">
          <span>{project.stack}</span>
          {project.source && <a href={project.source}>source ↗</a>}
        </div>
      </div>
    </article>
  );
}
