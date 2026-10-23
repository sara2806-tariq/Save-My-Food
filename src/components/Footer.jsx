import React from 'react';
import { Utensils, Heart, ShieldCheck } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
            <Utensils size={18} />
          </div>
          <span>Save<span className="brand-accent">MyFood</span></span>
        </div>

        <p style={{ fontWeight: 600, color: '#2d6a4f', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          Save Food, Create Meals — Practical, Zero-Waste Kitchen Companion
        </p>

        <p className="footer-disclaimer">
          🎓 <strong>Student Project Demo:</strong> Built with React, Vite, JavaScript, and Vanilla CSS. 
          All recipe matching runs entirely locally in your browser with zero external APIs, database requirements, or subscriptions.
        </p>

        <p className="footer-disclaimer" style={{ color: '#b45309', background: '#fffbeb', padding: '0.6rem', borderRadius: '8px', border: '1px solid #fde68a', marginTop: '0.75rem' }}>
          🛡️ <strong>Safety Disclaimer:</strong> Always inspect stored ingredients before cooking. 
          Never eat food showing signs of mold, bad odors, or slime. Do not rely solely on expiry dates to determine food safety.
        </p>

        <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: '#9ca3af' }}>
          <span>© {new Date().getFullYear()} SaveMyFood Project • Cook smart, waste less. </span>
          <button 
            type="button" 
            onClick={scrollToTop}
            style={{ color: '#2d6a4f', fontWeight: 600, marginLeft: '0.5rem', textDecoration: 'underline' }}
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
