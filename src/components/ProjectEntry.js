export default function ProjectEntry({ project }) {
  return (
    <article className="project-entry" id={project.id}>
      <h2><span className="entry-prefix" aria-hidden="true">./</span>{project.title}</h2>
      {project.role && <p className="project-role">{project.role}</p>}
      <p>{project.description}</p>
      {project.details?.length > 0 && (
        <details>
          <summary>Details</summary>
          <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        </details>
      )}
      <div className="project-bottom">
        <span>{project.stack}</span>
        {project.source && <a href={project.source}>Source ↗</a>}
      </div>
    </article>
  );
}
