import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import SplashOverlay from './components/SplashOverlay';


import Projects from './components/Projects';
import Note from './components/Note';

const Writings = React.lazy(() => import('./components/Writings'));
const Admin = React.lazy(() => import('./components/Admin'));

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [showSplash, setShowSplash] = useState(true);

  // Track pathname-based views
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isAdminView = currentPath === '/admin';
  const isArticlesView = currentPath === '/article';

  return (
    <>
      {showSplash && <SplashOverlay onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? 'preload-hidden' : 'preload-visible'}>
        {isAdminView ? (
          <main className="container">
            <header className="top-header">
              <a 
                href="#" 
                className="writings-nav-link"
                onClick={(e) => { e.preventDefault(); window.history.back(); }}
              >
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

            <React.Suspense fallback={<div className="loading-spinner"></div>}>
              <Admin />
            </React.Suspense>
          </main>
        ) : isArticlesView ? (
          <main className="container">
            <header className="top-header">
              <a 
                href="#" 
                className="writings-nav-link"
                onClick={(e) => { e.preventDefault(); window.history.back(); }}
              >
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

            <React.Suspense fallback={<div className="loading-spinner"></div>}>
              <Writings />
            </React.Suspense>
          </main>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default App;


