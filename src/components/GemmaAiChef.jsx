import React, { useState } from 'react';
import { Sparkles, Bot, Clock, Flame, ShieldAlert, CheckCircle2, Plus, RefreshCw, Cpu, Image } from 'lucide-react';

export function GemmaAiChef({
  activeIngredientsList,
  uploadedImages = [],
  useSoonItems = [],
  loading,
  resultData,
  onTriggerAi,
  onSaveToImpact
}) {
  const [optionalExpiryNote, setOptionalExpiryNote] = useState('');

  const handleManualGenerate = () => {
    onTriggerAi(optionalExpiryNote);
  };

  return (
    <section id="gemma-ai" className="gemma-ai-section" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '2px solid #34d399',
      borderRadius: '26px',
      padding: '2.25rem',
      marginBottom: '3rem',
      boxShadow: '0 20px 50px -10px rgba(16, 185, 129, 0.18)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top accent glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #10b981, #06b6d4, #f59e0b, #10b981)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 4s linear infinite'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(5, 150, 105, 0.3)'
          }}>
            <Bot size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.55rem', color: '#064e3b', fontWeight: 800 }}>
                Gemma 4 AI Chef
              </h2>
              <span style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Cpu size={13} color="#059669" />
                Google Gemma 4
              </span>
            </div>
            <p style={{ fontSize: '0.94rem', color: '#475569', marginTop: '2px' }}>
              Analyzes your photos & pantry items to formulate fresh, personalized zero-waste meals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualGenerate}
          disabled={loading}
          className="btn-primary-action"
          style={{
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.85rem 1.75rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none'
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
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

      {/* Optional Expiry Date bar */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '0.75rem 1.1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Clock size={16} color="#059669" />
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
          Optional Expiry Note / Urgency:
        </span>
        <input
          type="text"
          placeholder="e.g. Milk expires tomorrow, spinach is 2 days old, tomatoes are ripe"
          value={optionalExpiryNote}
          onChange={(e) => setOptionalExpiryNote(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.88rem',
            background: '#ffffff',
            color: '#1e293b'
          }}
        />
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #ecfeff)',
          borderRadius: '18px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          border: '1.5px solid #6ee7b7',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', animation: 'bounce 1s infinite' }}>
            🪄
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#065f46', fontWeight: 800 }}>
            Google Gemma 4 is Creating Your Recipe...
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#475569', maxWidth: '540px', margin: '0.5rem auto 0 auto' }}>
            {uploadedImages.length > 0 ? `Analyzing ${uploadedImages.length} food photo(s) and ` : ''}
            evaluating available ingredients, checking food freshness rules, and generating step-by-step instructions.
          </p>
        </div>
      )}

      {/* Generated Result Display */}
      {resultData && resultData.recipe && !loading && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '2px solid #10b981',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.12)'
        }}>
          {/* Header pill & metadata */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '0.85rem'
          }}>
            <span style={{
              background: '#ecfdf5',
              color: '#065f46',
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid #a7f3d0'
            }}>
              <Sparkles size={14} color="#059669" />
              <span>{resultData.modelUsed || 'Google Gemma 4 AI'}</span>
            </span>

            <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
              <span>⏱️ Prep: {resultData.recipe.prepTime}</span>
              <span>🔥 Cook: {resultData.recipe.cookTime}</span>
              <span>👥 {resultData.recipe.servings || '2 servings'}</span>
            </div>
          </div>

          {/* If ingredients were detected from images */}
          {resultData.recipe.detectedFromImages && resultData.recipe.detectedFromImages.length > 0 && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Image size={18} color="#059669" />
              <div style={{ fontSize: '0.88rem', color: '#065f46' }}>
                <strong>Detected from your photos: </strong>
                {resultData.recipe.detectedFromImages.join(', ')}
              </div>
            </div>
          )}

          {/* Title & Description */}
          <h3 style={{ fontSize: '1.65rem', color: '#064e3b', fontWeight: 800, marginBottom: '0.45rem' }}>
            {resultData.recipe.title}
          </h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {resultData.recipe.description}
          </p>

          {/* Usable vs Missing Breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Ingredients You Can Use */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem', color: '#166534', marginBottom: '0.65rem' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>INGREDIENTS YOU CAN USE ({resultData.recipe.ingredientsYouCanUse?.length || 0})</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(resultData.recipe.ingredientsYouCanUse || []).map((ing, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Staples Needed */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem', color: '#b45309', marginBottom: '0.65rem' }}>
                <Plus size={16} color="#d97706" />
                <span>MISSING STAPLES NEEDED ({resultData.recipe.missingIngredients?.length || 0})</span>
              </div>
              {resultData.recipe.missingIngredients && resultData.recipe.missingIngredients.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {resultData.recipe.missingIngredients.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.9rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#d97706', fontWeight: 800 }}>+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.88rem', color: '#16a34a', fontWeight: 600 }}>
                  You have everything needed for this meal!
                </div>
              )}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.2rem', color: '#064e3b', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Flame size={20} color="#059669" />
              <span>Step-by-Step Cooking Instructions</span>
            </h4>
            <ol style={{ paddingLeft: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#334155', fontSize: '0.96rem' }}>
              {(resultData.recipe.instructions || []).map((step, idx) => (
                <li key={idx} style={{ lineHeight: '1.6' }}>
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
              borderRadius: '10px',
              padding: '0.9rem 1.15rem',
              fontSize: '0.92rem',
              color: '#065f46',
              marginBottom: '1.25rem'
            }}>
              <strong>Zero-Waste Chef Tip: </strong>
              <span>{resultData.recipe.zeroWasteTip}</span>
            </div>
          )}

          {/* Food Safety Reminder */}
          <div style={{
            background: '#fff1f2',
            borderLeft: '4px solid #f43f5e',
            borderRadius: '10px',
            padding: '1rem 1.15rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <ShieldAlert size={22} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.9rem', color: '#881337', lineHeight: '1.55' }}>
              <strong style={{ color: '#9f1239' }}>FOOD SAFETY REMINDER: </strong>
              {resultData.recipe.foodSafetyWarning || 'Inspect all items before use. An ingredient is not guaranteed safe just because it has not passed its expiry date. Discard any item showing mold or foul odor.'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
