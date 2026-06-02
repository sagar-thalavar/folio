import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Note from './components/Note';
import Writings from './components/Writings';
import Admin from './components/Admin';
import Footer from './components/Footer';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Track hash-based views
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#admin');
  const [isArticlesView, setIsArticlesView] = useState(window.location.hash === '#articles');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
      setIsArticlesView(window.location.hash === '#articles');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Render Admin Console if URL matches #admin
  if (isAdminView) {
    return (
      <main className="container">
        <header className="top-header">
          <a href="#" className="writings-nav-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        <Admin />

        <Footer />
      </main>
    );
  }

  // Render Articles Feed if URL matches #articles
  if (isArticlesView) {
    return (
      <main className="container">
        <header className="top-header">
          <a href="#" className="writings-nav-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        <Writings />

        <Footer />
      </main>
    );
  }

  // Render Default Public Portfolio Layout (Clean & Clutter-Free)
  return (
    <main className="container">
      <header className="top-header homepage-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <Hero />
      
      <div className="grid-layout">
        <Projects />
        <Note />
      </div>
      
      <Footer />
    </main>
  );
};

export default App;


