import React from 'react';

const Footer: React.FC = () => {
  const navigateTo = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <footer className="footer-wrapper" style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--card-border)' }}>
      <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '0.85rem' }}>
          <a href="/terms" onClick={navigateTo('/terms')} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms & Conditions</a>
          <span>•</span>
          <a href="/privacy" onClick={navigateTo('/privacy')} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <span>•</span>
          <a href="/refund-policy" onClick={navigateTo('/refund-policy')} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Refund Policy</a>
          <span>•</span>
          <a href="/contact" onClick={navigateTo('/contact')} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</a>
        </div>
        <p className="footer-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Sagar Thalavar · All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
