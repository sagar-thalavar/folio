import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { navigate } from '../lib/navigation';

interface ProjectCardProps {
  title: string;
  badge: string;
  href: string;
  summary: string;
  color?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, badge, href, summary, color }) => {
  const isInternal = href.startsWith('/');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInternal) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a 
      className="project-card glass" 
      href={href} 
      target={isInternal ? undefined : "_blank"} 
      rel={isInternal ? undefined : "noopener noreferrer"} 
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
    >
      <div className="project-top">
        <span
          className="project-badge"
          style={color ? { backgroundColor: `${color}1a`, color, borderColor: `${color}40` } : undefined}
        >
          {badge}
        </span>
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
