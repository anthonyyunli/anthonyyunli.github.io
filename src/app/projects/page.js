import ProjectEntry from '../../components/ProjectEntry';
import CommandLine from '../../components/CommandLine';
import { projects } from '../../data/projects';

export const metadata = {
  title: 'Projects',
  description: 'CanSat, Mayhem, CS229, and Breckeys — projects by Anthony Li.',
};

export default function Projects() {
  return (
    <section className="page-content projects-page" aria-labelledby="projects-title">
      <h1 className="visually-hidden" id="projects-title">Projects</h1>
      <CommandLine path="~/projects">ls</CommandLine>
      <div className="project-grid">
        {projects.map((project) => <ProjectEntry key={project.id} project={project} />)}
      </div>
    </section>
  );
}
