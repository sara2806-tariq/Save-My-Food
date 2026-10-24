// Google Gemma 4 Service for SaveMyFood
// Calls the secure backend endpoint which communicates with Gemma 4 through the Gemini API.

const BACKEND_API_URL = '/api/generate-recipe';
const FALLBACK_DIRECT_URL = 'http://localhost:3001/api/generate-recipe';

/**
 * Generate a recipe using Google Gemma 4 through the backend API.
 * Includes input validation, loading status, helpful error reporting,
 * and a clearly-labeled non-AI fallback if the API is unavailable.
 *
 * @param {string[]} ingredients - List of user-provided leftover ingredients
 * @param {Array} useSoonItems - List of ingredients approaching expiry
 * @returns {Promise<Object>}
 */
export async function generateGemmaRecipe(ingredients, useSoonItems = []) {
  // 1. Input Validation
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error('Please enter at least one ingredient to generate a recipe.');
  }

  const cleanIngredients = ingredients
    .map(i => (typeof i === 'string' ? i.trim() : ''))
    .filter(i => i.length > 0);

  if (cleanIngredients.length === 0) {
    throw new Error('Please enter valid, non-empty ingredient names.');
  }

  // 2. Attempt real backend call to Gemma 4
  try {
    let response;
    try {
      // First try relative URL (works with Vite proxy or production)
      response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: cleanIngredients, useSoonItems })
      });
    } catch (proxyError) {
      // Direct localhost fallback if proxy is bypassed
      response = await fetch(FALLBACK_DIRECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: cleanIngredients, useSoonItems })
      });
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Backend responded with error code ${response.status}`;
      console.warn('Gemma 4 backend returned an error:', errorMsg);
      
      // Return labeled fallback with specific reason
      return getFallbackRecipe(cleanIngredients, errorMsg);
    }

    // Success: Return verified Gemma 4 AI generated recipe
    return {
      success: true,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: data.modelUsed || 'Google Gemma 4 (gemma-4-26b-a4b-it) via Gemini API',
      recipe: data.recipe,
      rawOutput: data.recipe
    };

  } catch (networkError) {
    console.warn('Network error reaching Gemma 4 backend:', networkError.message);
    const friendlyReason = 'Backend server (http://localhost:3001) is not running or unreachable. Ensure "npm run server" is active.';
    return getFallbackRecipe(cleanIngredients, friendlyReason);
  }
}

/**
 * Safe local fallback generator when the backend or Gemini API is not available.
 * CRITICAL: Clearly labeled as non-AI-generated per project requirements.
 */
function getFallbackRecipe(ingredients, reason = 'API currently unreachable') {
  const norm = ingredients.map(i => i.toLowerCase());
  const hasEggs = norm.some(i => i.includes('egg'));
  const hasBread = norm.some(i => i.includes('bread') || i.includes('toast'));
  const hasPotatoes = norm.some(i => i.includes('potato'));
  const hasRice = norm.some(i => i.includes('rice'));
  const hasTomatoes = norm.some(i => i.includes('tomato'));

  let title = 'Quick Zero-Waste Pantry Sauté';
  let prepTime = '5 mins';
  let cookTime = '10 mins';
  let totalMinutes = 15;
  let description = `A simple, skillet-based meal utilizing your entered ingredients: ${ingredients.join(', ')}.`;
  let ingredientsYouCanUse = [...ingredients];
  let missingIngredients = ['Cooking oil or butter', 'Pinch of salt & pepper'];
  let instructions = [
    `Carefully inspect all your ingredients (${ingredients.join(', ')}) for freshness, mold, or off-odors.`,
    'Chop denser vegetables and ingredients into uniform bite-sized pieces.',
    'Heat 1 tablespoon of cooking oil or butter in a skillet over medium heat.',
    'Sauté firmer ingredients first for 4-5 minutes, then add softer ingredients and toss together.',
    'Season with salt, pepper, or herbs, and serve hot.'
  ];
  let zeroWasteTip = 'Leftover sautéed items can be cooled and refrigerated for up to 2 days or folded into eggs tomorrow.';

  if (hasBread && hasEggs) {
    title = 'Rustic Custard French Toast';
    prepTime = '5 mins';
    cookTime = '8 mins';
    totalMinutes = 13;
    description = 'Transforms dry or stale bread into a rich breakfast using eggs and milk or water.';
    missingIngredients = ['Milk (optional)', 'Butter or oil for pan'];
    instructions = [
      'Inspect bread for any white, green, or blue mold spots (discard whole loaf if mold is found).',
      'Whisk eggs in a shallow dish with a pinch of salt or cinnamon.',
      'Dip bread slices for 10-15 seconds per side until liquid is absorbed.',
      'Cook on a greased skillet over medium heat for 2-3 minutes per side until golden brown and cooked through.'
    ];
  } else if (hasRice) {
    title = 'Comfort Cold-Rice Stir-Fry';
    prepTime = '5 mins';
    cookTime = '8 mins';
    totalMinutes = 13;
    description = 'Uses chilled leftover rice to make non-sticky, savory fried rice.';
    missingIngredients = ['1 tbsp soy sauce or salt', '1 tbsp cooking oil'];
    instructions = [
      'Ensure cooked rice was refrigerated within 2 hours of cooking and is under 3 days old.',
      'Heat oil in a pan over medium-high heat. Sauté available vegetables or proteins first.',
      'Add cold rice, breaking up clumps with a spatula, and stir-fry for 3-4 minutes until steaming hot throughout.'
    ];
  }

  return {
    success: true,
    isAiGenerated: false,
    isFallback: true,
    fallbackReason: reason,
    modelUsed: 'Offline Template Fallback (NON-AI GENERATED)',
    recipe: {
      id: `fallback-${Date.now()}`,
      title,
      description,
      prepTime,
      cookTime,
      totalMinutes,
      difficulty: 'Easy',
      servings: '2 servings',
      ingredientsYouCanUse,
      missingIngredients,
      allIngredients: [
        ...ingredientsYouCanUse.map(name => ({ name, amount: 'Available portion', isUserProvided: true })),
        ...missingIngredients.map(name => ({ name, amount: 'As needed', isUserProvided: false }))
      ],
      instructions,
      zeroWasteTip,
      foodSafetyWarning: 'SAFETY WARNING: Inspect all food before cooking. Never eat food showing mold, foul odor, or slime. Food is NOT guaranteed safe merely because it is before its printed expiry date. When in doubt, discard it safely.'
    }
  };
}
