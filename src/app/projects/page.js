import ProjectEntry from '../../components/ProjectEntry';
import CommandLine from '../../components/CommandLine';
import { projects } from '../../data/projects';

export const metadata = {
  title: 'Projects',
  description: 'CanSat, Mayhem, compact AI text detectors, and other projects by Anthony Li.',
};

export default function Projects() {
  return (
    <section className="page-content projects-page" aria-labelledby="projects-title">
      <CommandLine>ls -la projects/</CommandLine>
      <h1 className="page-title" id="projects-title">projects/</h1>
      <div className="project-grid">
        {projects.map((project) => <ProjectEntry key={project.id} project={project} />)}
      </div>
      {/* Future ASCII animations and C++/WebAssembly fluid simulation can live on their own routes. */}
    </section>
  );
}
