import React from 'react';
import ProjectCard from './ProjectCard';
import { Briefcase } from 'lucide-react';

interface Project {
  title: string;
  badge: string;
  href: string;
  summary: string;
}

const projectsData: Project[] = [
  {
    title: "PI Collision Simulator",
    badge: "Physics + curiosity",
    href: "https://pi-collision-simulator.vercel.app/",
    summary: "An interactive simulator that turns a mathematical idea into something visible and easy to explore."
  },
  {
    title: "Mouse Practice",
    badge: "Skill training",
    href: "https://sagar-mouse-practice.netlify.app/",
    summary: "A browser-based practice space for improving cursor precision, control, and movement confidence."
  },
  {
    title: "DataOps Zeta",
    badge: "Data workflow",
    href: "https://dataops-zeta.vercel.app/",
    summary: "A clear view into understanding data operations and how they connect to database workflows."
  },
  {
    title: "One Last Two",
    badge: "College mini project",
    href: "https://one-last-two.vercel.app/",
    summary: "A college mini project that lives on the web and shows a simple, finished interface."
  }
];

const Projects: React.FC = () => {
  return (
    <section className="panel projects-panel glass">
      <div className="section-header">
        <div className="section-title-group">
          <Briefcase className="section-icon" size={24} />
          <h2>Live Projects</h2>
        </div>
        <p className="section-subtitle">
          A few pages that are already live and available to explore.
        </p>
      </div>

      <div className="project-grid">
        {projectsData.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            badge={project.badge}
            href={project.href}
            summary={project.summary}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
