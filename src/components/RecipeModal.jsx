import React, { useEffect } from 'react';
import { X, Clock, ChefHat, Check, AlertTriangle, Lightbulb, Users, Flame, ShieldAlert, Award } from 'lucide-react';

export function RecipeModal({ recipe, onClose, onMealRescued }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!recipe) return null;

  const {
    title,
    description,
    image,
    prepTime,
    cookTime,
    totalMinutes,
    servings,
    difficulty,
    category,
    ingredients,
    instructions,
    proTips,
    safetyTip,
    tags,
    usedIngredients
  } = recipe;

  // Helper to check if user has this ingredient
  const hasUserIngredient = (ingName) => {
    return (usedIngredients || []).some((u) => u.name.toLowerCase() === ingName.toLowerCase());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-hero-image">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80';
            }}
          />
        </div>

        <div className="modal-body">
          <div className="modal-tags-row">
            <span className="modal-tag" style={{ background: '#d8f3dc', color: '#1b4332', fontWeight: 700 }}>
              {category}
            </span>
            {tags && tags.map((t) => (
              <span key={t} className="modal-tag">
                {t}
              </span>
            ))}
          </div>

          <h2 className="modal-recipe-title">{title}</h2>
          <p style={{ color: '#4b5563', fontSize: '1rem', marginBottom: '1.25rem' }}>
            {description}
          </p>

          <div className="modal-stats-bar">
            <div>
              <div className="modal-stat-label">Prep Time</div>
              <div className="modal-stat-val">{prepTime}</div>
            </div>
            <div>
              <div className="modal-stat-label">Cook Time</div>
              <div className="modal-stat-val">{cookTime}</div>
            </div>
            <div>
              <div className="modal-stat-label">Servings</div>
              <div className="modal-stat-val">{servings}</div>
            </div>
          </div>

          {/* Food Safety Warning for this recipe */}
          {safetyTip && (
            <div className="modal-safety-box">
              <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#e11d48' }} />
              <div>
                <strong style={{ color: '#9f1239' }}>Food Safety First: </strong>
                <span>{safetyTip}</span>
              </div>
            </div>
          )}

          {/* Ingredients list with quantities & status */}
          <h3 className="modal-section-title">
            <ChefHat size={20} color="#2d6a4f" />
            <span>Ingredients & Quantities</span>
          </h3>

          <ul className="modal-ingredients-list">
            {ingredients.map((ing, i) => {
              const userHas = hasUserIngredient(ing.name);
              return (
                <li
                  key={i}
                  className={`modal-ingredient-row ${userHas ? 'user-has' : 'user-missing'}`}
                >
                  <span style={{ marginTop: '2px' }}>
                    {userHas ? (
                      <Check size={16} color="#15803d" />
                    ) : (
                      <span style={{ color: '#b45309', fontWeight: 800 }}>•</span>
                    )}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{ing.display}</span>
                    {userHas ? (
                      <span style={{ fontSize: '0.78rem', color: '#15803d', marginLeft: '0.5rem', fontWeight: 700 }}>
                        (In your pantry!)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#b45309', marginLeft: '0.5rem' }}>
                        (Missing item)
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Step-by-Step Cooking Instructions */}
          <h3 className="modal-section-title" style={{ marginTop: '2rem' }}>
            <Flame size={20} color="#2d6a4f" />
            <span>Cooking Instructions</span>
          </h3>

          <ol className="modal-steps-list">
            {instructions.map((step, idx) => (
              <li key={idx} className="modal-step-item">
                <div className="step-number">{idx + 1}</div>
                <div className="step-text">{step}</div>
              </li>
            ))}
          </ol>

          {/* Zero-Waste Pro Tip */}
          {proTips && (
            <div className="modal-tip-box">
              <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#059669' }} />
              <div>
                <strong>Zero-Waste Chef Tip: </strong>
                <span>{proTips}</span>
              </div>
            </div>
          )}

          {/* Action to rescue meal and celebrate */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f0eae1' }}>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => {
                onMealRescued(recipe.title);
                onClose();
              }}
            >
              <Award size={18} />
              <span>I Cooked This Meal!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
