# 🥗 SaveMyFood — Save Food, Create Meals

> **Student Project Demo:** A zero-waste cooking web application designed to help people use leftover or near-expiry ingredients to prepare delicious, budget-friendly meals instead of discarding them.

Built with **React**, **Vite**, **JavaScript**, and clean **Vanilla CSS**. Operates 100% locally in the browser with **no external database, no paid API, and no API keys required**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your computer.

### 2. Run the Development Server
Open your terminal in the project directory (`SaveMyFood`) and run:

```bash
# Start the local development server
npm run dev
```

Then open your browser and navigate to:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### 3. Build for Production (Optional)
```bash
npm run build
npm run preview
```

---

## ✨ Features Implemented

1. **"Save Food, Create Meals" Home Page & Hero:**
   - Features the required title and a clear mission statement.
   - Highlights community zero-waste goals, money-saving estimates, and kitchen safety.

2. **Comma-Separated Ingredient Input Box:**
   - Users can type ingredients separated by commas (e.g. `bread, eggs, potatoes, tomatoes`).
   - Dynamic tag badges with one-click `(X)` removal.
   - Quick-add buttons for everyday pantry staples (`+ Bread`, `+ Eggs`, `+ Potatoes`, `+ Tomatoes`, `+ Milk`, `+ Cheese`, `+ Onions`, etc.).
   - Includes a **"Load from 'Use Soon' Shelf"** button to automatically import ingredients nearing expiration.

3. **Functional "Find Recipes" Button & Matching Engine:**
   - Real algorithmic matching between entered ingredients and recipe requirements.
   - Handles singular vs. plural terms (`egg` / `eggs`, `potato` / `potatoes`, `tomato` / `tomatoes`).
   - Handles ingredient aliases (`bread` matches `toast` or `baguette`; `milk` matches `dairy` or `oat milk`).

4. **Detailed Recipe Cards:**
   - Displays recipe title, photo, category, and total cooking time.
   - **Show which ingredients the user can use:** Highlighted with green badges (`✓ bread`, `✓ eggs`).
   - **Show which ingredients are missing:** Highlighted with amber badges (`+ cheese`, `+ butter`).
   - Match status indicator (`100% Ready to Cook!`, `Missing 1 item`, etc.).

5. **Step-by-Step Cooking Modal:**
   - Click **"View Recipe"** on any card to see full measurements, numbered cooking steps, chef zero-waste tips, and recipe-specific food safety warnings.
   - **"I Cooked This Meal!"** button updates the interactive community food rescue counter.

6. **"Use Soon" Expiry Tracker Shelf:**
   - Pre-populated with realistic perishable items (e.g. milk, bread, eggs, spinach, tomatoes, bananas).
   - Color-coded urgency badges:
     - 🔴 **Red:** Expiring in 1 day or today.
     - 🟠 **Orange:** Expiring in 2–3 days.
     - 🟢 **Green:** Expiring in 4+ days.
   - One-click **"Use in Recipe"** button to immediately insert the item into the search box.
   - Add new custom pantry items with days remaining and quantities.
   - "Cooked / Remove" action button.

7. **Mandatory Food Safety Standards:**
   - **Critical Warning Banner:** Warns that an ingredient is *not* guaranteed safe just because it has not reached its printed expiry date.
   - **The 3 Senses Check:** Visual inspection for mold, odor check, and texture check.
   - **The Bread & Soft Food Rule:** Strict warning that mold roots penetrate deep—never just cut off mold from bread or soft cheese.
   - **The Golden Rule:** *"When in doubt, throw it out!"* Never taste test suspicious food.

8. **Aesthetics & Responsive Design:**
   - Rich modern design utilizing warm cream surfaces (`#FCFAF6`, `#F6F2EA`) and fresh forest & emerald greens (`#1B4332`, `#2D6A4F`, `#40916C`, `#D8F3DC`).
   - Styled using custom CSS with glassmorphism, responsive grids, and Google Fonts (`Outfit` & `Plus Jakarta Sans`).

---

## 📁 Project Structure

```
SaveMyFood/
├── index.html                   # HTML entry point with fonts & meta
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
├── public/
│   └── favicon.svg              # Custom eco-friendly SVG logo
└── src/
    ├── main.jsx                 # React root mounting
    ├── App.jsx                  # Main application state & layout
    ├── index.css                # Global green & cream design system
    ├── data/
    │   ├── recipes.js           # 16 zero-waste recipes with instructions
    │   └── initialUseSoon.js    # Default near-expiry pantry items
    ├── utils/
    │   └── ingredientMatcher.js # Normalization and matching algorithm
    └── components/
        ├── Navbar.jsx           # Top navigation bar
        ├── Hero.jsx             # Hero title & description
        ├── IngredientInput.jsx  # Comma-separated input & quick pills
        ├── UseSoonShelf.jsx     # Expiry tracker shelf & safety banner
        ├── RecipeList.jsx       # Filter tabs & recipe grid
        ├── RecipeCard.jsx       # Card displaying usable vs missing ingredients
        ├── RecipeModal.jsx      # Step-by-step cooking modal
        ├── SafetyGuide.jsx      # Food safety guide & spoilage rules
        ├── ImpactTracker.jsx    # Rescued meals & savings counter
        └── Footer.jsx           # Student demo disclaimer & safety note
```
