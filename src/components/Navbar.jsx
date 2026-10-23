import React from 'react';
import { Utensils, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export function Navbar({ onNavigate, onOpenSafety }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('hero'); }} className="brand-logo">
          <div className="brand-icon-wrapper">
            <Utensils size={22} />
          </div>
          <span>Save<span className="brand-accent">MyFood</span></span>
        </a>

        <nav className="nav-links">
          <button 
            type="button"
            className="nav-link" 
            onClick={() => onNavigate('search')}
          >
            <Sparkles size={16} />
            <span>Recipe Finder</span>
          </button>

          <button 
            type="button"
            className="nav-link" 
            onClick={() => onNavigate('use-soon')}
          >
            <Clock size={16} />
            <span>Use Soon Shelf</span>
          </button>

          <button 
            type="button"
            className="nav-safety-btn" 
            onClick={onOpenSafety}
            title="Read food safety guidelines"
          >
            <ShieldAlert size={16} />
            <span>Food Safety</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
