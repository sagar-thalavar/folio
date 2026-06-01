import React from 'react';
import { Mail } from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from './BrandIcons';

const Hero: React.FC = () => {
  return (
    <section className="hero glass">
      <div className="hero-badge">
        <span className="badge-pulse"></span>
        <span className="badge-text">Live portfolio</span>
      </div>
      
      <h1>Sagar R. Thalavar</h1>
      
      <p className="hero-subtitle">
        I work at{' '}
        <a 
          href="https://beneathatree.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hero-link"
        >
          BeneathAtree
        </a>{' '}
        and I am a 3rd-year Data Science Engineering student at New Horizon College, Bengaluru. 
        I build web pages that are simple, pleasant to use, and easy to understand. I have also started 
        reading a lot more lately, which has changed how I think about work, design, and attention.
      </p>

      <div className="hero-actions">
        <a 
          className="btn-primary" 
          href="https://www.linkedin.com/in/sagar-r-thalavar-developer-gpti/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <LinkedinIcon size={18} />
          <span>Open LinkedIn</span>
        </a>
        <a 
          className="btn-secondary" 
          href="https://github.com/sagar-thalavar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <GithubIcon size={18} />
          <span>GitHub</span>
        </a>
        <a 
          className="btn-secondary" 
          href="https://www.instagram.com/otziburl/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <InstagramIcon size={18} />
          <span>Instagram</span>
        </a>
        <a 
          className="btn-secondary" 
          href="mailto:sagarthalavar509@gmail.com"
        >
          <Mail size={18} />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
