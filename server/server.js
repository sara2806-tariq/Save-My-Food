import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supported Gemma 4 model on Gemini API
// Confirmed supported model IDs: gemma-4-26b-a4b-it, gemma-4-31b-it
const GEMMA_MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';

app.use(cors());
app.use(express.json());

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
 * Body: { ingredients: string[], useSoonItems?: Array<{ name: string, daysLeft?: number, quantity?: string }> }
 */
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { ingredients, useSoonItems = [] } = req.body;

    // 1. Input Validation
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Input Validation Failed',
        message: 'Please provide at least one ingredient (e.g. bread, eggs, tomatoes).'
      });
    }

    const cleanIngredients = ingredients
      .map(i => (typeof i === 'string' ? i.trim() : ''))
      .filter(i => i.length > 0);

    if (cleanIngredients.length === 0) {
      return res.status(400).json({
        error: 'Input Validation Failed',
        message: 'Ingredients list cannot be blank. Please enter comma-separated ingredients.'
      });
    }

    // 2. Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY_MISSING',
        message: 'GEMINI_API_KEY environment variable is not configured on the backend server. Please create a .env file with your valid Gemini API key.',
        fallbackAvailable: true
      });
    }

    // 3. Construct Gemma 4 Zero-Waste & Food Safety Prompt
    const expiryContext = useSoonItems.length > 0
      ? `\nHigh-priority near-expiry ingredients:\n${useSoonItems.map(item => `- ${item.name} (${item.daysLeft !== undefined ? `${item.daysLeft} day(s) left` : 'expiring soon'}${item.notes ? `: ${item.notes}` : ''})`).join('\n')}`
      : '';

    const systemInstruction = `You are SaveMyFood's culinary AI assistant powered by the open-weight Google Gemma 4 model (${GEMMA_MODEL}) through the Gemini API.
Your mission is to help people make delicious, budget-friendly meals using leftover or near-expiry ingredients to prevent food waste.

CRITICAL FOOD SAFETY RULES:
1. NEVER suggest eating spoiled, moldy, sour, slimy, or discolored food.
2. Explicitly warn the user that food is NOT guaranteed safe merely because it has not passed its printed expiry date (storage temperature, broken seals, and microbial growth can spoil food earlier).
3. If any ingredient is doubtful, advise discarding it safely.
4. Recommend thorough cooking of perishable items (eggs, meats, refrigerated rice).

Respond ONLY with a single valid JSON code block enclosed in \`\`\`json and \`\`\` with this exact structure:
\`\`\`json
{
  "title": "Creative recipe name",
  "description": "Short appetizing description explaining how it rescues the ingredients",
  "prepTime": "e.g. 5 mins",
  "cookTime": "e.g. 10 mins",
  "totalMinutes": 15,
  "difficulty": "Easy",
  "servings": "2 servings",
  "ingredientsYouCanUse": ["list of user-provided ingredients used in this recipe"],
  "missingIngredients": ["list of common staple ingredients the user still needs to add"],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "zeroWasteTip": "Practical tip on preserving, storing, or repurposing scraps",
  "foodSafetyWarning": "Explicit, specific safety warning about checking freshness and not relying solely on dates"
}
\`\`\``;

    const userPrompt = `I have the following ingredients:
User Ingredients: ${cleanIngredients.join(', ')}
${expiryContext}

Create a beginner-friendly recipe that uses as many of my provided ingredients as possible. Clearly separate the ingredients I can use from any missing pantry staples I need. Include step-by-step instructions, prep time, zero-waste tips, and a rigorous food safety reminder.`;

    // 4. Call Gemma 4 through Gemini API endpoint
    // Supported endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\n${userPrompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500
      }
    };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Gemini API error (${apiResponse.status}):`, errorText);

      let userFriendlyMessage = `Gemma 4 API request failed with status ${apiResponse.status}.`;
      if (apiResponse.status === 400) {
        userFriendlyMessage = `Invalid request to Gemma 4 API. Check your model ID (${GEMMA_MODEL}) or prompt parameters.`;
      } else if (apiResponse.status === 403 || apiResponse.status === 401) {
        userFriendlyMessage = 'Invalid or unauthorized GEMINI_API_KEY. Please verify your API key in the backend .env file.';
      } else if (apiResponse.status === 429) {
        userFriendlyMessage = 'Gemini API rate limit reached. Please wait a moment before trying again.';
      }

      return res.status(apiResponse.status).json({
        error: 'GEMINI_API_ERROR',
        status: apiResponse.status,
        message: userFriendlyMessage,
        details: errorText,
        fallbackAvailable: true
      });
    }

    const data = await apiResponse.json();

    // In Gemma 4 (reasoning model), extract the non-thought answer parts
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const nonThought = parts.filter(p => !p.thought);
    const targetParts = nonThought.length > 0 ? nonThought : parts;
    const generatedText = targetParts.map(p => p.text).join('\n').trim();

    if (!generatedText) {
      throw new Error('No content returned from Gemma 4 model.');
    }

    // 5. Parse JSON from model output
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

    // 6. Return standard structured response
    return res.json({
      success: true,
      isAiGenerated: true,
      modelUsed: `Google Gemma 4 (${GEMMA_MODEL}) via Gemini API`,
      recipe: {
        id: `gemma4-ai-${Date.now()}`,
        title: parsedRecipe.title || 'Gemma 4 Custom Zero-Waste Meal',
        description: parsedRecipe.description || 'Custom meal generated with Google Gemma 4.',
        prepTime: parsedRecipe.prepTime || '5 mins',
        cookTime: parsedRecipe.cookTime || '10 mins',
        totalMinutes: parsedRecipe.totalMinutes || 15,
        difficulty: parsedRecipe.difficulty || 'Easy',
        servings: parsedRecipe.servings || '2 servings',
        ingredientsYouCanUse: Array.isArray(parsedRecipe.ingredientsYouCanUse) ? parsedRecipe.ingredientsYouCanUse : cleanIngredients,
        missingIngredients: Array.isArray(parsedRecipe.missingIngredients) ? parsedRecipe.missingIngredients : [],
        instructions: Array.isArray(parsedRecipe.instructions) ? parsedRecipe.instructions : [generatedText],
        zeroWasteTip: parsedRecipe.zeroWasteTip || 'Store unused portions in an airtight container in the fridge.',
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
  console.log(` SaveMyFood Backend Server Running`);
  console.log(` Port:    http://localhost:${PORT}`);
  console.log(` Model:   ${GEMMA_MODEL}`);
  console.log(` API Key: ${process.env.GEMINI_API_KEY ? 'Configured (Hidden)' : 'MISSING (Check .env)'}`);
  console.log(`===============================================`);
});
