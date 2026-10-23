// Smart ingredient normalizer and recipe matching engine

/**
 * Normalizes an ingredient name for flexible matching
 * Handles plurals, trailing 'es', 's', common prefixes and adjectives
 */
export function normalizeIngredient(raw) {
  if (!raw) return '';
  let str = raw.trim().toLowerCase();

  // Strip common packaging words and quantities
  str = str.replace(/^(fresh|ripe|leftover|cooked|raw|dry|stale|frozen|canned|grated|sliced|diced|chopped|some|a couple of|few)\s+/i, '');
  str = str.replace(/\b(organic|extra|large|medium|small|cloves?|slices?|cups?|tbsp|tsp|pinch of)\b/gi, '').trim();

  // Common singularizations
  if (str.endsWith('ies')) {
    str = str.slice(0, -3) + 'y';
  } else if (str.endsWith('oes')) {
    str = str.slice(0, -2); // tomatoes -> tomato, potatoes -> potato
  } else if (str.endsWith('es') && !str.endsWith('cheese')) {
    str = str.slice(0, -1);
  } else if (str.endsWith('s') && !str.endsWith('ss') && str !== 'oats' && str !== 'spinach') {
    str = str.slice(0, -1); // eggs -> egg, onions -> onion
  }

  return str.trim();
}

/**
 * Check if a single user ingredient matches a recipe ingredient
 */
export function isMatch(userIng, recipeIng) {
  const u = normalizeIngredient(userIng);
  const r = normalizeIngredient(recipeIng);

  if (!u || !r) return false;

  // Direct match
  if (u === r) return true;

  // Root word inclusions (e.g., "cheddar cheese" contains "cheese", "spaghetti" matches "pasta")
  if (u.includes(r) || r.includes(u)) return true;

  // Synonyms and aliases mapping
  const aliases = {
    egg: ['eggs', 'egg whites', 'egg yolk'],
    potato: ['potatoes', 'russet', 'taters', 'hashbrown', 'mash'],
    tomato: ['tomatoes', 'cherry tomatoes', 'canned tomato', 'crushed tomato'],
    bread: ['toast', 'loaf', 'baguette', 'buns', 'tortilla', 'pita', 'crust'],
    milk: ['dairy', 'oat milk', 'almond milk', 'soy milk', 'cow milk', 'cream'],
    cheese: ['cheddar', 'mozzarella', 'parmesan', 'feta', 'gouda', 'swiss'],
    onion: ['onions', 'shallot', 'scallion', 'green onion', 'spring onion'],
    rice: ['white rice', 'brown rice', 'cooked rice', 'jasmine rice'],
    chicken: ['chicken breast', 'chicken thighs', 'poultry', 'roast chicken'],
    pasta: ['spaghetti', 'penne', 'macaroni', 'noodles', 'fettuccine'],
    oil: ['olive oil', 'cooking oil', 'vegetable oil', 'canola oil', 'butter'],
    butter: ['margarine', 'oil', 'spread'],
    banana: ['bananas', 'overripe banana']
  };

  for (const [key, list] of Object.entries(aliases)) {
    const keyNorm = normalizeIngredient(key);
    const inAliases = list.map(normalizeIngredient);

    const userMatchesGroup = u === keyNorm || inAliases.includes(u);
    const recipeMatchesGroup = r === keyNorm || inAliases.includes(r);

    if (userMatchesGroup && recipeMatchesGroup) {
      return true;
    }
  }

  return false;
}

/**
 * Parse a comma-separated or space/line-separated input string into an array of distinct ingredient strings
 */
export function parseIngredientsInput(text) {
  if (!text) return [];
  return text
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Evaluates all recipes against the user's available ingredients
 */
export function matchRecipes(recipes, userIngredients) {
  if (!userIngredients || userIngredients.length === 0) {
    // If no ingredients are entered yet, return all recipes with neutral status
    return recipes.map((recipe) => ({
      ...recipe,
      usedIngredients: [],
      missingIngredients: recipe.ingredients.map((ing) => ing.name),
      requiredUsedCount: 0,
      requiredTotalCount: recipe.ingredients.filter((i) => i.required).length,
      missingRequiredCount: recipe.ingredients.filter((i) => i.required).length,
      matchPercentage: 0,
      isPerfectMatch: false,
      canCookNow: false
    }));
  }

  return recipes.map((recipe) => {
    const used = [];
    const missing = [];

    recipe.ingredients.forEach((ing) => {
      const found = userIngredients.some((userIng) => isMatch(userIng, ing.name));
      if (found) {
        used.push(ing);
      } else {
        missing.push(ing);
      }
    });

    const requiredIngredients = recipe.ingredients.filter((i) => i.required);
    const requiredUsed = used.filter((i) => i.required);
    const requiredMissing = missing.filter((i) => i.required);

    const requiredTotalCount = requiredIngredients.length;
    const requiredUsedCount = requiredUsed.length;
    const missingRequiredCount = requiredMissing.length;

    // Match percentage calculation based primarily on required ingredients
    const matchPercentage = requiredTotalCount > 0
      ? Math.round((requiredUsedCount / requiredTotalCount) * 100)
      : Math.round((used.length / recipe.ingredients.length) * 100);

    const isPerfectMatch = missingRequiredCount === 0;
    const canCookNow = isPerfectMatch;

    return {
      ...recipe,
      usedIngredients: used,
      missingIngredients: missing,
      requiredUsedCount,
      requiredTotalCount,
      missingRequiredCount,
      matchPercentage,
      isPerfectMatch,
      canCookNow
    };
  });
}

/**
 * Sort matched recipes by match quality
 */
export function sortRecipes(matchedList, sortBy = 'match') {
  const list = [...matchedList];

  switch (sortBy) {
    case 'match':
      return list.sort((a, b) => {
        // First priority: highest match percentage
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        // Second priority: fewest missing required ingredients
        if (a.missingRequiredCount !== b.missingRequiredCount) {
          return a.missingRequiredCount - b.missingRequiredCount;
        }
        // Third: fastest cooking time
        return a.totalMinutes - b.totalMinutes;
      });

    case 'quickest':
      return list.sort((a, b) => a.totalMinutes - b.totalMinutes);

    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return list;
  }
}
