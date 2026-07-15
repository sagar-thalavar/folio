import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  badge: string;
  href: string;
  summary: string;
  color?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, badge, href, summary, color }) => {
  return (
    <article className="project-card glass">
      <div className="project-top">
        <span
          className="project-badge"
          style={color ? { backgroundColor: `${color}1a`, color, borderColor: `${color}40` } : undefined}
        >{badge}</span>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{summary}</p>
      </div>
      <a className="project-link" href={href} target="_blank" rel="noopener noreferrer">
        <span>Open project</span>
        <ArrowUpRight size={16} className="project-link-icon" />
      </a>
    </article>
  );
};

export default ProjectCard;
