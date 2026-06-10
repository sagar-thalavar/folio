import React from 'react';
import { Mail, BookOpen, Camera, Waves } from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from './BrandIcons';
import { navigate } from '../lib/navigation';

const Hero: React.FC = () => {
  return (
    <section className="hero glass">
      <div className="hero-badge">
        <Waves size={14} />
        <span className="badge-text">ಸ್ವಾಗತ</span>
      </div>
      <div className="hero-social-icons">
        <a 
          className="social-icon-btn" 
          href="https://www.linkedin.com/in/sagar-r-thalavar-developer-gpti/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={18} />
        </a>
        <a 
          className="social-icon-btn" 
          href="https://github.com/sagar-thalavar" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GithubIcon size={18} />
        </a>
        <a 
          className="social-icon-btn" 
          href="https://www.instagram.com/otziburl/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon size={18} />
        </a>
        <a 
          className="social-icon-btn" 
          href="mailto:sagarthalavar509@gmail.com"
          aria-label="Email"
        >
          <Mail size={18} />
        </a>
      </div>
      
      <img 
        src="/profile.jpeg" 
        alt="Sagar R. Thalavar" 
        className="hero-avatar"
        width="120"
        height="120"
        fetchPriority="high"
        decoding="async"
      />
      
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
          className="btn-primary btn-guestbook" 
          href="/guestbook"
          title="Leave a memory in my Guestbook"
        >
          <Camera size={18} />
          <span>Visit Guestbook</span>
        </a>
        <a 
          className="btn-secondary" 
          href="/article"
          onClick={(e) => {
            e.preventDefault();
            navigate('/article');
          }}
        >
          <BookOpen size={18} />
          <span>Read My Writings</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
