# EB WEALTH — Full-Stack Investment Education Platform

> **Tagline:** Learn. Invest. Build Wealth.

A production-ready, full-stack UK investment education and portfolio analysis platform designed for everyday investors, working-class wealth builders, young professionals, and parents investing for children.

---

## Brand & Visual System
- **Theme:** Luxury Cyber-Fintech maintaining the exact mobile app cosmic dark background (`assets/img_cosmic_bg.jpg`) with deep space obsidian overlay (`#040B14`, `#071322`).
- **Color Palette:**
  - Royal Blue: `#0284C7`
  - Neon Cyan: `#00F0FF`
  - Emerald Green: `#10B981`
  - Gold Accents: `#FBBF24` (used sparingly for premium highlights)
  - White: `#FFFFFF`
  - Soft Grey / Slate: `#94A3B8`, `#64748B`
- **Typography:** Modern professional sans-serif (`Inter`) with high-contrast numerical weight.

---

## Feature Architecture

### 1. High-Converting Landing Page
- **Hero Section:** "Learn how to invest. Understand your portfolio. Build long-term wealth."
- **Section 1 (The Problem):** 6 beginner dilemmas (What to invest in, Risk tolerance, ETF selection, Overlap risk, True diversification, Long-term planning).
- **Section 2 (The Solution):** 6 core pillars (Learn, Analyse, Track, Simulate, Ask, Grow).
- **Section 3 (Feature Suite Grid):** Interactive module showcases.
- **Section 4 (Investor Journey):** 5-stage transformation (Beginner → Educated → Confident → Disciplined → Long-Term Investor).
- **Section 5 (Transparent Pricing):** Free Starter (£0), EB Wealth Pro (£9.99/mo or £99/yr), and Masterclasses.
- **FCA Compliance Disclaimers:** Clear regulatory disclaimers throughout.

### 2. Multi-Step Onboarding & Investor Profile
- 6-step guided assessment analyzing experience, primary goal, time horizon, monthly contribution capacity, and risk scenarios.
- Dynamically generates the **EB INVESTOR PROFILE** with reference ID `REF: EB-8849-GB` and calibrated curriculum starting level.

### 3. Investment Dashboard
- Greeting, Investor Level banner with XP progress bar and learning streak days.
- 5-metric Portfolio Snapshot: Total Value, Contributions, Gain (£ and %), Positions count, Monthly compounding rate.
- Learning Momentum card with CTA to continue lessons.
- Portfolio Health indicators (Diversification, Geographic Exposure, ETF Overlap warning, Tax Shelter %).
- Quick tool launchpads.

### 4. 6-Level Learning Academy
- **Level 1:** Investing Foundations (What is investing?, Saving vs investing, Compound growth, Inflation, Risk vs reward).
- **Level 2:** Investment Types (Shares, ETFs, Index Funds, Bonds, Cash, Gold).
- **Level 3:** UK Investing (Stocks & Shares ISA, SIPP Pension, JISA, LISA, Capital Gains & Dividend tax rules).
- **Level 4:** Portfolio Building (Asset allocation, ETF overlap, Rebalancing, Core-satellite).
- **Level 5:** Stock Analysis (Revenue, Profit, EPS, Free cash flow, Debt, P/E ratios, Moats).
- **Level 6:** Advanced Investing (Factor strategies, Dividend growth, Behavioural finance).
- Each lesson includes a real-world UK example, key takeaway, and an interactive 3-question quiz with instant feedback and XP rewards.

### 5. Dedicated ETF Overlap Checker
- Multi-ETF comparator (VWRP, VUAG, IITU, EQGB, ISF).
- Calculates exact overlap percentage (e.g., 58.4% between VWRP and VUAG) and top shared holdings (Microsoft, Apple, Nvidia, Amazon, Alphabet).
- Educational warning on concentration risk without unauthorized buy/sell orders.

### 6. EB Research & Stock Scorecards
- Directory of legitimate UK & global securities with delayed LSE quote indicators.
- 10-Point Scorecard: Revenue Growth, Earnings Growth, Profitability, Balance Sheet, Cash Flow, Valuation, Competitive Advantage, Dividend Safety, Growth Potential, Key Risks (Strong / Moderate / Weak / Unknown).
- "What Looks Interesting", "What Needs Investigation", and key investor questions.

### 7. Compound Growth Simulator
- Sliders for Initial Investment, Monthly Deposit, Time Horizon (1–40 years), and Expected Annual Return (3–15%).
- Compounding growth projections with multi-scenario monthly comparisons (£100 vs £250 vs £500).

### 8. AI Wealth Coach
- Conversational investment education assistant with prompt chips and intelligent responses.

### 9. Community, Masterclasses, and News
- Category discussion forum with upvotes, comments, and new discussion creation.
- Live masterclass calendar with 1-tap registration.
- Curated LSE market news wire.

### 10. Admin Console
- Executive platform metrics: Total Users (4,820), Pro Subscribers (1,248), MRR (£12,410), Course Completion (68.4%), and AI queries (32,940).

---

## Live Cloud Firestore Synchronization
- Connected to project `com-aistudio-ebwealth-kq-f6b41` and named database `ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3`.
- Automatic sync with local fallback mode for instant offline reliability.

---

## Running the Web App

### Option 1: Browser Launch
Double-click `index.html` in Chrome, Safari, Edge, or Firefox.

### Option 2: Local HTTP Server
```bash
npx serve . -l 3000
# or
python3 -m http.server 3000
```
Visit `http://localhost:3000`.

### Option 3: Dedicated Git Branch
The repository has a dedicated branch **`web-app`** (and alias **`web`**) containing only the web application at the root for zero-config deployment to Vercel, Netlify, or GitHub Pages.
