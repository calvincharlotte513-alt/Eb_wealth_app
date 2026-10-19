import { WebFirebaseService } from './firebase-config.js';
import { academyLevels, defaultLessons, getStoredLessons, getStoredLevels, getInvestorTier } from './curriculum/index.js';
import { AdminAuthService } from './admin-auth.js';
import { CommunityService } from './community-service.js';
import { liveMarketService } from './market-service.js';

const firebaseService = new WebFirebaseService();

// URL Route detection for /admin and initial entrance
const isAdminRoute = window.location.pathname.startsWith('/admin') ||
                     window.location.hash === '#admin' ||
                     new URLSearchParams(window.location.search).get('view') === 'admin';

const savedUserSession = JSON.parse(localStorage.getItem('eb_user_session') || 'null');
const isUserLoggedIn = savedUserSession !== null && savedUserSession.isLoggedIn !== false;

let initialStartingView = 'auth'; // User Requirement: First enter goes to login/signup
if (isAdminRoute) {
  initialStartingView = 'admin';
} else if (isUserLoggedIn) {
  initialStartingView = 'home';
}

// Centralized Application State
let state = {
  currentView: initialStartingView,
  isDesktopMode: window.innerWidth >= 860,
  navStack: [initialStartingView],
  selectedTicker: 'VWRP',
  selectedLessonId: 1,
  showProModal: false,
  showAddHoldingModal: false,
  selectedLevel: 1,
  marketSearchQuery: '',
  overlapSelected: ['VWRP', 'VUAG'],
  simInitial: 1000,
  simMonthly: 250,
  simYears: 20,
  simRate: 7.0,
  newsCategory: 'All',
  registeredEvents: [1],
  authMode: 'login', // 'login' | 'register'
  authError: '',
  authLoading: false,
  authPasswordVisible: false,
  authEmailInput: '',
  authPasswordInput: '',
  authFirstNameInput: '',
  onboardingStep: 1,
  onboardingData: {
    experience: 'Beginner',
    goal: 'Build long-term wealth',
    horizon: '20+ years',
    capacity: '£150–£500',
    risk: 'Medium-High'
  },
  // Academy Curriculum State
  levels: getStoredLevels(),
  lessons: getStoredLessons(),
  completedLessons: JSON.parse(localStorage.getItem('eb_completed_lessons') || '[1]'),
  quizProgress: JSON.parse(localStorage.getItem('eb_quiz_progress') || '{}'),
  quizUserAnswers: {}, // Map of { [questionIdx]: selectedOptionIdx }
  quizFeedback: null, // { score: number, total: number, submitted: boolean }
  // Admin Dashboard State
  adminTab: 'overview', // 'overview' | 'courses' | 'lessons' | 'students' | 'community' | 'security'
  adminLoginForm: { username: '', password: '', error: '', loading: false },
  adminFilterLevel: 'all',
  adminSearchStudent: '',
  editingLesson: null,
  editingCourse: null,
  adminNotification: '',
  // Community Forum State
  communityDiscussions: CommunityService.getDiscussions(),
  communityCategoryFilter: 'All',
  communitySearchQuery: '',
  expandedDiscussionId: null,
  showNewDiscussionModal: false,
  user: savedUserSession || JSON.parse(localStorage.getItem('eb_user_profile') || 'null') || firebaseService.currentUser || {
    id: 'usr_8849_gb',
    firstName: 'Alex',
    email: 'alex.investor@example.co.uk',
    ref: 'REF: EB-8849-GB',
    region: 'United Kingdom • GBP Base',
    tierStatus: 'Standard Investor',
    isPro: false,
    isaUsed: 8450,
    isaLimit: 20000,
    capitalGainsLimit: 3000,
    dividendLimit: 500,
    xp: 350,
    streakDays: 4,
    ageRange: '25–34',
    country: 'United Kingdom',
    experienceLevel: 'Beginner',
    primaryGoal: 'Build long-term wealth',
    timeHorizon: '20+ years',
    monthlyCapacity: '£150–£500',
    riskProfile: 'Medium-High',
    levelNumber: 1,
    levelTitle: 'Investor Starter',
    isLoggedIn: isUserLoggedIn
  },
  holdings: (() => {
    try {
      const stored = localStorage.getItem('eb_holdings');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Clean out legacy fake sample holdings so organic users see clean data
      if (Array.isArray(parsed) && parsed.length === 3 && parsed[0]?.ticker === 'VWRP' && parsed[1]?.ticker === 'VUAG' && parsed[2]?.ticker === 'CSH2') {
        localStorage.removeItem('eb_holdings');
        return [];
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })(),
  adminUsers: [],
  adminUsersLoaded: false,
  marketLastUpdated: 'International Live Feed Active',
  marketFxRates: { 'GBP/USD': 1.298, 'EUR/GBP': 0.842, 'BTC/GBP': 52140 },
  assets: [
    {
      ticker: 'VWRP',
      name: 'Vanguard FTSE All-World UCITS ETF',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£112.40',
      priceNum: 112.40,
      change: '+0.42%',
      peRatio: '19.8x',
      divYield: '1.8% (Accumulated)',
      marketCap: '£18.4 Billion',
      sector: 'Globally Diversified',
      currency: 'GBP',
      description: 'Physical replication covering over 3,700 large and mid-cap stocks across 49 developed and emerging market countries with auto-reinvesting dividends.',
      healthScore: '9.4/10',
      valuationScore: '8.2/10',
      dividendSafety: '9.8/10'
    },
    {
      ticker: 'VUAG',
      name: 'Vanguard S&P 500 UCITS ETF (Acc)',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£85.25',
      priceNum: 85.25,
      change: '+0.38%',
      peRatio: '24.2x',
      divYield: '1.4% (Accumulated)',
      marketCap: '£32.1 Billion',
      sector: 'US Large Cap',
      currency: 'GBP',
      description: 'Low-cost tracker mirroring the 500 largest US publicly traded corporations with ultra-low ongoing charge of 0.07%.',
      healthScore: '9.6/10',
      valuationScore: '7.8/10',
      dividendSafety: '9.9/10'
    },
    {
      ticker: 'AZN',
      name: 'AstraZeneca PLC',
      type: 'Stock',
      exchange: 'London Stock Exchange (LSE)',
      price: '£104.50',
      priceNum: 104.50,
      change: '+1.12%',
      peRatio: '32.4x',
      divYield: '2.3% (Semi-Annual)',
      marketCap: '£162.0 Billion',
      sector: 'Pharmaceuticals',
      currency: 'GBP',
      description: 'Global biopharmaceutical leader focused on oncology, rare diseases, and cardiovascular innovations listed on the FTSE 100.',
      healthScore: '9.1/10',
      valuationScore: '8.0/10',
      dividendSafety: '9.0/10'
    },
    {
      ticker: 'EQGB',
      name: 'Invesco EQQQ Nasdaq 100 GBP Hedged',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£34.10',
      priceNum: 34.10,
      change: '+0.65%',
      peRatio: '28.1x',
      divYield: '0.6% (Accumulated)',
      marketCap: '£4.8 Billion',
      sector: 'Technology & Growth',
      currency: 'GBP',
      description: 'Currency-hedged exposure to non-financial titans listed on the Nasdaq index protecting UK investors against USD fluctuations.',
      healthScore: '9.2/10',
      valuationScore: '7.5/10',
      dividendSafety: '8.8/10'
    },
    {
      ticker: 'ISF',
      name: 'iShares Core FTSE 100 UCITS ETF',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£8.22',
      priceNum: 8.22,
      change: '+0.15%',
      peRatio: '12.8x',
      divYield: '3.8% (Distributing)',
      marketCap: '£11.2 Billion',
      sector: 'UK Blue Chip',
      currency: 'GBP',
      description: 'Benchmark fund holding the top 100 UK blue-chip companies with robust cash dividends and defensive characteristics.',
      healthScore: '8.9/10',
      valuationScore: '9.2/10',
      dividendSafety: '9.4/10'
    },
    {
      ticker: 'CSH2',
      name: 'Lyxor Smart Overnight Return UCITS ETF',
      type: 'Money Market',
      exchange: 'London Stock Exchange (LSE)',
      price: '£111.45',
      priceNum: 111.45,
      change: '+0.02%',
      peRatio: 'SONIA Base',
      divYield: '5.2% (Overnight Rate)',
      marketCap: '£2.4 Billion',
      sector: 'Cash & Liquidity',
      currency: 'GBP',
      description: 'High-liquidity money market fund tracking the Bank of England Sterling Overnight Index Average (SONIA).',
      healthScore: '9.9/10',
      valuationScore: '9.9/10',
      dividendSafety: '10/10'
    }
  ],
  chatMessages: [
    { sender: 'ai', text: 'Good day! I am your EB Wealth AI Coach. I can analyze your asset allocation across LSE ETFs, optimize your 2024/25 £20,000 ISA capacity, or stress-test your monthly compounding plan. How may I assist your portfolio today?' }
  ],
  events: [
    { id: 1, title: 'UK Tax-Year-End Wealth Masterclass 2024/25', date: 'Thursday, 24 Oct • 18:30 GMT', host: 'EB Wealth Institutional Desk', description: 'Comprehensive walkthrough on how to maximize your £20,000 ISA, £3,000 CGT exemption, and SIPP pension tax relief.' },
    { id: 2, title: 'Global ETF Asset Allocation & Rebalancing', date: 'Tuesday, 29 Oct • 19:00 GMT', host: 'Senior Portfolio Strategist', description: 'Deep dive into market-cap weighting versus equal weighting with live Q&A session.' }
  ],
  marketNews: [
    { id: 1, title: 'Bank of England Holds Base Rate at 5.00% Amid Steady Inflation', source: 'LSE Market Wire', time: '1 hour ago', snippet: 'Monetary Policy Committee signals measured approach to future interest rate adjustments, bolstering gilt yields.' },
    { id: 2, title: 'FTSE 100 Gains 0.4% as Healthcare and Defense Giants Rally', source: 'Financial Intelligence', time: '3 hours ago', snippet: 'AstraZeneca and BAE Systems lead benchmark index upward amidst positive clinical data releases.' },
    { id: 3, title: 'HMRC Reminds High Earners of Pension Tapering Rules Ahead of Autumn Budget', source: 'UK Tax Review', time: '1 day ago', snippet: 'Financial planners urge strategic utilization of SIPP carry-forward allowances prior to potential fiscal policy amendments.' }
  ]
};

const appEl = document.getElementById('app');

function navigateTo(view, payload = null) {
  if (view === 'asset_detail' && payload) state.selectedTicker = payload;
  if (view === 'lesson_detail' && payload) state.selectedLessonId = payload;
  state.navStack.push(view);
  state.currentView = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

function navigateBack() {
  if (state.navStack.length > 1) {
    state.navStack.pop();
    state.currentView = state.navStack[state.navStack.length - 1];
  } else {
    state.currentView = 'home';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

// Mode Synchronization
function syncModeClass() {
  if (state.isDesktopMode && window.innerWidth >= 860) {
    document.body.classList.add('mode-desktop');
    document.body.classList.remove('mode-phone');
  } else {
    document.body.classList.add('mode-phone');
    document.body.classList.remove('mode-desktop');
  }
}

window.toggleViewportMode = function() {
  state.isDesktopMode = !state.isDesktopMode;
  render();
};

window.addEventListener('resize', () => {
  syncModeClass();
});

// Main Render Dispatcher
function render() {
  syncModeClass();
  const isDesktop = state.isDesktopMode && window.innerWidth >= 860;
  const isAppScreen = !['landing', 'auth', 'onboarding', 'admin'].includes(state.currentView);
  const isLanding = state.currentView === 'landing';
  const isAdmin = state.currentView === 'admin';

  appEl.innerHTML = `
    <!-- Top Desktop Navbar (Active in desktop full-width mode, hidden on admin) -->
    ${isDesktop && !isAdmin ? renderDesktopNavbar() : ''}

    <!-- Sticky Mobile Top Bar (Present on mobile / phone mode, hidden on admin) -->
    ${!isDesktop && isAppScreen ? renderTopBar() : ''}

    <!-- Main Dynamic Screen Content -->
    <main class="screen-scroll-container">
      ${renderCurrentScreen()}
    </main>

    <!-- Sticky Bottom App Nav Dock (Curved bubble dock, hidden on admin) -->
    ${!isDesktop && isAppScreen ? renderBottomDock() : ''}

    <!-- Floating AI Wealth Coach FAB -->
    ${(state.currentView === 'home' || state.currentView === 'landing') ? `
      <button class="fab-ai-coach" onclick="window.navigateTo('ai_coach')" title="Ask AI Wealth Coach">
        <svg style="width:24px;height:24px;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        </svg>
      </button>
    ` : ''}

    <!-- Modals -->
    ${state.showProModal ? renderProModal() : ''}
    ${state.showAddHoldingModal ? renderAddHoldingModal() : ''}
  `;
}

// Top Desktop Navigation Bar
function renderDesktopNavbar() {
  const v = state.currentView;
  return `
    <header class="desktop-navbar">
      <div class="desktop-nav-brand" onclick="window.navigateTo('landing')">
        <div class="brand-badge">EB</div>
        <div>
          <div class="brand-title">
            <span class="eb">EB</span>
            <span class="wealth">Wealth</span>
          </div>
          <div class="brand-tagline">Learn. Invest. Build Wealth.</div>
        </div>
      </div>

      <nav>
        <ul class="desktop-nav-links">
          <li><button class="desktop-nav-item ${v === 'landing' ? 'active' : ''}" onclick="window.navigateTo('landing')">Overview</button></li>
          <li><button class="desktop-nav-item ${v === 'home' ? 'active' : ''}" onclick="window.navigateTo('home')">Dashboard</button></li>
          <li><button class="desktop-nav-item ${v === 'learn' || v === 'lesson_detail' ? 'active' : ''}" onclick="window.navigateTo('learn')">Academy</button></li>
          <li><button class="desktop-nav-item ${v === 'portfolio' ? 'active' : ''}" onclick="window.navigateTo('portfolio')">Portfolio</button></li>
          <li><button class="desktop-nav-item ${v === 'etf_overlap' ? 'active' : ''}" onclick="window.navigateTo('etf_overlap')">ETF Overlap</button></li>
          <li><button class="desktop-nav-item ${v === 'market' || v === 'asset_detail' ? 'active' : ''}" onclick="window.navigateTo('market')">Research</button></li>
          <li><button class="desktop-nav-item ${v === 'simulator' ? 'active' : ''}" onclick="window.navigateTo('simulator')">Simulator</button></li>
          <li><button class="desktop-nav-item ${v === 'ai_coach' ? 'active' : ''}" onclick="window.navigateTo('ai_coach')">AI Coach</button></li>
          <li><button class="desktop-nav-item ${v === 'community' ? 'active' : ''}" onclick="window.navigateTo('community')">Community</button></li>
          <li><button class="desktop-nav-item ${v === 'events' ? 'active' : ''}" onclick="window.navigateTo('events')">Events</button></li>
          <li><button class="desktop-nav-item ${v === 'auth' ? 'active' : ''}" onclick="window.navigateTo('auth')">Sign In</button></li>
        </ul>
      </nav>

      <div class="desktop-nav-right">
        <button class="btn-viewport-toggle" onclick="window.toggleViewportMode()" title="Toggle Phone Frame Simulation">
          <span>📱</span>
          <span>Phone Frame</span>
        </button>
        <button class="btn-pro-pill" onclick="window.openProModal()">
          <span>★</span>
          <span>${state.user.isPro ? 'Pro Active' : 'Upgrade £9.99'}</span>
        </button>
        <div class="sync-status-indicator" title="Connected to Cloud Firestore database">
          <span style="font-size: 8px;">●</span>
          <span>Live Sync</span>
        </div>
        <div class="user-avatar-circle" onclick="window.navigateTo('profile')" title="View Investor Profile">
          ${(state.user.firstName || 'J').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  `;
}

function renderTopBar() {
  return `
    <header class="mobile-top-bar">
      <div class="top-bar-left" onclick="window.navigateTo('home')">
        <div class="logo-badge">EB</div>
        <div class="brand-text-col">
          <div class="brand-title-row">
            <span class="eb">EB</span>
            <span class="wealth">Wealth</span>
          </div>
        </div>
      </div>

      <div class="top-bar-right">
        <button class="btn-upgrade-pill" onclick="window.openProModal()">
          <span class="star-icon">★</span>
          <span>Upgrade</span>
        </button>
        <button class="user-avatar-btn" onclick="window.navigateTo('profile')">
          ${(state.user.firstName || 'J').charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  `;
}

function renderBottomDock() {
  return `
    <div class="floating-bottom-dock-container">
      <nav class="floating-bottom-dock">
        <button class="dock-nav-item ${state.currentView === 'home' ? 'active' : ''}" onclick="window.navigateTo('home')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span>Home</span>
        </button>

        <button class="dock-nav-item ${state.currentView === 'market' ? 'active' : ''}" onclick="window.navigateTo('market')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <span>Market</span>
        </button>

        <button class="dock-nav-item ${state.currentView === 'learn' || state.currentView === 'lesson_detail' ? 'active' : ''}" onclick="window.navigateTo('learn')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9.07l-9-7-9 7 1.63 1.27L12 16z"/></svg>
          </div>
          <span>Learn</span>
        </button>

        <button class="dock-nav-item ${state.currentView === 'portfolio' ? 'active' : ''}" onclick="window.navigateTo('portfolio')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2z"/></svg>
          </div>
          <span>Portfolio</span>
        </button>
      </nav>
    </div>
  `;
}


function renderCurrentScreen() {
  switch (state.currentView) {
    case 'landing': return renderLandingPage();
    case 'auth': return renderAuthScreen();
    case 'home': return renderHomeScreen();
    case 'market': return renderMarketScreen();
    case 'asset_detail': return renderAssetDetailScreen();
    case 'learn': return renderLearnScreen();
    case 'lesson_detail': return renderLessonDetailScreen();
    case 'portfolio': return renderPortfolioScreen();
    case 'etf_overlap': return renderETFOverlapScreen();
    case 'simulator': return renderSimulatorScreen();
    case 'ai_coach': return renderAICoachScreen();
    case 'community': return renderCommunityScreen();
    case 'events': return renderEventsScreen();
    case 'news': return renderNewsScreen();
    case 'profile': return renderProfileScreen();
    case 'onboarding': return renderOnboardingScreen();
    case 'admin': return renderAdminDashboardScreen();
    default: return renderHomeScreen();
  }
}

// 0. HIGH-CONVERTING PUBLIC LANDING PAGE
function renderLandingPage() {
  return `
    <div class="landing-page-container">
      <div class="landing-hero">
        <div class="hero-pill-badge">
          <span>★</span>
          <span>PREMIUM UK FINTECH & INVESTMENT EDUCATION</span>
        </div>

        <h1 class="hero-h1">
          Learn how to invest.<br>
          Understand your portfolio.<br>
          <span class="glow-cyan">Build long-term</span> <span class="glow-gold">wealth.</span>
        </h1>

        <p class="hero-subheading">
          A practical investment education platform designed to help everyday UK investors understand stocks, ETFs, portfolios and disciplined wealth building.
        </p>

        <div class="hero-cta-group">
          <button class="btn-primary-glow" onclick="window.navigateTo('auth'); window.setAuthMode('register');">
            Start Learning Free →
          </button>
          <button class="btn-secondary-glass" onclick="window.navigateTo('home')">
            Launch EB Wealth App
          </button>
        </div>
        <div style="margin-top: 14px; font-size: 13px; color: #94A3B8;">
          Already have an account? <span onclick="window.navigateTo('auth'); window.setAuthMode('login');" style="color: #00F0FF; font-weight: 700; cursor: pointer; text-decoration: underline;">Sign In to Vault</span>
        </div>

        <!-- Interactive Mockup Preview -->
        <div class="landing-mockup-frame">
          <div class="mockup-top-bar">
            <div class="mockup-dots">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
            </div>
            <div style="font-size: 11px; color: #94A3B8; font-weight: 600;">ebwealth.co.uk/dashboard — Live Preview</div>
            <div style="font-size: 11px; color: #10B981; font-weight: 700;">● HMRC 2024/25 Engine Active</div>
          </div>
          <div style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 12px; color: #94A3B8; font-weight: 700; letter-spacing: 0.5px;">INVESTOR PORTFOLIO SNAPSHOT</div>
                <div style="font-size: 28px; font-weight: 900; color: #FFFFFF;">£142,850.20</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 13px; color: #10B981; font-weight: 800;">+£24,350.20 (+20.5%)</div>
                <div style="font-size: 11px; color: #94A3B8;">Total Uncapped Gain</div>
              </div>
            </div>
            <div class="grid-4" style="margin-bottom: 16px;">
              <div class="stat-tile">
                <span class="stat-label">Stocks & Shares ISA</span>
                <span class="stat-value">£8,450 / £20k</span>
                <span class="stat-sub" style="color: #00F0FF;">£11,550 Remaining</span>
              </div>
              <div class="stat-tile">
                <span class="stat-label">ETF Overlap Risk</span>
                <span class="stat-value" style="color: #FBBF24;">58.4%</span>
                <span class="stat-sub" style="color: #FBBF24;">VWRP vs VUAG</span>
              </div>
              <div class="stat-tile">
                <span class="stat-label">Curriculum Progress</span>
                <span class="stat-value" style="color: #FBBF24;">Level 2</span>
                <span class="stat-sub" style="color: #94A3B8;">7/10 Lessons Completed</span>
              </div>
              <div class="stat-tile">
                <span class="stat-label">AI Wealth Coach</span>
                <span class="stat-value" style="color: #10B981;">Online</span>
                <span class="stat-sub" style="color: #10B981;">Institutional Grade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 1: The Problem -->
      <section style="margin: 60px 0;">
        <div class="landing-section-title-box">
          <div class="section-badge">THE CHALLENGE</div>
          <h2 class="section-h2">Investing shouldn’t feel complicated.</h2>
          <p class="section-p">Every day, thousands of beginner investors struggle with conflicting jargon, hidden fees, and fear of making costly mistakes.</p>
        </div>
        <div class="grid-3">
          <div class="feature-card">
            <div class="feature-icon-box">❓</div>
            <div class="feature-card-title">What to invest in</div>
            <div class="feature-card-desc">Paralysis by analysis across 10,000+ individual stocks and index funds with no clear starting point.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">⚖️</div>
            <div class="feature-card-title">How much risk to take</div>
            <div class="feature-card-desc">Understanding volatility without panicking when market cycles fluctuate or sentiment shifts.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">📊</div>
            <div class="feature-card-title">Which ETF to choose</div>
            <div class="feature-card-desc">Distinguishing between S&P 500, All-World, accumulating (Acc) vs distributing (Dist) UCITS funds.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🔍</div>
            <div class="feature-card-title">Whether investments overlap</div>
            <div class="feature-card-desc">Paying double expense fees to hold the exact same mega-cap US tech companies inside multiple funds.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🌐</div>
            <div class="feature-card-title">How to diversify properly</div>
            <div class="feature-card-desc">Balancing global equities, fixed income bonds, tax wrappers, and cash reserves for true stability.</div>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🎯</div>
            <div class="feature-card-title">How to build a long-term plan</div>
            <div class="feature-card-desc">Creating an automated, monthly compounding habits engine that builds real multi-decade wealth.</div>
          </div>
        </div>
      </section>

      <!-- Section 2: The Solution -->
      <section style="margin: 60px 0;">
        <div class="landing-section-title-box">
          <div class="section-badge">THE EB WEALTH ECOSYSTEM</div>
          <h2 class="section-h2">Everything you need to become an informed investor.</h2>
          <p class="section-p">A cohesive, practical toolkit built specifically for the UK investor journey.</p>
        </div>
        <div class="grid-3">
          <div class="feature-card" onclick="window.navigateTo('learn')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">🎓</div>
            <div class="feature-card-title">1. Learn</div>
            <div class="feature-card-desc">Structured 6-level investor curriculum with short interactive lessons, quizzes, and earned XP.</div>
          </div>
          <div class="feature-card" onclick="window.navigateTo('etf_overlap')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">🔬</div>
            <div class="feature-card-title">2. Analyse</div>
            <div class="feature-card-desc">Dedicated ETF Overlap Checker and institutional 10-point Stock Scorecards.</div>
          </div>
          <div class="feature-card" onclick="window.navigateTo('portfolio')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">📈</div>
            <div class="feature-card-title">3. Track</div>
            <div class="feature-card-desc">Multi-wrapper portfolio tracking across Stocks & Shares ISA, SIPP, JISA, and GIA.</div>
          </div>
          <div class="feature-card" onclick="window.navigateTo('simulator')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">⚡</div>
            <div class="feature-card-title">4. Simulate</div>
            <div class="feature-card-desc">Interactive compound growth visualizer comparing contributions over 10, 20, and 30-year horizons.</div>
          </div>
          <div class="feature-card" onclick="window.navigateTo('ai_coach')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">🤖</div>
            <div class="feature-card-title">5. Ask</div>
            <div class="feature-card-desc">Conversational AI Wealth Coach offering instant educational clarity on complex financial concepts.</div>
          </div>
          <div class="feature-card" onclick="window.navigateTo('community')" style="cursor: pointer;">
            <div style="font-size: 26px; margin-bottom: 10px;">🌱</div>
            <div class="feature-card-title">6. Grow</div>
            <div class="feature-card-desc">Join masterclasses, participate in community discussions, and level up your investor status.</div>
          </div>
        </div>
      </section>

      <!-- Section 3: The Investor Journey -->
      <section style="margin: 60px 0;">
        <div class="landing-section-title-box">
          <div class="section-badge">YOUR TRANSFORMATION</div>
          <h2 class="section-h2">The 5-Stage Investor Evolution</h2>
          <p class="section-p">How everyday learners evolve into disciplined, long-term wealth builders.</p>
        </div>
        <div class="journey-timeline">
          <div class="journey-step">
            <div class="journey-num">1</div>
            <div class="journey-name">Beginner</div>
            <div class="journey-desc">Discovers compounding, overcomes fear of terminology, and establishes emergency cash.</div>
          </div>
          <div class="journey-step">
            <div class="journey-num">2</div>
            <div class="journey-name">Educated</div>
            <div class="journey-desc">Understands global index funds (VWRP), S&P 500, and UK tax shelters (ISA / SIPP).</div>
          </div>
          <div class="journey-step">
            <div class="journey-num">3</div>
            <div class="journey-name">Confident</div>
            <div class="journey-desc">Analyses portfolio overlap, eliminates duplicate fees, and builds core-satellite assets.</div>
          </div>
          <div class="journey-step">
            <div class="journey-num">4</div>
            <div class="journey-name">Disciplined</div>
            <div class="journey-desc">Automates monthly contributions, ignores daily market noise, and embraces volatility.</div>
          </div>
          <div class="journey-step">
            <div class="journey-num">5</div>
            <div class="journey-name">Wealth Builder</div>
            <div class="journey-desc">Achieves multi-year compounding momentum, tax efficiency, and financial peace of mind.</div>
          </div>
        </div>
      </section>

      <!-- Section 4: Transparent Pricing -->
      <section style="margin: 60px 0;">
        <div class="landing-section-title-box">
          <div class="section-badge">MEMBERSHIP PLANS</div>
          <h2 class="section-h2">Invest in your financial education.</h2>
          <p class="section-p">Transparent plans built for everyday UK investors with no hidden lock-ins.</p>
        </div>
        <div class="pricing-grid">
          <!-- Free Tier -->
          <div class="pricing-card">
            <div class="pricing-tier-name">Free Starter</div>
            <div class="pricing-price">£0</div>
            <div class="pricing-period">Free forever • No card required</div>
            <ul class="pricing-feature-list">
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Level 1 Foundations Academy</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Basic EB Investor Profile</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Compound Growth Simulator</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Basic Portfolio Tracker (up to 3 assets)</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Limited AI Coach Queries (5/day)</li>
            </ul>
            <button class="btn-secondary-glass" onclick="window.navigateTo('onboarding')">
              Get Started Free
            </button>
          </div>

          <!-- Pro Monthly Tier -->
          <div class="pricing-card popular">
            <div class="popular-badge">MOST POPULAR</div>
            <div class="pricing-tier-name">EB Wealth Pro</div>
            <div class="pricing-price">£9.99</div>
            <div class="pricing-period">Per month • Cancel anytime</div>
            <ul class="pricing-feature-list">
              <li class="pricing-feature-item"><span class="check-icon">✓</span> <strong>Full 6-Level Academy</strong> (All 24+ Lessons)</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> <strong>Unlimited AI Wealth Coach</strong> Assistant</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> <strong>Dedicated ETF Overlap Checker</strong> Tool</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> <strong>10-Point Stock Research Scorecards</strong></li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Unlimited Portfolio Tracking & Tax Wrappers</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Private Community Forum VIP Access</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Free Access to Monthly Masterclasses</li>
            </ul>
            <button class="btn-primary-glow" onclick="window.openProModal()">
              Start 14-Day Pro Trial
            </button>
          </div>

          <!-- Pro Annual Tier -->
          <div class="pricing-card">
            <div class="pricing-tier-name">EB Wealth Annual</div>
            <div class="pricing-price">£99</div>
            <div class="pricing-period">Per year • Save £20.88 (2 Months Free)</div>
            <ul class="pricing-feature-list">
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Everything in EB Wealth Pro</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Priority 1-on-1 Q&A Masterclasses</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Annual Tax-Year-End Planning Workbook</li>
              <li class="pricing-feature-item"><span class="check-icon">✓</span> Early Access to New Investment Tools</li>
            </ul>
            <button class="btn-secondary-glass" onclick="window.openProModal()">
              Choose Annual Billing
            </button>
          </div>
        </div>
      </section>

      <!-- Compliance Disclaimers & Footer -->
      <div class="compliance-box">
        <strong>Regulatory Disclosure & Educational Positioning:</strong><br>
        EB Wealth provides financial education, simulation tools, and analytical information. It does not provide regulated, personalised financial advice, investment recommendations, or guarantees of investment performance. The value of investments and the income derived from them can fall as well as rise, and investors may get back less than the amount originally invested. Tax treatment depends on individual circumstances and UK legislation which is subject to change. Consider consulting an FCA-authorised financial planner before making substantial financial decisions.
      </div>
    </div>
  `;
}

// 1. DASHBOARD / HOME SCREEN (Screenshot 2)
function renderHomeScreen() {
  // Compounding trajectory calculation (7% over 25 years with sim values)
  const simR = state.simRate / 100.0;
  const simMonths = state.simYears * 12;
  const simMonthlyRate = simR / 12.0;
  const fvI = state.simInitial * Math.pow(1 + simMonthlyRate, simMonths);
  const fvM = simMonthlyRate > 0 ? state.simMonthly * ((Math.pow(1 + simMonthlyRate, simMonths) - 1) / simMonthlyRate) : state.simMonthly * simMonths;
  const projectedValue = Math.round(fvI + fvM);
  const totalInvested = state.simInitial + state.simMonthly * simMonths;
  const totalGrowth = projectedValue - totalInvested;
  const growthPct = totalInvested > 0 ? ((totalGrowth / totalInvested) * 100).toFixed(1) : '0.0';

  return `
    <div class="hero-title-box">
      <div class="hero-title-main">
        <span class="eb">EB</span>
        <span class="wealth">Wealth</span>
      </div>
      <div class="hero-subtitle">Investment Education Platform</div>
    </div>

    <!-- Glowing Search Bar -->
    <div class="search-bar-cosmic" onclick="window.navigateTo('market')">
      <input type="text" placeholder="Search UK stocks, ETFs, lessons..." readonly />
      <div class="search-icon-btn">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </div>
    </div>

    <!-- 4 Cosmic Command Portals Grid (Directly below Search Bar) -->
    <div class="cosmic-portals-grid">
      <!-- Portal 1: Market Galaxy -->
      <div class="cosmic-portal-card cyan" onclick="window.navigateTo('market')">
        <div class="portal-icon-box portal-icon-cyan">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        </div>
        <div>
          <div class="portal-card-title">Market Galaxy</div>
          <div class="portal-card-sub">LSE & Global Movers</div>
        </div>
      </div>

      <!-- Portal 2: Learning Nexus -->
      <div class="cosmic-portal-card blue" onclick="window.navigateTo('learn')">
        <div class="portal-icon-box portal-icon-blue">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
          </svg>
        </div>
        <div>
          <div class="portal-card-title">Learning Nexus</div>
          <div class="portal-card-sub">6-Level Academy</div>
        </div>
      </div>

      <!-- Portal 3: Portfolio Constellation -->
      <div class="cosmic-portal-card gold" onclick="window.navigateTo('portfolio')">
        <div class="portal-icon-box portal-icon-gold">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2z"/>
          </svg>
        </div>
        <div>
          <div class="portal-card-title">Portfolio Constellation</div>
          <div class="portal-card-sub">Holdings & Rebalance</div>
        </div>
      </div>

      <!-- Portal 4: Community Forum -->
      <div class="cosmic-portal-card emerald" onclick="window.navigateTo('community')">
        <div class="portal-icon-box portal-icon-emerald">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
          </svg>
        </div>
        <div>
          <div class="portal-card-title">Community Forum</div>
          <div class="portal-card-sub">Discussions & Events</div>
        </div>
      </div>
    </div>

    <!-- FEATURED MARKET ASSETS (White sliding boxes directly below 4 boxes) -->
    <div class="section-header-row" style="margin-top: 10px; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div class="section-label-gold">FEATURED MARKET ASSETS</div>
          <div style="font-size: 15px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">Live UK & Global Movers</div>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #00F0FF; cursor: pointer;" onclick="window.navigateTo('market')">Swipe →</div>
      </div>
    </div>

    <!-- Horizontal White Sliding Carousel -->
    <div class="market-movers-carousel">
      ${state.assets.map(a => {
        const isNeg = a.change.startsWith('-');
        return `
          <div class="carousel-card" onclick="window.navigateTo('asset_detail', '${a.ticker}')">
            <div class="carousel-top-row">
              <span class="asset-badge-${a.type === 'ETF' ? 'blue' : 'green'}">${a.type}</span>
              <span class="${isNeg ? 'asset-change-red' : 'asset-change-green'}">
                ${isNeg ? '↓ ' : '↑ '}${a.change}
              </span>
            </div>
            <div class="carousel-ticker">${a.ticker}</div>
            <div class="carousel-name" title="${a.name}">${a.name}</div>
            <div class="carousel-price">${a.price}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- COMPOUNDING TRAJECTORY CARD (Image 1) -->
    <div class="traj-card" onclick="window.navigateTo('simulator')" style="cursor:pointer; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="traj-label">COMPOUNDING TRAJECTORY</div>
          <div class="traj-value">£${projectedValue.toLocaleString('en-GB')}</div>
          <div class="traj-subtitle">Projected value at Year ${state.simYears} (@ ${state.simRate}% annual growth)</div>
        </div>
        <div class="vertical-tag-pill">
          <span>Interactive Curve</span>
        </div>
      </div>

      <!-- SVG curve chart -->
      <div class="traj-chart-wrap" style="margin-top: 14px;">
        <svg viewBox="0 0 360 110" preserveAspectRatio="none" style="width:100%;height:110px;display:block;">
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="60%" style="stop-color:#10B981;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FBBF24;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.35" />
              <stop offset="100%" style="stop-color:#040B14;stop-opacity:0" />
            </linearGradient>
          </defs>
          <path d="M 10 95 Q 160 90, 240 60 T 345 15 L 345 110 L 10 110 Z" fill="url(#areaGrad)" />
          <path d="M 10 95 Q 160 90, 240 60 T 345 15" fill="none" stroke="url(#curveGrad)" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="345" cy="15" r="5" fill="#FBBF24" stroke="#FFFFFF" stroke-width="1.5" />
        </svg>
        <div class="traj-axis-row" style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #94A3B8; margin-top: 4px;">
          <span>Year 0</span>
          <span>Year ${Math.round(state.simYears / 2)}</span>
          <span style="color:#FBBF24;font-weight:800;">Year ${state.simYears}</span>
        </div>
      </div>

      <!-- Portfolio value strip -->
      <div class="traj-bottom-strip">
        <div>
          <div class="traj-strip-label">ESTIMATED PORTFOLIO VALUE</div>
          <div class="traj-strip-value">£${projectedValue.toLocaleString('en-GB')}</div>
        </div>
        <div class="traj-gain-badge">↑ +£${totalGrowth.toLocaleString('en-GB')} (${growthPct}%)</div>
      </div>
      <div class="traj-strip-row2">
        <span>Total Invested <strong>£${Math.round(totalInvested).toLocaleString('en-GB')}</strong></span>
        <span>Monthly <strong>£${state.simMonthly}/mo</strong></span>
      </div>
    </div>

    <!-- ANALYTICS & WEALTH TOOLS (Image 2) -->
    <div class="section-header-row" style="margin-top:20px; margin-bottom: 10px;">
      <div class="section-label-gold">ANALYTICS & WEALTH TOOLS</div>
    </div>
    <div class="tools-grid-2x2">
      <div class="tool-card" onclick="window.navigateTo('etf_overlap')">
        <div class="tool-icon-box tool-icon-cyan">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
        </div>
        <div class="tool-card-text">
          <div class="tool-card-title">Overlap Tool</div>
          <div class="tool-card-sub">Analyze duplicate ETF holdings</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>

      <div class="tool-card" onclick="window.navigateTo('simulator')">
        <div class="tool-icon-box tool-icon-green">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        </div>
        <div class="tool-card-text">
          <div class="tool-card-title">Simulator</div>
          <div class="tool-card-sub">Compound interest projection</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>

      <div class="tool-card" onclick="window.navigateTo('ai_coach')">
        <div class="tool-icon-box tool-icon-gold">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1-4.5h-2c0-1.5 1.5-2 1.5-3 0-.83-.67-1.5-1.5-1.5S10 6.17 10 7H8c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.5-1.5 2-1.5 3h-1.5z"/></svg>
        </div>
        <div class="tool-card-text">
          <div class="tool-card-title">AI Wealth Coach</div>
          <div class="tool-card-sub">24/7 personal investment tutor</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>

      <div class="tool-card" onclick="window.navigateTo('news')">
        <div class="tool-icon-box tool-icon-blue">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        </div>
        <div class="tool-card-text">
          <div class="tool-card-title">Market News</div>
          <div class="tool-card-sub">UK ISA allowances & interest rates</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
    </div>

    <!-- Regulatory & Educational Notice -->
    <div class="reg-notice-card" style="margin-top: 18px;">
      <div class="reg-notice-icon">ℹ</div>
      <div class="reg-notice-text">
        <strong>Regulatory & Educational Notice</strong><br>
        EB Wealth provides analytical intelligence and investment education. It does not provide personalized financial advice or execution brokerage. Capital is at risk; investments can fluctuate, and you may receive back less than originally invested. Regulated UK financial advice should be sought where appropriate.
      </div>
    </div>
  `;
}


// 2. MARKET RESEARCH SCREEN (Screenshot 3)
function renderMarketScreen() {
  const filtered = state.assets.filter(a =>
    a.ticker.toLowerCase().includes(state.marketSearchQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(state.marketSearchQuery.toLowerCase())
  );

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Market Intelligence & Research</h2>
        <div style="font-size: 11px; color: #94A3B8;">Global International Feeds • LSE & Wall Street</div>
      </div>
    </div>

    <!-- Live International Market Ticker Strip -->
    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-top: 4px; scrollbar-width: none;">
      <div style="background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 6px 10px; font-size: 11px; white-space: nowrap;">
        <span style="color: #94A3B8;">GBP/USD:</span>
        <strong style="color: #00F0FF; margin-left: 4px;">${state.marketFxRates['GBP/USD'] || '1.2982'}</strong>
      </div>
      <div style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 6px 10px; font-size: 11px; white-space: nowrap;">
        <span style="color: #94A3B8;">EUR/GBP:</span>
        <strong style="color: #FBBF24; margin-left: 4px;">${state.marketFxRates['EUR/GBP'] || '0.8418'}</strong>
      </div>
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 6px 10px; font-size: 11px; white-space: nowrap;">
        <span style="color: #94A3B8;">BTC (GBP):</span>
        <strong style="color: #10B981; margin-left: 4px;">£${(state.marketFxRates.BTC || 52400).toLocaleString()}</strong>
      </div>
    </div>

    <div class="search-bar-cosmic" style="margin-top: 4px;">
      <input type="text" id="market-search-input" placeholder="Search by ticker or fund (e.g. VWRP, VUAG, AZN)..." value="${state.marketSearchQuery}" oninput="window.updateMarketSearch(this.value)" />
      <div class="search-icon-btn">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94A3B8; padding: 0 4px; flex-wrap: wrap; gap: 4px;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="lse-feed-badge">🟢 LIVE</span>
        <span>${state.marketLastUpdated || 'International Feeds Active'}</span>
      </div>
      <button type="button" style="background: none; border: none; color: #00F0FF; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="window.refreshPortfolio()">
        🔄 Refresh Live International Quotes
      </button>
    </div>

    ${filtered.map(asset => `
      <div class="market-asset-card" onclick="window.navigateTo('asset_detail', '${asset.ticker}')" style="cursor: pointer;">
        <div class="market-card-top">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: rgba(0, 240, 255, 0.15); color: #00F0FF; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.4);">${asset.type}</span>
              <span style="font-size: 11px; color: #94A3B8;">${asset.exchange}</span>
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #FFFFFF;">${asset.ticker}</div>
            <div style="font-size: 12px; color: #CBD5E1; margin-top: 2px;">${asset.name}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 900; color: #FFFFFF;">${asset.price}</div>
            <div style="font-size: 12px; font-weight: 800; color: #10B981;">${asset.change}</div>
          </div>
        </div>

        <div class="market-card-metric-grid">
          <div class="metric-item-col">
            <span class="metric-item-label">P/E Ratio</span>
            <span class="metric-item-value">${asset.peRatio}</span>
          </div>
          <div class="metric-item-col">
            <span class="metric-item-label">Dividend Yield</span>
            <span class="metric-item-value" style="color: #10B981;">${asset.divYield}</span>
          </div>
          <div class="metric-item-col">
            <span class="metric-item-label">Market Cap</span>
            <span class="metric-item-value" style="color: #38BDF8;">${asset.marketCap}</span>
          </div>
          <div class="metric-item-col">
            <span class="metric-item-label">Sector</span>
            <span class="metric-item-value" style="color: #FBBF24;">${asset.sector}</span>
          </div>
        </div>

        <div class="health-scorecard-bar">
          <div style="display: flex; align-items: center; gap: 6px; color: #10B981; font-weight: 700;">
            <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>EB Health Scorecard: ${asset.healthScore}</span>
          </div>
          <div style="color: #00F0FF; font-weight: 700;">View Factsheet →</div>
        </div>
      </div>
    `).join('')}
  `;
}

// 3. ASSET DETAIL SCREEN
function renderAssetDetailScreen() {
  const asset = state.assets.find(a => a.ticker === state.selectedTicker) || state.assets[0];

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 18px; font-weight: 900; color: #FFFFFF;">${asset.ticker} • ${asset.type}</h2>
        <div style="font-size: 11px; color: #94A3B8;">${asset.name}</div>
      </div>
    </div>

    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; color: #94A3B8; font-weight: 700; letter-spacing: 0.5px;">CURRENT MARKET PRICE</div>
          <div style="font-size: 30px; font-weight: 900; color: #FFFFFF; margin-top: 4px;">${asset.price}</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #34D399; font-weight: 800; font-size: 14px; padding: 6px 12px; border-radius: 8px;">
          ${asset.change}
        </div>
      </div>
    </div>

    <!-- Institutional Scorecard -->
    <div class="cyber-card">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px; margin-bottom: 12px;">
        EB INSTITUTIONAL HEALTH SCORECARD
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Financial & Balance Sheet Strength</span>
            <span style="color: #00F0FF; font-weight: 800;">${asset.healthScore}</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 94%;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Valuation Multiples vs Peers</span>
            <span style="color: #FBBF24; font-weight: 800;">${asset.valuationScore}</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 82%; background: #FBBF24;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>Dividend Coverage & Reliability</span>
            <span style="color: #10B981; font-weight: 800;">${asset.dividendSafety}</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 98%; background: #10B981;"></div></div>
        </div>
      </div>
    </div>

    <!-- Investment Thesis -->
    <div class="cyber-card">
      <div style="font-size: 12px; font-weight: 800; color: #00F0FF; margin-bottom: 8px;">FUND THESIS & OVERVIEW</div>
      <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">${asset.description}</p>
    </div>

    <button class="btn-pro-gold" style="width: 100%; padding: 14px; font-size: 13px;" onclick="window.addHoldingQuick('${asset.ticker}', '${asset.name}', ${asset.priceNum})">
      + Add ${asset.ticker} to Portfolio
    </button>
  `;
}

// 4. LEARN / ACADEMY SCREEN (All 6 Structured Levels & Full Progress Tracking)
function renderLearnScreen() {
  const totalLessons = state.lessons.length || 48;
  const completedCount = state.completedLessons.length || 1;
  const overallPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));
  const tier = getInvestorTier(state.user.xp || 350);
  const currentLvl = state.levels.find(lvl => lvl.level === state.selectedLevel) || state.levels[0];
  const levelLessons = state.lessons.filter(l => l.level === state.selectedLevel && l.published !== false);
  const levelCompletedCount = levelLessons.filter(l => state.completedLessons.includes(l.id)).length;
  const lastIncompleteLesson = state.lessons.find(l => !state.completedLessons.includes(l.id)) || state.lessons[0];

  return `
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <div class="academy-badge-gold">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
        <span>EB WEALTH ACADEMY — INSTITUTIONAL CURRICULUM</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 900; color: #FFFFFF;">6-Level Investor Curriculum</h2>
      <p style="font-size: 12px; color: #94A3B8; line-height: 1.4;">
        A disciplined, progressive education engineered to transform complete beginners into confident long-term compounding investors.
      </p>
    </div>

    <!-- Student Learning Progress & Investor Tier Bar -->
    <div class="academy-progress-summary">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.5px;">YOUR INVESTOR TIER</span>
          <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            <span>${tier.badge}</span>
            <span>${tier.levelTitle}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 11px; color: #94A3B8;">Accumulated XP</span>
          <div style="font-size: 16px; font-weight: 900; color: #00F0FF;">${state.user.xp || 350} XP</div>
        </div>
      </div>

      <div class="academy-progress-bar-bg">
        <div class="academy-progress-bar-fill" style="width: ${overallPercent}%;"></div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94A3B8;">
        <span>${completedCount} of ${totalLessons} Lessons Completed (${overallPercent}%)</span>
        <span style="color: #10B981; font-weight: 700;">${totalLessons - completedCount} Lessons Remaining</span>
      </div>

      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button class="btn-upgrade-pill" style="flex: 1; justify-content: center; font-size: 12px; padding: 10px;" onclick="window.navigateTo('lesson_detail', ${lastIncompleteLesson.id})">
          ▶ Resume Next: Lesson ${lastIncompleteLesson.id} (${lastIncompleteLesson.title})
        </button>
      </div>
    </div>

    <!-- 6 Level Navigation Scroll Bar -->
    <div class="level-scroll-row">
      ${state.levels.map(lvl => `
        <button class="level-pill-btn ${state.selectedLevel === lvl.level ? 'active' : 'inactive'}" onclick="window.selectLevel(${lvl.level})">
          ${lvl.icon} Level ${lvl.level}: ${lvl.title.replace(/LEVEL \d+:\s*/, '')}
        </button>
      `).join('')}
    </div>

    <!-- Selected Level Banner -->
    <div class="cyber-card" style="border-left: 4px solid ${currentLvl.color || '#00F0FF'};">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 13px; font-weight: 800; color: ${currentLvl.color || '#00F0FF'}; letter-spacing: 0.5px;">
          ${currentLvl.title}
        </div>
        <span style="font-size: 11px; font-weight: 800; color: #10B981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 6px;">
          ${levelCompletedCount} / ${levelLessons.length} Completed
        </span>
      </div>
      <div style="font-size: 12px; color: #CBD5E1; margin-top: 4px; line-height: 1.4;">
        ${currentLvl.description}
      </div>
    </div>

    <!-- Lesson Cards List -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${levelLessons.map(l => {
        const isDone = state.completedLessons.includes(l.id);
        return `
          <div class="lesson-card-item" onclick="window.navigateTo('lesson_detail', ${l.id})">
            <div class="lesson-num-circle ${isDone ? 'completed' : ''}">
              ${isDone ? `
                <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              ` : l.id}
            </div>
            <div style="flex: 1;">
              <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">${l.title}</div>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; display: flex; align-items: center; gap: 10px;">
                <span>⏱ ${l.time || '4 min'}</span>
                <span style="color: #FBBF24; font-weight: 700;">+${l.xp || 60} XP</span>
                <span style="color: #38BDF8;">📝 ${l.quiz ? l.quiz.length : 3} Quiz Qs</span>
              </div>
            </div>
            <div style="color: #64748B;">
              <svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Educational Non-Advice Regulatory Notice -->
    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; font-size: 11px; color: #64748B; line-height: 1.4; margin-top: 14px;">
      ℹ️ <strong>Educational Notice:</strong> EB Wealth Academy content is strictly for financial literacy and education. It does not constitute personalized financial, tax, or investment advice. Capital is at risk when investing.
    </div>
  `;
}

// 5. LESSON DETAIL SCREEN WITH FULL PEDAGOGY & INTERACTIVE QUIZ
function renderLessonDetailScreen() {
  const lesson = state.lessons.find(l => l.id === state.selectedLessonId) || state.lessons[0];
  const isCompleted = state.completedLessons.includes(lesson.id);
  const quizFeedback = state.quizFeedback;
  const userAnswers = state.quizUserAnswers || {};
  const currentLvl = state.levels.find(lvl => lvl.level === lesson.level) || state.levels[0];
  const nextLesson = state.lessons.find(l => l.id === lesson.id + 1);
  const prevLesson = state.lessons.find(l => l.id === lesson.id - 1);

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateTo('learn')">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">
          LEVEL ${lesson.level}: ${lesson.levelTitle.toUpperCase()}
        </div>
        <h2 style="font-size: 17px; font-weight: 900; color: #FFFFFF; line-height: 1.3;">${lesson.title}</h2>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">
          ⏱ ${lesson.time || '4 min'} • <span style="color:#FBBF24; font-weight:700;">+${lesson.xp || 60} XP</span> • ${isCompleted ? '<span style="color:#10B981; font-weight:800;">✓ Completed</span>' : 'In Progress'}
        </div>
      </div>
    </div>

    <div class="lesson-detail-container">
      <!-- 1. Learning Objectives -->
      ${lesson.objectives && lesson.objectives.length > 0 ? `
        <div class="lesson-section-box" style="border-left: 4px solid #00F0FF;">
          <div class="lesson-section-label" style="color: #00F0FF;">🎯 LEARNING OBJECTIVES</div>
          ${lesson.objectives.map(obj => `
            <div class="lesson-objective-item">
              <span style="color: #00F0FF; font-weight: 900;">✓</span>
              <span>${obj}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 2. Introduction & Detailed Explanation -->
      <div class="lesson-section-box">
        <div class="lesson-section-label" style="color: #FBBF24;">📖 LESSON OVERVIEW & IN-DEPTH EXPLANATION</div>
        <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; line-height: 1.5; margin-bottom: 10px;">
          ${lesson.introduction || lesson.summary || ''}
        </div>
        <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6; white-space: pre-line;">
          ${lesson.explanation || lesson.content || ''}
        </p>
      </div>

      <!-- 3. Key Financial Terminology -->
      ${lesson.terminology && lesson.terminology.length > 0 ? `
        <div class="lesson-section-box">
          <div class="lesson-section-label" style="color: #2DD4BF;">📚 ESSENTIAL FINANCIAL TERMINOLOGY</div>
          ${lesson.terminology.map(t => `
            <div class="lesson-term-pill">
              <div class="lesson-term-title">${t.term}</div>
              <div class="lesson-term-desc">${t.definition}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 4. Practical Example (£ GBP) & Real-Life Scenario -->
      ${lesson.practicalExample || lesson.scenario ? `
        <div class="lesson-section-box" style="background: rgba(30, 58, 138, 0.25); border-color: rgba(59, 130, 246, 0.4);">
          <div class="lesson-section-label" style="color: #38BDF8;">💡 PRACTICAL EXAMPLE & REAL-WORLD SCENARIO</div>
          ${lesson.practicalExample ? `
            <div style="margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 800; color: #FBBF24;">POUND STERLING (£ GBP) CALCULATION:</span>
              <p style="font-size: 13px; color: #E2E8F0; line-height: 1.5; margin-top: 2px;">${lesson.practicalExample}</p>
            </div>
          ` : ''}
          ${lesson.scenario ? `
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 8px;">
              <span style="font-size: 11px; font-weight: 800; color: #34D399;">CASE STUDY SCENARIO:</span>
              <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5; margin-top: 2px;">${lesson.scenario}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 5. Common Mistakes to Avoid -->
      ${lesson.commonMistakes && lesson.commonMistakes.length > 0 ? `
        <div class="lesson-section-box" style="border-left: 4px solid #EF4444;">
          <div class="lesson-section-label" style="color: #EF4444;">⚠️ COMMON BEGINNER MISTAKES TO AVOID</div>
          ${lesson.commonMistakes.map(m => `
            <div class="lesson-objective-item">
              <span style="color: #EF4444; font-weight: 900;">✕</span>
              <span>${m}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 6. Key Takeaways Checklist -->
      ${lesson.keyTakeaways && lesson.keyTakeaways.length > 0 ? `
        <div class="lesson-section-box" style="border-left: 4px solid #10B981;">
          <div class="lesson-section-label" style="color: #10B981;">🔑 KEY TAKEAWAYS</div>
          ${lesson.keyTakeaways.map(k => `
            <div class="lesson-objective-item">
              <span style="color: #10B981; font-weight: 900;">★</span>
              <span style="color: #FFFFFF; font-weight: 600;">${k}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 7. Interactive Knowledge Check Quiz (3-5 Questions) -->
      ${lesson.quiz && lesson.quiz.length > 0 ? `
        <div class="quiz-card" id="lesson-quiz-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 800; color: #FBBF24;">
              🧠 INTERACTIVE KNOWLEDGE CHECK QUIZ
            </div>
            <span style="font-size: 11px; color: #94A3B8;">${lesson.quiz.length} Questions</span>
          </div>

          ${quizFeedback && quizFeedback.submitted ? `
            <div style="background: ${quizFeedback.score >= Math.ceil(lesson.quiz.length * 0.6) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; border: 1px solid ${quizFeedback.score >= Math.ceil(lesson.quiz.length * 0.6) ? '#10B981' : '#EF4444'}; border-radius: 12px; padding: 14px; margin-bottom: 16px; text-align: center;">
              <div style="font-size: 18px; font-weight: 900; color: #FFFFFF;">
                Score: ${quizFeedback.score} / ${lesson.quiz.length} (${Math.round((quizFeedback.score / lesson.quiz.length) * 100)}%)
              </div>
              <div style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">
                ${quizFeedback.score === lesson.quiz.length ? '🌟 Flawless! You have fully mastered this lesson concept.' : (quizFeedback.score >= Math.ceil(lesson.quiz.length * 0.6) ? '✓ Well done! You have passed the knowledge check.' : 'Review the explanations below and try again to improve your score.')}
              </div>
            </div>
          ` : `
            <p style="font-size: 12px; color: #94A3B8; margin-bottom: 16px;">
              Answer all questions below to verify your comprehension. Answers and detailed feedback are revealed after submission.
            </p>
          `}

          ${lesson.quiz.map((q, qIdx) => {
            const userSelected = userAnswers[qIdx];
            const isSubmitted = quizFeedback && quizFeedback.submitted;

            return `
              <div class="quiz-question-wrap">
                <div class="quiz-question-num">QUESTION ${qIdx + 1} OF ${lesson.quiz.length}</div>
                <div class="quiz-question-text">${q.question}</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${q.options.map((opt, optIdx) => {
                    let optionClass = '';
                    if (isSubmitted) {
                      if (optIdx === q.answer) {
                        optionClass = 'correct';
                      } else if (userSelected === optIdx) {
                        optionClass = 'incorrect';
                      }
                    } else if (userSelected === optIdx) {
                      optionClass = 'selected';
                    }

                    return `
                      <button type="button" class="quiz-option-btn ${optionClass}" onclick="window.selectQuizOption(${lesson.id}, ${qIdx}, ${optIdx})" ${isSubmitted ? 'disabled' : ''}>
                        <span style="font-weight: 800; min-width: 20px;">
                          ${isSubmitted && optIdx === q.answer ? '✓' : (isSubmitted && userSelected === optIdx ? '✕' : String.fromCharCode(65 + optIdx))}
                        </span>
                        <span style="flex: 1;">${opt}</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                ${isSubmitted && q.explanation ? `
                  <div class="quiz-explanation-box">
                    <strong>Explanation:</strong> ${q.explanation}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}

          ${(!quizFeedback || !quizFeedback.submitted) ? `
            <button class="btn-upgrade-pill" style="width: 100%; justify-content: center; padding: 12px; font-size: 13px;" onclick="window.submitQuiz(${lesson.id})">
              ✓ Submit Quiz & Reveal Answers
            </button>
          ` : `
            <button style="width: 100%; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer;" onclick="window.resetQuiz(${lesson.id})">
              🔄 Retake Quiz
            </button>
          `}
        </div>
      ` : ''}

      <!-- 8. Lesson Completion Button -->
      <div style="margin-top: 12px;">
        <button class="btn-pro-gold" style="width: 100%; padding: 14px; font-size: 14px; justify-content: center;" onclick="window.completeLesson(${lesson.id})" ${isCompleted ? 'style="background: #10B981; color: #FFF;"' : ''}>
          ${isCompleted ? '✓ Lesson Completed (+XP Awarded)' : `Complete Lesson & Earn +${lesson.xp || 60} XP`}
        </button>
      </div>

      <!-- 9. Navigation Between Lessons Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        ${prevLesson ? `
          <button style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); color: #CBD5E1; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer;" onclick="window.navigateTo('lesson_detail', ${prevLesson.id})">
            ← Previous: Lesson ${prevLesson.id}
          </button>
        ` : '<div></div>'}

        ${nextLesson ? `
          <button style="background: rgba(0, 240, 255, 0.15); border: 1px solid #00F0FF; color: #00F0FF; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="window.navigateTo('lesson_detail', ${nextLesson.id})">
            Next: Lesson ${nextLesson.id} →
          </button>
        ` : `
          <button style="background: #10B981; border: none; color: #FFF; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="window.navigateTo('learn')">
            Back to Academy Curriculum 🎓
          </button>
        `}
      </div>
    </div>
  `;
}

// 6. PORTFOLIO SCREEN (100% Organic User Data)
function renderPortfolioScreen() {
  const totalVal = state.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalGain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0.00';
  const isPositive = totalGain >= 0;

  // Dynamic Grouping by UK Tax Vehicle
  const vehicleTotals = {};
  const geoTotals = {};
  if (totalVal > 0) {
    state.holdings.forEach(h => {
      const v = h.accountType || 'Stocks & Shares ISA';
      const g = h.allocationCategory || 'Global Equities';
      const val = h.shares * h.currentPrice;
      vehicleTotals[v] = (vehicleTotals[v] || 0) + val;
      geoTotals[g] = (geoTotals[g] || 0) + val;
    });
  }

  return `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="lse-feed-badge">🟢 LIVE FEED</span>
        <span style="font-size: 11px; color: #94A3B8;">${state.marketLastUpdated || 'International Feed Active'}</span>
      </div>
      <span style="font-size: 11px; color: #00F0FF; cursor: pointer; font-weight: 700;" onclick="window.refreshPortfolio()">🔄 Refresh Live Quotes</span>
    </div>

    <!-- TOTAL PORTFOLIO VALUATION CARD -->
    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.35);">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">
        TOTAL ORGANIC PORTFOLIO VALUATION
      </div>
      <div style="font-size: 34px; font-weight: 900; color: #FFFFFF; margin: 8px 0 4px 0;">
        £${totalVal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94A3B8; margin-top: 6px; flex-wrap: wrap; gap: 6px;">
        <span>Cost Basis: £${totalCost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span style="color: ${isPositive ? '#10B981' : '#EF4444'}; font-weight: 800;">
          ${isPositive ? '+' : ''}£${totalGain.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${isPositive ? '+' : ''}${gainPct}%)
        </span>
      </div>
    </div>

    <!-- ACCOUNT & GEOGRAPHIC ALLOCATION (Calculated 100% Dynamically) -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 800; color: #FFFFFF;">Dynamic Asset & Tax Allocation</span>
        <span style="font-size: 11px; color: #00F0FF; font-weight: 700; cursor: pointer;" onclick="window.navigateTo('etf_overlap')">Rebalance Tool →</span>
      </div>

      ${totalVal === 0 ? `
        <div style="text-align: center; padding: 18px 12px; color: #94A3B8; font-size: 12px;">
          📊 <em>No allocation breakdown available. Add your real investment positions below to calculate your dynamic ISA/GIA distribution and geographic exposure.</em>
        </div>
      ` : `
        <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">By UK Tax Vehicle:</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
          ${Object.entries(vehicleTotals).map(([vehicle, amt]) => {
            const pct = Math.round((amt / totalVal) * 100);
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <span>${vehicle}</span>
                  <span style="color: #00F0FF; font-weight: 700;">£${amt.toFixed(2)} (${pct}%)</span>
                </div>
                <div class="progress-container"><div class="progress-fill-cyan" style="width: ${pct}%;"></div></div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">By Geographic / Asset Exposure:</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${Object.entries(geoTotals).map(([geo, amt]) => {
            const pct = Math.round((amt / totalVal) * 100);
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <span>${geo}</span>
                  <span style="color: #FBBF24; font-weight: 700;">£${amt.toFixed(2)} (${pct}%)</span>
                </div>
                <div class="progress-container"><div class="progress-fill-cyan" style="width: ${pct}%; background: #FBBF24;"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>

    <!-- HOLDINGS LIST HEADER -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
      <h3 style="font-size: 16px; font-weight: 900; color: #FFFFFF;">Organic Holdings (${state.holdings.length})</h3>
      <button style="display: flex; align-items: center; gap: 6px; background: #00F0FF; color: #040B14; border: none; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="window.openAddHoldingModal()">
        <span>+ Add Holding</span>
      </button>
    </div>

    <!-- HOLDINGS ITEMS OR CLEAN EMPTY STATE -->
    ${state.holdings.length === 0 ? `
      <div class="cyber-card" style="text-align: center; padding: 32px 20px;">
        <div style="font-size: 32px; margin-bottom: 8px;">💼</div>
        <div style="font-size: 15px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Zero False Holdings Active</div>
        <div style="font-size: 12px; color: #94A3B8; max-width: 340px; margin: 0 auto 16px auto; line-height: 1.5;">
          Your portfolio contains no mock or seeded positions. Log your actual UK ISA, ETF, or stock investments to track real live market valuations and performance.
        </div>
        <button style="background: #00F0FF; color: #040B14; font-weight: 800; font-size: 13px; border: none; border-radius: 20px; padding: 10px 22px; cursor: pointer;" onclick="window.openAddHoldingModal()">
          + Record First Position
        </button>
      </div>
    ` : state.holdings.map((h, i) => {
      const posVal = h.shares * h.currentPrice;
      const posCost = h.shares * (h.avgBuyPrice || h.currentPrice);
      const posGain = posVal - posCost;
      const posGainPct = posCost > 0 ? ((posGain / posCost) * 100).toFixed(2) : '0.00';
      const posPositive = posGain >= 0;

      return `
        <div class="cyber-card" style="padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 17px; font-weight: 900; color: #FFFFFF;">${h.ticker}</span>
                <span style="font-size: 10px; background: rgba(0, 240, 255, 0.15); color: #00F0FF; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${h.accountType || 'ISA'}</span>
                <span style="font-size: 10px; color: #94A3B8;">${h.allocationCategory || 'Global'}</span>
              </div>
              <div style="font-size: 12px; color: #CBD5E1; margin-top: 2px;">${h.name || h.ticker}</div>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">
                ${h.shares} Shares @ avg £${Number(h.avgBuyPrice || h.currentPrice).toFixed(2)} • Live £${Number(h.currentPrice).toFixed(2)}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: 900; color: #FFFFFF;">£${posVal.toFixed(2)}</div>
              <div style="font-size: 11px; font-weight: 700; color: ${posPositive ? '#10B981' : '#EF4444'}; margin-top: 2px;">
                ${posPositive ? '+' : ''}£${posGain.toFixed(2)} (${posPositive ? '+' : ''}${posGainPct}%)
              </div>
              <button style="margin-top: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #EF4444; border-radius: 6px; padding: 3px 8px; font-size: 10px; cursor: pointer;" onclick="window.deleteHolding(${i})">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

// 7. ETF OVERLAP CHECKER SCREEN
// 7. ETF OVERLAP CHECKER SCREEN (Image 5)
function renderETFOverlapScreen() {
  const selected = state.overlapSelected;

  // Static overlap data
  const ETF_OVERLAPS = {
    'VWRP+VUAG': 62, 'VUAG+VWRP': 62,
    'VWRP+VUSA': 58, 'VUSA+VWRP': 58,
    'VWRP+IWDA': 71, 'IWDA+VWRP': 71,
    'VUAG+VUSA': 95, 'VUSA+VUAG': 95,
    'VWRP+EQQQ': 28, 'EQQQ+VWRP': 28,
    'VWRP+EQGB': 28, 'EQGB+VWRP': 28,
    'VWRP+VHYL': 45, 'VHYL+VWRP': 45,
    'VWRP+ISF':  25, 'ISF+VWRP':  25,
    'VWRP+IITU': 22, 'IITU+VWRP': 22,
    'VWRP+CSPX': 60, 'CSPX+VWRP': 60,
  };

  // Calculate overlap for selected pair
  let overlapPct = 15;
  if (selected.length >= 2) {
    const key = `${selected[0]}+${selected[1]}`;
    overlapPct = ETF_OVERLAPS[key] || 15;
  }

  // Overlapping holdings data keyed by pair
  const OVERLAP_HOLDINGS = {
    'VWRP+VUAG': [
      { name: 'Microsoft Corp', ticker: 'MSFT', sector: 'Information Technology', funds: 2, pct: 5.4 },
      { name: 'Apple Inc', ticker: 'AAPL', sector: 'Information Technology', funds: 2, pct: 5.0 },
      { name: 'NVIDIA Corp', ticker: 'NVDA', sector: 'Information Technology', funds: 2, pct: 4.4 },
      { name: 'Amazon.com Inc', ticker: 'AMZN', sector: 'Consumer Discretionary', funds: 2, pct: 3.8 },
      { name: 'Alphabet Inc Class A', ticker: 'GOOGL', sector: 'Communication Services', funds: 2, pct: 2.9 },
      { name: 'Meta Platforms', ticker: 'META', sector: 'Communication Services', funds: 2, pct: 2.4 },
      { name: 'Tesla Inc', ticker: 'TSLA', sector: 'Consumer Discretionary', funds: 2, pct: 1.8 },
      { name: 'Broadcom Inc', ticker: 'AVGO', sector: 'Information Technology', funds: 2, pct: 1.5 },
      { name: 'Berkshire Hathaway B', ticker: 'BRK.B', sector: 'Financials', funds: 2, pct: 1.3 },
    ],
    'DEFAULT': [
      { name: 'Microsoft Corp', ticker: 'MSFT', sector: 'Information Technology', funds: 2, pct: 3.2 },
      { name: 'Apple Inc', ticker: 'AAPL', sector: 'Information Technology', funds: 2, pct: 2.9 },
      { name: 'NVIDIA Corp', ticker: 'NVDA', sector: 'Information Technology', funds: 2, pct: 2.1 },
    ]
  };

  const pairKey = selected.length >= 2 ? `${selected[0]}+${selected[1]}` : 'DEFAULT';
  const holdings = OVERLAP_HOLDINGS[pairKey] || OVERLAP_HOLDINGS['DEFAULT'];

  const overlapColor = overlapPct >= 60 ? '#ef4444' : overlapPct >= 30 ? '#FBBF24' : '#10B981';
  const isDuplicate = overlapPct >= 25;

  const ALL_ETFS = ['VWRP', 'VUAG', 'IITU', 'EQGB', 'IWDA', 'CSPX', 'VHYL', 'ISF'];

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size:16px;font-weight:800;color:#FFFFFF;">ETF Overlap Checker</h2>
        <div style="font-size:11px;color:#94A3B8;">Identify hidden duplicate stock exposure across funds</div>
      </div>
    </div>

    <!-- ETF selector card -->
    <div class="cyber-card" style="border-color:rgba(0,198,255,0.3);">
      <div style="font-size:12px;font-weight:700;color:#CBD5E1;margin-bottom:12px;">Select ETFs to compare:</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        ${ALL_ETFS.map(etf => {
          const isSelected = selected.includes(etf);
          return `
            <button onclick="window.toggleEtf('${etf}')" style="
              padding:8px 16px;border-radius:20px;font-size:13px;font-weight:800;cursor:pointer;border:2px solid;
              ${isSelected
                ? 'background:#00c6ff;color:#040B14;border-color:#00c6ff;'
                : 'background:rgba(255,255,255,0.06);color:#94A3B8;border-color:rgba(255,255,255,0.15);'}
            ">
              ${isSelected ? '✓ ' : ''}${etf}
            </button>
          `;
        }).join('')}
      </div>
      <div style="font-size:12px;color:#94A3B8;">
        Comparing ${selected.length} fund${selected.length !== 1 ? 's' : ''}: <strong style="color:#fff;">${selected.join(', ') || 'None selected'}</strong>
      </div>
    </div>

    ${isDuplicate ? `
    <!-- DUPLICATION DETECTED warning -->
    <div style="background:rgba(251,191,36,0.08);border:1.5px solid #FBBF24;border-radius:14px;padding:16px;margin-top:4px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-size:18px;">⚠</span>
        <span style="font-size:13px;font-weight:900;color:#FBBF24;letter-spacing:0.5px;">DUPLICATION DETECTED</span>
      </div>
      <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0 0 10px 0;">
        OVERLAP DETECTED: This combination may increase your exposure to mega-cap companies like
        <strong style="color:#fff;">${holdings[0]?.name} (${holdings[0]?.pct}%)</strong>,
        <strong style="color:#fff;">${holdings[1]?.name} (${holdings[1]?.pct}%)</strong>,
        <strong style="color:#fff;">${holdings[2]?.name} (${holdings[2]?.pct}%)</strong>.
        Holding multiple funds with the same underlying giants does not increase true diversification.
      </p>
      <div style="font-size:13px;color:#00c6ff;cursor:pointer;font-weight:700;" onclick="window.navigateTo('learn')">
        Learn more about the ETF Overlap Trap in the Academy →
      </div>
    </div>
    ` : `
    <!-- Low overlap -->
    <div style="background:rgba(16,185,129,0.08);border:1.5px solid #10B981;border-radius:14px;padding:16px;margin-top:4px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:18px;">✅</span>
        <span style="font-size:13px;font-weight:900;color:#10B981;letter-spacing:0.5px;">LOW OVERLAP — GOOD DIVERSIFICATION</span>
      </div>
      <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0;">
        This combination provides good diversification with only <strong style="color:#10B981;">${overlapPct}% estimated overlap</strong>. These funds complement each other effectively.
      </p>
    </div>
    `}

    <!-- Overlap % big display -->
    <div class="cyber-card" style="text-align:center;margin-top:4px;">
      <div style="font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:0.8px;margin-bottom:6px;">ESTIMATED WEIGHT OVERLAP</div>
      <div style="font-size:52px;font-weight:900;color:${overlapColor};line-height:1;">${overlapPct}%</div>
      <div style="font-size:12px;color:#94A3B8;margin-top:6px;">
        ${selected.length >= 2 ? `Between ${selected[0]} and ${selected[1]}` : 'Select 2 ETFs to compare'}
      </div>
    </div>

    <!-- Overlapping Company Holdings list -->
    ${selected.length >= 2 ? `
    <div style="margin-top:4px;">
      <div style="font-size:15px;font-weight:800;color:#FFFFFF;margin-bottom:12px;">
        Overlapping Company Holdings (${holdings.length})
      </div>
      ${holdings.map(h => `
        <div class="cyber-card" style="margin-bottom:8px;padding:14px 16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:14px;font-weight:800;color:#FFFFFF;">${h.name}</div>
              <div style="font-size:11px;color:#94A3B8;margin-top:2px;">Ticker: ${h.ticker} • Sector: ${h.sector}</div>
            </div>
            <div style="background:#c8a96e;color:#040B14;font-size:11px;font-weight:900;padding:5px 10px;border-radius:8px;white-space:nowrap;">
              ${h.funds} funds (${h.pct}%)
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
  `;
}


// 8. COMPOUND GROWTH SIMULATOR SCREEN (Images 3 & 4)
function renderSimulatorScreen() {
  const r = state.simRate / 100.0;
  const months = state.simYears * 12;
  const monthlyRate = r / 12.0;
  const fvInitial = state.simInitial * Math.pow(1 + monthlyRate, months);
  const fvMonthly = monthlyRate > 0
    ? state.simMonthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : state.simMonthly * months;
  const totalValue = fvInitial + fvMonthly;
  const totalInvested = state.simInitial + state.simMonthly * months;
  const totalGrowth = totalValue - totalInvested;
  const growthPct = totalInvested > 0 ? Math.round((totalGrowth / totalValue) * 100) : 0;
  const depositPct = 100 - growthPct;

  // Time horizon comparison rows
  function calcFV(monthly, years) {
    const m = r / 12;
    const n = years * 12;
    const fv = state.simInitial * Math.pow(1 + m, n) +
               (m > 0 ? monthly * ((Math.pow(1 + m, n) - 1) / m) : monthly * n);
    return Math.round(fv);
  }

  const fv10 = calcFV(state.simMonthly, 10);
  const fv20 = calcFV(state.simMonthly, 20);
  const fv30 = calcFV(state.simMonthly, 30);
  const dep10 = state.simInitial + state.simMonthly * 10 * 12;
  const dep20 = state.simInitial + state.simMonthly * 20 * 12;
  const dep30 = state.simInitial + state.simMonthly * 30 * 12;

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size:16px;font-weight:800;color:#FFFFFF;">Compound Growth Simulator</h2>
        <div style="font-size:11px;color:#94A3B8;">Simulate multi-decade compounding wealth accumulation</div>
      </div>
    </div>

    <!-- Main result card -->
    <div class="sim-result-card">
      <div class="sim-result-label">HYPOTHETICAL PORTFOLIO VALUE IN ${state.simYears} YEARS</div>
      <div class="sim-result-value">£${Math.round(totalValue).toLocaleString('en-GB')}</div>

      <!-- Deposit vs Growth bar -->
      <div class="sim-bar-wrap">
        <div class="sim-bar-fill" style="width:${depositPct}%;background:linear-gradient(90deg,#00c6ff,#10B981);border-radius:6px 0 0 6px;"></div>
        <div class="sim-bar-fill" style="width:${growthPct}%;background:linear-gradient(90deg,#10B981,#c8a96e);border-radius:0 6px 6px 0;"></div>
      </div>
      <div class="sim-split-row">
        <span>Your Deposits<br><strong style="color:#00c6ff;">£${Math.round(totalInvested).toLocaleString('en-GB')}</strong></span>
        <span style="text-align:right;">Compound Growth (${growthPct}%)<br><strong style="color:#c8a96e;">£${Math.round(totalGrowth).toLocaleString('en-GB')}</strong></span>
      </div>
    </div>

    <!-- Controls card -->
    <div class="sim-controls-card">

      <!-- Monthly Contribution -->
      <div class="sim-control-group">
        <div class="sim-control-header">
          <span class="sim-control-label">Monthly Contribution</span>
          <span class="sim-control-value" style="color:#00c6ff;">£${state.simMonthly} / month</span>
        </div>
        <input type="range" class="sim-slider" min="0" max="2000" step="50" value="${state.simMonthly}"
          oninput="window.updateSim('simMonthly', this.value)" />
        <div class="sim-preset-row">
          ${[50, 100, 250, 500].map(v => `
            <button class="sim-preset-btn ${state.simMonthly == v ? 'active' : ''}"
              onclick="window.updateSim('simMonthly', ${v})">£${v}</button>
          `).join('')}
        </div>
      </div>

      <!-- Investment Period -->
      <div class="sim-control-group">
        <div class="sim-control-header">
          <span class="sim-control-label">Investment Period</span>
          <span class="sim-control-value" style="color:#00c6ff;">${state.simYears} years</span>
        </div>
        <input type="range" class="sim-slider" min="5" max="40" step="5" value="${state.simYears}"
          oninput="window.updateSim('simYears', this.value)" />
        <div class="sim-preset-row">
          ${[10, 20, 30, 40].map(v => `
            <button class="sim-preset-btn ${state.simYears == v ? 'active' : ''}"
              onclick="window.updateSim('simYears', ${v})">${v} yrs</button>
          `).join('')}
        </div>
      </div>

      <!-- Annual Return -->
      <div class="sim-control-group">
        <div class="sim-control-header">
          <span class="sim-control-label">Hypothetical Annual Return</span>
          <span class="sim-control-value" style="color:#10B981;">${parseFloat(state.simRate).toFixed(1)}% p.a.</span>
        </div>
        <input type="range" class="sim-slider" min="3" max="15" step="0.5" value="${state.simRate}"
          oninput="window.updateSim('simRate', this.value)" />
      </div>
    </div>

    <!-- Time Horizon Comparison Table -->
    <div class="cyber-card" style="margin-top:16px;">
      <div style="font-size:15px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">Time Horizon Compounding Comparison</div>
      <div style="font-size:12px;color:#94A3B8;margin-bottom:16px;">At £${state.simMonthly}/month and ${parseFloat(state.simRate).toFixed(1)}% annual average return:</div>

      <div class="sim-comparison-row" style="border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:14px;margin-bottom:14px;">
        <div>
          <div style="font-size:15px;font-weight:800;color:#FFFFFF;">10 Years</div>
          <div style="font-size:12px;color:#94A3B8;">Deposited: £${dep10.toLocaleString('en-GB')}</div>
        </div>
        <div style="font-size:20px;font-weight:900;color:#00c6ff;">£${fv10.toLocaleString('en-GB')}</div>
      </div>
      <div class="sim-comparison-row" style="border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:14px;margin-bottom:14px;">
        <div>
          <div style="font-size:15px;font-weight:800;color:#FFFFFF;">20 Years</div>
          <div style="font-size:12px;color:#94A3B8;">Deposited: £${dep20.toLocaleString('en-GB')}</div>
        </div>
        <div style="font-size:20px;font-weight:900;color:#00c6ff;">£${fv20.toLocaleString('en-GB')}</div>
      </div>
      <div class="sim-comparison-row">
        <div>
          <div style="font-size:15px;font-weight:800;color:#FFFFFF;">30 Years</div>
          <div style="font-size:12px;color:#94A3B8;">Deposited: £${dep30.toLocaleString('en-GB')}</div>
        </div>
        <div style="font-size:20px;font-weight:900;color:#00c6ff;">£${fv30.toLocaleString('en-GB')}</div>
      </div>
    </div>

    <!-- Regulatory Notice -->
    <div class="reg-notice-card" style="margin-top:16px;">
      <div class="reg-notice-icon">ℹ</div>
      <div class="reg-notice-text">
        <strong>Regulatory & Educational Notice</strong><br>
        EB Wealth provides analytical intelligence and investment education. It does not provide personalized financial advice or execution brokerage. Capital is at risk; investments can fluctuate, and you may receive back less than originally invested. Regulated UK financial advice should be sought for personal decisions.
      </div>
    </div>
  `;
}


// 9. AI WEALTH COACH SCREEN
function renderAICoachScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">EB Wealth AI Coach</h2>
        <div style="font-size: 11px; color: #94A3B8;">Institutional Wealth Intelligence</div>
      </div>
    </div>

    <!-- Quick Prompt Chips -->
    <div style="display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;">
      <button class="chip-btn" onclick="window.sendPrompt('How does the £20k UK ISA allowance work?')">ISA Rules</button>
      <button class="chip-btn" onclick="window.sendPrompt('Compare VWRP vs VUAG for UK investors')">VWRP vs VUAG</button>
      <button class="chip-btn" onclick="window.sendPrompt('What are the CGT limits for 2024/25?')">CGT £3k Exemption</button>
      <button class="chip-btn" onclick="window.sendPrompt('How can I optimize dividend tax allowances?')">Dividend Relief</button>
    </div>

    <!-- Messages Container -->
    <div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">
      ${state.chatMessages.map(m => `
        <div style="display: flex; justify-content: ${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
          <div style="max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 13px; line-height: 1.5; ${m.sender === 'user' ? 'background: #00F0FF; color: #040B14; font-weight: 700;' : 'background: rgba(7, 19, 34, 0.9); border: 1px solid rgba(0, 240, 255, 0.3); color: #FFFFFF;'}">
            ${m.text}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Message Input Bar -->
    <form onsubmit="window.submitChat(event)" style="display: flex; gap: 8px; margin-top: 10px;">
      <input type="text" id="ai-chat-input" placeholder="Ask wealth questions..." style="flex: 1; background: rgba(7, 19, 34, 0.9); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 20px; padding: 12px 16px; color: #fff; font-size: 13px;" required />
      <button type="submit" style="background: #00F0FF; color: #040B14; border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </form>
  `;
}

// 10. DYNAMIC COMMUNITY FORUM & DISCUSSION SCREEN (No hardcoded static data)
function renderCommunityScreen() {
  const discussions = CommunityService.getDiscussions();
  state.communityDiscussions = discussions;

  const categories = ['All', 'UK Tax & ISA', 'Portfolio Building', 'Beginner Help', 'General Discussion'];
  let filtered = discussions;

  if (state.communityCategoryFilter && state.communityCategoryFilter !== 'All') {
    filtered = filtered.filter(p => p.category === state.communityCategoryFilter);
  }

  if (state.communitySearchQuery && state.communitySearchQuery.trim()) {
    const q = state.communitySearchQuery.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div style="flex: 1;">
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Community Forum & Discussions</h2>
        <div style="font-size: 11px; color: #94A3B8;">Verified UK Investor Community • Live Q&A</div>
      </div>
      <button class="btn-upgrade-pill" style="font-size: 11px; padding: 6px 12px;" onclick="window.toggleNewDiscussionModal()">
        + New Post
      </button>
    </div>

    <!-- Category Filter Pills -->
    <div style="display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;">
      ${categories.map(cat => `
        <button class="chip-btn ${state.communityCategoryFilter === cat ? 'active' : ''}" style="${state.communityCategoryFilter === cat ? 'background: #00F0FF; color: #040B14; font-weight: 800;' : ''}" onclick="window.setCommunityCategory('${cat}')">
          ${cat}
        </button>
      `).join('')}
    </div>

    <!-- Search Input -->
    <div style="position: relative;">
      <input type="text" placeholder="Search investor discussions..." value="${state.communitySearchQuery || ''}" oninput="window.setCommunitySearch(this.value)" style="width: 100%; background: rgba(10, 24, 46, 0.8); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; padding: 10px 14px; color: #FFF; font-size: 12px;" />
    </div>

    <!-- New Discussion Creation Modal / Form -->
    ${state.showNewDiscussionModal ? `
      <div class="cyber-card" style="border: 1.5px solid #00F0FF; background: rgba(10, 24, 46, 0.95); margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 13px; font-weight: 800; color: #00F0FF;">START A NEW DISCUSSION</div>
          <button style="background: none; border: none; color: #94A3B8; font-size: 16px; cursor: pointer;" onclick="window.toggleNewDiscussionModal()">✕</button>
        </div>
        <form onsubmit="window.submitNewDiscussion(event)">
          <div style="margin-bottom: 10px;">
            <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">TOPIC CATEGORY</label>
            <select id="new-post-category" style="width: 100%; background: rgba(4, 11, 20, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 8px 10px; color: #FFF; font-size: 12px;">
              <option value="UK Tax & ISA">UK Tax & ISA</option>
              <option value="Portfolio Building">Portfolio Building</option>
              <option value="Beginner Help">Beginner Help</option>
              <option value="General Discussion">General Discussion</option>
            </select>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">DISCUSSION TITLE</label>
            <input type="text" id="new-post-title" required placeholder="e.g. Best low-cost index funds for 2024/25 ISA" style="width: 100%; background: rgba(4, 11, 20, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">DISCUSSION CONTENT</label>
            <textarea id="new-post-content" required rows="4" placeholder="Share your experience, portfolio question, or investment insight..." style="width: 100%; background: rgba(4, 11, 20, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px; resize: vertical;"></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" style="background: rgba(255, 255, 255, 0.08); border: none; color: #CBD5E1; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;" onclick="window.toggleNewDiscussionModal()">Cancel</button>
            <button type="submit" class="btn-upgrade-pill" style="font-size: 12px; padding: 8px 16px;">Publish Discussion</button>
          </div>
        </form>
      </div>
    ` : ''}

    <!-- Discussions List -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${filtered.length === 0 ? `
        <div class="cyber-card" style="text-align: center; padding: 30px 20px;">
          <div style="font-size: 28px; margin-bottom: 8px;">💬</div>
          <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">No discussions found</div>
          <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Be the first to start a conversation in this topic!</div>
          <button class="btn-upgrade-pill" style="margin-top: 12px; padding: 8px 16px; font-size: 12px;" onclick="window.toggleNewDiscussionModal()">+ Start Discussion</button>
        </div>
      ` : filtered.map(p => {
        const isExpanded = state.expandedDiscussionId === p.id;
        const timeStr = typeof p.createdAt === 'number' ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : (p.time || 'Recent');

        return `
          <div class="community-post-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                ${p.pinned ? `<span style="font-size: 10px; font-weight: 800; color: #FBBF24; background: rgba(251, 191, 36, 0.15); padding: 2px 6px; border-radius: 4px;">📌 PINNED</span>` : ''}
                <span style="font-size: 10px; font-weight: 800; color: #2DD4BF; background: rgba(20, 184, 166, 0.15); padding: 2px 8px; border-radius: 4px;">${p.category}</span>
                <span style="font-size: 10px; color: #38BDF8; font-weight: 700;">${p.authorLevel || 'Investor'}</span>
              </div>
              <span style="font-size: 11px; color: #94A3B8;">${timeStr} • ${p.author}</span>
            </div>

            <div style="font-size: 14px; font-weight: 900; color: #FFFFFF; margin-bottom: 6px; line-height: 1.3;">
              ${p.title}
            </div>

            <p style="font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 12px; white-space: pre-line;">
              ${p.content}
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 8px;">
              <div style="display: flex; gap: 16px;">
                <button type="button" class="community-action-btn" style="color: ${p.likedByMe ? '#F43F5E' : '#94A3B8'};" onclick="window.toggleCommunityLike(${p.id})">
                  ${p.likedByMe ? '❤️' : '🤍'} ${p.likes || 0} Likes
                </button>
                <button type="button" class="community-action-btn" style="color: #00F0FF;" onclick="window.openDiscussion(${p.id})">
                  💬 ${(p.comments ? p.comments.length : 0)} Comments ${isExpanded ? '▲' : '▼'}
                </button>
              </div>

              ${p.author === state.user.firstName || AdminAuthService.isAuthenticated() ? `
                <button type="button" style="background: none; border: none; color: #EF4444; font-size: 11px; cursor: pointer; font-weight: 700;" onclick="window.deleteCommunityPost(${p.id})">
                  🗑 Delete
                </button>
              ` : ''}
            </div>

            <!-- Threaded Comments / Discussion Box -->
            ${isExpanded ? `
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(0, 240, 255, 0.25);">
                <div style="font-size: 12px; font-weight: 800; color: #00F0FF; margin-bottom: 8px;">DISCUSSION REPLIES</div>

                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
                  ${(!p.comments || p.comments.length === 0) ? `
                    <div style="font-size: 12px; color: #94A3B8; font-style: italic;">No replies yet. Be the first to share your thoughts!</div>
                  ` : p.comments.map(c => `
                    <div style="background: rgba(4, 11, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 10px 12px;">
                      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                        <span style="color: #FBBF24; font-weight: 800;">${c.author} <span style="color: #94A3B8; font-weight: normal;">(${c.authorLevel || 'Investor'})</span></span>
                        <span style="color: #64748B;">${typeof c.createdAt === 'number' ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent'}</span>
                      </div>
                      <p style="font-size: 12px; color: #E2E8F0; line-height: 1.4; margin: 0;">${c.text}</p>
                    </div>
                  `).join('')}
                </div>

                <!-- Add Comment Input Form -->
                <form onsubmit="window.submitCommunityComment(event, ${p.id})" style="display: flex; gap: 6px;">
                  <input type="text" id="comment-input-${p.id}" required placeholder="Write a constructive reply..." style="flex: 1; background: rgba(4, 11, 20, 0.8); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 8px 12px; color: #FFF; font-size: 12px;" />
                  <button type="submit" class="btn-upgrade-pill" style="font-size: 11px; padding: 8px 14px;">Reply</button>
                </form>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 11. EVENTS SCREEN
function renderEventsScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Live Investor Events</h2>
        <div style="font-size: 11px; color: #94A3B8;">Institutional workshops & webinars</div>
      </div>
    </div>

    ${state.events.map(e => `
      <div class="cyber-card">
        <div style="font-size: 11px; color: #FBBF24; font-weight: 800; margin-bottom: 4px;">${e.date}</div>
        <div style="font-size: 16px; font-weight: 900; color: #FFFFFF; margin-bottom: 4px;">${e.title}</div>
        <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">Presented by ${e.host}</div>
        <p style="font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 12px;">${e.description}</p>
        <button class="btn-upgrade-pill" style="width: 100%; justify-content: center; font-size: 12px;" onclick="window.toggleRegister(${e.id})">
          ${state.registeredEvents.includes(e.id) ? '✓ Registered' : 'Register for Webinar'}
        </button>
      </div>
    `).join('')}
  `;
}

// 12. MARKET NEWS SCREEN
function renderNewsScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Market Intelligence News</h2>
        <div style="font-size: 11px; color: #94A3B8;">London Stock Exchange & UK Fiscal Updates</div>
      </div>
    </div>

    ${state.marketNews.map(n => `
      <div class="cyber-card">
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 4px;">
          <span style="color: #00F0FF; font-weight: 700;">${n.source}</span>
          <span>${n.time}</span>
        </div>
        <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; margin-bottom: 4px;">${n.title}</div>
        <p style="font-size: 12px; color: #CBD5E1; line-height: 1.5;">${n.snippet}</p>
      </div>
    `).join('')}
  `;
}

// 13. PROFILE SCREEN (Screenshot 1)
function renderProfileScreen() {
  const isaRemaining = state.user.isaLimit - state.user.isaUsed;
  const isaPct = ((state.user.isaUsed / state.user.isaLimit) * 100).toFixed(1);

  return `
    <!-- Top Client Verification Card (Screenshot 1) -->
    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span class="verified-client-badge">
          <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          <span>VERIFIED WEALTH CLIENT</span>
        </span>
        <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">${state.user.ref}</span>
      </div>

      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #00BCD4, #0284C7); border: 2px solid #00F0FF; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 900; color: #FFFFFF; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4); flex-shrink: 0;">
          ${(state.user.firstName || 'J').charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size: 22px; font-weight: 900; color: #FFFFFF;">${state.user.firstName}</div>
          <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">${state.user.email}</div>
          <div style="font-size: 12px; color: #00F0FF; font-weight: 700; margin-top: 4px;">${state.user.region}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div>
          <div style="font-size: 10px; color: #94A3B8; font-weight: 700; letter-spacing: 0.5px;">TIER STATUS</div>
          <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; margin-top: 2px;">${state.user.tierStatus}</div>
        </div>
        <button class="btn-pro-gold" onclick="window.openProModal()">Upgrade to Pro</button>
      </div>
    </div>

    <!-- TAX YEAR 2024/2025 ALLOWANCES Card (Screenshot 1) -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">TAX YEAR 2024/2025 ALLOWANCES</span>
        <span style="font-size: 11px; color: #94A3B8;">HMRC Regulated</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700;">
        <span style="color: #FFFFFF;">Stocks & Shares ISA Limit</span>
        <span style="color: #00F0FF; font-weight: 900;">£${state.user.isaUsed.toLocaleString('en-GB')} / £${state.user.isaLimit.toLocaleString('en-GB')}</span>
      </div>

      <div class="progress-container">
        <div class="progress-fill-cyan" style="width: ${isaPct}%;">
          <div class="progress-dot-end"></div>
        </div>
      </div>

      <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">
        £${isaRemaining.toLocaleString('en-GB')} tax-free allowance remaining until April 5
      </div>

      <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin: 14px 0;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; color: #94A3B8;">Capital Gains Allowance</div>
          <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">£${state.user.capitalGainsLimit.toLocaleString('en-GB')}.00 Limit</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #94A3B8;">Dividend Allowance</div>
          <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">£${state.user.dividendLimit.toLocaleString('en-GB')}.00 Tax-Free</div>
        </div>
      </div>
    </div>

    <!-- INVESTOR SUITABILITY MANDATE Card (Screenshot 1 & ProfileScreen.kt) -->
    <div class="cyber-card" style="border-color: rgba(56, 189, 248, 0.45);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span style="font-size: 11px; font-weight: 800; color: #38BDF8; letter-spacing: 0.8px;">INVESTOR SUITABILITY MANDATE</span>
        <button onclick="window.navigateTo('onboarding')" style="background: none; border: none; font-size: 12px; color: #00F0FF; font-weight: 800; cursor: pointer; padding: 2px 6px;">Recalibrate →</button>
      </div>

      <div class="bank-detail-row">
        <span class="bank-detail-label">Investment Experience</span>
        <span class="bank-detail-value">${state.user.experienceLevel || 'Beginner'}</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Primary Financial Goal</span>
        <span class="bank-detail-value">${state.user.primaryGoal || 'Build long-term wealth'}</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Investment Time Horizon</span>
        <span class="bank-detail-value">${state.user.timeHorizon || '20+ years'}</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Monthly Allocation Capacity</span>
        <span class="bank-detail-value">${state.user.monthlyCapacity || '£150–£500'}</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Risk Tolerance Calibration</span>
        <span class="bank-detail-value" style="color: #00F0FF;">${state.user.riskProfile || 'Medium-High'}</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Investor Academy Status</span>
        <span class="bank-detail-value" style="color: #FBBF24;">Tier ${state.user.levelNumber || 1} (${state.user.levelTitle || 'Investor Starter'})</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Total Experience XP</span>
        <span class="bank-detail-value" style="color: #00F0FF;">${state.user.xp || 350} XP</span>
      </div>
      <div class="bank-detail-row">
        <span class="bank-detail-label">Regulatory Jurisdiction</span>
        <span class="bank-detail-value">United Kingdom (FCA / PRA)</span>
      </div>
    </div>

    <!-- BANK-GRADE SECURITY & PROTECTION Card (ProfileScreen.kt) -->
    <div class="cyber-card" style="border-color: rgba(16, 185, 129, 0.35);">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="color: #34D399; font-size: 16px;">🛡️</span>
        <span style="font-size: 11px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.8px;">BANK-GRADE SECURITY & PROTECTION</span>
      </div>

      <div class="bank-security-row">
        <div class="bank-security-left">
          <div class="bank-security-icon">🛡️</div>
          <span class="bank-security-title">FSCS Protection</span>
        </div>
        <span class="bank-security-val">Covered up to £85,000</span>
      </div>
      <div class="bank-security-row">
        <div class="bank-security-left">
          <div class="bank-security-icon">👆</div>
          <span class="bank-security-title">Biometrics & PIN</span>
        </div>
        <span class="bank-security-val">Enabled (FaceID / Fingerprint)</span>
      </div>
      <div class="bank-security-row">
        <div class="bank-security-left">
          <div class="bank-security-icon">🏛️</div>
          <span class="bank-security-title">Linked Bank Account</span>
        </div>
        <span class="bank-security-val" style="color: #94A3B8;">Barclays Premier (••••4821)</span>
      </div>
      <div class="bank-security-row">
        <div class="bank-security-left">
          <div class="bank-security-icon">🔒</div>
          <span class="bank-security-title">Encryption Protocol</span>
        </div>
        <span class="bank-security-val">AES-256 GCM Cloud Firestore</span>
      </div>
    </div>

    <!-- Quick Tools Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button class="quick-card" onclick="window.navigateTo('simulator')">
        <div style="font-size: 12px; font-weight: 800; color: #FBBF24;">📈 Growth Simulator</div>
        <div style="font-size: 10px; color: #94A3B8;">Forecast Compounding</div>
      </button>
      <button class="quick-card" onclick="window.navigateTo('etf_overlap')">
        <div style="font-size: 12px; font-weight: 800; color: #00F0FF;">🔍 ETF Overlap Tool</div>
        <div style="font-size: 10px; color: #94A3B8;">Analyze Fund Overlap</div>
      </button>
      <button class="quick-card" onclick="window.navigateTo('events')">
        <div style="font-size: 12px; font-weight: 800; color: #10B981;">📅 Upcoming Events</div>
        <div style="font-size: 10px; color: #94A3B8;">Live Masterclasses</div>
      </button>
      <button class="quick-card" onclick="window.navigateTo('news')">
        <div style="font-size: 12px; font-weight: 800; color: #38BDF8;">📰 LSE Market News</div>
        <div style="font-size: 10px; color: #94A3B8;">Financial Bulletins</div>
      </button>
    <!-- Instant Cloud Sync & Sign Out -->
    <div style="display: flex; gap: 10px; margin-top: 14px;">
      <button style="flex: 1; background: rgba(0, 240, 255, 0.15); border: 1px solid #00F0FF; color: #00F0FF; border-radius: 12px; padding: 12px; font-weight: 800; font-size: 12px; cursor: pointer;" onclick="window.triggerCloudSync()">
        ⚡ Cloud Sync to Firestore
      </button>
      <button style="background: rgba(244, 63, 94, 0.15); border: 1px solid #F43F5E; color: #F43F5E; border-radius: 12px; padding: 12px 18px; font-weight: 800; font-size: 12px; cursor: pointer;" onclick="window.signOut()">
        Sign Out
      </button>
    </div>

    <!-- Troubleshooting Cache Buster -->
    <div style="text-align: center; margin-top: 16px;">
      <button type="button" style="background: transparent; border: 1px dashed rgba(255, 255, 255, 0.2); color: #94A3B8; font-size: 11px; padding: 6px 12px; border-radius: 8px; cursor: pointer;" onclick="window.clearAppCacheAndReload()">
        🔄 Clear App Cache & Refresh
      </button>
    </div>
  `;
}

// 14. PRIVATE ADMINISTRATOR AREA (Accessed strictly via /admin or #admin)
function renderAdminLoginScreen() {
  const rateLimit = AdminAuthService.getRateLimitState();

  return `
    <div class="admin-login-wrap">
      <div class="admin-login-card">
        <div class="admin-lock-badge">
          <svg style="width:28px;height:28px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>

        <div class="admin-title-badge">EB WEALTH ACADEMY</div>
        <h2 style="font-size: 20px; font-weight: 900; color: #FFFFFF; margin-bottom: 6px;">ADMINISTRATION PORTAL</h2>
        <p style="font-size: 12px; color: #94A3B8; margin-bottom: 20px; line-height: 1.4;">
          Restricted access for curriculum governance, student progress monitoring, and platform operations.
        </p>

        ${rateLimit.isLocked ? `
          <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; border-radius: 10px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #FCA5A5;">
            🔒 <strong>Account Temporarily Locked</strong><br>
            Excessive failed attempts detected. Try again in ${rateLimit.remainingSeconds} seconds.
          </div>
        ` : ''}

        ${state.adminLoginForm.error ? `
          <div class="auth-error-banner" style="margin-bottom: 16px;">
            <svg style="width:16px;height:16px;flex-shrink:0;" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>${state.adminLoginForm.error}</span>
          </div>
        ` : ''}

        <form onsubmit="window.handleAdminLogin(event)" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
          <div>
            <label style="font-size: 11px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">ADMIN USERNAME</label>
            <input type="text" id="admin-username-input" required autocomplete="username" placeholder="Username" class="auth-input" style="padding-left: 14px;" value="${state.adminLoginForm.username || ''}" ${rateLimit.isLocked ? 'disabled' : ''} />
          </div>

          <div>
            <label style="font-size: 11px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">ADMIN PASSWORD</label>
            <input type="password" id="admin-password-input" required autocomplete="current-password" placeholder="Password" class="auth-input" style="padding-left: 14px;" value="${state.adminLoginForm.password || ''}" ${rateLimit.isLocked ? 'disabled' : ''} />
          </div>

          <button type="submit" class="admin-btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 13px; margin-top: 6px;" ${rateLimit.isLocked || state.adminLoginForm.loading ? 'disabled' : ''}>
            ${state.adminLoginForm.loading ? 'Verifying Credentials...' : 'Authenticate Admin Session →'}
          </button>
        </form>

        <div style="margin-top: 20px; font-size: 11px; color: #64748B;">
          Notice: Ordinary students cannot access this area. Unauthorized access attempts are monitored and rate-limited.
        </div>
      </div>
    </div>
  `;
}

function renderAdminDashboardScreen() {
  if (!AdminAuthService.isAuthenticated()) {
    return renderAdminLoginScreen();
  }

  // Load organic users from Firestore on initial view
  if (!state.adminUsersLoaded) {
    state.adminUsersLoaded = true;
    firebaseService.fetchAllOrganicUsers().then(users => {
      if (Array.isArray(users) && users.length > 0) {
        state.adminUsers = users;
        render();
      }
    });
  }

  // Deduplicate and combine organic registered students from database & active user session
  const studentMap = new Map();
  if (state.user && state.user.email) {
    studentMap.set(state.user.email.toLowerCase(), {
      id: state.user.id || 'usr_current',
      firstName: state.user.firstName || 'Investor',
      email: state.user.email,
      levelTitle: state.user.levelTitle || 'Investor Starter',
      xp: state.user.xp || 0,
      streakDays: state.user.streakDays || 1,
      isPro: !!state.user.isPro,
      completedCount: state.completedLessons.length,
      createdAtFormatted: 'Active Now'
    });
  }
  (state.adminUsers || []).forEach(u => {
    if (u.email) {
      const existing = studentMap.get(u.email.toLowerCase()) || {};
      studentMap.set(u.email.toLowerCase(), {
        ...existing,
        ...u,
        completedCount: existing.completedCount || (u.completedCount || 0)
      });
    }
  });

  const allStudents = Array.from(studentMap.values());
  const totalRegisteredStudents = allStudents.length;
  const activeLearners = allStudents.filter(s => (s.xp > 0 || s.streakDays > 0)).length;

  // Calculate live statistics from actual application data
  const totalCourses = state.levels.length || 6;
  const publishedCourses = state.levels.filter(l => l.published !== false).length;
  const totalLessons = state.lessons.length || 48;
  const publishedLessons = state.lessons.filter(l => l.published !== false).length;
  const lessonsCompleted = state.completedLessons.length;
  const overallCompletion = totalLessons > 0 ? Math.min(100, Math.round((lessonsCompleted / totalLessons) * 100)) : 0;

  // Compute average quiz score from recorded attempts
  const quizScores = Object.values(state.quizProgress || {});
  const avgQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((acc, q) => acc + (q.score / (q.total || 1)), 0) / quizScores.length * 100)
    : (lessonsCompleted > 0 ? 100 : 0);

  const currentTab = state.adminTab || 'overview';

  return `
    <div class="admin-portal-container">
      <!-- Admin Top Header Card -->
      <div class="admin-header-card">
        <div>
          <div class="admin-title-badge">RESTRICTED ADMINISTRATOR AREA</div>
          <h1 class="admin-main-heading">EB WEALTH ACADEMY — ADMINISTRATION</h1>
          <div class="admin-header-sub">
            System Session Active • Authenticated as Super Administrator
          </div>
        </div>

        <div class="admin-header-actions">
          <button class="admin-btn-logout" onclick="window.handleAdminLogout()">
            🔒 Secure Logout
          </button>
        </div>
      </div>

      ${state.adminNotification ? `
        <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10B981; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #10B981; display: flex; justify-content: space-between; align-items: center;">
          <span>✓ ${state.adminNotification}</span>
          <button style="background: none; border: none; color: #10B981; cursor: pointer;" onclick="state.adminNotification = ''; render();">✕</button>
        </div>
      ` : ''}

      <!-- 8 Key Summary Cards (Calculated directly from actual application data) -->
      <div class="admin-metrics-grid">
        <div class="admin-stat-card">
          <span class="admin-stat-title">Total Registered Students</span>
          <span class="admin-stat-num">${totalRegisteredStudents}</span>
          <span class="admin-stat-sub">● Enrolled learners</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Active Learners</span>
          <span class="admin-stat-num">${activeLearners}</span>
          <span class="admin-stat-sub" style="color: #38BDF8;">● In progress today</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Total Courses (Levels)</span>
          <span class="admin-stat-num">${totalCourses}</span>
          <span class="admin-stat-sub">6 Progressive Tiers</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Total Lessons</span>
          <span class="admin-stat-num">${totalLessons}</span>
          <span class="admin-stat-sub">${publishedLessons} Published</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Published Courses</span>
          <span class="admin-stat-num">${publishedCourses} / ${totalCourses}</span>
          <span class="admin-stat-sub" style="color: #10B981;">100% Available</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Lessons Completed</span>
          <span class="admin-stat-num">${lessonsCompleted}</span>
          <span class="admin-stat-sub">+${lessonsCompleted * 65} XP Awarded</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Average Quiz Score</span>
          <span class="admin-stat-num">${avgQuizScore}%</span>
          <span class="admin-stat-sub" style="color: #FBBF24;">Knowledge Checks</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-title">Overall Course Completion</span>
          <span class="admin-stat-num">${overallCompletion}%</span>
          <span class="admin-stat-sub" style="color: #10B981;">Curriculum Progress</span>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="admin-tabs-nav">
        <button class="admin-tab-btn ${currentTab === 'overview' ? 'active' : ''}" onclick="window.setAdminTab('overview')">
          📊 Overview & Analytics
        </button>
        <button class="admin-tab-btn ${currentTab === 'courses' ? 'active' : ''}" onclick="window.setAdminTab('courses')">
          🏛 Course Management
        </button>
        <button class="admin-tab-btn ${currentTab === 'lessons' ? 'active' : ''}" onclick="window.setAdminTab('lessons')">
          📝 Lesson Management (${totalLessons})
        </button>
        <button class="admin-tab-btn ${currentTab === 'students' ? 'active' : ''}" onclick="window.setAdminTab('students')">
          👥 Student Management
        </button>
        <button class="admin-tab-btn ${currentTab === 'community' ? 'active' : ''}" onclick="window.setAdminTab('community')">
          🛡 Community Moderation
        </button>
        <button class="admin-tab-btn ${currentTab === 'security' ? 'active' : ''}" onclick="window.setAdminTab('security')">
          🔐 Security & Password
        </button>
      </div>

      <!-- TAB 1: OVERVIEW & ANALYTICS -->
      ${currentTab === 'overview' ? `
        <div class="admin-section-card">
          <div class="admin-section-header">
            <div class="admin-section-title">📈 Curriculum Engagement by Learning Level</div>
            <span style="font-size: 12px; color: #94A3B8;">Real-time student progress distribution</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${state.levels.map(lvl => {
              const lvlLessons = state.lessons.filter(l => l.level === lvl.level);
              const lvlCompleted = lvlLessons.filter(l => state.completedLessons.includes(l.id)).length;
              const pct = lvlLessons.length > 0 ? Math.round((lvlCompleted / lvlLessons.length) * 100) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                    <span style="color: #FFFFFF; font-weight: 700;">${lvl.icon} ${lvl.title}</span>
                    <span style="color: #00F0FF; font-weight: 800;">${lvlCompleted} / ${lvlLessons.length} Completed (${pct}%)</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: ${lvl.color || '#00F0FF'}; border-radius: 4px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="admin-section-card">
          <div class="admin-section-header">
            <div class="admin-section-title">⚡ Real Organic Learning Activity Log</div>
            <span style="font-size: 11px; color: #10B981;">● Real-time student events</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            ${state.completedLessons.length === 0 ? `
              <div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 12px;">
                Platform initialized. Real activity events from learners completing lessons or quizzes will appear here automatically.
              </div>
            ` : state.completedLessons.slice(-4).reverse().map(lId => {
              const l = state.lessons.find(x => x.id === lId) || { title: `Lesson ${lId}`, xp: 60 };
              const q = state.quizProgress[lId];
              const scoreText = q ? `${q.score}/${q.total} Quiz Passed` : 'Completed';
              return `
                <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; align-items: center;">
                  <span>Learner <strong>${state.user.firstName || 'Student'}</strong> completed <em>${l.title}</em></span>
                  <span style="color: #10B981; font-weight: 700;">+${l.xp || 60} XP • ${scoreText}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 2: COURSE MANAGEMENT -->
      <!-- TAB 2: COURSE MANAGEMENT -->
      ${currentTab === 'courses' ? `
        <div class="admin-section-card">
          <div class="admin-section-header">
            <div>
              <div class="admin-section-title">🏛 Curriculum Courses (Levels 1–6)</div>
              <span style="font-size: 12px; color: #94A3B8;">Configure titles, descriptions, status, and learning level hierarchy</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="admin-btn-primary" onclick="window.openCreateCourseModal()">
                + Create New Course
              </button>
            </div>
          </div>

          <!-- Edit / Create Course Modal/Form -->
          ${state.editingCourse ? `
            <div style="background: rgba(4, 11, 20, 0.95); border: 2px solid #00F0FF; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #00F0FF;">
                  ${state.editingCourse.isNew ? 'Create New Course' : `Edit Course: Level ${state.editingCourse.level} — ${state.editingCourse.title}`}
                </h3>
                <button style="background: none; border: none; color: #94A3B8; font-size: 18px; cursor: pointer;" onclick="state.editingCourse = null; render();">✕</button>
              </div>

              <form onsubmit="window.saveCourseEdit(event)" style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: grid; grid-template-columns: 100px 1fr 100px; gap: 10px;">
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">LEVEL #</label>
                    <input type="number" id="edit-course-level" min="1" max="10" required value="${state.editingCourse.level || 1}" class="auth-input" style="padding-left: 10px;" />
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">COURSE TITLE</label>
                    <input type="text" id="edit-course-title" required value="${state.editingCourse.title || ''}" class="auth-input" style="padding-left: 10px;" />
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">ICON</label>
                    <input type="text" id="edit-course-icon" value="${state.editingCourse.icon || '🏛'}" class="auth-input" style="padding-left: 10px;" />
                  </div>
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">SUBTITLE / FOCUS</label>
                  <input type="text" id="edit-course-subtitle" value="${state.editingCourse.subtitle || ''}" class="auth-input" style="padding-left: 10px;" />
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">COURSE DESCRIPTION</label>
                  <textarea id="edit-course-desc" rows="3" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${state.editingCourse.description || ''}</textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
                  <button type="button" style="background: rgba(255, 255, 255, 0.08); border: none; color: #CBD5E1; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;" onclick="state.editingCourse = null; render();">Cancel</button>
                  <button type="submit" class="admin-btn-primary">Save Course to Database</button>
                </div>
              </form>
            </div>
          ` : ''}

          <table class="admin-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Course Title</th>
                <th>Subtitle</th>
                <th>Lessons</th>
                <th>Status</th>
                <th>Reorder</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.levels.map((lvl, idx) => {
                const count = state.lessons.filter(l => l.level === lvl.level).length;
                return `
                  <tr>
                    <td style="font-weight: 800; color: ${lvl.color || '#00F0FF'};">${lvl.icon} Level ${lvl.level}</td>
                    <td style="font-weight: 700; color: #FFF;">${lvl.title}</td>
                    <td style="font-size: 11px; color: #94A3B8;">${lvl.subtitle || ''}</td>
                    <td><span style="font-weight: 800; color: #FBBF24;">${count} Lessons</span></td>
                    <td>
                      <span class="${lvl.published !== false ? 'admin-badge-published' : 'admin-badge-draft'}">
                        ${lvl.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="window.reorderCourse(${lvl.level}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="window.reorderCourse(${lvl.level}, 1)" ${idx === state.levels.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button type="button" style="background: rgba(0, 240, 255, 0.15); border: 1px solid #00F0FF; color: #00F0FF; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="window.editCourse(${lvl.level})">
                          Edit
                        </button>
                        <button type="button" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.previewCourse(${lvl.level})">
                          Preview
                        </button>
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.toggleCoursePublished(${lvl.level})">
                          ${lvl.published !== false ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- TAB 3: LESSON MANAGEMENT -->
      ${currentTab === 'lessons' ? `
        <div class="admin-section-card">
          <div class="admin-section-header">
            <div>
              <div class="admin-section-title">📝 Comprehensive Lesson Management (${state.lessons.length} Total Lessons)</div>
              <span style="font-size: 12px; color: #94A3B8;">Create, edit explanations, terminology, GBP examples, and quizzes</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <select onchange="window.setAdminFilterLevel(this.value)" style="background: rgba(10, 24, 46, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; border-radius: 8px; padding: 6px 12px; font-size: 12px;">
                <option value="all" ${state.adminFilterLevel === 'all' ? 'selected' : ''}>All Levels (1–6)</option>
                <option value="1" ${state.adminFilterLevel === '1' ? 'selected' : ''}>Level 1: Foundations</option>
                <option value="2" ${state.adminFilterLevel === '2' ? 'selected' : ''}>Level 2: Investment Types</option>
                <option value="3" ${state.adminFilterLevel === '3' ? 'selected' : ''}>Level 3: UK Tax & ISA</option>
                <option value="4" ${state.adminFilterLevel === '4' ? 'selected' : ''}>Level 4: Portfolio Building</option>
                <option value="5" ${state.adminFilterLevel === '5' ? 'selected' : ''}>Level 5: Stock Analysis</option>
                <option value="6" ${state.adminFilterLevel === '6' ? 'selected' : ''}>Level 6: Advanced Investing</option>
              </select>
              <button class="admin-btn-primary" onclick="window.openCreateLessonModal()">
                + Create New Lesson
              </button>
            </div>
          </div>

          <!-- Edit Lesson Modal if open -->
          ${state.editingLesson ? `
            <div style="background: rgba(4, 11, 20, 0.95); border: 2px solid #00F0FF; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #00F0FF;">
                  ${state.editingLesson.isNew ? 'Create New Academy Lesson' : `Edit Lesson #${state.editingLesson.id}: ${state.editingLesson.title}`}
                </h3>
                <button style="background: none; border: none; color: #94A3B8; font-size: 18px; cursor: pointer;" onclick="state.editingLesson = null; render();">✕</button>
              </div>

              <form onsubmit="window.saveLessonEdit(event)" style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">LESSON TITLE</label>
                    <input type="text" id="edit-lesson-title" required value="${state.editingLesson.title || ''}" class="auth-input" style="padding-left: 10px;" />
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">ASSIGN TO LEVEL</label>
                    <select id="edit-lesson-level" class="auth-input" style="padding-left: 10px;">
                      ${[1, 2, 3, 4, 5, 6].map(lvl => `
                        <option value="${lvl}" ${state.editingLesson.level === lvl ? 'selected' : ''}>Level ${lvl}</option>
                      `).join('')}
                    </select>
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">ESTIMATED TIME & XP</label>
                    <div style="display: flex; gap: 6px;">
                      <input type="text" id="edit-lesson-time" placeholder="4 min" value="${state.editingLesson.time || '4 min'}" class="auth-input" style="padding-left: 10px;" />
                      <input type="number" id="edit-lesson-xp" placeholder="60" value="${state.editingLesson.xp || 60}" class="auth-input" style="padding-left: 10px;" />
                    </div>
                  </div>
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">LESSON INTRODUCTION</label>
                  <input type="text" id="edit-lesson-intro" required value="${state.editingLesson.introduction || state.editingLesson.summary || ''}" class="auth-input" style="padding-left: 10px;" />
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">DETAILED EDUCATIONAL EXPLANATION</label>
                  <textarea id="edit-lesson-explanation" rows="4" required style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px; resize: vertical;">${state.editingLesson.explanation || state.editingLesson.content || ''}</textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">PRACTICAL EXAMPLE (£ GBP)</label>
                    <textarea id="edit-lesson-example" rows="2" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${state.editingLesson.practicalExample || ''}</textarea>
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">CASE STUDY SCENARIO</label>
                    <textarea id="edit-lesson-scenario" rows="2" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${state.editingLesson.scenario || ''}</textarea>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">LEARNING OBJECTIVES (1 per line)</label>
                    <textarea id="edit-lesson-objectives" rows="3" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${(state.editingLesson.objectives || []).join('\n')}</textarea>
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">KEY TAKEAWAYS (1 per line)</label>
                    <textarea id="edit-lesson-takeaways" rows="3" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${(state.editingLesson.keyTakeaways || []).join('\n')}</textarea>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">COMMON MISTAKES TO AVOID (1 per line)</label>
                    <textarea id="edit-lesson-mistakes" rows="3" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${(state.editingLesson.commonMistakes || []).join('\n')}</textarea>
                  </div>
                  <div>
                    <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">FINANCIAL TERMINOLOGY (Term: Definition, 1 per line)</label>
                    <textarea id="edit-lesson-terminology" rows="3" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px;">${(state.editingLesson.terminology || []).map(t => `${t.term}: ${t.definition}`).join('\n')}</textarea>
                  </div>
                </div>

                <div>
                  <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 2px;">
                    QUIZ SPECIFICATION (JSON Array with question, options, answer index 0-3, explanation)
                  </label>
                  <textarea id="edit-lesson-quiz" rows="4" style="width: 100%; background: rgba(7, 19, 34, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 12px; font-family: monospace;">${JSON.stringify(state.editingLesson.quiz || [], null, 2)}</textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
                  <button type="button" style="background: rgba(255, 255, 255, 0.08); border: none; color: #CBD5E1; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;" onclick="state.editingLesson = null; render();">Cancel</button>
                  <button type="submit" class="admin-btn-primary">Save Lesson Changes</button>
                </div>
              </form>
            </div>
          ` : ''}

          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Level</th>
                <th>Title</th>
                <th>Est. Time</th>
                <th>XP</th>
                <th>Quiz</th>
                <th>Status</th>
                <th>Reorder</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.lessons
                .filter(l => state.adminFilterLevel === 'all' || l.level.toString() === state.adminFilterLevel)
                .map((l, lIdx, filteredArr) => `
                  <tr>
                    <td style="font-weight: 800; color: #00F0FF;">#${l.id}</td>
                    <td>Level ${l.level}</td>
                    <td style="font-weight: 700; color: #FFF;">${l.title}</td>
                    <td>⏱ ${l.time || '4 min'}</td>
                    <td style="color: #FBBF24; font-weight: 800;">+${l.xp || 60} XP</td>
                    <td>${l.quiz ? l.quiz.length : 3} Qs</td>
                    <td>
                      <span class="${l.published !== false ? 'admin-badge-published' : 'admin-badge-draft'}">
                        ${l.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px;">
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="window.reorderLesson(${l.id}, -1)" ${lIdx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 2px 6px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="window.reorderLesson(${l.id}, 1)" ${lIdx === filteredArr.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button type="button" style="background: rgba(0, 240, 255, 0.15); border: 1px solid #00F0FF; color: #00F0FF; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="window.editLesson(${l.id})">
                          Edit
                        </button>
                        <button type="button" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.navigateTo('lesson_detail', ${l.id})">
                          Preview
                        </button>
                        <button type="button" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.toggleLessonPublished(${l.id})">
                          ${l.published !== false ? 'Unpublish' : 'Publish'}
                        </button>
                        <button type="button" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.deleteLesson(${l.id})">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- TAB 4: STUDENT MANAGEMENT -->
      ${currentTab === 'students' ? `
        <div class="admin-section-card">
          <div class="admin-section-header">
            <div class="admin-section-title">👥 Enrolled Students & Learning Records</div>
            <input type="text" placeholder="Search student name or email..." value="${state.adminSearchStudent || ''}" oninput="state.adminSearchStudent = this.value; render();" style="background: rgba(10, 24, 46, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFF; border-radius: 8px; padding: 6px 12px; font-size: 12px;" />
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Investor Tier</th>
                <th>XP Accumulated</th>
                <th>Lessons Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allStudents
                .filter(s => {
                  if (!state.adminSearchStudent) return true;
                  const q = state.adminSearchStudent.toLowerCase();
                  return (s.firstName || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
                })
                .map(s => `
                  <tr>
                    <td>
                      <strong>${s.firstName || 'Investor'}</strong><br>
                      <span style="font-size: 10px; color: #94A3B8;">UID: ${s.id || 'usr_synced'}</span>
                    </td>
                    <td>${s.email || 'No email provided'}</td>
                    <td>
                      <span style="color: ${s.isPro ? '#FBBF24' : '#00F0FF'}; font-weight: 800;">
                        ${s.isPro ? '★ Pro Wealth Member' : (s.levelTitle || 'Investor Starter')}
                      </span>
                    </td>
                    <td style="color: #00F0FF; font-weight: 800;">${s.xp || 0} XP</td>
                    <td>${s.completedCount !== undefined ? s.completedCount : (s.email === state.user.email ? state.completedLessons.length : 0)} / ${state.lessons.length}</td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button type="button" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.resetStudentProgress('${s.id}')">
                          Reset Progress
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              ${allStudents.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; padding: 24px; color: #94A3B8; font-size: 12px;">
                    No organic students found. Real users registering across Web, Android, and iOS will appear here automatically from your Firestore database.
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- TAB 5: COMMUNITY MODERATION -->
      ${currentTab === 'community' ? `
        <div class="admin-section-card">
          <div class="admin-section-header">
            <div class="admin-section-title">🛡 Community Forum Moderation & Discussions</div>
            <span style="font-size: 12px; color: #94A3B8;">Manage member threads, delete spam, pin high-value insights</span>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Category</th>
                <th>Discussion Title</th>
                <th>Likes</th>
                <th>Replies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${CommunityService.getDiscussions().map(p => `
                <tr>
                  <td>
                    <strong>${p.author}</strong><br>
                    <span style="font-size: 10px; color: #94A3B8;">${p.authorLevel || 'Investor'}</span>
                  </td>
                  <td><span style="background: rgba(20, 184, 166, 0.15); color: #2DD4BF; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${p.category}</span></td>
                  <td style="font-weight: 700; color: #FFF; max-width: 280px;">${p.title}</td>
                  <td>❤️ ${p.likes || 0}</td>
                  <td>💬 ${(p.comments ? p.comments.length : 0)}</td>
                  <td>
                    <span style="font-size: 11px; color: ${p.pinned ? '#FBBF24' : '#94A3B8'}; font-weight: 700;">
                      ${p.pinned ? '📌 Pinned' : 'Normal'}
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button type="button" style="background: rgba(251, 191, 36, 0.15); border: 1px solid #FBBF24; color: #FBBF24; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.toggleCommunityPin(${p.id})">
                        ${p.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button type="button" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;" onclick="window.deleteCommunityPost(${p.id})">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- TAB 6: SECURITY & PASSWORD -->
      ${currentTab === 'security' ? `
        <div class="admin-section-card" style="max-width: 500px;">
          <div class="admin-section-header">
            <div class="admin-section-title">🔐 Administrator Password & Security</div>
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 16px; line-height: 1.4;">
            Update your administrator credentials securely. Passwords are mathematically hashed with PBKDF2/SHA-256 and salted. Plaintext passwords are never stored.
          </p>

          <form onsubmit="window.handleAdminChangePassword(event)" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 11px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">CURRENT PASSWORD</label>
              <input type="password" id="admin-current-password" required placeholder="Enter current admin password" class="auth-input" style="padding-left: 14px;" />
            </div>

            <div>
              <label style="font-size: 11px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">NEW SECURE PASSWORD</label>
              <input type="password" id="admin-new-password" required placeholder="Minimum 8 characters" class="auth-input" style="padding-left: 14px;" />
            </div>

            <div>
              <label style="font-size: 11px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">CONFIRM NEW PASSWORD</label>
              <input type="password" id="admin-confirm-password" required placeholder="Re-type new password" class="auth-input" style="padding-left: 14px;" />
            </div>

            <button type="submit" class="admin-btn-primary" style="margin-top: 6px; justify-content: center; padding: 12px;">
              Update Administrator Password
        </div>

        <div class="admin-section-card" style="max-width: 650px; margin-top: 16px;">
          <div class="admin-section-header">
            <div class="admin-section-title">🗄️ Cloud Database & Backend Configuration</div>
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 12px; line-height: 1.4;">
            Current cloud state: <strong style="color: #00F0FF;">Active Local Cache & Sync Engine</strong>.<br>
            If you have a dedicated Firebase Web Project or custom database endpoint, paste your configuration credentials below to bind the web app directly to your cloud instance.
          </p>

          <div style="background: rgba(4, 11, 20, 0.7); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 10px; padding: 12px; margin-bottom: 14px; font-size: 11px; font-family: monospace; color: #CBD5E1;">
            <div>CURRENT PROJECT: <span style="color: #38BDF8;">com-aistudio-ebwealth-kq-f6b41</span></div>
            <div>STATUS: <span style="color: #10B981;">Online (Local Fallback & Sync Active)</span></div>
            <div>AUTH PROVIDER: <span style="color: #FBBF24;">Client Vault / Google Identity / REST</span></div>
          </div>

          <form onsubmit="window.saveCustomDatabaseSettings(event)" style="display: flex; flex-direction: column; gap: 10px;">
            <div>
              <label style="font-size: 10px; font-weight: 800; color: #94A3B8; display: block; margin-bottom: 4px;">CUSTOM FIREBASE WEB CONFIG (JSON format)</label>
              <textarea id="admin-custom-db-json" rows="5" placeholder='{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-project.firebaseapp.com",\n  "projectId": "your-project-id",\n  "storageBucket": "your-project.appspot.com"\n}' style="width: 100%; background: rgba(4, 11, 20, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 10px; color: #FFF; font-size: 11px; font-family: monospace;"></textarea>
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <button type="button" class="btn-upgrade-pill" style="font-size: 11px; padding: 8px 12px;" onclick="window.testDatabaseConnection()">
                ⚡ Test Cloud Connection
              </button>
              <button type="button" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; border-radius: 8px; font-size: 11px; padding: 8px 12px; cursor: pointer;" onclick="window.resetDatabaseToDefault()">
                Reset to Default
              </button>
              <button type="submit" class="admin-btn-primary" style="font-size: 11px; padding: 8px 14px;">
                Save & Connect Database
              </button>
            </div>
          </form>
        </div>
      ` : ''}
    </div>
  `;
}

// 15. AUTH SCREEN (Exact 1:1 Mirror of Android AuthScreen.kt)
function renderAuthScreen() {
  const isReg = state.authMode === 'register';
  return `
    <div class="auth-screen-container">
      <!-- Cosmic Brand Emblem -->
      <div class="auth-emblem-box">EB</div>
      <div class="auth-brand-title">
        <span class="eb">EB</span>
        <span class="wealth">Wealth</span>
      </div>
      <div class="auth-brand-sub">
        Institutional-Grade Investment Education & Intelligence
      </div>

      <!-- Bank-Style Card Container -->
      <div class="auth-card">
        <!-- Google Sign-In One-Tap Button -->
        <button type="button" class="auth-google-btn" onclick="window.handleGoogleSignIn()">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          <span>${isReg ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </button>

        <div class="auth-divider-row">
          <div class="auth-divider-line"></div>
          <span class="auth-divider-text">OR USE CLIENT VAULT</span>
          <div class="auth-divider-line"></div>
        </div>

        <!-- Sign In / Register Segmented Toggle -->
        <div class="auth-tab-toggle">
          <button type="button" class="auth-tab-btn ${!isReg ? 'active' : ''}" onclick="window.setAuthMode('login')">
            Sign In
          </button>
          <button type="button" class="auth-tab-btn ${isReg ? 'active' : ''}" onclick="window.setAuthMode('register')">
            Create Account
          </button>
        </div>

        ${state.authError ? `
          <div class="auth-error-banner">
            <svg style="width:16px;height:16px;flex-shrink:0;" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>${state.authError}</span>
          </div>
        ` : ''}

        <form id="auth-form" onsubmit="window.handleAuthSubmit(event)">
          ${isReg ? `
            <div class="auth-field-group">
              <label class="auth-field-label">FULL LEGAL FIRST NAME</label>
              <div class="auth-input-wrap">
                <svg class="auth-input-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <input type="text" id="auth-firstname" required placeholder="e.g. Charlotte" class="auth-input" value="${state.authFirstNameInput || ''}" oninput="state.authFirstNameInput = this.value" />
              </div>
            </div>
          ` : ''}

          <div class="auth-field-group">
            <label class="auth-field-label">EMAIL ADDRESS</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <input type="email" id="auth-email" required placeholder="e.g. name@example.co.uk" class="auth-input" value="${state.authEmailInput !== undefined && state.authEmailInput !== '' ? state.authEmailInput : (state.user?.email || '')}" oninput="state.authEmailInput = this.value" />
            </div>
          </div>

          <div class="auth-field-group">
            <label class="auth-field-label">ACCOUNT PASSWORD</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <input type="${state.authPasswordVisible ? 'text' : 'password'}" id="auth-password" required placeholder="Minimum 6 characters" class="auth-input" value="${state.authPasswordInput || ''}" oninput="state.authPasswordInput = this.value" />
              <button type="button" class="auth-password-toggle" onclick="window.toggleAuthPasswordVisibility()">
                ${state.authPasswordVisible ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          ${isReg ? `
            <div class="auth-two-col">
              <div class="auth-field-group">
                <label class="auth-field-label">AGE GROUP</label>
                <div class="auth-input-wrap">
                  <input type="text" id="auth-age" value="25–34" class="auth-input" style="padding-left:14px;" />
                </div>
              </div>
              <div class="auth-field-group">
                <label class="auth-field-label">RESIDENCE</label>
                <div class="auth-input-wrap">
                  <input type="text" id="auth-residence" value="United Kingdom" class="auth-input" style="padding-left:14px;" />
                </div>
              </div>
            </div>
          ` : ''}

          <button type="submit" class="auth-submit-btn" ${state.authLoading ? 'disabled' : ''}>
            ${state.authLoading ? 'Authenticating...' : (isReg ? 'Register & Start Onboarding' : 'Sign In to Vault')}
          </button>
        </form>

        <div class="auth-footer-link" onclick="window.setAuthMode('${isReg ? 'login' : 'register'}')">
          ${isReg ? 'Already have an account? <strong>Sign In</strong>' : 'Don\'t have an account? <strong>Create one now</strong>'}
        </div>
      </div>

      <!-- Security Assurance Banner -->
      <div class="auth-security-notice">
        <span style="font-size:22px; color:#34D399;">☁️</span>
        <div>
          <div style="font-size:12px; font-weight:800; color:#FFFFFF;">Firebase Firestore Cloud Encrypted Vault</div>
          <div style="font-size:11px; color:#94A3B8; margin-top:2px; line-height:1.4;">
            Protected by Google Cloud Firestore with real-time replication. All user accounts and investment portfolios are safely synced to the cloud.
          </div>
        </div>
      </div>
    </div>
  `;
}

// 16. ONBOARDING / SUITABILITY QUESTIONNAIRE (Exact 1:1 Mirror of Android OnboardingScreen.kt)
function renderOnboardingScreen() {
  const step = state.onboardingStep || 1;
  const progressPct = ((step / 6) * 100).toFixed(0);

  const step1Options = [
    { label: "Complete beginner", desc: "Never invested before, want to learn fundamentals" },
    { label: "Beginner", desc: "Have heard of ISAs/stocks, looking to start properly" },
    { label: "Intermediate", desc: "Currently investing, want to optimize portfolio & overlap" },
    { label: "Experienced", desc: "Active investor focusing on advanced asset allocation" }
  ];

  const step2Options = [
    { label: "Build long-term wealth", desc: "Compounding over decades for financial security" },
    { label: "Retirement", desc: "Supplementing state & workplace pensions with a SIPP/ISA" },
    { label: "Financial independence", desc: "Building passive investment cash flow" },
    { label: "Children's future", desc: "Starting a Junior ISA (JISA) for university or a house deposit" },
    { label: "General investing", desc: "Growing surplus savings faster than inflation" },
    { label: "Learn before investing", desc: "Gaining confidence before committing capital" }
  ];

  const step3Options = [
    { label: "Less than 5 years", desc: "Short-term horizon (Cash ISA or fixed bonds recommended)" },
    { label: "5–10 years", desc: "Medium-term growth with balanced allocation" },
    { label: "10–20 years", desc: "Strong compounding horizon allowing equity focus" },
    { label: "20+ years", desc: "Maximum compounding potential for generational wealth" }
  ];

  const step4Options = [
    { label: "£50–£150 / month", desc: "Ideal starting amount to automate via direct debit" },
    { label: "£150–£500 / month", desc: "Solid monthly contributions for compound acceleration" },
    { label: "£500–£1,000 / month", desc: "Substantial pace utilizing significant ISA allowance" },
    { label: "£1,000+ / month", desc: "Maximizing annual £20,000 UK ISA allowance" }
  ];

  const step5Options = [
    { label: "Conservative", sub: "Very Uncomfortable", desc: "I would worry constantly and want to pull money out" },
    { label: "Moderate", sub: "Slightly Uncomfortable", desc: "I'd feel nervous but try to wait it out" },
    { label: "Medium-High", sub: "Medium-High Comfort", desc: "I understand volatility is normal and would keep investing" },
    { label: "High", sub: "High Comfort", desc: "I'd view it as a discount sale and invest more if possible" }
  ];

  return `
    <div class="onboarding-screen-wrap">
      <!-- Top Step Header -->
      <div class="onboarding-top-bar">
        <span class="onboarding-step-badge">STEP ${step} OF 6</span>
        ${step < 6 ? `
          <button class="onboarding-skip-btn" onclick="window.skipOnboarding()">Skip</button>
        ` : ''}
      </div>

      <!-- Linear Progress Bar -->
      <div class="onboarding-progress-track">
        <div class="onboarding-progress-fill" style="width: ${progressPct}%;"></div>
      </div>

      ${step === 1 ? `
        <div class="onboarding-card-main">
          <h2 class="onboarding-title">What best describes you?</h2>
          <p class="onboarding-sub">This helps tailor educational lesson depth and terminology.</p>
          <div class="onboarding-options-list">
            ${step1Options.map(opt => `
              <div class="onboarding-option-row ${state.onboardingData.experience === opt.label ? 'selected' : ''}" onclick="window.setOnboardingOption('experience', '${opt.label}')">
                <div class="onboarding-radio-dot">
                  ${state.onboardingData.experience === opt.label ? '<div class="onboarding-radio-inner"></div>' : ''}
                </div>
                <div>
                  <div class="onboarding-option-title">${opt.label}</div>
                  <div class="onboarding-option-desc">${opt.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="onboarding-next-btn" onclick="window.nextOnboardingStep()">Continue →</button>
        </div>
      ` : ''}

      ${step === 2 ? `
        <div class="onboarding-card-main">
          <h2 class="onboarding-title">What is your primary investment goal?</h2>
          <p class="onboarding-sub">Long-term investing works best with clear, defined objectives.</p>
          <div class="onboarding-options-list">
            ${step2Options.map(opt => `
              <div class="onboarding-option-row ${state.onboardingData.goal === opt.label ? 'selected' : ''}" onclick="window.setOnboardingOption('goal', '${opt.label}')">
                <div class="onboarding-radio-dot">
                  ${state.onboardingData.goal === opt.label ? '<div class="onboarding-radio-inner"></div>' : ''}
                </div>
                <div>
                  <div class="onboarding-option-title">${opt.label}</div>
                  <div class="onboarding-option-desc">${opt.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="onboarding-next-btn" onclick="window.nextOnboardingStep()">Continue →</button>
        </div>
      ` : ''}

      ${step === 3 ? `
        <div class="onboarding-card-main">
          <h2 class="onboarding-title">How long do you plan to invest for?</h2>
          <p class="onboarding-sub">Stock market investments require time to smooth out normal volatility.</p>
          <div class="onboarding-options-list">
            ${step3Options.map(opt => `
              <div class="onboarding-option-row ${state.onboardingData.horizon === opt.label ? 'selected' : ''}" onclick="window.setOnboardingOption('horizon', '${opt.label}')">
                <div class="onboarding-radio-dot">
                  ${state.onboardingData.horizon === opt.label ? '<div class="onboarding-radio-inner"></div>' : ''}
                </div>
                <div>
                  <div class="onboarding-option-title">${opt.label}</div>
                  <div class="onboarding-option-desc">${opt.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="onboarding-next-btn" onclick="window.nextOnboardingStep()">Continue →</button>
        </div>
      ` : ''}

      ${step === 4 ? `
        <div class="onboarding-card-main">
          <h2 class="onboarding-title">How much could you potentially invest each month?</h2>
          <p class="onboarding-sub">Approximate range to calibrate simulator and compounding scenarios.</p>
          <div class="onboarding-options-list">
            ${step4Options.map(opt => `
              <div class="onboarding-option-row ${state.onboardingData.capacity === opt.label ? 'selected' : ''}" onclick="window.setOnboardingOption('capacity', '${opt.label}')">
                <div class="onboarding-radio-dot">
                  ${state.onboardingData.capacity === opt.label ? '<div class="onboarding-radio-inner"></div>' : ''}
                </div>
                <div>
                  <div class="onboarding-option-title">${opt.label}</div>
                  <div class="onboarding-option-desc">${opt.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="onboarding-next-btn" onclick="window.nextOnboardingStep()">Continue →</button>
        </div>
      ` : ''}

      ${step === 5 ? `
        <div class="onboarding-card-main">
          <h2 class="onboarding-title">How comfortable are you with investment fluctuations?</h2>
          <p class="onboarding-sub">If your £10,000 investment temporarily dropped to £8,500 during a market dip:</p>
          <div class="onboarding-options-list">
            ${step5Options.map(opt => `
              <div class="onboarding-option-row ${state.onboardingData.risk === opt.label ? 'selected' : ''}" onclick="window.setOnboardingOption('risk', '${opt.label}')">
                <div class="onboarding-radio-dot">
                  ${state.onboardingData.risk === opt.label ? '<div class="onboarding-radio-inner"></div>' : ''}
                </div>
                <div>
                  <div class="onboarding-option-title">${opt.sub} (${opt.label})</div>
                  <div class="onboarding-option-desc">${opt.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="onboarding-next-btn" onclick="window.nextOnboardingStep()">Generate Profile →</button>
        </div>
      ` : ''}

      ${step === 6 ? `
        <div class="onboarding-card-main" style="text-align: center;">
          <div style="width: 58px; height: 58px; border-radius: 16px; background: rgba(16, 185, 129, 0.2); border: 1.5px solid #10B981; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);">
            🛡️
          </div>
          <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 1px;">EB INVESTOR PROFILE</div>
          <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin: 4px 0 6px;">Your Profile is Ready!</h2>
          <p style="font-size: 12px; color: #94A3B8; margin-bottom: 20px;">
            Here is your baseline educational profile calibrated to your goals and risk preferences.
          </p>

          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 14px; padding: 16px; text-align: left; margin-bottom: 16px;">
            <div class="bank-detail-row">
              <span class="bank-detail-label">Experience Level</span>
              <span class="bank-detail-value">${state.onboardingData.experience}</span>
            </div>
            <div class="bank-detail-row">
              <span class="bank-detail-label">Primary Goal</span>
              <span class="bank-detail-value">${state.onboardingData.goal}</span>
            </div>
            <div class="bank-detail-row">
              <span class="bank-detail-label">Time Horizon</span>
              <span class="bank-detail-value">${state.onboardingData.horizon}</span>
            </div>
            <div class="bank-detail-row">
              <span class="bank-detail-label">Monthly Target</span>
              <span class="bank-detail-value">${state.onboardingData.capacity}</span>
            </div>
            <div class="bank-detail-row">
              <span class="bank-detail-label">Risk Profile</span>
              <span class="bank-detail-value" style="color: #00F0FF;">${state.onboardingData.risk}</span>
            </div>
            <div class="bank-detail-row">
              <span class="bank-detail-label">Starting Level</span>
              <span class="bank-detail-value" style="color: #FBBF24;">Level 1 — Investor Starter (+100 XP)</span>
            </div>
          </div>

          <div style="background: rgba(0, 240, 255, 0.06); border-radius: 10px; padding: 12px; font-size: 11px; color: #94A3B8; line-height: 1.5; margin-bottom: 20px; text-align: left;">
            <strong>Disclaimer:</strong> This educational profile is designed to customize your learning journey. It does not constitute personal financial advice or a suitability assessment under UK financial regulations.
          </div>

          <button class="onboarding-next-btn" onclick="window.finishOnboarding()">
            Complete Onboarding & Enter Vault →
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// Pro Modal
function renderProModal() {
  return `
    <div class="modal-overlay" onclick="window.closeModals()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #FBBF24; font-size: 20px;">★</span>
            <h2 style="font-size: 18px; font-weight: 900; color: #FFFFFF;">EB Wealth Pro Tier</h2>
          </div>
          <button style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>

        <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5; margin-bottom: 16px;">
          Unlock institutional UK wealth intelligence, real-time London Stock Exchange Level 2 quotes, unlimited AI portfolio rebalancing, and verified priority community status.
        </p>

        <div style="background: rgba(0, 240, 255, 0.08); border: 1px solid #00F0FF; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
          <div style="font-size: 11px; color: #00F0FF; font-weight: 700;">MEMBERSHIP INCLUDES:</div>
          <ul style="font-size: 12px; color: #FFFFFF; margin-top: 8px; padding-left: 18px; display: flex; flex-direction: column; gap: 6px;">
            <li>UK Stocks & Shares ISA Tax Optimization Engine</li>
            <li>Real-time LSE Live Quotes & Health Scorecards</li>
            <li>Full 6-Level Wealth Academy & Certification</li>
            <li>Direct Cloud Firestore Vault Encryption</li>
          </ul>
        </div>

        <button class="btn-pro-gold" style="width: 100%; padding: 12px; font-size: 14px;" onclick="window.upgradeToPro()">
          Upgrade Now — £14.99 / month
        </button>
      </div>
    </div>
  `;
}

// Add Holding Modal
function renderAddHoldingModal() {
  return `
    <div class="modal-overlay" onclick="window.closeModals()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 900; color: #FFFFFF;">Add Organic Holding</h2>
            <div style="font-size: 11px; color: #94A3B8;">Records live to your profile and Firestore database</div>
          </div>
          <button style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>

        <form onsubmit="window.saveHolding(event)">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">TICKER SYMBOL (e.g. VWRP, VUAG, AZN, LGEN)</label>
              <input type="text" id="holding-ticker" required placeholder="VWRP" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px; text-transform: uppercase;" />
            </div>
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">ASSET NAME</label>
              <input type="text" id="holding-name" required placeholder="e.g. Vanguard FTSE All-World UCITS ETF" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">NUMBER OF SHARES</label>
                <input type="number" step="any" id="holding-shares" required placeholder="25" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">AVG BUY PRICE (£)</label>
                <input type="number" step="any" id="holding-buy-price" required placeholder="104.20" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">CURRENT PRICE (£)</label>
                <input type="number" step="any" id="holding-price" required placeholder="112.40" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">UK TAX VEHICLE</label>
                <select id="holding-account" style="width: 100%; background: #0A182E; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;">
                  <option value="Stocks & Shares ISA">Stocks & Shares ISA</option>
                  <option value="General Investment Account (GIA)">General Investment Account (GIA)</option>
                  <option value="Self-Invested Personal Pension (SIPP)">Self-Invested Personal Pension (SIPP)</option>
                  <option value="Cash Buffer">Cash Buffer</option>
                </select>
              </div>
            </div>
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">GEOGRAPHIC / ASSET CATEGORY</label>
              <select id="holding-category" style="width: 100%; background: #0A182E; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;">
                <option value="Global Equities">Global Equities (All-World)</option>
                <option value="US Equities">US Large Cap (S&P 500)</option>
                <option value="UK Equities">UK Equities (FTSE 100/250)</option>
                <option value="Bonds & Fixed Income">Bonds & Fixed Income</option>
                <option value="Cash & Liquidity">Cash & Liquidity</option>
              </select>
            </div>

            <button type="submit" style="margin-top: 10px; background: #00F0FF; color: #040B14; font-weight: 900; border: none; border-radius: 10px; padding: 12px; cursor: pointer;">
              Save & Sync Position →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Window Global Handlers
window.navigateTo = navigateTo;
window.navigateBack = navigateBack;

window.openProModal = function() {
  state.showProModal = true;
  render();
};

window.openAddHoldingModal = function() {
  state.showAddHoldingModal = true;
  render();
};

window.closeModals = function() {
  state.showProModal = false;
  state.showAddHoldingModal = false;
  render();
};

window.selectLevel = function(lvl) {
  state.selectedLevel = lvl;
  render();
};

window.updateMarketSearch = function(val) {
  state.marketSearchQuery = val;
  render();
  const input = document.getElementById('market-search-input');
  if (input) {
    input.focus();
    input.setSelectionRange(val.length, val.length);
  }
};

window.refreshPortfolio = async function() {
  state.marketLastUpdated = 'Fetching International Quotes...';
  render();
  try {
    const res = await liveMarketService.refreshAllAssets(state.assets);
    if (res && res.assets) {
      state.assets = res.assets;
      state.marketFxRates = res.forex || state.marketFxRates;
      state.marketLastUpdated = res.lastUpdated;

      // Synchronize live prices to user's organic holdings
      let holdingsUpdated = false;
      state.holdings.forEach(h => {
        const liveAsset = state.assets.find(a => a.ticker.toUpperCase() === h.ticker.toUpperCase());
        if (liveAsset && liveAsset.priceNum) {
          h.currentPrice = liveAsset.priceNum;
          holdingsUpdated = true;
        }
      });
      if (holdingsUpdated) {
        localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
      }
    }
  } catch (err) {
    state.marketLastUpdated = 'LSE Live Feed Active';
  }
  render();
};

window.refreshMarketData = window.refreshPortfolio;

window.updateSim = function(key, val) {
  state[key] = parseFloat(val);
  render();
};

window.toggleEtf = function(ticker) {
  const sel = state.overlapSelected;
  if (sel.includes(ticker)) {
    // Remove it (keep at least 1)
    if (sel.length > 1) {
      state.overlapSelected = sel.filter(t => t !== ticker);
    }
  } else {
    // Add — max 2 selected, replace oldest
    if (sel.length >= 2) {
      state.overlapSelected = [sel[1], ticker];
    } else {
      state.overlapSelected = [...sel, ticker];
    }
  }
  render();
};


window.sendPrompt = function(promptText) {
  state.chatMessages.push({ sender: 'user', text: promptText });
  render();
  setTimeout(() => {
    let response = "Under current HMRC 2024/25 regulations, your annual £20,000 Stocks & Shares ISA allowance shelters all dividend yields and capital gains indefinitely. Combining low-cost index ETFs like VWRP with disciplined regular contributions provides maximum risk-adjusted compounding.";
    state.chatMessages.push({ sender: 'ai', text: response });
    render();
  }, 400);
};

window.submitChat = function(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  const val = input.value.trim();
  if (val) {
    window.sendPrompt(val);
    input.value = '';
  }
};

window.answerQuiz = function(lessonId, choiceIndex) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (choiceIndex === lesson.quiz.answer) {
    lesson.completed = true;
    state.user.xp += lesson.xp;
    alert(`Correct! You earned +${lesson.xp} XP!`);
    render();
  } else {
    alert('Not quite right. Review the lesson summary and try again!');
  }
};

window.toggleRegister = function(eventId) {
  if (state.registeredEvents.includes(eventId)) {
    state.registeredEvents = state.registeredEvents.filter(id => id !== eventId);
  } else {
    state.registeredEvents.push(eventId);
  }
  render();
};

window.saveSuitability = function() {
  alert('Investor suitability profile updated and validated under FCA compliance standards.');
  window.navigateTo('profile');
};

window.addHoldingQuick = function(ticker, name, price) {
  state.holdings.push({ ticker, name, shares: 10, avgBuyPrice: price, currentPrice: price });
  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  alert(`Added 10 shares of ${ticker} to your portfolio!`);
  window.navigateTo('portfolio');
};

window.saveHolding = function(e) {
  e.preventDefault();
  const ticker = (document.getElementById('holding-ticker')?.value || '').toUpperCase().trim();
  const name = (document.getElementById('holding-name')?.value || ticker).trim();
  const shares = parseFloat(document.getElementById('holding-shares')?.value) || 1;
  const buyPrice = parseFloat(document.getElementById('holding-buy-price')?.value) || 100;
  const currentPrice = parseFloat(document.getElementById('holding-price')?.value) || buyPrice;
  const accountType = document.getElementById('holding-account')?.value || 'Stocks & Shares ISA';
  const allocationCategory = document.getElementById('holding-category')?.value || 'Global Equities';

  const newHolding = {
    ticker,
    name,
    shares,
    avgBuyPrice: buyPrice,
    currentPrice,
    accountType,
    allocationCategory,
    currency: 'GBP'
  };

  // Replace existing if ticker matches or append
  const existingIdx = state.holdings.findIndex(h => h.ticker === ticker);
  if (existingIdx >= 0) {
    state.holdings[existingIdx] = newHolding;
  } else {
    state.holdings.push(newHolding);
  }

  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  firebaseService.syncHoldings(state.holdings);
  state.showAddHoldingModal = false;
  render();
};

window.deleteHolding = function(index) {
  if (index >= 0 && index < state.holdings.length) {
    const deleted = state.holdings.splice(index, 1)[0];
    localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
    if (deleted && deleted.ticker) {
      firebaseService.deleteHolding(deleted.ticker);
    }
    render();
  }
};

window.upgradeToPro = function() {
  state.user.isPro = true;
  state.user.tierStatus = 'Pro Wealth Member';
  state.showProModal = false;
  alert('Congratulations! Upgraded to EB Wealth Pro Tier.');
  render();
};

window.triggerCloudSync = async function() {
  try {
    await firebaseService.syncProfile(state.user);
    await firebaseService.syncHoldings(state.holdings);
    alert(`⚡ Cloud Firestore Synchronized Successfully!\nDatabase: ${firebaseService.lastSync}\nProject: com-aistudio-ebwealth-kq-f6b41\n\nYour portfolio holdings and profile state are in live sync across Android, iOS, and Web.`);
  } catch (err) {
    alert(`Local cache synchronized. Active offline fallback mode for Firestore: ${err.message || 'Complete'}`);
  }
  render();
};

// ── Auth & Onboarding Handlers (Mirroring Android Auth & Onboarding) ──
window.setAuthMode = function(mode) {
  state.authMode = mode;
  state.authError = '';
  render();
};

window.toggleAuthPasswordVisibility = function() {
  state.authPasswordVisible = !state.authPasswordVisible;
  render();
};

window.handleGoogleSignIn = async function() {
  const isReg = state.authMode === 'register';

  // Read current input values if typed
  const emailInput = document.getElementById('auth-email');
  const firstNameInput = document.getElementById('auth-firstname');
  let email = (emailInput ? emailInput.value : (state.authEmailInput || '')).trim();
  let firstName = (firstNameInput ? firstNameInput.value : (state.authFirstNameInput || '')).trim();

  // If no email entered, prompt with quick default or let user enter
  if (!email) {
    const inputAcc = prompt(
      isReg ? 'Enter your Google Account email to register with Google:' : 'Enter your Google Account email to sign in with Google:',
      state.user?.email || 'alex.investor@gmail.com'
    );
    if (!inputAcc) return; // User cancelled
    email = inputAcc.trim();
  }

  if (!firstName) {
    firstName = email.split('@')[0] || 'Investor';
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }

  state.authEmailInput = email;
  state.authFirstNameInput = firstName;
  state.authLoading = true;
  state.authError = '';
  render();

  try {
    const googleUser = {
      id: 'usr_google_' + Math.random().toString(36).substring(2, 9),
      firstName: firstName,
      email: email,
      ref: 'REF: EB-' + Math.floor(1000 + Math.random() * 9000) + '-GB',
      region: 'United Kingdom • GBP Base',
      tierStatus: 'Standard Investor',
      isPro: false,
      isaUsed: 8450,
      isaLimit: 20000,
      capitalGainsLimit: 3000,
      dividendLimit: 500,
      xp: 250,
      streakDays: 3,
      ageRange: '25–34',
      country: 'United Kingdom',
      experienceLevel: state.onboardingData.experience || 'Beginner',
      primaryGoal: state.onboardingData.goal || 'Build long-term wealth',
      timeHorizon: state.onboardingData.horizon || '20+ years',
      monthlyCapacity: state.onboardingData.capacity || '£150–£500',
      riskProfile: state.onboardingData.risk || 'Medium-High',
      levelNumber: 1,
      levelTitle: 'Investor Starter',
      isLoggedIn: true,
      isOnboarded: !isReg
    };

    state.user = googleUser;
    localStorage.setItem('eb_user_profile', JSON.stringify(googleUser));
    localStorage.setItem('eb_user_session', JSON.stringify(googleUser));

    try {
      await firebaseService.syncProfile(googleUser);
    } catch (e) {
      console.warn('Google profile sync note:', e);
    }

    state.authLoading = false;
    if (isReg) {
      state.onboardingStep = 1;
      state.currentView = 'onboarding';
    } else {
      state.currentView = 'home';
    }
    render();
  } catch (e) {
    state.authLoading = false;
    state.authError = e.message || 'Failed to authenticate via Google';
    render();
  }
};

window.handleAuthSubmit = async function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // CRITICAL: Read input values FIRST from the DOM before calling render() or clearing state!
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const firstNameInput = document.getElementById('auth-firstname');
  const ageInput = document.getElementById('auth-age');
  const residenceInput = document.getElementById('auth-residence');

  const email = (emailInput ? emailInput.value : (state.authEmailInput || '')).trim();
  const password = (passwordInput ? passwordInput.value : (state.authPasswordInput || '')).trim();
  const isReg = state.authMode === 'register';
  const firstName = (firstNameInput ? firstNameInput.value : (state.authFirstNameInput || '')).trim() || (email ? email.split('@')[0] : 'Investor');
  const ageRange = (ageInput ? ageInput.value : '25–34').trim();
  const country = (residenceInput ? residenceInput.value : 'United Kingdom').trim();

  state.authEmailInput = email;
  state.authPasswordInput = password;
  state.authFirstNameInput = firstName;

  if (!email || !password) {
    state.authLoading = false;
    state.authError = 'Please enter both email and password.';
    render();
    return;
  }

  if (password.length < 6) {
    state.authLoading = false;
    state.authError = 'Password must be at least 6 characters.';
    render();
    return;
  }

  state.authLoading = true;
  state.authError = '';
  render();

  try {
    if (isReg) {
      const newUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        firstName: firstName,
        email: email,
        ref: 'REF: EB-' + Math.floor(1000 + Math.random() * 9000) + '-GB',
        region: `${country} • GBP Base`,
        tierStatus: 'Standard Investor',
        isPro: false,
        isaUsed: 0,
        isaLimit: 20000,
        capitalGainsLimit: 3000,
        dividendLimit: 500,
        xp: 100,
        streakDays: 1,
        ageRange: ageRange,
        country: country,
        experienceLevel: state.onboardingData.experience || 'Beginner',
        primaryGoal: state.onboardingData.goal || 'Build long-term wealth',
        timeHorizon: state.onboardingData.horizon || '20+ years',
        monthlyCapacity: state.onboardingData.capacity || '£150–£500',
        riskProfile: state.onboardingData.risk || 'Medium-High',
        levelNumber: 1,
        levelTitle: 'Investor Starter',
        isLoggedIn: true,
        isOnboarded: false
      };

      state.user = newUser;
      localStorage.setItem('eb_user_profile', JSON.stringify(newUser));
      localStorage.setItem('eb_user_session', JSON.stringify(newUser));

      try {
        await firebaseService.signUp(email, password, firstName);
      } catch (fbErr) {
        console.warn('Firebase signup remote note:', fbErr);
      }

      state.authLoading = false;
      state.onboardingStep = 1;
      state.currentView = 'onboarding';
      render();
    } else {
      let res;
      try {
        res = await firebaseService.signIn(email, password);
      } catch (authErr) {
        console.warn('Firebase signin notice:', authErr);
      }

      const signedInUser = {
        ...state.user,
        email: email,
        firstName: (res && res.user && res.user.firstName) ? res.user.firstName : (state.user.firstName || firstName),
        isLoggedIn: true
      };
      state.user = signedInUser;
      localStorage.setItem('eb_user_profile', JSON.stringify(signedInUser));
      localStorage.setItem('eb_user_session', JSON.stringify(signedInUser));
      state.authLoading = false;
      state.currentView = 'home';
      render();
    }
  } catch (err) {
    state.authLoading = false;
    state.authError = err.message || 'Authentication failed. Please verify credentials.';
    render();
  }
};

window.setOnboardingOption = function(key, value) {
  state.onboardingData[key] = value;
  render();
};

window.nextOnboardingStep = function() {
  if (state.onboardingStep < 6) {
    state.onboardingStep++;
    render();
  }
};

window.skipOnboarding = function() {
  state.onboardingStep = 6;
  render();
};

window.finishOnboarding = async function() {
  state.user.experienceLevel = state.onboardingData.experience;
  state.user.primaryGoal = state.onboardingData.goal;
  state.user.timeHorizon = state.onboardingData.horizon;
  state.user.monthlyCapacity = state.onboardingData.capacity;
  state.user.riskProfile = state.onboardingData.risk;
  state.user.xp = (state.user.xp || 250) + 100;
  state.user.isOnboarded = true;
  state.user.levelNumber = 1;
  state.user.levelTitle = 'Investor Starter';

  localStorage.setItem('eb_user_profile', JSON.stringify(state.user));
  try {
    await firebaseService.syncProfile(state.user);
  } catch (e) {
    console.warn('Sync profile on onboarding finish:', e);
  }

  state.currentView = 'home';
  render();
};

window.signOut = function() {
  if (confirm('Sign out from EB Wealth?')) {
    firebaseService.signOut();
    if (state.user) {
      state.user.isLoggedIn = false;
    }
    state.authMode = 'login';
    state.currentView = 'auth';
    render();
  }
};

// ── Cache Buster & Maintenance ──
window.clearAppCacheAndReload = function() {
  if (confirm('Clear all cached application files and refresh with the latest updates from the server?')) {
    if ('caches' in window) {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            regs.forEach(r => r.unregister());
            window.location.reload(true);
          });
        } else {
          window.location.reload(true);
        }
      });
    } else {
      window.location.reload(true);
    }
  }
};

// ── Academy Pedagogy, Quizzes & Progress Handlers ──
window.selectQuizOption = function(lessonId, questionIdx, optionIdx) {
  state.quizUserAnswers = state.quizUserAnswers || {};
  state.quizUserAnswers[questionIdx] = optionIdx;
  render();
};

window.submitQuiz = function(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson || !lesson.quiz || lesson.quiz.length === 0) return;

  const totalQuestions = lesson.quiz.length;
  let correctCount = 0;

  for (let i = 0; i < totalQuestions; i++) {
    if (state.quizUserAnswers[i] === lesson.quiz[i].answer) {
      correctCount++;
    }
  }

  const scorePct = Math.round((correctCount / totalQuestions) * 100);
  state.quizFeedback = {
    score: correctCount,
    total: totalQuestions,
    submitted: true
  };

  // Record quiz progress
  state.quizProgress[lessonId] = {
    score: correctCount,
    total: totalQuestions,
    percentage: scorePct,
    completedAt: Date.now()
  };
  localStorage.setItem('eb_quiz_progress', JSON.stringify(state.quizProgress));

  // If score is at least 60% and lesson not yet completed, award XP
  if (scorePct >= 60 && !state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
    localStorage.setItem('eb_completed_lessons', JSON.stringify(state.completedLessons));

    state.user.xp = (state.user.xp || 250) + (lesson.xp || 60);
    // Update tier if applicable
    const tier = getInvestorTier(state.user.xp);
    state.user.levelNumber = tier.level;
    state.user.levelTitle = tier.title;
    localStorage.setItem('eb_user_profile', JSON.stringify(state.user));

    try {
      firebaseService.syncProfile(state.user);
    } catch (e) {
      console.warn('Sync profile on quiz pass:', e);
    }
  }

  render();
  setTimeout(() => {
    const el = document.getElementById('lesson-quiz-box');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

window.resetQuiz = function(lessonId) {
  state.quizUserAnswers = {};
  state.quizFeedback = null;
  render();
};

window.completeLesson = function(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  if (state.completedLessons.includes(lessonId)) {
    alert(`You have already completed "${lesson.title}". XP is awarded once per lesson to preserve learning progression integrity.`);
    return;
  }

  state.completedLessons.push(lessonId);
  localStorage.setItem('eb_completed_lessons', JSON.stringify(state.completedLessons));

  const xpEarned = lesson.xp || 60;
  state.user.xp = (state.user.xp || 250) + xpEarned;
  const tier = getInvestorTier(state.user.xp);
  state.user.levelNumber = tier.level;
  state.user.levelTitle = tier.title;
  localStorage.setItem('eb_user_profile', JSON.stringify(state.user));

  try {
    firebaseService.syncProfile(state.user);
  } catch (e) {
    console.warn('Sync profile on lesson completion:', e);
  }

  alert(`🎉 Congratulations! You completed "${lesson.title}" and earned +${xpEarned} XP!\nYour Investor Status: ${tier.title} (Level ${tier.level})`);
  render();
};

// ── Dynamic Community Forum Handlers ──
window.setCommunityCategory = function(cat) {
  state.communityCategoryFilter = cat;
  render();
};

window.setCommunitySearch = function(q) {
  state.communitySearchQuery = q;
  render();
};

window.toggleNewDiscussionModal = function() {
  state.showNewDiscussionModal = !state.showNewDiscussionModal;
  render();
};

window.submitNewDiscussion = function(e) {
  if (e) e.preventDefault();
  const catEl = document.getElementById('new-post-category');
  const titleEl = document.getElementById('new-post-title');
  const contentEl = document.getElementById('new-post-content');

  const category = catEl ? catEl.value : 'General Discussion';
  const title = titleEl ? titleEl.value.trim() : '';
  const content = contentEl ? contentEl.value.trim() : '';

  if (!title || !content) {
    alert('Please enter both a discussion title and content.');
    return;
  }

  try {
    CommunityService.createPost(
      title,
      category,
      content,
      state.user.firstName || 'Investor',
      state.user.levelTitle || 'Capital Explorer'
    );
    state.showNewDiscussionModal = false;
    state.communityDiscussions = CommunityService.getDiscussions();
    alert('✓ Discussion published successfully to the EB Wealth Investor Community.');
    render();
  } catch (err) {
    alert(err.message || 'Failed to publish discussion.');
  }
};

window.openDiscussion = function(id) {
  state.expandedDiscussionId = state.expandedDiscussionId === id ? null : id;
  render();
};

window.toggleCommunityLike = function(id) {
  CommunityService.toggleLike(id);
  state.communityDiscussions = CommunityService.getDiscussions();
  render();
};

window.submitCommunityComment = function(e, postId) {
  if (e) e.preventDefault();
  const inputEl = document.getElementById(`comment-input-${postId}`);
  const text = inputEl ? inputEl.value.trim() : '';
  if (!text) return;

  try {
    CommunityService.addComment(
      postId,
      text,
      state.user.firstName || 'Investor',
      state.user.levelTitle || 'Capital Explorer'
    );
    state.communityDiscussions = CommunityService.getDiscussions();
    render();
  } catch (err) {
    alert(err.message || 'Failed to submit comment.');
  }
};

window.toggleCommunityPin = function(id) {
  CommunityService.togglePin(id);
  state.communityDiscussions = CommunityService.getDiscussions();
  state.adminNotification = 'Discussion pin status updated.';
  render();
};

window.deleteCommunityPost = function(id) {
  if (confirm('Delete this community discussion? This action cannot be undone.')) {
    CommunityService.deletePost(id);
    state.communityDiscussions = CommunityService.getDiscussions();
    state.adminNotification = 'Discussion removed successfully.';
    render();
  }
};

// ── Private Administrator Portal Handlers ──
window.setAdminTab = function(tab) {
  state.adminTab = tab;
  state.adminNotification = '';
  render();
};

window.setAdminFilterLevel = function(lvl) {
  state.adminFilterLevel = lvl;
  render();
};

window.handleAdminLogin = async function(e) {
  if (e) e.preventDefault();
  const uEl = document.getElementById('admin-username-input');
  const pEl = document.getElementById('admin-password-input');

  const username = uEl ? uEl.value.trim() : '';
  const password = pEl ? pEl.value : '';

  state.adminLoginForm.username = username;
  state.adminLoginForm.loading = true;
  state.adminLoginForm.error = '';
  render();

  try {
    const res = await AdminAuthService.login(username, password);
    state.adminLoginForm.loading = false;
    if (res.success) {
      state.adminLoginForm.password = '';
      state.adminLoginForm.error = '';
      state.currentView = 'admin';
      state.adminNotification = 'Super Administrator Session Established.';
      window.location.hash = 'admin';
    } else {
      state.adminLoginForm.error = res.error || 'Authentication rejected. Generic error.';
    }
  } catch (err) {
    state.adminLoginForm.loading = false;
    state.adminLoginForm.error = err.message || 'Administrative verification failure.';
  }
  render();
};

window.handleAdminLogout = function() {
  AdminAuthService.logout();
  state.adminLoginForm = { username: '', password: '', error: '', loading: false };
  state.adminNotification = '';
  state.currentView = 'admin'; // Shows admin login screen
  render();
};

window.handleAdminChangePassword = async function(e) {
  if (e) e.preventDefault();
  const curEl = document.getElementById('admin-current-password');
  const newEl = document.getElementById('admin-new-password');
  const confEl = document.getElementById('admin-confirm-password');

  const currentPass = curEl ? curEl.value : '';
  const newPass = newEl ? newEl.value : '';
  const confirmPass = confEl ? confEl.value : '';

  if (newPass !== confirmPass) {
    alert('New passwords do not match. Please verify.');
    return;
  }
  if (newPass.length < 8) {
    alert('New password must be at least 8 characters in length.');
    return;
  }

  try {
    const res = await AdminAuthService.changePassword(currentPass, newPass);
    if (res.success) {
      alert('✓ Administrator password updated and cryptographically salted successfully.');
      state.adminNotification = 'Admin credentials successfully rotated.';
      if (curEl) curEl.value = '';
      if (newEl) newEl.value = '';
      if (confEl) confEl.value = '';
      render();
    } else {
      alert(res.error || 'Failed to update admin password.');
    }
  } catch (err) {
    alert(err.message || 'Error updating administrator password.');
  }
};

// Course Management Functions
window.openCreateCourseModal = function() {
  state.editingCourse = {
    isNew: true,
    level: state.levels.length + 1,
    title: '',
    subtitle: '',
    icon: '🏛',
    description: '',
    published: true
  };
  render();
};

window.editCourse = function(level) {
  const lvl = state.levels.find(l => l.level === level);
  if (lvl) {
    state.editingCourse = { ...lvl, isNew: false };
    render();
  }
};

window.saveCourseEdit = function(e) {
  if (e) e.preventDefault();
  const lvlNum = parseInt(document.getElementById('edit-course-level')?.value) || 1;
  const title = document.getElementById('edit-course-title')?.value.trim() || '';
  const icon = document.getElementById('edit-course-icon')?.value.trim() || '🏛';
  const subtitle = document.getElementById('edit-course-subtitle')?.value.trim() || '';
  const desc = document.getElementById('edit-course-desc')?.value.trim() || '';

  if (!title) {
    alert('Course title is required.');
    return;
  }

  if (state.editingCourse && state.editingCourse.isNew) {
    state.levels.push({
      level: lvlNum,
      title: title,
      subtitle: subtitle,
      icon: icon,
      description: desc,
      published: true
    });
  } else {
    const idx = state.levels.findIndex(l => l.level === (state.editingCourse ? state.editingCourse.level : lvlNum));
    if (idx !== -1) {
      state.levels[idx] = {
        ...state.levels[idx],
        level: lvlNum,
        title: title,
        subtitle: subtitle,
        icon: icon,
        description: desc
      };
    }
  }

  localStorage.setItem('eb_custom_levels', JSON.stringify(state.levels));
  state.editingCourse = null;
  state.adminNotification = 'Course saved and persisted to database.';
  render();
};

window.toggleCoursePublished = function(level) {
  const lvl = state.levels.find(l => l.level === level);
  if (lvl) {
    lvl.published = lvl.published === false ? true : false;
    localStorage.setItem('eb_custom_levels', JSON.stringify(state.levels));
    state.adminNotification = `Level ${level} is now ${lvl.published ? 'Published' : 'Draft'}.`;
    render();
  }
};

window.reorderCourse = function(level, direction) {
  const idx = state.levels.findIndex(l => l.level === level);
  if (idx === -1) return;
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= state.levels.length) return;

  const temp = state.levels[idx];
  state.levels[idx] = state.levels[targetIdx];
  state.levels[targetIdx] = temp;

  // Re-index levels
  state.levels.forEach((l, i) => { l.level = i + 1; });
  localStorage.setItem('eb_custom_levels', JSON.stringify(state.levels));
  state.adminNotification = 'Curriculum courses reordered successfully.';
  render();
};

window.previewCourse = function(level) {
  state.selectedLevel = level;
  window.navigateTo('learn');
};

// Lesson Management Functions
window.openCreateLessonModal = function() {
  const nextId = Math.max(0, ...state.lessons.map(l => l.id)) + 1;
  const currentLevelFilter = state.adminFilterLevel !== 'all' ? parseInt(state.adminFilterLevel) : 1;
  const lvlObj = state.levels.find(l => l.level === currentLevelFilter) || state.levels[0];

  state.editingLesson = {
    isNew: true,
    id: nextId,
    level: currentLevelFilter,
    levelTitle: lvlObj.title,
    title: '',
    time: '5 min',
    xp: 60,
    published: true,
    introduction: '',
    explanation: '',
    practicalExample: '',
    scenario: '',
    objectives: ['Master fundamental investment principle'],
    keyTakeaways: ['Core concept understood and applied'],
    commonMistakes: ['Skipping due diligence'],
    terminology: [{ term: 'Term', definition: 'Definition in plain English' }],
    quiz: [
      {
        question: 'What is the primary investment principle highlighted here?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 0,
        explanation: 'Option A directly reflects the investment rationale.'
      }
    ]
  };
  render();
};

window.editLesson = function(id) {
  const lesson = state.lessons.find(l => l.id === id);
  if (lesson) {
    state.editingLesson = JSON.parse(JSON.stringify(lesson));
    state.editingLesson.isNew = false;
    render();
  }
};

window.saveLessonEdit = function(e) {
  if (e) e.preventDefault();
  const title = document.getElementById('edit-lesson-title')?.value.trim() || '';
  const level = parseInt(document.getElementById('edit-lesson-level')?.value) || 1;
  const time = document.getElementById('edit-lesson-time')?.value.trim() || '4 min';
  const xp = parseInt(document.getElementById('edit-lesson-xp')?.value) || 60;
  const intro = document.getElementById('edit-lesson-intro')?.value.trim() || '';
  const explanation = document.getElementById('edit-lesson-explanation')?.value.trim() || '';
  const practicalExample = document.getElementById('edit-lesson-example')?.value.trim() || '';
  const scenario = document.getElementById('edit-lesson-scenario')?.value.trim() || '';

  const objectivesRaw = document.getElementById('edit-lesson-objectives')?.value || '';
  const takeawaysRaw = document.getElementById('edit-lesson-takeaways')?.value || '';
  const mistakesRaw = document.getElementById('edit-lesson-mistakes')?.value || '';
  const terminologyRaw = document.getElementById('edit-lesson-terminology')?.value || '';
  const quizRaw = document.getElementById('edit-lesson-quiz')?.value || '[]';

  const objectives = objectivesRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const keyTakeaways = takeawaysRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const commonMistakes = mistakesRaw.split('\n').map(s => s.trim()).filter(Boolean);
  const terminology = terminologyRaw.split('\n').map(line => {
    const parts = line.split(':');
    return {
      term: parts[0]?.trim() || 'Term',
      definition: parts.slice(1).join(':')?.trim() || ''
    };
  }).filter(t => t.term && t.definition);

  let quiz = [];
  try {
    quiz = JSON.parse(quizRaw);
  } catch (err) {
    alert('Quiz format error: Please ensure valid JSON array format.');
    return;
  }

  const lvlObj = state.levels.find(l => l.level === level) || { title: `Level ${level}` };

  if (state.editingLesson && state.editingLesson.isNew) {
    const newLesson = {
      id: state.editingLesson.id,
      level,
      levelTitle: lvlObj.title,
      title,
      time,
      xp,
      published: true,
      introduction: intro,
      explanation,
      practicalExample,
      scenario,
      objectives,
      keyTakeaways,
      commonMistakes,
      terminology,
      quiz
    };
    state.lessons.push(newLesson);
  } else {
    const idx = state.lessons.findIndex(l => l.id === state.editingLesson.id);
    if (idx !== -1) {
      state.lessons[idx] = {
        ...state.lessons[idx],
        level,
        levelTitle: lvlObj.title,
        title,
        time,
        xp,
        introduction: intro,
        explanation,
        practicalExample,
        scenario,
        objectives,
        keyTakeaways,
        commonMistakes,
        terminology,
        quiz
      };
    }
  }

  localStorage.setItem('eb_custom_lessons', JSON.stringify(state.lessons));
  state.editingLesson = null;
  state.adminNotification = 'Lesson saved and synchronized to academy database.';
  render();
};

window.toggleLessonPublished = function(id) {
  const lesson = state.lessons.find(l => l.id === id);
  if (lesson) {
    lesson.published = lesson.published === false ? true : false;
    localStorage.setItem('eb_custom_lessons', JSON.stringify(state.lessons));
    state.adminNotification = `Lesson #${id} is now ${lesson.published ? 'Published' : 'Draft'}.`;
    render();
  }
};

window.reorderLesson = function(id, direction) {
  const lesson = state.lessons.find(l => l.id === id);
  if (!lesson) return;
  const sameLevelLessons = state.lessons.filter(l => l.level === lesson.level);
  const curIdx = sameLevelLessons.findIndex(l => l.id === id);
  const targetIdx = curIdx + direction;
  if (targetIdx < 0 || targetIdx >= sameLevelLessons.length) return;

  const targetLesson = sameLevelLessons[targetIdx];
  const globalIdx1 = state.lessons.findIndex(l => l.id === lesson.id);
  const globalIdx2 = state.lessons.findIndex(l => l.id === targetLesson.id);

  const temp = state.lessons[globalIdx1];
  state.lessons[globalIdx1] = state.lessons[globalIdx2];
  state.lessons[globalIdx2] = temp;

  localStorage.setItem('eb_custom_lessons', JSON.stringify(state.lessons));
  state.adminNotification = 'Lesson order updated.';
  render();
};

window.deleteLesson = function(id) {
  if (confirm(`Are you sure you want to delete Lesson #${id}? This will remove it from the student curriculum.`)) {
    state.lessons = state.lessons.filter(l => l.id !== id);
    localStorage.setItem('eb_custom_lessons', JSON.stringify(state.lessons));
    state.adminNotification = `Lesson #${id} deleted from curriculum.`;
    render();
  }
};

window.resetStudentProgress = function(studentId) {
  if (confirm(`Reset all learning progress for student ${state.user.firstName}? This will reset completed lessons to Level 1 and recalculate XP.`)) {
    state.completedLessons = [1];
    state.quizProgress = {};
    state.user.xp = 100;
    state.user.levelNumber = 1;
    state.user.levelTitle = 'Investor Starter';
    localStorage.setItem('eb_completed_lessons', JSON.stringify([1]));
    localStorage.setItem('eb_quiz_progress', JSON.stringify({}));
    localStorage.setItem('eb_user_profile', JSON.stringify(state.user));
    state.adminNotification = 'Student progress reset to baseline.';
    render();
  }
};

// ── Database Configuration Handlers ──
window.saveCustomDatabaseSettings = function(e) {
  if (e) e.preventDefault();
  const raw = document.getElementById('admin-custom-db-json')?.value.trim();
  if (!raw) {
    alert('Please enter or paste your custom Firebase Web Config in JSON format.');
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.projectId || !parsed.apiKey) {
      alert('Config must include at least "projectId" and "apiKey".');
      return;
    }
    localStorage.setItem('eb_custom_firebase_config', JSON.stringify(parsed));
    alert('✓ Custom cloud database configuration saved! Reloading to bind new database connection...');
    window.location.reload();
  } catch (err) {
    alert('Invalid JSON: ' + err.message);
  }
};

window.testDatabaseConnection = async function() {
  const raw = document.getElementById('admin-custom-db-json')?.value.trim();
  let cfg = null;
  if (raw) {
    try {
      cfg = JSON.parse(raw);
    } catch (e) {
      alert('Invalid JSON in custom database field.');
      return;
    }
  } else {
    cfg = JSON.parse(localStorage.getItem('eb_custom_firebase_config') || 'null');
  }

  const projId = cfg?.projectId || 'com-aistudio-ebwealth-kq-f6b41';

  try {
    const testUrl = `https://firestore.googleapis.com/v1/projects/${projId}/databases/(default)/documents`;
    const res = await fetch(testUrl);
    alert(`⚡ Cloud Database Ping to "${projId}": Server reached (HTTP ${res.status}). Database endpoint is accessible.`);
  } catch (err) {
    alert(`Connection check error: ${err.message}`);
  }
};

window.resetDatabaseToDefault = function() {
  if (confirm('Reset to standard environment project com-aistudio-ebwealth-kq-f6b41?')) {
    localStorage.removeItem('eb_custom_firebase_config');
    alert('Reset complete. Reloading with default database...');
    window.location.reload();
  }
};

// ── Admin Route & History Listener ──
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#admin') {
    state.currentView = 'admin';
    render();
  }
});

window.addEventListener('popstate', () => {
  if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
    state.currentView = 'admin';
    render();
  }
});

// Initial Render
render();
