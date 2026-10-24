import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config()

// Custom embedded API middleware plugin so `npm run dev` serves Gemma 4 API out-of-the-box
function gemmaApiPlugin() {
  return {
    name: 'gemma-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            status: 'ok',
            service: 'SaveMyFood Gemma 4 Embedded Vite API',
            model: process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it',
            hasApiKey: Boolean(process.env.GEMINI_API_KEY)
          }))
          return
        }

        if (req.url === '/api/generate-recipe' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const { ingredients = [], images = [], useSoonItems = [] } = JSON.parse(body || '{}')
              const apiKey = process.env.GEMINI_API_KEY
              const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it'

              if (!apiKey) {
                res.statusCode = 503
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({
                  error: 'GEMINI_API_KEY_MISSING',
                  message: 'GEMINI_API_KEY is not configured in .env'
                }))
                return
              }

              const cleanIngredients = Array.isArray(ingredients)
                ? ingredients.map(i => (typeof i === 'string' ? i.trim() : '')).filter(i => i.length > 0)
                : []

              const validImages = Array.isArray(images)
                ? images.filter(img => img && img.data && img.mimeType)
                : []

              const expiryContext = useSoonItems.length > 0
                ? `\nHigh-priority near-expiry ingredients:\n${useSoonItems.map(item => `- ${item.name} (${item.daysLeft !== undefined ? `${item.daysLeft} day(s) left` : 'expiring soon'}${item.notes ? `: ${item.notes}` : ''})`).join('\n')}`
                : ''

              const systemInstruction = `You are SaveMyFood's AI Chef powered by Google Gemma 4 (${model}) via the Gemini API.
Your mission is to help people prepare delicious, nourishing, beginner-friendly meals from their leftover or near-expiry ingredients to prevent kitchen waste.
If photos are provided, inspect the images to identify any food, produce, pantry items, or groceries shown, and build a recipe around them.

CRITICAL FOOD SAFETY RULES:
1. NEVER suggest eating spoiled, moldy, sour-smelling, or slimy food.
2. Explicitly warn that food is NOT guaranteed safe merely because it is before its printed expiry date.
3. Advise discarding questionable or unsafe food.

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
\`\`\``

              const userPrompt = `Here are the items available in my home:
${cleanIngredients.length > 0 ? `Entered Ingredients: ${cleanIngredients.join(', ')}` : ''}
${validImages.length > 0 ? `I also attached ${validImages.length} photo(s) of my food/fridge. Please identify the ingredients in the images and use them.` : ''}
${expiryContext}

Formulate a delicious zero-waste meal I can make today. Separate what I can use from any missing staples.`

              const parts = []
              for (const img of validImages) {
                parts.push({
                  inlineData: {
                    mimeType: img.mimeType,
                    data: img.data
                  }
                })
              }
              parts.push({ text: `${systemInstruction}\n\n${userPrompt}` })

              const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
              const apiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts }],
                  generationConfig: { temperature: 0.3, maxOutputTokens: 3000 }
                })
              })

              if (!apiResponse.ok) {
                const errorText = await apiResponse.text()
                res.statusCode = apiResponse.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'GEMINI_API_ERROR', details: errorText }))
                return
              }

              const data = await apiResponse.json()
              const rawParts = data?.candidates?.[0]?.content?.parts || []
              const nonThought = rawParts.filter(p => !p.thought)
              const targetParts = nonThought.length > 0 ? nonThought : rawParts
              const generatedText = targetParts.map(p => p.text).join('\n').trim()

              let jsonString = generatedText
              const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/i) || generatedText.match(/```\s*([\s\S]*?)\s*```/i)
              if (jsonMatch) {
                jsonString = jsonMatch[1]
              } else {
                const braceMatch = generatedText.match(/\{[\s\S]*\}/)
                if (braceMatch) jsonString = braceMatch[0]
              }

              const parsedRecipe = JSON.parse(jsonString.trim())

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: true,
                isAiGenerated: true,
                modelUsed: `Google Gemma 4 (${model}) via Gemini API`,
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
              }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'SERVER_ERROR', message: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), gemmaApiPlugin()]
})
