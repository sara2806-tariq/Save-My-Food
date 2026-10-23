import React, { useState } from 'react';
import { Search, Plus, X, RotateCcw, Sparkles, ChefHat } from 'lucide-react';
import { parseIngredientsInput } from '../utils/ingredientMatcher';

const COMMON_STAPLES = [
  'bread',
  'eggs',
  'potatoes',
  'tomatoes',
  'milk',
  'cheese',
  'onions',
  'rice',
  'pasta',
  'garlic',
  'bananas',
  'spinach',
  'chicken'
];

export function IngredientInput({
  ingredientsString,
  setIngredientsString,
  activeIngredientsList,
  onFindRecipes,
  onClear,
  onAddFromUseSoon
}) {
  const [localInput, setLocalInput] = useState(ingredientsString);

  // Sync local input when external state changes (e.g. from quick chips or Use Soon shelf)
  React.useEffect(() => {
    setLocalInput(ingredientsString);
  }, [ingredientsString]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    setIngredientsString(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFindRecipes();
    }
  };

  const handleAddStaple = (staple) => {
    const currentList = parseIngredientsInput(ingredientsString);
    const lowerStaple = staple.toLowerCase();

    // Check if already in list
    const alreadyExists = currentList.some(
      (item) => item.toLowerCase() === lowerStaple
    );

    if (!alreadyExists) {
      const updated = currentList.length > 0 ? `${ingredientsString}, ${staple}` : staple;
      setIngredientsString(updated);
      setLocalInput(updated);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentList = parseIngredientsInput(ingredientsString);
    const updatedList = currentList.filter(
      (item) => item.toLowerCase() !== tagToRemove.toLowerCase()
    );
    const updatedStr = updatedList.join(', ');
    setIngredientsString(updatedStr);
    setLocalInput(updatedStr);
  };

  return (
    <div id="search-section" className="search-card">
      <div className="search-header">
        <h2 className="search-heading">
          <ChefHat size={24} color="#2d6a4f" />
          What ingredients do you have?
        </h2>
        <p className="search-instructions">
          Type your extra or near-expiry ingredients separated by commas (e.g. <strong>bread, eggs, potatoes, tomatoes</strong>).
        </p>
      </div>

      <div className="search-input-wrapper">
        <input
          id="ingredient-input-box"
          type="text"
          className="ingredient-input-field"
          placeholder="e.g. bread, eggs, potatoes, tomatoes, milk..."
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Display parsed tags with easy one-click removal */}
        {activeIngredientsList.length > 0 && (
          <div className="active-tags-wrapper">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5563' }}>
              Your Pantry ({activeIngredientsList.length}):
            </span>
            {activeIngredientsList.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="active-tag">
                {tag}
                <button
                  type="button"
                  className="tag-remove-btn"
                  onClick={() => handleRemoveTag(tag)}
                  title={`Remove ${tag}`}
                  aria-label={`Remove ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="search-actions-row">
          <div className="search-buttons-group">
            <button
              id="find-recipes-button"
              type="button"
              className="btn-primary-action"
              onClick={onFindRecipes}
            >
              <Search size={18} />
              <span>Find Recipes</span>
            </button>

            {localInput.trim() && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={onClear}
                title="Clear entered ingredients"
              >
                <RotateCcw size={16} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn-link-action"
            onClick={onAddFromUseSoon}
            title="Import ingredients from Use Soon shelf"
          >
            <Sparkles size={16} />
            <span>+ Load from 'Use Soon' Shelf</span>
          </button>
        </div>
      </div>

      {/* Quick Add Common Staples */}
      <div className="quick-add-container">
        <div className="quick-add-label">
          <Plus size={14} />
          <span>Quick Add Popular Staples:</span>
        </div>
        <div className="quick-add-chips">
          {COMMON_STAPLES.map((staple) => {
            const isAdded = activeIngredientsList.some(
              (i) => i.toLowerCase() === staple.toLowerCase()
            );
            return (
              <button
                key={staple}
                type="button"
                className={`chip-btn ${isAdded ? 'active' : ''}`}
                onClick={() => handleAddStaple(staple)}
              >
                <span>{isAdded ? '✓' : '+'}</span>
                <span>{staple}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
