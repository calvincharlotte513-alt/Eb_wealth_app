# EB Wealth: 1:1 Cross-Platform Mirror (Web & iOS Alignment)

A comprehensive architectural and engineering blueprint to replicate all 15 native Android screens and financial tools directly into the Web application (and iOS client), featuring a high-fidelity mobile-centered phone chassis on desktop, pixel-perfect visual styling, and live synchronization with Firebase Cloud Firestore.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification:
> - **Desktop Adaptation**: Centered mobile phone frame (390px–430px wide) simulating realistic device proportions with luxury cyber glass borders, maintaining exact mobile parity on desktop displays.
> - **Data Synchronization**: Direct live synchronization with Firebase Cloud Firestore, sharing authenticated portfolio holdings, tax wrapper balances, and user progress across Android, iOS, and Web.
> - **Screen Scope**: Full 1:1 parity across all 15 native screens and financial tools (Dashboard, Market Research, Asset Detail, Academy, Lesson Detail, Portfolio, AI Coach, Compound Simulator, ETF Overlap Analyzer, Market News, Community Forum, Masterclass Events, Investor Profile, Pro Membership Upgrade, and Auth Gate).

---

## 1. Overview & Core Concept

### What It Delivers
The EB Wealth web application will be transformed from a basic desktop view into an exact, pixel-for-pixel replica of the native Android application. When opened on desktop or mobile browsers, the interface renders inside a sleek, dark-matter mobile viewport with the exact cyber-capsule top bar, glowing live market tickers, interactive financial calculators, structured wealth curriculum, and the signature floating frosted bottom dock.

### Target Audience & Persona
High-net-worth investors, ISA/SIPP retail wealth builders, and finance students who demand access to EB Wealth tools on any laptop, tablet, or browser with identical aesthetics, instant data sync, and zero feature compromise.

### Key Value
- **Zero Discrepancy**: Complete visual and functional symmetry across Android, iOS, and Web.
- **Unified Cloud State**: Portfolios, ISA allowances, completed lessons, and watchlist items created on Android immediately reflect in real time on the Web app.
- **Full Tool Suite**: Direct web access to the ETF Overlap Calculator, Compound Interest Simulator, AI Wealth Coach, and LSE Real-Time Market Feed.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Mood
**Cyber-Fintech Luxury**: Deep space obsidian atmosphere (`#040814` to `#0A1128`) layered with ambient nebula glow, razor-sharp electric cyan accents (`#00F0FF`), institutional wealth gold (`#FBBF24`), and high-contrast typography designed for financial clarity.

### Color Tokens & System Palette
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg-space` | `#040814` | Core application backdrop and chassis border |
| `--bg-card` | `rgba(10, 18, 38, 0.75)` | Glassmorphic cards with 1px border highlight |
| `--primary-cyan` | `#00F0FF` | Active navigation pills, XP badges, interactive sliders |
| `--gold-accent` | `#FBBF24` | Pro status chips, verified investor badge, trophy markers |
| `--emerald-up` | `#10B981` | Positive yields, LSE market gains, completed lessons |
| `--rose-down` | `#F43F5E` | Negative market movements, expense indicators |
| `--text-primary`| `#F8FAFC` | Primary financial values and screen titles |
| `--text-muted`  | `#64748B` | Metric subtitles, metadata, tickers, and labels |

### Screen Inventory (15 Screens + Modals)
1. **Top Bar Header**: Glowing cyan EB monogram, dual-tone EB Wealth wordmark, "Investment Education Platform" subtitle, and gold "★ Upgrade" pill.
2. **Dashboard (Home)**: Portfolio summary card (£142,850.20), quick-action grid (Markets, Academy, Overlap, Simulator), and Featured Market Assets carousel.
3. **Research Screen (Markets)**: Searchable asset directory, sector filter pills (Global, Tech, Fixed Income), P/E ratios, dividend yields, and EB Health Scorecards.
4. **Asset Factsheet (Detail)**: Full financial metrics breakdown, price performance chart, asset allocation, and direct "Add to Portfolio" drawer.
5. **Academy Screen (Learn)**: 4-tier structured curriculum (Level 1 Foundation to Level 4 Wealth Mastery), module progress rings, and lesson cards.
6. **Lesson Detail & Quiz**: Reading view with key investment takeaways, interactive knowledge check, and instant XP reward animations.
7. **Portfolio Screen**: Real-time valuation, ISA (£20k) and SIPP (£60k) tax wrapper allocation rings, geographic exposure charts, and holdings manager.
8. **AI Wealth Coach**: Dedicated conversational wealth advisor with quick prompt chips ("Explain S&P 500 P/E", "Analyze ISA tax efficiency").
9. **Compound Interest Simulator**: Interactive initial deposit, monthly contribution, return rate, and time horizon sliders with compounding projection chart.
10. **ETF Overlap Analyzer**: Side-by-side ETF comparison tool calculating portfolio overlap percentage and top stock concentration risks.
11. **Market News & Insights**: Curated institutional headlines, macroeconomic analysis, and sentiment indicators with read-time tags.
12. **Community Forum**: Category discussion threads (UK Equities, Dividend Strategy, Fire Movement) with upvotes and reply counts.
13. **Events & Masterclasses**: Calendar of live webinars, Q&A sessions with wealth managers, and registration status buttons.
14. **Profile & Identity**: Verified Wealth Client badge (`REF: EB-8849-GB`), user email, tier status, tax year allowance progress bars, and cloud sync toggle.
15. **Pro Membership Upgrade Modal**: Tier comparisons (Free vs Pro at £19.99/mo), perk checklists, and instant upgrade action.
16. **Floating Cyber Navigation Dock**: 4 primary tabs (Home, Market, Learn, Portfolio) with glowing cyan capsule indicator and avatar shortcut.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Viewport: Mobile-Centered Phone Frame on Desktop
- **Chosen Approach**: Responsive CSS chassis that locks to an optimal mobile ratio (420px max width, 880px min height, 36px border radius with subtle screen reflection) on wide screens, while gracefully filling 100% of mobile screens.
- **Why**: Guarantees 100% visual parity with the Android phone UI screenshots, eliminating awkward desktop stretching while providing desktop users a clean, focused app experience.
- **Alternative Considered**: Fluid desktop multi-column dashboard. Passed over because the user explicitly requested the web version look exactly like the Android mobile app without discrepancy.

### 2. State & Storage: Live Firebase Firestore Sync with Client Fallback
- **Chosen Approach**: Direct integration with Firebase Cloud Firestore using snapshot listeners (`onSnapshot`) on the user collection (`users/{uid}/holdings`, `users/{uid}/progress`). If offline or unauthenticated, the app gracefully falls back to instant reactive local state.
- **Why**: Enables instantaneous multi-device synchronization so changes made on the Android phone or Web reflect across both clients within milliseconds.

### 3. Screen Router: Single Page Architecture (SPA) with Backstack
- **Chosen Approach**: Reactive navigation state stack within `app.js` with browser history integration (`pushState` / `popstate`), ensuring Android back-button and browser back-button behavior matches seamlessly.
- **Why**: Keeps navigation snappy (<16ms tab transitions) without page reloads or jarring transitions.

---

## 4. Technical Architecture & Data Strategy

### System & Navigation Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                   EB WEALTH WEB CHASSIS                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  EBTopBar: Monogram | "EB Wealth" | Upgrade Pill │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │  ACTIVE SCREEN (Switchable via Router):          │  │
│  │                                                  │  │
│  │  ├── [1] DashboardView (Overview & Tickers)       │  │
│  │  ├── [2] ResearchView (Market Assets & Filters)  │  │
│  │  ├── [3] AssetDetailView (Deep Factsheet)        │  │
│  │  ├── [4] AcademyView (Curriculum Levels 1-4)     │  │
│  │  ├── [5] LessonDetailView (Lesson Reader & Quiz) │  │
│  │  ├── [6] PortfolioView (Valuations & Tax Rings)  │  │
│  │  ├── [7] AICoachView (Interactive AI Mentor)     │  │
│  │  ├── [8] SimulatorView (Compound Wealth Sliders) │  │
│  │  ├── [9] ETFOverlapView (Exposure Matrix)        │  │
│  │  ├── [10] MarketNewsView (Curated Intelligence)  │  │
│  │  ├── [11] CommunityView (Investor Discussions)   │  │
│  │  ├── [12] EventsView (Webinars & Calendar)       │  │
│  │  ├── [13] ProfileView (Client ID & ISA Tracker)  │  │
│  │  └── [14] AdminDashboardView (System Stats)      │  │
│  │                                                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  OVERLAYS & MODALS:                              │  │
│  │  ├── ProMembershipModal (Tier Selection)         │  │
│  │  └── AddHoldingModal (Live Portfolio Entry)      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  EBCyberBottomNav: Home | Market | Learn | Port  │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                             │
│                           ▼                             │
│           Firebase Cloud Firestore / Auth              │
│       collections: users/{uid}/[holdings|profile]       │
└────────────────────────────────────────────────────────┘
```

### Component State Mapping & Reactive Handlers
- **Navigation State (`state.currentScreen`, `state.screenParams`)**: Controls the currently mounted view inside the mobile container. Back navigation pops the view stack.
- **Portfolio Store (`state.portfolio`)**: Tracks user holdings, cash balances, LSE market quotes, and tax wrapper breakdown (ISA, SIPP, GIA). Updates trigger real-time recalculation of total value and P&L.
- **Curriculum Store (`state.academy`)**: Tracks level selection, completed lesson IDs, unlocked quizzes, and accrued investor XP points.
- **Financial Tool Calculators**: Real-time reactive calculation loops for compound projections ($A = P(1 + r/n)^{nt}$) and ETF overlapping percentage matrix.
- **Sync Engine (`firebase-config.js`)**: Connects to the configured Firestore project, binding authentication and data synchronization directly with Google Sign-In and cloud document listeners.

---

## Plan Verification & Execution Next Steps
Upon user approval:
1. Update `EB_Wealth_Web/styles.css` with the complete mobile chassis, cyber-glass styling, and 15-screen layout rules.
2. Refactor `EB_Wealth_Web/app.js` with all 15 full-fidelity screen composables, interactive calculators, and modal flows.
3. Align `EB_Wealth_iOS` Views and `EBWealthApp.swift` to ensure identical styling and screen inventory across the iOS codebase.
4. Update the bundled ZIP distribution archives (`EB_Wealth_Web.zip` and `EB_Wealth_iOS.zip`).
5. Verify the Android build passes cleanly via `compile_applet`.
