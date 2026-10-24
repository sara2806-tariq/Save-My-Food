import React, { useState, useMemo } from 'react';
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

export function App() {
  // Pre-fill with sample beginner ingredients so demo works immediately out of the box
  const [ingredientsString, setIngredientsString] = useState('bread, eggs, potatoes, tomatoes');
  const [userHasSearched, setUserHasSearched] = useState(true);
  
  const [useSoonItems, setUseSoonItems] = useState(initialUseSoonIngredients);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mealsRescuedCount, setMealsRescuedCount] = useState(4);
  const [toastMessage, setToastMessage] = useState(null);

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

  // Handle Find Recipes button click
  const handleFindRecipes = () => {
    setUserHasSearched(true);
    const element = document.getElementById('recipes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Found matching recipes for your ${activeIngredientsList.length} ingredients!`);
  };

  // Clear entered ingredients
  const handleClear = () => {
    setIngredientsString('');
    setUserHasSearched(false);
    showToast('Cleared ingredient input.');
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
    showToast('Ingredient used! Community rescue score updated.');
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
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#1b4332',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          fontSize: '0.92rem',
          fontWeight: 600,
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

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onStartSearch={() => handleNavigate('search')}
          recipeCount={sampleRecipes.length}
        />

        {/* Ingredient Search Input with Comma Separation & Quick Staples */}
        <IngredientInput
          ingredientsString={ingredientsString}
          setIngredientsString={setIngredientsString}
          activeIngredientsList={activeIngredientsList}
          onFindRecipes={handleFindRecipes}
          onClear={handleClear}
          onAddFromUseSoon={handleAddAllFromUseSoon}
        />

        {/* Use Soon Shelf Section */}
        <UseSoonShelf
          useSoonItems={useSoonItems}
          onAddIngredientToSearch={handleAddIngredientToSearch}
          onRemoveItem={handleRemoveUseSoonItem}
          onAddNewItem={handleAddNewUseSoonItem}
        />

        {/* Google Gemma Open-Source AI Chef Section */}
        <GemmaAiChef
          activeIngredientsList={activeIngredientsList}
          useSoonItems={useSoonItems}
          onSaveToImpact={() => setMealsRescuedCount(prev => prev + 1)}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
