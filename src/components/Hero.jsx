import React from 'react';
import { Sparkles, Leaf, CheckCircle2, DollarSign, HeartHandshake, Bot } from 'lucide-react';

export function Hero({ onStartSearch, recipeCount = 16 }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-pill-badge">
        <Leaf size={16} color="#2d6a4f" />
        <span>Student Project Demo • Zero-Waste Cooking with Google Gemma AI</span>
      </div>

      <h1 className="hero-title">
        Save Food, <span className="hero-title-highlight">Create Meals</span>
      </h1>

      <p className="hero-subtitle">
        Have spare ingredients or food approaching its expiry date? Don't toss them! 
        Enter what’s in your pantry or fridge, and discover quick, beginner-friendly meals 
        formulated with our smart recipe matcher and <strong>Google Gemma open-source AI</strong> 
        to cut down food waste and save money.
      </p>

      <div className="hero-highlights-strip">
        <div className="hero-highlight-item" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
          <Bot size={15} color="#15803d" />
          <span style={{ color: '#166534', fontWeight: 700 }}>Google Gemma AI Powered</span>
        </div>
        <div className="hero-highlight-item">
          <CheckCircle2 size={15} color="#2d6a4f" />
          <span>{recipeCount} Built-in Recipes (No API Key Required)</span>
        </div>
        <div className="hero-highlight-item">
          <Sparkles size={15} color="#e76f51" />
          <span>Smart Ingredient Matcher</span>
        </div>
        <div className="hero-highlight-item">
          <DollarSign size={15} color="#2d6a4f" />
          <span>Save Money On Groceries</span>
        </div>
        <div className="hero-highlight-item">
          <HeartHandshake size={15} color="#2d6a4f" />
          <span>Food Safety First Certified</span>
        </div>
      </div>
    </section>
  );
}
