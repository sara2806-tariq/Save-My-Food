import React from 'react';
import { Sparkles, DollarSign, Leaf, Utensils } from 'lucide-react';

export function ImpactTracker({ mealsRescuedCount }) {
  // Estimated metrics: each rescued meal saves ~$4.50 and prevents ~0.8kg of food waste/CO2e
  const moneySaved = (mealsRescuedCount * 4.5).toFixed(2);
  const wastePreventedKg = (mealsRescuedCount * 0.8).toFixed(1);

  return (
    <section className="impact-tracker-section">
      <div className="impact-tracker-inner">
        <div className="impact-copy">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a7f3d0', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Leaf size={14} />
            <span>COMMUNITY IMPACT COUNTER</span>
          </div>
          <h3>Your Food-Saving Impact</h3>
          <p>
            Every ingredient you cook instead of throwing away keeps nutritious food on plates,
            reduces landfill methane, and saves real household money.
          </p>
        </div>

        <div className="impact-metrics-row">
          <div className="impact-metric-pill">
            <div className="metric-num">{mealsRescuedCount}</div>
            <div className="metric-lbl">Meals Rescued</div>
          </div>

          <div className="impact-metric-pill">
            <div className="metric-num">${moneySaved}</div>
            <div className="metric-lbl">Est. Money Saved</div>
          </div>

          <div className="impact-metric-pill">
            <div className="metric-num">{wastePreventedKg} kg</div>
            <div className="metric-lbl">Food Waste Avoided</div>
          </div>
        </div>
      </div>
    </section>
  );
}
