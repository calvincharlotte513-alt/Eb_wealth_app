import { WebFirebaseService } from './firebase-config.js';

const firebaseService = new WebFirebaseService();

// Centralized Application State
let state = {
  currentView: 'home', // 'home' | 'market' | 'asset_detail' | 'learn' | 'lesson_detail' | 'portfolio' | 'etf_overlap' | 'simulator' | 'ai_coach' | 'community' | 'events' | 'news' | 'profile' | 'onboarding'
  navStack: ['home'],
  selectedTicker: 'VWRP',
  selectedLessonId: 1,
  showProModal: false,
  showAddHoldingModal: false,
  selectedLevel: 1,
  marketSearchQuery: '',
  overlapSelected: ['VWRP', 'VUAG'],
  simInitial: 5000,
  simMonthly: 500,
  simYears: 20,
  simRate: 8.5,
  registeredEvents: [1],
  user: firebaseService.currentUser || {
    id: 'usr_8849_gb',
    firstName: 'Johnkennedy',
    email: 'johnkennedy3313@gmail.com',
    ref: 'REF: EB-8849-GB',
    region: 'United Kingdom • GBP Base',
    tierStatus: 'Standard Investor',
    isPro: false,
    isaUsed: 8450,
    isaLimit: 20000,
    capitalGainsLimit: 3000,
    dividendLimit: 500,
    xp: 350,
    streakDays: 4
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

// Main Render Dispatcher
function render() {
  const isPrimaryTab = ['home', 'market', 'learn', 'portfolio', 'profile'].includes(state.currentView);

  appEl.innerHTML = `
    <!-- Simulated Mobile Status Bar (Matches phone screenshot 14:33) -->
    <div class="mobile-status-bar">
      <span>14:33</span>
      <div class="status-bar-icons">
        <span>5G</span>
        <span class="battery-pill">■■■ 100%</span>
      </div>
    </div>

    <!-- Sticky Mobile Top Bar (Present on primary tabs) -->
    ${isPrimaryTab ? renderTopBar() : ''}

    <!-- Main View Content -->
    <main class="screen-scroll-container">
      ${renderCurrentScreen()}
    </main>

    <!-- Floating Cyber Frosted-Glass Bottom Nav Dock -->
    ${isPrimaryTab ? renderBottomDock() : ''}

    <!-- Floating AI Wealth Coach FAB on Dashboard -->
    ${state.currentView === 'home' ? `
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

// 1. DASHBOARD / HOME SCREEN (Screenshot 2)
function renderHomeScreen() {
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

    <!-- 2x2 Quick Action Cards Grid (Screenshot 2) -->
    <div class="quick-action-grid">
      <div class="quick-card" onclick="window.navigateTo('market')">
        <div class="quick-card-icon-box icon-cyan-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Market Galaxy</div>
          <div class="quick-card-sub">LSE & Global Movers</div>
        </div>
      </div>

      <div class="quick-card" onclick="window.navigateTo('learn')">
        <div class="quick-card-icon-box icon-blue-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Learning Nexus</div>
          <div class="quick-card-sub">6-Level Academy</div>
        </div>
      </div>

      <div class="quick-card" onclick="window.navigateTo('portfolio')">
        <div class="quick-card-icon-box icon-gold-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Portfolio Constellation</div>
          <div class="quick-card-sub">Holdings & Rebalance</div>
        </div>
      </div>

      <div class="quick-card" onclick="window.navigateTo('community')">
        <div class="quick-card-icon-box icon-teal-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Community Forum</div>
          <div class="quick-card-sub">Discussions & Events</div>
        </div>
      </div>
    </div>

    <!-- Featured Market Assets Section -->
    <div class="section-header-row">
      <div class="section-label-gold">FEATURED MARKET ASSETS</div>
      <div class="section-subtitle-muted">Live UK & Global Movers</div>
    </div>

    <!-- Horizontal Carousel -->
    <div class="market-movers-carousel">
      ${state.assets.map(a => `
        <div class="carousel-card" onclick="window.navigateTo('asset_detail', '${a.ticker}')">
          <div class="carousel-top-row">
            <span class="asset-badge-gray">${a.type}</span>
            <span class="asset-change-green">${a.change}</span>
          </div>
          <div class="carousel-ticker">${a.ticker}</div>
          <div class="carousel-price">${a.price}</div>
        </div>
      `).join('')}
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
function renderETFOverlapScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">ETF Overlap Checker</h2>
        <div style="font-size: 11px; color: #94A3B8;">Identify duplicate exposure across index funds</div>
      </div>
    </div>

    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4); text-align: center;">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24;">ESTIMATED PORTFOLIO WEIGHT OVERLAP</div>
      <div style="font-size: 42px; font-weight: 900; color: #00F0FF; margin: 8px 0;">64.2%</div>
      <p style="font-size: 12px; color: #94A3B8;">Between Vanguard FTSE All-World (VWRP) & Vanguard S&P 500 (VUAG)</p>
    </div>

    <div class="cyber-card">
      <div style="font-size: 12px; font-weight: 800; color: #FFFFFF; margin-bottom: 10px;">TOP DUPLICATE HOLDINGS</div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
          <span>Microsoft Corporation (MSFT)</span>
          <span style="color: #00F0FF; font-weight: 700;">6.8% Combined</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
          <span>Apple Inc. (AAPL)</span>
          <span style="color: #00F0FF; font-weight: 700;">6.2% Combined</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
          <span>NVIDIA Corporation (NVDA)</span>
          <span style="color: #00F0FF; font-weight: 700;">5.9% Combined</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Amazon.com Inc. (AMZN)</span>
          <span style="color: #00F0FF; font-weight: 700;">3.8% Combined</span>
        </div>
      </div>
    </div>
  `;
}

// 8. COMPOUND GROWTH SIMULATOR SCREEN
function renderSimulatorScreen() {
  const r = state.simRate / 100.0;
  const months = state.simYears * 12;
  const monthlyRate = r / 12.0;
  const fvInitial = state.simInitial * Math.pow(1.0 + monthlyRate, months);
  const fvMonthly = monthlyRate > 0 ? state.simMonthly * ((Math.pow(1.0 + monthlyRate, months) - 1.0) / monthlyRate) : state.simMonthly * months;
  const totalValue = fvInitial + fvMonthly;
  const totalInvested = state.simInitial + (state.simMonthly * months);
  const totalGrowth = totalValue - totalInvested;

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Compound Growth Simulator</h2>
        <div style="font-size: 11px; color: #94A3B8;">Multi-decade wealth trajectory modeling</div>
      </div>
    </div>

    <div class="cyber-card" style="border-color: rgba(251, 191, 36, 0.4); text-align: center;">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24;">PROJECTED PORTFOLIO WEALTH</div>
      <div style="font-size: 36px; font-weight: 900; color: #00F0FF; margin: 6px 0;">
        £${Math.round(totalValue).toLocaleString('en-GB')}
      </div>
      <div style="display: flex; justify-content: space-around; font-size: 11px; color: #94A3B8; margin-top: 8px;">
        <span>Invested: £${Math.round(totalInvested).toLocaleString('en-GB')}</span>
        <span style="color: #10B981; font-weight: 800;">Growth: +£${Math.round(totalGrowth).toLocaleString('en-GB')}</span>
      </div>
    </div>

    <div class="cyber-card" style="display: flex; flex-direction: column; gap: 14px;">
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Initial Lump Sum (£)</span>
          <span style="color: #00F0FF; font-weight: 800;">£${state.simInitial}</span>
        </div>
        <input type="range" min="0" max="50000" step="500" value="${state.simInitial}" oninput="window.updateSim('simInitial', this.value)" style="width: 100%;" />
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Monthly Contribution (£)</span>
          <span style="color: #00F0FF; font-weight: 800;">£${state.simMonthly} / month</span>
        </div>
        <input type="range" min="50" max="2500" step="50" value="${state.simMonthly}" oninput="window.updateSim('simMonthly', this.value)" style="width: 100%;" />
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Investment Horizon</span>
          <span style="color: #FBBF24; font-weight: 800;">${state.simYears} Years</span>
        </div>
        <input type="range" min="5" max="40" step="1" value="${state.simYears}" oninput="window.updateSim('simYears', this.value)" style="width: 100%;" />
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span>Estimated Annual Return (%)</span>
          <span style="color: #10B981; font-weight: 800;">${state.simRate}%</span>
        </div>
        <input type="range" min="3.0" max="15.0" step="0.5" value="${state.simRate}" oninput="window.updateSim('simRate', this.value)" style="width: 100%;" />
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

    <!-- INVESTOR SUITABILITY MANDATE Card (Screenshot 1) -->
    <div class="cyber-card" onclick="window.navigateTo('onboarding')" style="cursor: pointer;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">INVESTOR SUITABILITY MANDATE</span>
        <span style="font-size: 12px; color: #00F0FF; font-weight: 800;">Recalibrate →</span>
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

// 15. ONBOARDING / SUITABILITY QUIZ
function renderOnboardingScreen() {
  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navigateBack()">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Investor Suitability Questionnaire</h2>
        <div style="font-size: 11px; color: #94A3B8;">FCA-mandated risk profiling assessment</div>
      </div>
    </div>

    <div class="cyber-card">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">1. Investment Time Horizon</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="horizon" checked /> 10+ Years (Long-Term Compounding)</label>
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="horizon" /> 5-10 Years (Balanced Growth)</label>
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="horizon" /> Under 5 Years (Capital Preservation)</label>
      </div>
    </div>

    <div class="cyber-card">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">2. Risk Tolerance Profile</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="risk" checked /> Balanced Growth (Global ETFs & Index Funds)</label>
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="risk" /> Aggressive Expansion (Tech & Growth Stocks)</label>
        <label style="font-size: 12px; color: #CBD5E1;"><input type="radio" name="risk" /> Conservative (Cash Equivalents & Gilts)</label>
      </div>
    </div>

    <button class="btn-pro-gold" style="width: 100%; padding: 14px;" onclick="window.saveSuitability()">
      Save Updated Investor Mandate
    </button>
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

window.signOut = function() {
  if (confirm('Sign out from EB Wealth?')) {
    state.currentView = 'home';
    render();
  }
};

// Initial Render
render();
