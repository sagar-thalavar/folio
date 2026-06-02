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
    title: "PiCollision: Mathematical Simulator",
    badge: "Physics + curiosity",
    href: "https://pi-collision-simulator.vercel.app/",
    summary: "An interactive physics simulator that visualizes elastic collisions and demonstrates how they compute the digits of Pi."
  },
  {
    title: "ClickCraft: Mouse Precision Trainer",
    badge: "Skill training",
    href: "https://sagar-mouse-practice.netlify.app/",
    summary: "A browser-based skill training workspace designed for improving cursor control, precision, and hand-eye coordination."
  },
  {
    title: "DataOps Zeta: PostgreSQL Playground",
    badge: "Data workflow",
    href: "https://data.sagarthalavar.in/",
    summary: "An interactive operations portal built with Next.js and Neon Serverless Postgres for executing and visualizing CRUD database operations in real-time."
  },
  {
    title: "Equilibrium: Life Balance Tracker",
    badge: "College mini project",
    href: "https://one-last-two.vercel.app/",
    summary: "A college project designed as a life-balancing planner application to track, prioritize, and manage tasks across life, college, and work."
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
