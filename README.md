# 🥗 SaveMyFood — Save Food, Create Meals

> **Student Project Demo:** A zero-waste cooking web application designed to help people use leftover or near-expiry ingredients to prepare delicious, budget-friendly meals instead of discarding them.

Built with **React**, **Vite**, **JavaScript**, and clean **Vanilla CSS**, with a secure **Node.js/Express** backend that calls **Google Gemma 4** (open-weight model family) via the **Gemini API**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your computer.

### 2. Configure Backend Environment Variable (Never committed to Git!)
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set your Google AI Studio API key:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   PORT=3001
   GEMMA_MODEL=gemma-4-26b-a4b-it
   ```
   > 🔒 **Security Notice:** `.env` is listed in `.gitignore` and is **never** committed to GitHub or exposed in frontend code.

### 3. Run Both Frontend and Backend

You have two convenient options:

#### Option A: One Single Command (Recommended)
```bash
npm run start
```
*This starts both the backend API (`http://localhost:3001`) and the Vite frontend (`http://localhost:5173`) concurrently.*

#### Option B: Separate Terminal Windows
* **Terminal 1 (Backend):**
  ```bash
  npm run server
  ```
* **Terminal 2 (Frontend):**
  ```bash
  npm run dev
  ```

Then open your browser and navigate to:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## ✨ Features Implemented

1. **Google Gemma 4 AI Recipe Generation:**
   - Uses the open-weight model `gemma-4-26b-a4b-it` (or `gemma-4-31b-it`) via Google's Gemini API.
   - Takes user-entered leftover ingredients and optional expiry dates to formulate brand-new zero-waste recipes.
   - Clearly displays recipe title, preparation time, cooking time, step-by-step instructions, usable ingredients, and missing staples.
   - Includes real-time loading indicators, helpful error messages, and input validation.

2. **Guaranteed Safe Fallback (Clearly Labeled):**
   - If the backend is offline or `GEMINI_API_KEY` is not provided, the application automatically displays a fallback zero-waste recipe.
   - Fallback recipes are **explicitly labeled** as `FALLBACK RECIPE (NON-AI GENERATED)` so evaluators can clearly see the distinction.

3. **Strict Food Safety Standards:**
   - Adheres to the principle: **Never eat spoiled food; discard unsafe ingredients.**
   - Explicitly warns that an ingredient is **NOT guaranteed safe just because it has not reached its expiry date**. Storage conditions, broken seals, and microbial growth can spoil food earlier.
   - "When in doubt, throw it out!" rule and 3-senses freshness check (sight, smell, texture).

4. **"Save Food, Create Meals" Home Page & Hero:**
   - Features the required title, mission statement, and quick navigation.
   - Zero-waste community counter and money-saving statistics.

5. **Comma-Separated Ingredient Input Box:**
   - Users can type ingredients separated by commas (e.g. `bread, eggs, potatoes, tomatoes`).
   - Dynamic tag badges with one-click `(X)` removal.
   - Quick-add buttons for everyday pantry staples (`+ Bread`, `+ Eggs`, `+ Potatoes`, `+ Tomatoes`, `+ Milk`, `+ Cheese`, `+ Onions`, etc.).
   - Includes a **"Load from 'Use Soon' Shelf"** button.

6. **16 Curated Built-in Zero-Waste Recipes:**
   - Instant recipe library (French toast, Spanish tortilla, fried rice, frittata, quesadilla, chowder) that functions without external calls.
   - Highlights **"You Can Use"** (green pills `✓`) and **"Missing Ingredients"** (amber pills `+`).

7. **"Use Soon" Expiry Tracker Shelf:**
   - Tracks perishable pantry items with color-coded urgency badges (🔴 1 day, 🟠 2–3 days, 🟢 4+ days).
   - One-click **"Use in Recipe"** button to add items into the search box.

---

## 📁 Project Architecture & Changed Files

```
SaveMyFood/
├── .env.example                 # Template for GEMINI_API_KEY (New)
├── .gitignore                   # Updated to ignore .env and secrets
├── package.json                 # Added express, cors, dotenv, concurrently, and scripts
├── vite.config.js               # Added proxy for /api -> localhost:3001
├── server/
│   └── server.js                # Secure Node/Express backend calling Gemma 4 via Gemini API (New)
└── src/
    ├── services/
    │   └── gemmaService.js      # Frontend service calling backend with labeled fallback (Updated)
    ├── components/
    │   ├── GemmaAiChef.jsx      # Gemma 4 UI with loading state, errors, and fallback badge (Updated)
    │   ├── Hero.jsx             # Updated with Gemma 4 details
    │   ├── Navbar.jsx           # Updated with navigation link to Gemma AI
    │   └── ... (all existing components preserved)
```
