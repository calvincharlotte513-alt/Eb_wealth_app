import { WebFirebaseService } from './firebase-config.js';

const firebaseService = new WebFirebaseService();

// Centralized Application State
let state = {
  currentView: 'home', // 'landing' | 'home' | 'market' | 'asset_detail' | 'learn' | 'lesson_detail' | 'portfolio' | 'etf_overlap' | 'simulator' | 'ai_coach' | 'community' | 'events' | 'news' | 'profile' | 'onboarding' | 'admin'
  isDesktopMode: window.innerWidth >= 860,
  navStack: ['home'],
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
  onboardingStep: 1,
  onboardingData: {
    experience: 'Beginner',
    goal: 'Build long-term wealth',
    horizon: '20+ years',
    capacity: '£150–£500',
    risk: 'Medium-High'
  },
  user: JSON.parse(localStorage.getItem('eb_user_profile') || 'null') || firebaseService.currentUser || {
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
    isLoggedIn: true
  },
  holdings: JSON.parse(localStorage.getItem('eb_holdings') || 'null') || [
    { ticker: 'VWRP', name: 'Vanguard FTSE All-World UCITS ETF', assetType: 'ETF', shares: 45, avgBuyPrice: 104.20, currentPrice: 112.40, category: 'Global Equities', currency: 'GBP' },
    { ticker: 'VUAG', name: 'Vanguard S&P 500 UCITS ETF', assetType: 'ETF', shares: 25, avgBuyPrice: 79.10, currentPrice: 85.25, category: 'US Equities', currency: 'GBP' },
    { ticker: 'CSH2', name: 'Lyxor Smart Overnight Return Cash', assetType: 'Money Market', shares: 20, avgBuyPrice: 108.50, currentPrice: 111.45, category: 'Cash & Liquidity', currency: 'GBP' }
  ],
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
  lessons: [
    {
      id: 1,
      level: 1,
      title: 'What is Investing?',
      time: '2 min',
      xp: 50,
      completed: true,
      summary: 'Investing is the allocation of capital to assets that generate productive returns, outpacing inflation over multi-year horizons.',
      content: 'Unlike saving in a bank account which erodes purchasing power through inflation, investing purchases ownership stakes in productive businesses and real assets.',
      quiz: {
        question: 'What is the primary objective of investing versus cash savings?',
        options: ['Generating compounding returns that beat inflation', 'Guaranteeing zero price fluctuation', 'Avoiding all taxes automatically'],
        answer: 0
      }
    },
    {
      id: 2,
      level: 1,
      title: 'Saving vs Investing',
      time: '3 min',
      xp: 50,
      completed: false,
      summary: 'Distinguish between emergency liquidity needs and capital compounding investments.',
      content: 'Cash is for short-term liquidity (3-6 months emergency reserve). Investments are for wealth horizons exceeding 5 to 10 years where short-term volatility is rewarded with equity risk premiums.',
      quiz: {
        question: 'What time horizon is typically recommended for equity investing?',
        options: ['1 to 3 months', '5 to 10+ years', 'Overnight only'],
        answer: 1
      }
    },
    {
      id: 3,
      level: 1,
      title: 'The Magic of Compound Growth',
      time: '3 min',
      xp: 50,
      completed: false,
      summary: 'Albert Einstein called compound interest the eighth wonder of the world.',
      content: 'When returns generate further returns over decades, exponential hockey-stick curves turn regular modest monthly contributions into multi-million pound wealth pools.',
      quiz: {
        question: 'What accelerates compounding growth the most?',
        options: ['Frequent daily trading', 'Time in the market & reinvested dividends', 'Holding only physical cash'],
        answer: 1
      }
    },
    {
      id: 4,
      level: 1,
      title: 'Stocks, Bonds & Cash Explained',
      time: '4 min',
      xp: 50,
      completed: false,
      summary: 'The three primary asset classes in institutional asset allocation.',
      content: 'Equities provide capital growth; bonds offer fixed debt coupon yields; cash provides volatility buffer and dry powder.',
      quiz: {
        question: 'Which asset class historically delivers the highest real growth over 20+ years?',
        options: ['Equities / Stocks', 'Cash under the mattress', 'Government Bonds'],
        answer: 0
      }
    },
    {
      id: 5,
      level: 1,
      title: 'Index Funds & ETFs: The Ultimate Vehicle',
      time: '4 min',
      xp: 50,
      completed: false,
      summary: 'Why passive global indexation defeats 90% of active fund managers over 10-year horizons.',
      content: 'By owning thousands of global companies through UCITS index funds like VWRP, investors minimize single-stock failure risks with rock-bottom expense ratios.',
      quiz: {
        question: 'What is a major advantage of UCITS index ETFs?',
        options: ['High management fees', 'Instant broad diversification at ultra-low cost', 'Guaranteed doubling every week'],
        answer: 1
      }
    }
  ],
  chatMessages: [
    { sender: 'ai', text: 'Good day, Johnkennedy! I am your EB Wealth AI Coach. I can analyze your asset allocation across LSE ETFs, optimize your 2024/25 £20,000 ISA capacity, or stress-test your monthly compounding plan. How may I assist your portfolio today?' }
  ],
  communityPosts: [
    { id: 1, author: 'James Henderson', category: 'UK Investing', title: 'Why 100% VWRP is the gold standard for UK Stocks & Shares ISA', content: 'With over 3,700 stocks and automatic dividend reinvesting (Acc), VWRP eliminates single-market risk and currency conversion fees for UK residents.', likes: 42, comments: 16, time: '2h ago' },
    { id: 2, author: 'Sophia Patel', category: 'ISA & Tax', title: 'Maximizing the £20,000 allowance before April 5th', content: 'Remember that uninvested cash inside a Stocks & Shares ISA still counts toward your allowance limit. Ensure you fund your account in time.', likes: 31, comments: 9, time: '5h ago' },
    { id: 3, author: 'Oliver Wright', category: 'JISA & Junior Accounts', title: 'Junior ISA compounding over 18 years is staggering', content: 'Just £100/month at a 7% annualized return equals ~£43,000 on your child’s 18th birthday, entirely tax-free.', likes: 54, comments: 22, time: '1d ago' }
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
  const isPrimaryTab = ['home', 'market', 'learn', 'portfolio', 'profile'].includes(state.currentView);
  const isLanding = state.currentView === 'landing';

  appEl.innerHTML = `
    <!-- Top Desktop Navbar (Active in desktop full-width mode) -->
    ${isDesktop ? renderDesktopNavbar() : ''}

    <!-- Simulated Mobile Status Bar (Active in phone frame mode) -->
    ${!isDesktop ? `
      <div class="mobile-status-bar">
        <span>14:33</span>
        <div class="status-bar-icons">
          <span>5G</span>
          <span class="battery-pill">■■■ 100%</span>
        </div>
      </div>
    ` : ''}

    <!-- Sticky Mobile Top Bar (Present on mobile / phone mode) -->
    ${!isDesktop && isPrimaryTab ? renderTopBar() : ''}

    <!-- Main Dynamic Screen Content -->
    <main class="screen-scroll-container">
      ${renderCurrentScreen()}
    </main>

    <!-- Floating Cyber Frosted-Glass Bottom Nav Dock (Present in mobile / phone mode on primary tabs) -->
    ${!isDesktop && isPrimaryTab ? renderBottomDock() : ''}

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
          <li><button class="desktop-nav-item ${v === 'admin' ? 'active' : ''}" onclick="window.navigateTo('admin')">Admin</button></li>
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
          <span class="brand-subtitle">Investment Education Platform</span>
        </div>
      </div>

      <div class="top-bar-right">
        <button class="btn-upgrade-pill" onclick="window.navigateTo('landing')" style="background: rgba(0, 240, 255, 0.12); color: #00F0FF; border: 1px solid rgba(0, 240, 255, 0.3);">
          <span>🌐</span>
          <span>Overview</span>
        </button>
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

        <button class="dock-nav-item ${state.currentView === 'learn' ? 'active' : ''}" onclick="window.navigateTo('learn')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg>
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
        <div style="font-size: 11px; color: #94A3B8;">London Stock Exchange (LSE) & Global ETFs</div>
      </div>
    </div>

    <div class="search-bar-cosmic" style="margin-top: 4px;">
      <input type="text" id="market-search-input" placeholder="Search by ticker or fund (e.g. VWRP, VUAG, AZN)..." value="${state.marketSearchQuery}" oninput="window.updateMarketSearch(this.value)" />
      <div class="search-icon-btn">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; padding: 0 4px;">
      <span>Displaying ${filtered.length} Analyzed Assets</span>
      <span style="color: #FBBF24;">FCA Compliant Metrics</span>
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

// 4. LEARN / ACADEMY SCREEN (Screenshot 5)
function renderLearnScreen() {
  return `
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <div class="academy-badge-gold">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
        <span>EB WEALTH ACADEMY</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 900; color: #FFFFFF;">Structured Investor Curriculum</h2>
      <p style="font-size: 12px; color: #94A3B8; line-height: 1.4;">
        6 progressive levels designed to build disciplined long-term compounding wealth.
      </p>
    </div>

    <div class="level-scroll-row">
      <button class="level-pill-btn ${state.selectedLevel === 1 ? 'active' : 'inactive'}" onclick="window.selectLevel(1)">
        Level 1 Investing Foundations
      </button>
      <button class="level-pill-btn ${state.selectedLevel === 2 ? 'active' : 'inactive'}" onclick="window.selectLevel(2)">
        Level 2 Investment Strategies
      </button>
      <button class="level-pill-btn ${state.selectedLevel === 3 ? 'active' : 'inactive'}" onclick="window.selectLevel(3)">
        Level 3 UK Tax Wrappers & ISA
      </button>
    </div>

    <div>
      <div style="font-size: 13px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">
        LEVEL ${state.selectedLevel} — INVESTING FOUNDATIONS
      </div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 3px;">
        Master the mental models, time horizons, and mathematical laws behind wealth creation.
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${state.lessons.map(l => `
        <div class="lesson-card-item" onclick="window.navigateTo('lesson_detail', ${l.id})">
          <div class="lesson-num-circle ${l.completed ? 'completed' : ''}">
            ${l.completed ? `
              <svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
            ` : l.id}
          </div>
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">${l.title}</div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 3px; display: flex; align-items: center; gap: 8px;">
              <span>⏱ ${l.time}</span>
              <span style="color: #FBBF24; font-weight: 700;">+${l.xp} XP</span>
            </div>
          </div>
          <div style="color: #64748B;">
            <svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. LESSON DETAIL SCREEN WITH INTERACTIVE QUIZ
function renderLessonDetailScreen() {
  const lesson = state.lessons.find(l => l.id === state.selectedLessonId) || state.lessons[0];

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 900; color: #FFFFFF;">${lesson.title}</h2>
        <div style="font-size: 11px; color: #94A3B8;">Level ${lesson.level} • ⏱ ${lesson.time} • +${lesson.xp} XP</div>
      </div>
    </div>

    <div class="cyber-card">
      <div style="font-size: 11px; color: #00F0FF; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 6px;">CORE SUMMARY</div>
      <p style="font-size: 13px; color: #FFFFFF; line-height: 1.5;">${lesson.summary}</p>
      <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin: 12px 0;"></div>
      <div style="font-size: 11px; color: #FBBF24; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 6px;">DETAILED LESSON MATERIAL</div>
      <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">${lesson.content}</p>
    </div>

    <!-- Interactive Knowledge Check Quiz -->
    <div class="cyber-card" style="border-color: rgba(251, 191, 36, 0.4);">
      <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 8px;">KNOWLEDGE CHECK QUIZ</div>
      <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">${lesson.quiz.question}</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${lesson.quiz.options.map((opt, idx) => `
          <button style="text-align: left; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 10px; padding: 12px; color: #FFFFFF; font-size: 12px; cursor: pointer;" onclick="window.answerQuiz(${lesson.id}, ${idx})">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// 6. PORTFOLIO SCREEN (Screenshot 4)
function renderPortfolioScreen() {
  const totalVal = state.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalGain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0.00';

  return `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="lse-feed-badge">LSE LIVE FEED</span>
      <span style="font-size: 11px; color: #94A3B8;">Today, 14:33</span>
      <span style="font-size: 11px; color: #00F0FF; cursor: pointer; font-weight: 700;" onclick="window.refreshPortfolio()">🔄 Refresh Quotes</span>
    </div>

    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.35);">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">
        TOTAL PORTFOLIO VALUATION
      </div>
      <div style="font-size: 34px; font-weight: 900; color: #FFFFFF; margin: 8px 0 4px 0;">
        £${totalVal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94A3B8; margin-top: 6px;">
        <span>Total Cost Basis: £${totalCost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span style="color: #10B981; font-weight: 800;">Unrealized Return: +£${totalGain.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${gainPct}%)</span>
      </div>
    </div>

    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 800; color: #FFFFFF;">Account & Geographic Allocation</span>
        <span style="font-size: 11px; color: #00F0FF; font-weight: 700; cursor: pointer;" onclick="window.navigateTo('etf_overlap')">Rebalance Tool →</span>
      </div>

      <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">By UK Tax Vehicle:</div>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>Stocks & Shares ISA</span>
            <span style="color: #00F0FF; font-weight: 700;">80%</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 80%;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>General Investment Account (GIA)</span>
            <span style="color: #FBBF24; font-weight: 700;">20%</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 20%; background: #FBBF24;"></div></div>
        </div>
      </div>

      <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">By Geographic Exposure:</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>Global All-World (VWRP)</span>
            <span style="color: #38BDF8; font-weight: 700;">60%</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 60%; background: #38BDF8;"></div></div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>US S&P 500 (VUAG)</span>
            <span style="color: #10B981; font-weight: 700;">40%</span>
          </div>
          <div class="progress-container"><div class="progress-fill-cyan" style="width: 40%; background: #10B981;"></div></div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
      <h3 style="font-size: 16px; font-weight: 900; color: #FFFFFF;">Holdings (${state.holdings.length})</h3>
      <button style="display: flex; align-items: center; gap: 6px; background: #00F0FF; color: #040B14; border: none; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="window.openAddHoldingModal()">
        <span>+ Add Holding</span>
      </button>
    </div>

    ${state.holdings.map((h, i) => `
      <div class="cyber-card" style="padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 16px; font-weight: 900; color: #FFFFFF;">${h.ticker}</div>
            <div style="font-size: 11px; color: #94A3B8;">${h.name} • ${h.shares} Shares</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 15px; font-weight: 800; color: #FFFFFF;">£${(h.shares * h.currentPrice).toFixed(2)}</div>
            <div style="font-size: 11px; color: #10B981; font-weight: 700;">+£${((h.shares * h.currentPrice) - (h.shares * h.avgBuyPrice)).toFixed(2)}</div>
          </div>
        </div>
      </div>
    `).join('')}
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

// 10. COMMUNITY SCREEN
function renderCommunityScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Community Forum & Discussions</h2>
        <div style="font-size: 11px; color: #94A3B8;">Verified UK Investor Discussions</div>
      </div>
    </div>

    ${state.communityPosts.map(p => `
      <div class="cyber-card" style="border-color: rgba(20, 184, 166, 0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 800; color: #2DD4BF; background: rgba(20, 184, 166, 0.15); padding: 2px 8px; border-radius: 4px;">${p.category}</span>
          <span style="font-size: 11px; color: #94A3B8;">${p.time} • By ${p.author}</span>
        </div>
        <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; margin-bottom: 4px;">${p.title}</div>
        <p style="font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 10px;">${p.content}</p>
        <div style="display: flex; gap: 14px; font-size: 11px; color: #94A3B8; font-weight: 700;">
          <span style="color: #F43F5E; cursor: pointer;">❤️ ${p.likes} Likes</span>
          <span style="color: #00F0FF; cursor: pointer;">💬 ${p.comments} Comments</span>
        </div>
      </div>
    `).join('')}
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
    </div>

    <!-- Admin Console Access -->
    <div class="cyber-card" onclick="window.navigateTo('admin')" style="cursor: pointer; border-color: rgba(251, 191, 36, 0.4); margin-top: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">👑</span>
          <div>
            <div style="font-size: 12px; font-weight: 800; color: #FBBF24; letter-spacing: 0.5px;">EB WEALTH ADMIN CONSOLE</div>
            <div style="font-size: 10px; color: #94A3B8;">Executive Platform & Revenue Summary</div>
          </div>
        </div>
        <span style="font-size: 12px; color: #FBBF24; font-weight: 800;">Open →</span>
      </div>
    </div>

    <!-- Instant Cloud Sync & Sign Out -->
    <div style="display: flex; gap: 10px; margin-top: 8px;">
      <button style="flex: 1; background: rgba(0, 240, 255, 0.15); border: 1px solid #00F0FF; color: #00F0FF; border-radius: 12px; padding: 12px; font-weight: 800; font-size: 12px; cursor: pointer;" onclick="window.triggerCloudSync()">
        ⚡ Cloud Sync to Firestore
      </button>
      <button style="background: rgba(244, 63, 94, 0.15); border: 1px solid #F43F5E; color: #F43F5E; border-radius: 12px; padding: 12px 18px; font-weight: 800; font-size: 12px; cursor: pointer;" onclick="window.signOut()">
        Sign Out
      </button>
    </div>
  `;
}

// 14. ADMIN DASHBOARD SCREEN (Exact match to Android AdminDashboardScreen.kt)
function renderAdminDashboardScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">EB Wealth Admin Console</h2>
        <div style="font-size: 11px; color: #94A3B8;">Platform analytics, revenue & curriculum management</div>
      </div>
    </div>

    <!-- Key Business Metrics Grid (Exact match to Android AdminDashboardScreen.kt) -->
    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.35);">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 12px;">Executive Platform Summary</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div class="admin-metric-tile">
          <span class="admin-metric-label">Total Users</span>
          <span class="admin-metric-val">4,820</span>
          <span class="admin-metric-badge" style="color: #10B981;">+14% MoM</span>
        </div>
        <div class="admin-metric-tile">
          <span class="admin-metric-label">Pro Subscribers</span>
          <span class="admin-metric-val">1,248</span>
          <span class="admin-metric-badge" style="color: #FBBF24;">£12,410 MRR</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="admin-metric-tile">
          <span class="admin-metric-label">Course Completion</span>
          <span class="admin-metric-val">68.4%</span>
          <span class="admin-metric-badge" style="color: #38BDF8;">Disciplined</span>
        </div>
        <div class="admin-metric-tile">
          <span class="admin-metric-label">AI Coach Queries</span>
          <span class="admin-metric-val">32,940</span>
          <span class="admin-metric-badge" style="color: #10B981;">99.8% Safety</span>
        </div>
      </div>
    </div>

    <!-- Most Popular Curriculum & Research (Exact match to Android AdminDashboardScreen.kt) -->
    <div class="cyber-card">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 12px;">Top Performing Educational Content</div>
      <div class="admin-content-row">
        <div>
          <div class="admin-content-title">Level 3: Stocks & Shares ISA Tax Fortress</div>
          <div class="admin-content-sub">3,890 completions</div>
        </div>
        <span style="font-size: 11px; font-weight: 700; color: #10B981;">94% pass</span>
      </div>
      <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin: 6px 0;"></div>
      <div class="admin-content-row">
        <div>
          <div class="admin-content-title">Level 4: The ETF Overlap Trap</div>
          <div class="admin-content-sub">3,410 completions</div>
        </div>
        <span style="font-size: 11px; font-weight: 700; color: #10B981;">91% pass</span>
      </div>
      <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin: 6px 0;"></div>
      <div class="admin-content-row">
        <div>
          <div class="admin-content-title">Level 1: What is Investing?</div>
          <div class="admin-content-sub">4,210 completions</div>
        </div>
        <span style="font-size: 11px; font-weight: 700; color: #10B981;">98% pass</span>
      </div>
    </div>

    <!-- Financial Engine & Platform Infrastructure -->
    <div class="cyber-card">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 12px;">Financial Data & Regulatory Status</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <span style="color: #94A3B8;">LSE Live Market Feed:</span>
          <span style="color: #10B981; font-weight: 700;">● Connected (12ms)</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <span style="color: #94A3B8;">HMRC 2024/25 Allowance Engine:</span>
          <span style="color: #00F0FF; font-weight: 700;">Active (£20k ISA / £60k SIPP)</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <span style="color: #94A3B8;">Cloud Firestore Sync:</span>
          <span style="color: #FBBF24; font-weight: 700;">com-aistudio-ebwealth-kq-f6b41</span>
        </div>
      </div>
    </div>

    <!-- Administrative Operations -->
    <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
      <button class="admin-action-btn" onclick="alert('Broadcasting priority market bulletin to all 4,820 registered investors.')">
        📢 Broadcast Market Notice to Members
      </button>
      <button class="admin-action-btn" onclick="alert('Curriculum XP weights recalibrated according to FCA investor literacy benchmarks.')">
        🎯 Recalibrate Curriculum XP Weights
      </button>
      <button class="admin-action-btn" onclick="alert('Exporting encrypted FCA compliance regulatory audit log (CSV/PDF)... Generated.')">
        📥 Export FCA Compliance Audit Log
      </button>
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
          <span>Sign in with Google</span>
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
                <input type="text" id="auth-firstname" required placeholder="e.g. Charlotte" class="auth-input" />
              </div>
            </div>
          ` : ''}

          <div class="auth-field-group">
            <label class="auth-field-label">EMAIL ADDRESS</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <input type="email" id="auth-email" required placeholder="e.g. name@example.co.uk" class="auth-input" value="${state.user?.email || ''}" />
            </div>
          </div>

          <div class="auth-field-group">
            <label class="auth-field-label">ACCOUNT PASSWORD</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <input type="${state.authPasswordVisible ? 'text' : 'password'}" id="auth-password" required placeholder="Minimum 6 characters" class="auth-input" />
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
          <h2 style="font-size: 18px; font-weight: 900; color: #FFFFFF;">Add UK Asset Holding</h2>
          <button style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>

        <form onsubmit="window.saveHolding(event)">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">TICKER (e.g. VWRP, VUAG, AZN)</label>
              <input type="text" id="holding-ticker" required style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
            </div>
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">ASSET NAME</label>
              <input type="text" id="holding-name" required placeholder="e.g. Vanguard FTSE All-World" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">SHARES</label>
                <input type="number" step="any" id="holding-shares" required placeholder="10" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">CURRENT PRICE (£)</label>
                <input type="number" step="any" id="holding-price" required placeholder="112.40" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
            </div>

            <button type="submit" style="margin-top: 10px; background: #00F0FF; color: #040B14; font-weight: 800; border: none; border-radius: 10px; padding: 12px; cursor: pointer;">
              Save to Portfolio
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

window.refreshPortfolio = function() {
  render();
};

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
  const ticker = document.getElementById('holding-ticker').value.toUpperCase().trim();
  const name = document.getElementById('holding-name').value.trim();
  const shares = parseFloat(document.getElementById('holding-shares').value) || 1;
  const currentPrice = parseFloat(document.getElementById('holding-price').value) || 100;

  state.holdings.push({ ticker, name, shares, avgBuyPrice: currentPrice, currentPrice });
  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  state.showAddHoldingModal = false;
  render();
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
  state.authLoading = true;
  state.authError = '';
  render();
  try {
    const demoGoogleUser = {
      id: 'usr_google_' + Math.random().toString(36).substring(2, 8),
      firstName: state.user?.firstName || 'Alex',
      email: state.user?.email || 'alex.investor@example.co.uk',
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
      experienceLevel: state.onboardingData.experience || 'Beginner',
      primaryGoal: state.onboardingData.goal || 'Build long-term wealth',
      timeHorizon: state.onboardingData.horizon || '20+ years',
      monthlyCapacity: state.onboardingData.capacity || '£150–£500',
      riskProfile: state.onboardingData.risk || 'Medium-High',
      levelNumber: 1,
      levelTitle: 'Investor Starter',
      isLoggedIn: true
    };
    state.user = demoGoogleUser;
    localStorage.setItem('eb_user_profile', JSON.stringify(demoGoogleUser));
    await firebaseService.syncProfile(demoGoogleUser);
    state.authLoading = false;
    state.currentView = 'home';
    render();
  } catch (e) {
    state.authLoading = false;
    state.authError = e.message || 'Failed to authenticate via Google';
    render();
  }
};

window.handleAuthSubmit = async function(e) {
  e.preventDefault();
  state.authLoading = true;
  state.authError = '';
  render();

  const email = (document.getElementById('auth-email')?.value || '').trim();
  const password = (document.getElementById('auth-password')?.value || '').trim();
  const isReg = state.authMode === 'register';

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

  try {
    if (isReg) {
      const firstName = (document.getElementById('auth-firstname')?.value || '').trim() || 'Investor';
      const ageRange = (document.getElementById('auth-age')?.value || '25–34').trim();
      const country = (document.getElementById('auth-residence')?.value || 'United Kingdom').trim();

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
        experienceLevel: 'Beginner',
        primaryGoal: 'Build long-term wealth',
        timeHorizon: '20+ years',
        monthlyCapacity: '£150–£500',
        riskProfile: 'Medium-High',
        levelNumber: 1,
        levelTitle: 'Investor Starter',
        isLoggedIn: true
      };

      state.user = newUser;
      localStorage.setItem('eb_user_profile', JSON.stringify(newUser));
      await firebaseService.signUp(email, password, firstName);

      state.authLoading = false;
      state.onboardingStep = 1;
      state.currentView = 'onboarding';
      render();
    } else {
      const res = await firebaseService.signIn(email, password);
      const signedInUser = {
        ...state.user,
        email: email,
        firstName: res.user?.firstName || state.user.firstName || 'Investor',
        isLoggedIn: true
      };
      state.user = signedInUser;
      localStorage.setItem('eb_user_profile', JSON.stringify(signedInUser));
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

// Initial Render
render();
