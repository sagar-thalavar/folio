import React from 'react';
import { Mail, BookOpen, Camera, Waves, Building } from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon, LeetcodeIcon } from './BrandIcons';
import { navigate } from '../lib/navigation';

const Hero: React.FC = () => {
  const [isEnglish, setIsEnglish] = React.useState(false);

  return (
    <section className="hero glass">
      <div className="hero-top-row">
        <div 
          className="hero-badge" 
          onClick={() => setIsEnglish(prev => !prev)}
          style={{ 
            cursor: 'pointer', 
            userSelect: 'none', 
            WebkitUserSelect: 'none' 
          }}
        >
          <Waves size={14} />
          <span className="badge-text">{isEnglish ? 'Welcome' : 'ಸ್ವಾಗತ'}</span>
        </div>
        <div className="hero-social-icons">
          <a 
            className="social-icon-btn" 
            href="https://www.linkedin.com/in/sagar-r-thalavar-developer-gpti/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <LinkedinIcon size={18} />
          </a>
          <a 
            className="social-icon-btn" 
            href="https://github.com/sagar-thalavar" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <GithubIcon size={18} />
          </a>
          <a
            className="social-icon-btn"
            href="https://mail.google.com/mail/?view=cm&to=sagarthalavar509@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            title="Email"
          >
            <Mail size={18} />
          </a>
          <a
            className="social-icon-btn"
            href="https://share.google/UvPtn6OHxLGjI5K1y"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bangalore International Centre (BIC) Exhibition"
            title="Bangalore International Centre (BIC) Exhibition"
          >
            <Building size={18} />
          </a>
          <a 
            className="social-icon-btn" 
            href="https://leetcode.com/u/sagar50906/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LeetCode"
            title="LeetCode"
          >
            <LeetcodeIcon size={18} />
          </a>
          <a 
            className="social-icon-btn" 
            href="https://www.instagram.com/otziburl/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </div>
      
      <img 
        src="/profile.webp" 
        alt="Sagar R. Thalavar" 
        className="hero-avatar"
        width="120"
        height="120"
        fetchPriority="high"
        decoding="async"
      />
      
      <h1>Sagar R. Thalavar</h1>
      
      <p className="hero-subtitle" style={{ maxWidth: '800px', lineHeight: 1.7 }}>
        I'm Sagar R. Thalavar, a software developer who enjoys building practical web applications, AI tools, and developer utilities.
        <br /><br />
        I also help students and beginner developers debug projects, improve portfolios, and build software through practical one-on-one sessions.
      </p>

      <div className="hero-actions">
        <a 
          className="btn-primary" 
          href="/playground"
          onClick={(e) => {
            e.preventDefault();
            navigate('/playground');
          }}
          title="Book 1-on-1 Mentorship & Professional Services"
        >
          <span>Services Provided</span>
        </a>
        <a 
          className="btn-secondary" 
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
