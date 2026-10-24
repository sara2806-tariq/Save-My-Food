import React from 'react';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section id="hero" className="hero-section" style={{ padding: '2.5rem 1rem 1.5rem 1rem' }}>
      <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
        Save Food, <span className="hero-title-highlight">Create Meals</span>
      </h1>

      <p className="hero-subtitle" style={{ maxWidth: '640px', fontSize: '1.15rem', color: '#4b5563', lineHeight: '1.6', margin: '0 auto' }}>
        Snap a photo of your fridge or type your leftover ingredients. 
        <strong> Gemma 4 AI</strong> crafts delicious, zero-waste recipes instantly to help you cook what you have and prevent food waste.
      </p>
    </section>
  );
}
