import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Sun, Moon, ArrowLeft, Eye, Palette } from 'lucide-react';
import SplashOverlay from './components/SplashOverlay';
import { supabase } from './lib/supabase';

import Projects from './components/Projects';
import Note from './components/Note';

const Writings = React.lazy(() => import('./components/Writings'));
const Admin = React.lazy(() => import('./components/Admin'));

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'colorful'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light' || saved === 'colorful') return saved;
    } catch (e) {
      // ignore security exceptions in sandboxed test runs
    }
    return 'colorful';
  });

  const [showSplash, setShowSplash] = useState(true);
  const [visitCount, setVisitCount] = useState<number | null>(null);

  // Track pathname-based views
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore security exceptions in sandboxed test runs
    }
  }, [theme]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return; // skip in test/dev environments without credentials

    async function trackVisit() {
      try {
        const { data } = await supabase.rpc('increment_page_view', { page_name: 'folio' });
        if (typeof data === 'number') setVisitCount(data);
      } catch {
        // silently fail — counter is non-critical
      }
    }
    trackVisit();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : prev === 'dark' ? 'colorful' : 'light');
  };

  const themeIcon = theme === 'light' ? <Moon size={20} /> : theme === 'dark' ? <Sun size={20} /> : <Palette size={20} />;
  const themeTitle = theme === 'light' ? 'Switch to Dark Mode' : theme === 'dark' ? 'Switch to Colorful Mode' : 'Switch to Light Mode';

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
                title={themeTitle}
              >
                {themeIcon}
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
                title={themeTitle}
              >
                {themeIcon}
              </button>
            </header>

            <React.Suspense fallback={<div className="loading-spinner"></div>}>
              <Writings />
            </React.Suspense>
          </main>
        ) : (
          <main className="container">
            <header className="top-header homepage-header">
              {visitCount !== null && (
                <div className="visit-counter" aria-label={`${visitCount.toLocaleString()} visits`}>
                  <Eye size={14} />
                  <span>{visitCount.toLocaleString()}</span>
                </div>
              )}
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={themeTitle}
              >
                {themeIcon}
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


