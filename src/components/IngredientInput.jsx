import React, { useState } from 'react';
import { Search, Plus, X, RotateCcw, Sparkles, ChefHat } from 'lucide-react';
import { parseIngredientsInput } from '../utils/ingredientMatcher';
import { ImageIngredientPicker } from './ImageIngredientPicker';

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
  uploadedImages,
  setUploadedImages,
  onFindRecipes,
  onClear,
  onAddFromUseSoon,
  isAiLoading
}) {
  const [localInput, setLocalInput] = useState(ingredientsString);

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
    <div id="search-section" className="search-card" style={{
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(110, 231, 183, 0.45)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 45px -15px rgba(16, 185, 129, 0.15)',
      marginBottom: '2.5rem',
      position: 'relative'
    }}>
      <div className="search-header" style={{ marginBottom: '1.25rem' }}>
        <h2 className="search-heading" style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1b4332' }}>
          <ChefHat size={26} color="#059669" />
          <span>What do you have at home?</span>
        </h2>
        <p className="search-instructions" style={{ color: '#4b5563', fontSize: '1rem', marginTop: '4px' }}>
          Type ingredients or snap photos of your fridge/pantry. Gemma 4 will detect what you have and generate meals!
        </p>
      </div>

      <div className="search-input-wrapper">
        <input
          id="ingredient-input-box"
          type="text"
          className="ingredient-input-field"
          placeholder="Type ingredients: bread, eggs, potatoes, tomatoes, milk..."
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          style={{
            background: '#ffffff',
            border: '2px solid #a7f3d0',
            borderRadius: '16px',
            fontSize: '1.05rem',
            padding: '1.1rem 1.25rem'
          }}
        />

        {/* Camera and Multi-Image Picker */}
        <ImageIngredientPicker
          images={uploadedImages}
          setImages={setUploadedImages}
          onAnalyze={onFindRecipes}
        />

        {/* Active ingredient tags */}
        {activeIngredientsList.length > 0 && (
          <div className="active-tags-wrapper" style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b4332' }}>
              Your Pantry ({activeIngredientsList.length}):
            </span>
            {activeIngredientsList.map((tag, idx) => (
              <span key={`${tag}-${idx}`} className="active-tag" style={{
                background: '#ffffff',
                border: '1.5px solid #059669',
                color: '#1b4332',
                fontWeight: 600,
                padding: '0.35rem 0.8rem',
                borderRadius: '9999px'
              }}>
                {tag}
                <button
                  type="button"
                  className="tag-remove-btn"
                  onClick={() => handleRemoveTag(tag)}
                  title={`Remove ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="search-actions-row" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div className="search-buttons-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              id="find-recipes-button"
              type="button"
              className="btn-primary-action"
              onClick={onFindRecipes}
              disabled={isAiLoading}
              style={{
                background: isAiLoading ? '#94a3b8' : 'linear-gradient(135deg, #059669, #047857)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.05rem',
                padding: '0.95rem 1.85rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
                cursor: isAiLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <Sparkles size={20} />
              <span>{isAiLoading ? 'Gemma 4 Cooking...' : 'Tell Me What I Can Make'}</span>
            </button>

            {(localInput.trim() || uploadedImages.length > 0) && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={onClear}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.25rem',
                  fontWeight: 600
                }}
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
            style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}
          >
            <Sparkles size={16} />
            <span>+ Load from 'Use Soon' Shelf</span>
          </button>
        </div>
      </div>

      {/* Quick Add Common Staples */}
      <div className="quick-add-container" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #cbd5e1' }}>
        <div className="quick-add-label" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.6rem' }}>
          <Plus size={14} />
          <span>Quick Add Popular Items:</span>
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
