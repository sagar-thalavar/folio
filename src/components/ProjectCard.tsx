import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  badge: string;
  href: string;
  summary: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, badge, href, summary }) => {
  return (
    <a className="project-card glass" href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="project-top">
        <span className="project-badge">{badge}</span>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{summary}</p>
      </div>
      <div className="project-link">
        <span>Open project</span>
        <ArrowUpRight size={16} className="project-link-icon" />
      </div>
    </a>
  );
};

export default ProjectCard;
