import React, { useState } from 'react';
import { Sparkles, Bot, Clock, Flame, ShieldAlert, AlertTriangle, Check, Plus, AlertCircle, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { generateGemmaRecipe } from '../services/gemmaService';

export function GemmaAiChef({ activeIngredientsList, useSoonItems, onSaveToImpact }) {
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [optionalExpiryNote, setOptionalExpiryNote] = useState('');

  const handleGenerate = async () => {
    // Input validation
    if (!activeIngredientsList || activeIngredientsList.length === 0) {
      setErrorState('Please enter at least one ingredient in the search box above (e.g. bread, eggs, potatoes) before asking Gemma 4.');
      return;
    }

    setErrorState(null);
    setLoading(true);

    try {
      // Build list of use soon items including any optional expiry note typed by user
      const enrichedUseSoon = [...useSoonItems];
      if (optionalExpiryNote.trim()) {
        enrichedUseSoon.push({
          name: 'User Specified Expiry Notes',
          notes: optionalExpiryNote.trim(),
          daysLeft: 1
        });
      }

      const response = await generateGemmaRecipe(activeIngredientsList, enrichedUseSoon);
      setResultData(response);

      if (response.isFallback && response.fallbackReason) {
        setErrorState(`Notice: Using local fallback recipe because: ${response.fallbackReason}`);
      }
    } catch (err) {
      setErrorState(err.message || 'Failed to generate recipe. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gemma-ai" className="gemma-ai-section" style={{
      background: 'linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%)',
      border: '2px solid #86efac',
      borderRadius: '22px',
      padding: '2rem',
      marginBottom: '3rem',
      boxShadow: '0 10px 25px rgba(45, 106, 79, 0.08)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(45, 106, 79, 0.25)'
          }}>
            <Bot size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.45rem', color: '#1b4332', fontWeight: 800 }}>
                Gemma 4 AI Recipe Generator
              </h2>
              <span style={{
                background: '#1b4332',
                color: '#86efac',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Cpu size={12} />
                Open-Weight Model: Gemma 4 via Gemini API
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#4b5563', marginTop: '3px' }}>
              Send your leftover ingredients and expiry dates to Google's Gemma 4 model to formulate safe, custom zero-waste recipes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary-action"
          style={{
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #15803d, #166534)',
            boxShadow: '0 6px 18px rgba(22, 101, 52, 0.3)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Gemma 4 Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate with Gemma 4</span>
            </>
          )}
        </button>
      </div>

      {/* Optional Expiry Date & Freshness input */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid #d1fae5',
        borderRadius: '12px',
        padding: '0.85rem 1.1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Clock size={16} color="#059669" />
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#065f46' }}>
          Optional Expiry Date / Priority:
        </span>
        <input
          type="text"
          placeholder="e.g. Milk expires tomorrow, bread is 2 days old, tomatoes are very ripe"
          value={optionalExpiryNote}
          onChange={(e) => setOptionalExpiryNote(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.88rem',
            background: '#ffffff'
          }}
        />
      </div>

      {/* Error / Status Banner */}
      {errorState && (
        <div style={{
          background: '#fffbeb',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem'
        }}>
          <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.88rem', color: '#92400e', lineHeight: '1.45' }}>
            {errorState}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #86efac',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'bounce 1s infinite' }}>
            🍳
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 800 }}>
            Consulting Google Gemma 4 via Gemini API...
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
            Analyzing provided ingredients (<strong>{activeIngredientsList.join(', ')}</strong>), evaluating safe flavor pairings, checking perishable food rules, and building step-by-step instructions.
          </p>
        </div>
      )}

      {/* Generated Result Display */}
      {resultData && resultData.recipe && !loading && (
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: resultData.isFallback ? '2px dashed #f59e0b' : '2px solid #22c55e',
          padding: '2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)'
        }}>
          {/* Label: Real AI vs Fallback */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            {resultData.isAiGenerated ? (
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid #86efac'
              }}>
                <Sparkles size={14} />
                REAL AI-GENERATED RECIPE • {resultData.modelUsed}
              </span>
            ) : (
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid #fcd34d'
              }}>
                <AlertTriangle size={14} />
                FALLBACK RECIPE (NON-AI GENERATED)
              </span>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              <span>⏱️ Prep: {resultData.recipe.prepTime}</span>
              <span>🔥 Cook: {resultData.recipe.cookTime}</span>
              <span>👥 {resultData.recipe.servings || '2 servings'}</span>
            </div>
          </div>

          {/* Fallback Notice Explanation */}
          {resultData.isFallback && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: '#78350f'
            }}>
              <strong>Non-AI Notice:</strong> {resultData.fallbackReason || 'The AI service was unavailable. This is a tested emergency zero-waste recipe.'}
            </div>
          )}

          {/* Title & Description */}
          <h3 style={{ fontSize: '1.5rem', color: '#1b4332', fontWeight: 800, marginBottom: '0.45rem' }}>
            {resultData.recipe.title}
          </h3>
          <p style={{ color: '#4b5563', fontSize: '0.96rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
            {resultData.recipe.description}
          </p>

          {/* Ingredients Breakdown: What User Can Use vs Missing */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Ingredients You Can Use */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.88rem', color: '#15803d', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={16} />
                <span>INGREDIENTS YOU CAN USE ({resultData.recipe.ingredientsYouCanUse?.length || 0})</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(resultData.recipe.ingredientsYouCanUse || []).map((ing, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Ingredients Needed */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '1.1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.88rem', color: '#b45309', marginBottom: '0.6rem' }}>
                <Plus size={16} />
                <span>MISSING STAPLES NEEDED ({resultData.recipe.missingIngredients?.length || 0})</span>
              </div>
              {resultData.recipe.missingIngredients && resultData.recipe.missingIngredients.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {resultData.recipe.missingIngredients.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#d97706', fontWeight: 800 }}>+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
                  You have all ingredients required for this meal!
                </div>
              )}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.15rem', color: '#1b4332', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Flame size={18} color="#2d6a4f" />
              <span>Step-by-Step Cooking Instructions</span>
            </h4>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#334155', fontSize: '0.94rem' }}>
              {(resultData.recipe.instructions || []).map((step, idx) => (
                <li key={idx} style={{ lineHeight: '1.55' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Zero-Waste Chef Tip */}
          {resultData.recipe.zeroWasteTip && (
            <div style={{
              background: '#ecfdf5',
              borderLeft: '4px solid #10b981',
              borderRadius: '8px',
              padding: '0.85rem 1.1rem',
              fontSize: '0.9rem',
              color: '#065f46',
              marginBottom: '1.25rem'
            }}>
              <strong>Zero-Waste Chef Tip: </strong>
              <span>{resultData.recipe.zeroWasteTip}</span>
            </div>
          )}

          {/* Critical Food Safety Warning */}
          <div style={{
            background: '#fff1f2',
            borderLeft: '4px solid #f43f5e',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <ShieldAlert size={22} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.88rem', color: '#881337', lineHeight: '1.5' }}>
              <strong style={{ color: '#9f1239' }}>FOOD SAFETY REMINDER: </strong>
              {resultData.recipe.foodSafetyWarning || 'Never consume ingredients that show signs of mold, bad odors, or slime. Note that an ingredient is NOT guaranteed safe merely because it is before its printed expiry date. Discard questionable items.'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
