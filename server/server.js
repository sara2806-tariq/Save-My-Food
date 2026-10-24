import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supported Gemma 4 model on Gemini API
const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';

app.use(cors());
// Support large base64 image payloads up to 25mb
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SaveMyFood Gemma 4 Backend',
    model: GEMMA_MODEL,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
  });
});

/**
 * POST /api/generate-recipe
 * Body: { 
 *   ingredients?: string[], 
 *   images?: Array<{ mimeType: string, data: string }>,
 *   useSoonItems?: Array<{ name: string, daysLeft?: number, notes?: string }> 
 * }
 */
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients = [], images = [], useSoonItems = [] } = req.body;

    const cleanIngredients = Array.isArray(ingredients)
      ? ingredients.map(i => (typeof i === 'string' ? i.trim() : '')).filter(i => i.length > 0)
      : [];

    const validImages = Array.isArray(images)
      ? images.filter(img => img && img.data && img.mimeType)
      : [];

    // Validation: Require either text ingredients OR uploaded photos/camera shots
    if (cleanIngredients.length === 0 && validImages.length === 0) {
      return res.status(400).json({
        error: 'Input Validation Failed',
        message: 'Please provide at least one ingredient name or upload a photo of food in your home.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY_MISSING',
        message: 'GEMINI_API_KEY environment variable is not configured in .env. Please set your Gemini API key.',
        fallbackAvailable: true
      });
    }

    const expiryContext = useSoonItems.length > 0
      ? `\nHigh-priority near-expiry items from fridge/pantry to rescue first:\n${useSoonItems.map(item => `- ${item.name} (${item.daysLeft !== undefined ? `${item.daysLeft} day(s) left` : 'expiring soon'}${item.notes ? `: ${item.notes}` : ''})`).join('\n')}`
      : '';

    const systemInstruction = `You are SaveMyFood's AI Chef powered by Google Gemma 4 (${GEMMA_MODEL}) via the Gemini API.
Your mission is to help people prepare delicious, nourishing, beginner-friendly meals from their leftover or near-expiry ingredients to prevent kitchen waste.
If photos are provided, inspect the images to identify any food, produce, pantry items, or groceries shown, and build a recipe around them.

CRITICAL FOOD SAFETY RULES:
1. NEVER suggest eating spoiled, moldy, sour-smelling, or slimy food.
2. Explicitly warn that food is NOT guaranteed safe merely because it is before its printed expiry date.
3. Advise discarding questionable or unsafe food.
4. Recommend thorough cooking of meats, eggs, and refrigerated grains.

Respond ONLY with a single valid JSON code block enclosed in \`\`\`json and \`\`\` with this exact structure:
\`\`\`json
{
  "title": "Creative recipe name",
  "description": "Short appetizing description explaining how it rescues the ingredients",
  "detectedFromImages": ["list of ingredients detected from the uploaded photos (if any)"],
  "prepTime": "e.g. 5 mins",
  "cookTime": "e.g. 10 mins",
  "totalMinutes": 15,
  "difficulty": "Easy",
  "servings": "2 servings",
  "ingredientsYouCanUse": ["list of available/detected ingredients used in this recipe"],
  "missingIngredients": ["list of basic pantry staples needed"],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "zeroWasteTip": "Practical tip on preserving, storing, or repurposing scraps",
  "foodSafetyWarning": "Explicit freshness check warning (do not rely solely on printed dates)"
}
\`\`\``;

    const userPrompt = `Here are the items available in my home:
${cleanIngredients.length > 0 ? `Entered Ingredients: ${cleanIngredients.join(', ')}` : ''}
${validImages.length > 0 ? `I also attached ${validImages.length} photo(s) of my food/fridge. Please identify the ingredients in the images and use them.` : ''}
${expiryContext}

Formulate a delicious zero-waste meal I can make today. Separate what I can use from any missing staples.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:generateContent?key=${apiKey}`;

    // Build multimodal payload
    const parts = [];

    // Add image parts if provided
    for (const img of validImages) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      });
    }

    // Add instruction and text prompt
    parts.push({ text: `${systemInstruction}\n\n${userPrompt}` });

    const requestBody = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3000
      }
    };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Gemini API error (${apiResponse.status}):`, errorText);

      let userFriendlyMessage = `Gemma 4 API request failed (${apiResponse.status}).`;
      if (apiResponse.status === 400) {
        userFriendlyMessage = `Invalid request to Gemma 4 API. Please check image format or model parameters.`;
      } else if (apiResponse.status === 403 || apiResponse.status === 401) {
        userFriendlyMessage = 'Invalid or unauthorized GEMINI_API_KEY. Please verify your API key in .env.';
      } else if (apiResponse.status === 429) {
        userFriendlyMessage = 'Gemini API rate limit reached. Please wait a few seconds and try again.';
      }

      return res.status(apiResponse.status).json({
        error: 'GEMINI_API_ERROR',
        message: userFriendlyMessage,
        details: errorText,
        fallbackAvailable: true
      });
    }

    const data = await apiResponse.json();

    // Extract non-thought parts (Gemma 4 thinking trace separation)
    const rawParts = data?.candidates?.[0]?.content?.parts || [];
    const nonThought = rawParts.filter(p => !p.thought);
    const targetParts = nonThought.length > 0 ? nonThought : rawParts;
    const generatedText = targetParts.map(p => p.text).join('\n').trim();

    if (!generatedText) {
      throw new Error('No content returned from Gemma 4 model.');
    }

    // Parse JSON
    let jsonString = generatedText;
    const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/i) || generatedText.match(/```\s*([\s\S]*?)\s*```/i);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      const braceMatch = generatedText.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonString = braceMatch[0];
      }
    }

    const parsedRecipe = JSON.parse(jsonString.trim());

    return res.json({
      success: true,
      isAiGenerated: true,
      modelUsed: `Google Gemma 4 (${GEMMA_MODEL}) via Gemini API`,
      recipe: {
        id: `gemma4-ai-${Date.now()}`,
        title: parsedRecipe.title || 'Gemma 4 Custom Zero-Waste Meal',
        description: parsedRecipe.description || 'Custom meal formulated with Google Gemma 4.',
        detectedFromImages: parsedRecipe.detectedFromImages || [],
        prepTime: parsedRecipe.prepTime || '5 mins',
        cookTime: parsedRecipe.cookTime || '10 mins',
        totalMinutes: parsedRecipe.totalMinutes || 15,
        difficulty: parsedRecipe.difficulty || 'Easy',
        servings: parsedRecipe.servings || '2 servings',
        ingredientsYouCanUse: Array.isArray(parsedRecipe.ingredientsYouCanUse) ? parsedRecipe.ingredientsYouCanUse : cleanIngredients,
        missingIngredients: Array.isArray(parsedRecipe.missingIngredients) ? parsedRecipe.missingIngredients : [],
        instructions: Array.isArray(parsedRecipe.instructions) ? parsedRecipe.instructions : [generatedText],
        zeroWasteTip: parsedRecipe.zeroWasteTip || 'Store remaining portions chilled to prevent waste.',
        foodSafetyWarning: parsedRecipe.foodSafetyWarning || 'Inspect all items before use. An ingredient is not guaranteed safe just because it has not passed its expiry date. Discard any item showing mold or foul odor.'
      }
    });

  } catch (err) {
    console.error('Server error in /api/generate-recipe:', err);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred while communicating with Gemma 4.',
      fallbackAvailable: true
    });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` SaveMyFood Backend Running (Port: ${PORT})`);
  console.log(` Model: ${GEMMA_MODEL}`);
  console.log(` API Key: ${process.env.GEMINI_API_KEY ? 'Configured (Hidden)' : 'MISSING (Check .env)'}`);
  console.log(`===============================================`);
});
