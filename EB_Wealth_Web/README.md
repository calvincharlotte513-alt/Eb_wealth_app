# EB Wealth — Web Application

The institutional-grade UK wealth platform web edition featuring direct Firebase Cloud Firestore persistence and Authentication.

## Running Locally

### Option 1: Double-Click Open
Simply double-click `index.html` in Chrome, Safari, Firefox, or Edge.

### Option 2: Run Local Dev Server
```bash
# Using Node / NPX
npx serve . -l 3000

# Or using Python
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment Options
- **Firebase Hosting**: Run `firebase deploy --only hosting`
- **Vercel / Netlify**: Connect folder or GitHub repository
- **GitHub Pages**: Upload to `gh-pages` branch or repository settings

## Features Included
- **No Landing Page**: Direct to Sign In / Create Account with luxury cosmic background.
- **Firebase Integration**: Real Auth REST API + Named Cloud Firestore database (`ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3`).
- **Dashboard**: Net worth summary, UK Stocks & Shares ISA tracker (£20k annual limit), and asset allocation distribution.
- **Portfolio Tracker**: Live ETF & stock holdings with P&L metrics and Add Holding modal.
- **Academy**: Interactive UK investing curriculum with XP gamification.
- **AI Coach**: Institutional wealth intelligence assistant.
- **Community Forum**: Real discussion threads with full category selector and like/comment interaction.
- **Vault**: Profile settings, Pro membership tier badge, and manual instant sync button.
