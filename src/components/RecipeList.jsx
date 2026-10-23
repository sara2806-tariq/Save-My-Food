import React, { useState, useMemo } from 'react';
import { RecipeCard } from './RecipeCard';
import { sortRecipes } from '../utils/ingredientMatcher';
import { Filter, ArrowUpDown, Sparkles, ChefHat } from 'lucide-react';

export function RecipeList({
  recipes,
  userHasSearched,
  onSelectRecipe
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  // Filter recipes based on tab selection
  const filteredRecipes = useMemo(() => {
    let result = recipes;

    switch (activeFilter) {
      case 'can-cook':
        result = result.filter((r) => r.isPerfectMatch);
        break;
      case 'almost':
        result = result.filter((r) => r.missingRequiredCount <= 1);
        break;
      case 'quick':
        result = result.filter((r) => r.totalMinutes <= 20);
        break;
      case 'veg':
        result = result.filter((r) => (r.tags || []).includes('Vegetarian') || (r.tags || []).includes('Vegan'));
        break;
      default:
        result = recipes;
    }

    return sortRecipes(result, sortBy);
  }, [recipes, activeFilter, sortBy]);

  const perfectMatchCount = recipes.filter((r) => r.isPerfectMatch).length;

  return (
    <section id="recipes" className="recipes-section">
      <div className="recipes-header-bar">
        <div>
          <h2 className="results-count-title">
            <ChefHat size={26} color="#2d6a4f" />
            <span>Recipe Suggestions</span>
            <span className="results-count-badge">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </h2>
          {userHasSearched && perfectMatchCount > 0 && (
            <p style={{ fontSize: '0.92rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
              🎉 You have all required ingredients to cook <strong>{perfectMatchCount}</strong> of these meals right now!
            </p>
          )}
        </div>

        <div className="recipes-controls-row">
          {/* Quick Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              type="button"
              className={`filter-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Recipes
            </button>
            <button
              type="button"
              className={`filter-tab-pill ${activeFilter === 'can-cook' ? 'active' : ''}`}
              onClick={() => setActiveFilter('can-cook')}
              title="Show recipes where you have 100% of required ingredients"
            >
              100% Ready ({perfectMatchCount})
            </button>
            <button
              type="button"
              className={`filter-tab-pill ${activeFilter === 'almost' ? 'active' : ''}`}
              onClick={() => setActiveFilter('almost')}
            >
              Missing ≤ 1 Item
            </button>
            <button
              type="button"
              className={`filter-tab-pill ${activeFilter === 'quick' ? 'active' : ''}`}
              onClick={() => setActiveFilter('quick')}
            >
              ⚡ Under 20 Mins
            </button>
            <button
              type="button"
              className={`filter-tab-pill ${activeFilter === 'veg' ? 'active' : ''}`}
              onClick={() => setActiveFilter('veg')}
            >
              Vegetarian
            </button>
          </div>

          {/* Sort selector */}
          <div className="sort-select-wrapper">
            <ArrowUpDown size={14} />
            <span>Sort:</span>
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort recipes"
            >
              <option value="match">Best Ingredient Match</option>
              <option value="quickest">Quickest Prep Time</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e7dfd3'
        }}>
          <Sparkles size={40} color="#9ca3af" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#1b4332', marginBottom: '0.5rem' }}>
            No recipes matched this filter
          </h3>
          <p style={{ color: '#6b7280', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Try selecting "All Recipes" or adding more staple ingredients like eggs, potatoes, or bread to your search.
          </p>
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setActiveFilter('all')}
          >
            Show All Recipes
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              userHasSearched={userHasSearched}
              onSelectRecipe={onSelectRecipe}
            />
          ))}
        </div>
      )}
    </section>
  );
}
