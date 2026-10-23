import React from 'react';
import { Clock, Check, AlertCircle, ChefHat, ArrowRight } from 'lucide-react';

export function RecipeCard({ recipe, onSelectRecipe, userHasSearched }) {
  const {
    title,
    description,
    image,
    prepTime,
    cookTime,
    totalMinutes,
    difficulty,
    category,
    usedIngredients,
    missingIngredients,
    matchPercentage,
    isPerfectMatch
  } = recipe;

  // Render match banner based on calculation
  const renderMatchBanner = () => {
    if (!userHasSearched) {
      return (
        <div className="recipe-match-banner match-none">
          <span>Explore Recipe</span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{difficulty}</span>
        </div>
      );
    }

    if (isPerfectMatch) {
      return (
        <div className="recipe-match-banner match-perfect">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={16} />
            <span>100% Ready to Cook!</span>
          </span>
          <span>{matchPercentage}% Match</span>
        </div>
      );
    }

    if (matchPercentage >= 50) {
      return (
        <div className="recipe-match-banner match-high">
          <span>Great Match ({missingIngredients.length} missing)</span>
          <span>{matchPercentage}% Match</span>
        </div>
      );
    }

    return (
      <div className="recipe-match-banner match-medium">
        <span>Missing {missingIngredients.length} ingredients</span>
        <span>{matchPercentage}% Match</span>
      </div>
    );
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-media">
        <img
          src={image}
          alt={title}
          className="recipe-card-img"
          loading="lazy"
          onError={(e) => {
            // High quality fallback illustration if image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80';
          }}
        />
        <div className="recipe-category-tag">
          {category}
        </div>
        <div className="recipe-time-tag">
          <Clock size={12} />
          <span>{totalMinutes} mins total</span>
        </div>
      </div>

      {renderMatchBanner()}

      <div className="recipe-card-body">
        <h3 className="recipe-title">{title}</h3>
        <p className="recipe-desc">{description}</p>

        {/* Feature 5: Show which ingredients the user can use and which ingredients are missing */}
        <div className="ingredients-status-block">
          {/* Ingredients User Can Use */}
          <div className="ingredient-status-group">
            <span className="ingredient-status-label label-have">
              <Check size={13} />
              <span>You Can Use ({usedIngredients.length}):</span>
            </span>
            <div className="ingredient-pills-list">
              {usedIngredients.length > 0 ? (
                usedIngredients.map((ing) => (
                  <span key={ing.name} className="ing-pill ing-pill-have">
                    ✓ {ing.name}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                  None of your entered ingredients match yet
                </span>
              )}
            </div>
          </div>

          {/* Missing Ingredients */}
          <div className="ingredient-status-group">
            <span className="ingredient-status-label label-missing">
              <AlertCircle size={13} />
              <span>Missing Ingredients ({missingIngredients.length}):</span>
            </span>
            <div className="ingredient-pills-list">
              {missingIngredients.length > 0 ? (
                missingIngredients.map((ing) => (
                  <span key={ing.name} className="ing-pill ing-pill-missing">
                    + {ing.name}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  You have everything needed!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="recipe-card-footer">
          <div className="recipe-meta-details">
            <span>⏱️ Prep: {prepTime}</span>
            <span>🔥 Cook: {cookTime}</span>
          </div>

          <button
            type="button"
            className="btn-view-recipe"
            onClick={() => onSelectRecipe(recipe)}
            title={`View full recipe instructions for ${title}`}
          >
            <span>View Recipe</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
