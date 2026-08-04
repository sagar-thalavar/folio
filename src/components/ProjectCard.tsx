import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { navigate } from '../lib/navigation';

interface ProjectCardProps {
  title: string;
  badge: string;
  href: string;
  summary: string;
  color?: string;
  isHighlight?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, badge, href, summary, color, isHighlight }) => {
  const isInternal = href.startsWith('/');
  const isMentorship = href === '/playground' || isHighlight;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInternal) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a 
      className={`project-card glass ${isMentorship ? 'mentorship-highlight-card' : ''}`}
      href={href} 
      target={isInternal ? undefined : "_blank"} 
      rel={isInternal ? undefined : "noopener noreferrer"} 
      onClick={handleClick}
      style={{ 
        textDecoration: 'none',
        position: 'relative',
        ...(isMentorship ? {
          border: '2px solid var(--accent)',
          boxShadow: 'var(--shadow-lg)'
        } : {})
      }}
    >
      {isMentorship && (
        <span 
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            padding: '3px 10px',
            borderRadius: '99px',
            background: 'var(--accent)',
            color: '#111827',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
          }}
        >
          Most Popular
        </span>
      )}
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
      <div className="project-link" style={isMentorship ? { background: 'var(--accent)', color: '#111827', borderColor: 'var(--accent)', fontWeight: 700 } : undefined}>
        <span>{isMentorship ? 'Book Session →' : 'Explore →'}</span>
        <ArrowUpRight size={16} className="project-link-icon" />
      </div>
    </a>
  );
};

export default ProjectCard;
