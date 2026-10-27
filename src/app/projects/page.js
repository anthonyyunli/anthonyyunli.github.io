import ProjectCard from '../../components/ProjectCard';
import { projects } from '../../data/projects';

export const metadata = {
  title: 'Projects',
  description: 'CanSat, Mayhem, compact AI text detectors, and other projects by Anthony Li.',
};

export default function Projects() {
  return (
    <section className="page-content" aria-labelledby="projects-title">
      <h1 className="page-title" id="projects-title">Projects</h1>
      <div className="project-grid">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
      {/* Future ASCII animations and C++/WebAssembly fluid simulation can live on their own routes. */}
    </section>
  );
}
