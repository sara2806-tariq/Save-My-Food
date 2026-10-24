// Google Gemma 4 Service for SaveMyFood
// Supports text ingredients, near-expiry items, and camera/gallery photos.

const BACKEND_API_URL = '/api/generate-recipe';

/**
 * Generate a recipe using Google Gemma 4 through the backend API.
 * Supports both text ingredients and uploaded images.
 *
 * @param {string[]} ingredients - List of user-provided leftover ingredients
 * @param {Array} useSoonItems - List of ingredients approaching expiry
 * @param {Array} images - Array of base64 objects: [{ mimeType: string, data: string }]
 * @returns {Promise<Object>}
 */
export async function generateGemmaRecipe(ingredients = [], useSoonItems = [], images = []) {
  const cleanIngredients = Array.isArray(ingredients)
    ? ingredients.map(i => (typeof i === 'string' ? i.trim() : '')).filter(i => i.length > 0)
    : [];

  const cleanImages = Array.isArray(images)
    ? images.filter(img => img && img.data && img.mimeType)
    : [];

  if (cleanIngredients.length === 0 && cleanImages.length === 0) {
    throw new Error('Please enter ingredients or snap a photo of items in your kitchen.');
  }

  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: cleanIngredients,
        useSoonItems,
        images: cleanImages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error (${response.status})`);
    }

    return {
      success: true,
      isAiGenerated: true,
      isFallback: false,
      modelUsed: data.modelUsed || 'Google Gemma 4 (gemma-4-26b-a4b-it) via Gemini API',
      recipe: data.recipe
    };

  } catch (err) {
    console.warn('Gemma 4 API request failed, loading safe fallback:', err.message);
    return getFallbackRecipe(cleanIngredients, err.message);
  }
}

/**
 * Safe local fallback recipe
 */
function getFallbackRecipe(ingredients, reason = 'API connection issue') {
  const fallbackList = ingredients.length > 0 ? ingredients : ['vegetables', 'eggs', 'bread'];
  return {
    success: true,
    isAiGenerated: false,
    isFallback: true,
    fallbackReason: reason,
    modelUsed: 'Offline Fallback Recipe',
    recipe: {
      id: `fallback-${Date.now()}`,
      title: 'Comfort Zero-Waste Kitchen Sauté',
      description: `A warm, versatile pan-sauté designed to use up what is on hand: ${fallbackList.join(', ')}.`,
      prepTime: '5 mins',
      cookTime: '10 mins',
      totalMinutes: 15,
      difficulty: 'Easy',
      servings: '2 servings',
      ingredientsYouCanUse: fallbackList,
      missingIngredients: ['1 tbsp cooking oil or butter', 'Pinch of salt & pepper'],
      instructions: [
        'Inspect all food items for spoilage, off-smell, or mold before cooking.',
        'Chop ingredients into even bite-sized pieces.',
        'Warm cooking oil in a frying pan over medium heat.',
        'Sauté firmer items first for 4 minutes, then add softer items and toss together.',
        'Season with salt, pepper, or herbs and serve warm.'
      ],
      zeroWasteTip: 'Leftovers can be refrigerated in an airtight container for up to 2 days.',
      foodSafetyWarning: 'SAFETY REMINDER: Never eat food that smells bad, feels slimy, or shows mold. Food is NOT guaranteed safe merely because it is before its printed expiry date. Discard questionable items.'
    }
  };
}
