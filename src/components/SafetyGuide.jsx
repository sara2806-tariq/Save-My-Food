import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, XCircle, Thermometer, Eye, Wind, Hand } from 'lucide-react';

export function SafetyGuide() {
  return (
    <section id="safety-guide" className="safety-guide-section">
      <div className="safety-header">
        <div className="safety-badge">
          <ShieldAlert size={15} />
          <span>Student Health & Kitchen Safety Standards</span>
        </div>
        <h2 className="safety-main-title">Food Safety First</h2>
        <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Zero-waste cooking is about smart planning, not risking your health. 
          Follow these golden rules to protect yourself and your household.
        </p>
      </div>

      <div className="safety-cards-grid">
        {/* Card 1: The Expiry Date Myth */}
        <div className="safety-card-item">
          <div className="safety-card-icon safety-icon-danger">
            <AlertTriangle size={24} />
          </div>
          <h3 className="safety-card-title">Never Rely Solely on Dates</h3>
          <p className="safety-card-desc">
            An ingredient is <strong>NOT guaranteed safe</strong> simply because it hasn't reached its expiry date. 
            Improper refrigeration, broken seals, or kitchen warmth can accelerate bacterial growth days before the printed date.
          </p>
        </div>

        {/* Card 2: Never Taste Questionable Food */}
        <div className="safety-card-item">
          <div className="safety-card-icon safety-icon-danger">
            <XCircle size={24} />
          </div>
          <h3 className="safety-card-title">Never Taste Test Spoiled Food</h3>
          <p className="safety-card-desc">
            Never taste food to "check if it's still good." Certain dangerous foodborne pathogens 
            (such as <em>Salmonella</em> or <em>Bacillus cereus</em>) cannot be tasted or smelled, 
            and even a tiny bite can cause severe food poisoning.
          </p>
        </div>

        {/* Card 3: The 3 Senses Check */}
        <div className="safety-card-item">
          <div className="safety-card-icon safety-icon-warn">
            <Eye size={24} />
          </div>
          <h3 className="safety-card-title">Look, Smell, and Feel</h3>
          <p className="safety-card-desc">
            Inspect food before using:
            <br />• <strong>Sight:</strong> Discoloration or fuzzy mold (white, green, black).
            <br />• <strong>Smell:</strong> Sour, fermented, or pungent ammonia odors.
            <br />• <strong>Feel:</strong> Unnatural slime, stickiness, or mushy textures.
          </p>
        </div>

        {/* Card 4: Mold Rules */}
        <div className="safety-card-item">
          <div className="safety-card-icon safety-icon-danger">
            <ShieldAlert size={24} />
          </div>
          <h3 className="safety-card-title">The Bread & Soft Food Rule</h3>
          <p className="safety-card-desc">
            If mold appears on bread, soft cheese, yogurt, or cooked leftovers, 
            <strong>discard the entire item immediately</strong>. Invisible microscopic mold roots 
            penetrate deeply beyond the surface spots.
          </p>
        </div>

        {/* Card 5: Safe Temperature */}
        <div className="safety-card-item">
          <div className="safety-card-icon safety-icon-good">
            <Thermometer size={24} />
          </div>
          <h3 className="safety-card-title">Refrigeration & Reheating</h3>
          <p className="safety-card-desc">
            Keep refrigerators below <strong>4°C (40°F)</strong>. Refrigerate cooked food within 2 hours. 
            When reheating leftovers (especially rice or poultry), heat thoroughly until steaming hot throughout (74°C / 165°F).
          </p>
        </div>

        {/* Card 6: The Golden Rule */}
        <div className="safety-card-item" style={{ background: '#fdf2f2', borderColor: '#fecaca' }}>
          <div className="safety-card-icon safety-icon-danger">
            <CheckCircle size={24} />
          </div>
          <h3 className="safety-card-title" style={{ color: '#991b1b' }}>The Golden Rule</h3>
          <p className="safety-card-desc" style={{ color: '#7f1d1d' }}>
            <strong>"When in doubt, throw it out!"</strong> 
            Saving food is important, but preventing illness is always your top priority. Composting spoiled food is safe—eating it is not.
          </p>
        </div>
      </div>
    </section>
  );
}
