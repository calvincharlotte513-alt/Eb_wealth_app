import { WebFirebaseService } from './firebase-config.js';

const firebaseService = new WebFirebaseService();

// State matching screenshot data exactly
let state = {
  currentTab: 'home', // 'home' | 'market' | 'learn' | 'portfolio' | 'profile'
  previousTab: 'home',
  showProModal: false,
  showAddHoldingModal: false,
  showCommunityModal: false,
  selectedLevel: 1,
  marketSearchQuery: '',
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
  holdings: JSON.parse(localStorage.getItem('eb_holdings') || '[]'),
  assets: [
    {
      ticker: 'VWRP',
      name: 'Vanguard FTSE All-World UCITS ETF',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£112.40',
      change: '+0.42%',
      peRatio: '19.8x',
      divYield: '1.8% (Accumulated)',
      marketCap: '£18.4 Billion',
      sector: 'Globally Diversified',
      currency: 'GBP'
    },
    {
      ticker: 'VUAG',
      name: 'Vanguard S&P 500 UCITS ETF (Acc)',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£85.25',
      change: '+0.38%',
      peRatio: '24.2x',
      divYield: '1.4% (Accumulated)',
      marketCap: '£32.1 Billion',
      sector: 'US Large Cap',
      currency: 'GBP'
    },
    {
      ticker: 'AZN',
      name: 'AstraZeneca PLC',
      type: 'Stock',
      exchange: 'London Stock Exchange (LSE)',
      price: '£104.50',
      change: '+1.12%',
      peRatio: '32.4x',
      divYield: '2.3% (Semi-Annual)',
      marketCap: '£162.0 Billion',
      sector: 'Pharmaceuticals',
      currency: 'GBP'
    },
    {
      ticker: 'EQGB',
      name: 'Invesco EQQQ Nasdaq 100 GBP Hedged',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£34.10',
      change: '+0.65%',
      peRatio: '28.1x',
      divYield: '0.6% (Accumulated)',
      marketCap: '£4.8 Billion',
      sector: 'Technology & Growth',
      currency: 'GBP'
    },
    {
      ticker: 'ISF',
      name: 'iShares Core FTSE 100 UCITS ETF',
      type: 'ETF',
      exchange: 'London Stock Exchange (LSE)',
      price: '£8.22',
      change: '+0.15%',
      peRatio: '12.8x',
      divYield: '3.8% (Distributing)',
      marketCap: '£11.2 Billion',
      sector: 'UK Blue Chip',
      currency: 'GBP'
    },
    {
      ticker: 'CSH2',
      name: 'Lyxor Smart Overnight Return UCITS ETF',
      type: 'Money Market',
      exchange: 'London Stock Exchange (LSE)',
      price: '£111.45',
      change: '+0.02%',
      peRatio: 'SONIA Base',
      divYield: '5.2% (Overnight Rate)',
      marketCap: '£2.4 Billion',
      sector: 'Cash & Liquidity',
      currency: 'GBP'
    }
  ],
  lessons: [
    { id: 1, title: 'What is Investing?', time: '2 min', xp: 50, completed: true },
    { id: 2, title: 'Saving vs Investing', time: '3 min', xp: 50, completed: false },
    { id: 3, title: 'The Magic of Compound Growth', time: '3 min', xp: 50, completed: false },
    { id: 4, title: 'Stocks, Bonds & Cash Explained', time: '4 min', xp: 50, completed: false },
    { id: 5, title: 'Index Funds & ETFs: The Ultimate Vehicle', time: '4 min', xp: 50, completed: false },
    { id: 6, title: 'Understanding Market Volatility', time: '5 min', xp: 50, completed: false }
  ]
};

const appEl = document.getElementById('app');

function render() {
  appEl.innerHTML = `
    <!-- Top Sticky Mobile Bar matching Screenshot -->
    <header class="mobile-top-bar">
      <div class="top-bar-left" onclick="window.navTo('home')">
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
        <button class="user-avatar-btn" onclick="window.navTo('profile')">
          ${(state.user.firstName || 'J').charAt(0).toUpperCase()}
        </button>
      </div>
    </header>

    <!-- Main Active Screen Content -->
    <main class="screen-scroll-container">
      ${renderActiveScreen()}
    </main>

    <!-- Floating Cyber Frosted Capsule Bottom Dock -->
    <div class="floating-bottom-dock-container">
      <nav class="floating-bottom-dock">
        <button class="dock-nav-item ${state.currentTab === 'home' ? 'active' : ''}" onclick="window.navTo('home')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span>Home</span>
        </button>

        <button class="dock-nav-item ${state.currentTab === 'market' ? 'active' : ''}" onclick="window.navTo('market')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <span>Market</span>
        </button>

        <button class="dock-nav-item ${state.currentTab === 'learn' ? 'active' : ''}" onclick="window.navTo('learn')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>
          </div>
          <span>Learn</span>
        </button>

        <button class="dock-nav-item ${state.currentTab === 'portfolio' ? 'active' : ''}" onclick="window.navTo('portfolio')">
          <div class="dock-icon-box">
            <svg viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2zm0 11.01V22c4.2 0 7.61-2.27 8.95-5.5L13 13.01z"/></svg>
          </div>
          <span>Portfolio</span>
        </button>
      </nav>
    </div>

    <!-- Modals -->
    ${state.showProModal ? renderProModal() : ''}
    ${state.showAddHoldingModal ? renderAddHoldingModal() : ''}
    ${state.showCommunityModal ? renderCommunityModal() : ''}
  `;
}

function renderActiveScreen() {
  switch (state.currentTab) {
    case 'home':
      return renderHomeScreen();
    case 'market':
      return renderMarketScreen();
    case 'learn':
      return renderLearnScreen();
    case 'portfolio':
      return renderPortfolioScreen();
    case 'profile':
      return renderProfileScreen();
    default:
      return renderHomeScreen();
  }
}

// 1. SCREEN: HOME (Matches Screenshot 2)
function renderHomeScreen() {
  return `
    <!-- EB Wealth Big Title -->
    <div class="hero-title-box">
      <div class="hero-title-main">
        <span class="eb">EB</span>
        <span class="wealth">Wealth</span>
      </div>
      <div class="hero-subtitle">Investment Education Platform</div>
    </div>

    <!-- Glowing Search Bar -->
    <div class="search-bar-cosmic" onclick="window.navTo('market')">
      <input type="text" placeholder="Search UK stocks, ETFs, lessons..." readonly />
      <div class="search-icon-btn">
        <svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </div>
    </div>

    <!-- 2x2 Quick Action Cards Grid -->
    <div class="quick-action-grid">
      <!-- Card 1: Market Galaxy -->
      <div class="quick-card" onclick="window.navTo('market')">
        <div class="quick-card-icon-box icon-cyan-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Market Galaxy</div>
          <div class="quick-card-sub">LSE & Global Movers</div>
        </div>
      </div>

      <!-- Card 2: Learning Nexus -->
      <div class="quick-card" onclick="window.navTo('learn')">
        <div class="quick-card-icon-box icon-blue-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Learning Nexus</div>
          <div class="quick-card-sub">6-Level Academy</div>
        </div>
      </div>

      <!-- Card 3: Portfolio Constellation -->
      <div class="quick-card" onclick="window.navTo('portfolio')">
        <div class="quick-card-icon-box icon-gold-box">
          <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2z"/></svg>
        </div>
        <div>
          <div class="quick-card-title">Portfolio Constellation</div>
          <div class="quick-card-sub">Holdings & Rebalance</div>
        </div>
      </div>

      <!-- Card 4: Community Forum -->
      <div class="quick-card" onclick="window.openCommunityModal()">
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
        <div class="carousel-card" onclick="window.navTo('market')">
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

// 2. SCREEN: MARKET INTELLIGENCE (Matches Screenshot 3)
function renderMarketScreen() {
  const filtered = state.assets.filter(a =>
    a.ticker.toLowerCase().includes(state.marketSearchQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(state.marketSearchQuery.toLowerCase())
  );

  return `
    <div class="market-top-row">
      <button class="back-btn-circle" onclick="window.navTo('home')">
        <svg style="width:20px;height:20px;" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div>
        <h2 style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Market Intelligence & Research</h2>
        <div style="font-size: 11px; color: #94A3B8;">London Stock Exchange (LSE) & Global ETFs</div>
      </div>
    </div>

    <!-- Search input -->
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

    <!-- Asset Cards list -->
    ${filtered.map(asset => `
      <div class="market-asset-card">
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

        <!-- 4-metric grid -->
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

        <!-- EB Health Scorecard -->
        <div class="health-scorecard-bar">
          <div style="display: flex; align-items: center; gap: 6px; color: #10B981; font-weight: 700;">
            <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>EB Health Scorecard</span>
          </div>
          <div style="color: #00F0FF; font-weight: 700; cursor: pointer;">View Factsheet →</div>
        </div>
      </div>
    `).join('')}
  `;
}

// 3. SCREEN: LEARN / ACADEMY (Matches Screenshot 5)
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

    <!-- Level Pills Row -->
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

    <!-- Lesson Cards list -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${state.lessons.map(l => `
        <div class="lesson-card-item" onclick="window.completeLesson(${l.id})">
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

// 4. SCREEN: PORTFOLIO (Matches Screenshot 4)
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

    <!-- TOTAL PORTFOLIO VALUATION Card -->
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

    <!-- Account & Geographic Allocation Card -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 800; color: #FFFFFF;">Account & Geographic Allocation</span>
        <span style="font-size: 11px; color: #00F0FF; font-weight: 700; cursor: pointer;">Rebalance Tool →</span>
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

    <!-- Holdings Section with Add Button -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
      <h3 style="font-size: 16px; font-weight: 900; color: #FFFFFF;">Holdings (${state.holdings.length})</h3>
      <button style="display: flex; align-items: center; gap: 6px; background: #00F0FF; color: #040B14; border: none; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="window.openAddHoldingModal()">
        <span>+ Add Holding</span>
      </button>
    </div>

    ${state.holdings.length === 0 ? `
      <div class="cyber-card" style="text-align: center; padding: 30px 20px;">
        <div style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">No holdings added yet in this account.</div>
        <button style="background: rgba(0, 240, 255, 0.2); border: 1px solid #00F0FF; color: #00F0FF; border-radius: 10px; padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer;" onclick="window.addSampleHoldings()">
          Load Sample UK Portfolio (VWRP + VUAG)
        </button>
      </div>
    ` : state.holdings.map((h, i) => `
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

// 5. SCREEN: PROFILE / VERIFIED CLIENT (Matches Screenshot 1)
function renderProfileScreen() {
  const isaRemaining = state.user.isaLimit - state.user.isaUsed;
  const isaPct = ((state.user.isaUsed / state.user.isaLimit) * 100).toFixed(1);

  return `
    <!-- Top Client Verification Card -->
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

    <!-- TAX YEAR 2024/2025 ALLOWANCES Card -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">TAX YEAR 2024/2025 ALLOWANCES</span>
        <span style="font-size: 11px; color: #94A3B8;">HMRC Regulated</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700;">
        <span style="color: #FFFFFF;">Stocks & Shares ISA Limit</span>
        <span style="color: #00F0FF; font-weight: 900;">£${state.user.isaUsed.toLocaleString('en-GB')} / £${state.user.isaLimit.toLocaleString('en-GB')}</span>
      </div>

      <!-- Dual tone progress bar with cyan end dot -->
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

    <!-- INVESTOR SUITABILITY MANDATE Card -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">INVESTOR SUITABILITY MANDATE</span>
        <span style="font-size: 12px; color: #00F0FF; font-weight: 800; cursor: pointer;">Recalibrate →</span>
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

// Pro Upgrade Modal
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

// Community Forum Modal
function renderCommunityModal() {
  return `
    <div class="modal-overlay" onclick="window.closeModals()">
      <div class="modal-content" style="max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 18px; font-weight: 900; color: #FFFFFF;">Community Forum & Events</h2>
          <button style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="cyber-card" style="padding: 12px; border-color: rgba(20, 184, 166, 0.5);">
            <div style="font-size: 11px; color: #2DD4BF; font-weight: 700;">UK INVESTING THREAD</div>
            <div style="font-size: 14px; font-weight: 800; color: #fff; margin: 4px 0;">Why 100% VWRP is the gold standard for UK Stocks & Shares ISA</div>
            <div style="font-size: 11px; color: #94A3B8;">42 Likes • 16 Comments • By James Henderson</div>
          </div>

          <div class="cyber-card" style="padding: 12px; border-color: rgba(20, 184, 166, 0.5);">
            <div style="font-size: 11px; color: #2DD4BF; font-weight: 700;">TAX YEAR 24/25 STRATEGY</div>
            <div style="font-size: 14px; font-weight: 800; color: #fff; margin: 4px 0;">Maximizing the £20,000 ISA allowance before April 5th</div>
            <div style="font-size: 11px; color: #94A3B8;">31 Likes • 9 Comments • By Sophia Patel</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Window Navigation Functions
window.navTo = function(tab) {
  state.previousTab = state.currentTab;
  state.currentTab = tab;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
};

window.openProModal = function() {
  state.showProModal = true;
  render();
};

window.openAddHoldingModal = function() {
  state.showAddHoldingModal = true;
  render();
};

window.openCommunityModal = function() {
  state.showCommunityModal = true;
  render();
};

window.closeModals = function() {
  state.showProModal = false;
  state.showAddHoldingModal = false;
  state.showCommunityModal = false;
  render();
};

window.selectLevel = function(lvl) {
  state.selectedLevel = lvl;
  render();
};

window.completeLesson = function(id) {
  const lesson = state.lessons.find(l => l.id === id);
  if (lesson) {
    lesson.completed = !lesson.completed;
    state.user.xp += lesson.completed ? lesson.xp : -lesson.xp;
    render();
  }
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

window.addSampleHoldings = function() {
  state.holdings = [
    { ticker: 'VWRP', name: 'Vanguard FTSE All-World UCITS ETF', shares: 50, avgBuyPrice: 102.50, currentPrice: 112.40 },
    { ticker: 'VUAG', name: 'Vanguard S&P 500 UCITS ETF', shares: 30, avgBuyPrice: 78.00, currentPrice: 85.25 }
  ];
  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  render();
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

window.triggerCloudSync = function() {
  alert('Syncing profile & holdings with Cloud Firestore: com-aistudio-ebwealth-kq-f6b41 ... Connected!');
};

window.signOut = function() {
  if (confirm('Sign out from EB Wealth?')) {
    state.currentTab = 'home';
    render();
  }
};

// Initial Render
render();
