import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IngredientInput } from './components/IngredientInput';
import { UseSoonShelf } from './components/UseSoonShelf';
import { GemmaAiChef } from './components/GemmaAiChef';
import { RecipeList } from './components/RecipeList';
import { RecipeModal } from './components/RecipeModal';
import { SafetyGuide } from './components/SafetyGuide';
import { ImpactTracker } from './components/ImpactTracker';
import { Footer } from './components/Footer';

import { sampleRecipes } from './data/recipes';
import { initialUseSoonIngredients } from './data/initialUseSoon';
import { parseIngredientsInput, matchRecipes } from './utils/ingredientMatcher';
import { generateGemmaRecipe } from './services/gemmaService';

export function App() {
  const [ingredientsString, setIngredientsString] = useState('bread, eggs, potatoes, tomatoes');
  const [userHasSearched, setUserHasSearched] = useState(true);
  
  // Camera & Multi-Image Upload State
  const [uploadedImages, setUploadedImages] = useState([]);

  // Moving Cursor Glow Position
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [useSoonItems, setUseSoonItems] = useState(initialUseSoonIngredients);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mealsRescuedCount, setMealsRescuedCount] = useState(4);
  const [toastMessage, setToastMessage] = useState(null);

  // Gemma 4 AI Generation Shared State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Show a brief toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Parse active ingredients into trimmed array
  const activeIngredientsList = useMemo(() => {
    return parseIngredientsInput(ingredientsString);
  }, [ingredientsString]);

  // Compute matched recipes with used and missing breakdown
  const matchedRecipes = useMemo(() => {
    return matchRecipes(sampleRecipes, activeIngredientsList);
  }, [activeIngredientsList]);

  // Function to call Gemma 4 via backend (supports text + camera/gallery images)
  const triggerGemmaAi = async (optionalExpiryNote = '') => {
    if (activeIngredientsList.length === 0 && uploadedImages.length === 0) {
      showToast('Please enter an ingredient or upload a food photo first!');
      return;
    }

    setAiLoading(true);

    try {
      const enrichedUseSoon = [...useSoonItems];
      if (optionalExpiryNote && optionalExpiryNote.trim()) {
        enrichedUseSoon.push({
          name: 'User Expiry Note',
          notes: optionalExpiryNote.trim(),
          daysLeft: 1
        });
      }

      const response = await generateGemmaRecipe(activeIngredientsList, enrichedUseSoon, uploadedImages);
      setAiResult(response);
      showToast(`Gemma 4 created your custom recipe!`);
    } catch (err) {
      console.error('AI generation error:', err);
      showToast(err.message || 'Error communicating with Gemma 4.');
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Find Recipes button click - triggers Gemma 4 AI generation
  const handleFindRecipes = () => {
    setUserHasSearched(true);
    triggerGemmaAi();
    const element = document.getElementById('gemma-ai');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Clear entered ingredients & images
  const handleClear = () => {
    setIngredientsString('');
    setUploadedImages([]);
    setUserHasSearched(false);
    setAiResult(null);
    showToast('Cleared ingredients & photos.');
  };

  // Add an item from the "Use Soon" shelf into the search bar
  const handleAddIngredientToSearch = (name) => {
    const currentList = parseIngredientsInput(ingredientsString);
    const lowerName = name.toLowerCase();

    if (!currentList.some((i) => i.toLowerCase() === lowerName)) {
      const updated = currentList.length > 0 ? `${ingredientsString}, ${name}` : name;
      setIngredientsString(updated);
      setUserHasSearched(true);
      showToast(`Added "${name}" to recipe search!`);
    } else {
      showToast(`"${name}" is already in your search.`);
    }

    const element = document.getElementById('search-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Import all items from the Use Soon shelf into the search bar
  const handleAddAllFromUseSoon = () => {
    const currentList = parseIngredientsInput(ingredientsString);
    const newItems = useSoonItems
      .map((item) => item.name)
      .filter((name) => !currentList.some((c) => c.toLowerCase() === name.toLowerCase()));

    if (newItems.length === 0) {
      showToast('All "Use Soon" ingredients are already in your search!');
      return;
    }

    const updatedList = [...currentList, ...newItems];
    const updatedStr = updatedList.join(', ');
    setIngredientsString(updatedStr);
    setUserHasSearched(true);
    showToast(`Loaded ${newItems.length} items from "Use Soon" shelf!`);
  };

  // Remove or mark as used an item from Use Soon shelf
  const handleRemoveUseSoonItem = (id) => {
    setUseSoonItems((prev) => prev.filter((item) => item.id !== id));
    setMealsRescuedCount((prev) => prev + 1);
    showToast('Ingredient used! Community score updated.');
  };

  // Add new item to Use Soon shelf
  const handleAddNewUseSoonItem = (newItem) => {
    setUseSoonItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to your Use Soon shelf.`);
  };

  // Handle meal rescue event from modal
  const handleMealRescued = (recipeTitle) => {
    setMealsRescuedCount((prev) => prev + 1);
    showToast(`Awesome! You cooked "${recipeTitle}" and saved food! 🎉`);
  };

  // Navigation scroll helper
  const handleNavigate = (targetId) => {
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(targetId === 'search' ? 'search-section' : targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSafety = () => {
    const el = document.getElementById('safety-guide');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Moving Colorful Blurry Background with Cursor Spotlight */}
      <div className="cursor-ambient-container" aria-hidden="true">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
        <div className="ambient-orb-3" />
        <div
          className="interactive-cursor-glow"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px) translate(-50%, -50%)`
          }}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#064e3b',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          fontSize: '0.92rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'slideUp 0.25s ease'
        }}>
          <span>🌱</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar onNavigate={handleNavigate} onOpenSafety={handleOpenSafety} />

      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* Clean, Non-Stuffy Hero Section */}
        <Hero />

        {/* Input Card with Text + Camera / Gallery Upload */}
        <IngredientInput
          ingredientsString={ingredientsString}
          setIngredientsString={setIngredientsString}
          activeIngredientsList={activeIngredientsList}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          onFindRecipes={handleFindRecipes}
          onClear={handleClear}
          onAddFromUseSoon={handleAddAllFromUseSoon}
          isAiLoading={aiLoading}
        />

        {/* Google Gemma 4 AI Chef Section */}
        <GemmaAiChef
          activeIngredientsList={activeIngredientsList}
          uploadedImages={uploadedImages}
          useSoonItems={useSoonItems}
          loading={aiLoading}
          resultData={aiResult}
          onTriggerAi={triggerGemmaAi}
          onSaveToImpact={() => setMealsRescuedCount(prev => prev + 1)}
        />

        {/* Use Soon Shelf Section */}
        <UseSoonShelf
          useSoonItems={useSoonItems}
          onAddIngredientToSearch={handleAddIngredientToSearch}
          onRemoveItem={handleRemoveUseSoonItem}
          onAddNewItem={handleAddNewUseSoonItem}
        />

        {/* Recipe Cards List with Usable & Missing Breakdown */}
        <RecipeList
          recipes={matchedRecipes}
          userHasSearched={userHasSearched}
          onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
        />

        {/* Impact Tracker Counter */}
        <div style={{ marginTop: '3.5rem' }}>
          <ImpactTracker mealsRescuedCount={mealsRescuedCount} />
        </div>

        {/* Food Safety Guide */}
        <SafetyGuide />
      </main>

      {/* Recipe Details Modal with Step-by-Step Instructions */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onMealRescued={handleMealRescued}
        />
      )}

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

export default App;
