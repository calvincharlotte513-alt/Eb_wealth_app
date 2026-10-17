import { WebFirebaseService } from './firebase-config.js';

const firebaseService = new WebFirebaseService();

// Centralized Application State
let state = {
  currentView: 'landing', // 'landing' | 'dashboard' | 'learn' | 'lesson_detail' | 'portfolio' | 'etf_overlap' | 'research' | 'simulator' | 'ai_coach' | 'community' | 'events' | 'news' | 'profile' | 'onboarding' | 'admin'
  navStack: ['landing'],
  selectedTicker: 'VWRP',
  selectedLessonId: 1,
  selectedLevel: 1,
  showProModal: false,
  showAddHoldingModal: false,
  editingHoldingIndex: null,
  marketSearchQuery: '',
  selectedCategory: 'All',
  overlapSelected: ['VWRP', 'VUAG'],
  simInitial: 5000,
  simMonthly: 500,
  simYears: 20,
  simRate: 8.5,
  registeredEvents: [1],
  onboardingStep: 1,
  onboardingData: {
    experience: 'Beginner',
    goal: 'Build long-term wealth',
    horizon: '10–20 years',
    monthly: '£250–£500',
    risk: 'Balanced Growth (Global ETFs & Index Funds)'
  },
  user: firebaseService.currentUser || {
    id: 'usr_8849_gb',
    firstName: 'Johnkennedy',
    email: 'johnkennedy3313@gmail.com',
    ref: 'REF: EB-8849-GB',
    region: 'United Kingdom • GBP Base',
    level: 2,
    levelTitle: 'Developing Investor',
    tierStatus: 'Standard Investor',
    isPro: false,
    isaUsed: 8450,
    isaLimit: 20000,
    sippUsed: 12500,
    sippLimit: 60000,
    capitalGainsLimit: 3000,
    dividendLimit: 500,
    xp: 420,
    streakDays: 4,
    monthlyContribution: 500
  },
  holdings: JSON.parse(localStorage.getItem('eb_holdings') || 'null') || [
    { ticker: 'VWRP', name: 'Vanguard FTSE All-World UCITS ETF', assetType: 'ETF', accountType: 'Stocks & Shares ISA', shares: 45, avgBuyPrice: 104.20, currentPrice: 112.40, category: 'Global Equities', currency: 'GBP', purchaseDate: '2024-01-15' },
    { ticker: 'VUAG', name: 'Vanguard S&P 500 UCITS ETF (Acc)', assetType: 'ETF', accountType: 'Stocks & Shares ISA', shares: 25, avgBuyPrice: 79.10, currentPrice: 85.25, category: 'US Equities', currency: 'GBP', purchaseDate: '2024-02-10' },
    { ticker: 'AZN', name: 'AstraZeneca PLC', assetType: 'Share', accountType: 'General Investment Account', shares: 15, avgBuyPrice: 98.40, currentPrice: 104.50, category: 'UK Healthcare', currency: 'GBP', purchaseDate: '2024-03-01' },
    { ticker: 'EQGB', name: 'Invesco EQQQ Nasdaq 100 GBP Hedged', assetType: 'ETF', accountType: 'SIPP', shares: 30, avgBuyPrice: 31.50, currentPrice: 34.10, category: 'Technology', currency: 'GBP', purchaseDate: '2024-03-20' },
    { ticker: 'CSH2', name: 'Lyxor Smart Overnight Return Cash', assetType: 'Money Market', accountType: 'Stocks & Shares ISA', shares: 20, avgBuyPrice: 108.50, currentPrice: 111.45, category: 'Cash & Liquidity', currency: 'GBP', purchaseDate: '2024-04-05' }
  ],
  assets: [
    {
      ticker: 'VWRP',
      name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
      type: 'ETF',
      market: 'London Stock Exchange (LSE)',
      price: '£112.40',
      priceNum: 112.40,
      change: '+0.42%',
      peRatio: '19.8x',
      divYield: '1.8% (Accumulated)',
      marketCap: '£18.4 Billion',
      sector: 'Globally Diversified',
      expenseRatio: '0.22%',
      currency: 'GBP',
      description: 'Physical replication covering over 3,700 large and mid-cap stocks across 49 developed and emerging market countries with auto-reinvesting dividends.',
      scorecard: {
        revenueGrowth: 'Strong',
        earningsGrowth: 'Strong',
        profitability: 'Strong',
        balanceSheet: 'Strong',
        cashFlow: 'Strong',
        valuation: 'Moderate',
        competitiveAdvantage: 'Strong',
        dividend: 'Strong',
        growthPotential: 'Strong',
        keyRisks: 'Moderate'
      },
      interesting: 'Provides instant exposure to 3,700+ companies globally with automatic dividend reinvestment.',
      investigation: 'Weighted heavily towards the US market (~64%), which creates dollar exposure.',
      investorQuestions: ['Does your portfolio already hold US-focused funds like VUAG?', 'Are you comfortable with emerging market volatility?']
    },
    {
      ticker: 'VUAG',
      name: 'Vanguard S&P 500 UCITS ETF (Acc)',
      type: 'ETF',
      market: 'London Stock Exchange (LSE)',
      price: '£85.25',
      priceNum: 85.25,
      change: '+0.38%',
      peRatio: '24.2x',
      divYield: '1.4% (Accumulated)',
      marketCap: '£32.1 Billion',
      sector: 'US Large Cap',
      expenseRatio: '0.07%',
      currency: 'GBP',
      description: 'Ultra-low cost tracker mirroring the 500 largest US publicly traded corporations with ongoing charge of only 0.07%.',
      scorecard: {
        revenueGrowth: 'Strong',
        earningsGrowth: 'Strong',
        profitability: 'Strong',
        balanceSheet: 'Strong',
        cashFlow: 'Strong',
        valuation: 'Moderate',
        competitiveAdvantage: 'Strong',
        dividend: 'Moderate',
        growthPotential: 'Strong',
        keyRisks: 'Moderate'
      },
      interesting: 'Top-tier cost efficiency with the highest historical 10-year annualized return among broad indexes.',
      investigation: 'Top 7 tech firms comprise nearly 30% of total index weighting (concentration risk).',
      investorQuestions: ['Are you over-allocated to mega-cap US tech?', 'What happens to your portfolio if the USD weakens against GBP?']
    },
    {
      ticker: 'AZN',
      name: 'AstraZeneca PLC',
      type: 'Share',
      market: 'London Stock Exchange (FTSE 100)',
      price: '£104.50',
      priceNum: 104.50,
      change: '+1.12%',
      peRatio: '32.4x',
      divYield: '2.3% (Semi-Annual)',
      marketCap: '£162.0 Billion',
      sector: 'Pharmaceuticals',
      expenseRatio: 'N/A',
      currency: 'GBP',
      description: 'Global biopharmaceutical leader focused on oncology, rare diseases, and cardiovascular innovations listed on the FTSE 100.',
      scorecard: {
        revenueGrowth: 'Strong',
        earningsGrowth: 'Strong',
        profitability: 'Strong',
        balanceSheet: 'Moderate',
        cashFlow: 'Strong',
        valuation: 'Moderate',
        competitiveAdvantage: 'Strong',
        dividend: 'Strong',
        growthPotential: 'Strong',
        keyRisks: 'Moderate'
      },
      interesting: 'World-class oncology pipeline delivering double-digit revenue expansion.',
      investigation: 'Patent expiry timelines and clinical trial execution risks require continual monitoring.',
      investorQuestions: ['How dependent is revenue on top three oncology medications?', 'Is the P/E ratio justified by pipeline approvals?']
    },
    {
      ticker: 'EQGB',
      name: 'Invesco EQQQ Nasdaq 100 GBP Hedged',
      type: 'ETF',
      market: 'London Stock Exchange (LSE)',
      price: '£34.10',
      priceNum: 34.10,
      change: '+0.65%',
      peRatio: '28.1x',
      divYield: '0.6% (Accumulated)',
      marketCap: '£4.8 Billion',
      sector: 'Technology & Innovation',
      expenseRatio: '0.35%',
      currency: 'GBP',
      description: 'Currency-hedged exposure to non-financial titans listed on the Nasdaq index protecting UK investors against USD fluctuations.',
      scorecard: {
        revenueGrowth: 'Strong',
        earningsGrowth: 'Strong',
        profitability: 'Strong',
        balanceSheet: 'Strong',
        cashFlow: 'Strong',
        valuation: 'Weak',
        competitiveAdvantage: 'Strong',
        dividend: 'Weak',
        growthPotential: 'Strong',
        keyRisks: 'Strong'
      },
      interesting: 'Eliminates currency fluctuations while capturing secular tech innovation.',
      investigation: 'Higher expense ratio and valuation multiples compared to standard S&P 500 funds.',
      investorQuestions: ['Do you require currency hedging for a 15-year horizon?', 'Can you tolerate high volatility during interest rate cycles?']
    },
    {
      ticker: 'ISF',
      name: 'iShares Core FTSE 100 UCITS ETF',
      type: 'ETF',
      market: 'London Stock Exchange (LSE)',
      price: '£8.22',
      priceNum: 8.22,
      change: '+0.15%',
      peRatio: '12.8x',
      divYield: '3.8% (Distributing)',
      marketCap: '£11.2 Billion',
      sector: 'UK Blue Chip',
      expenseRatio: '0.07%',
      currency: 'GBP',
      description: 'Benchmark fund holding the top 100 UK blue-chip companies with robust cash dividends and defensive characteristics.',
      scorecard: {
        revenueGrowth: 'Moderate',
        earningsGrowth: 'Moderate',
        profitability: 'Strong',
        balanceSheet: 'Strong',
        cashFlow: 'Strong',
        valuation: 'Strong',
        competitiveAdvantage: 'Strong',
        dividend: 'Strong',
        growthPotential: 'Moderate',
        keyRisks: 'Weak'
      },
      interesting: 'Attractive cash dividend yields with defensive, cash-generative holdings.',
      investigation: 'Lower growth rate over the last decade relative to US and global tech indices.',
      investorQuestions: ['Is high dividend income your primary objective?', 'Are you balancing low growth with higher-growth global assets?']
    },
    {
      ticker: 'CSH2',
      name: 'Lyxor Smart Overnight Return Cash ETF',
      type: 'Money Market',
      market: 'London Stock Exchange (LSE)',
      price: '£111.45',
      priceNum: 111.45,
      change: '+0.02%',
      peRatio: 'SONIA Base',
      divYield: '5.05% (Daily Acc)',
      marketCap: '£2.4 Billion',
      sector: 'Cash & Short-Term Debt',
      expenseRatio: '0.05%',
      currency: 'GBP',
      description: 'High-liquidity money market fund tracking the Bank of England Sterling Overnight Index Average (SONIA).',
      scorecard: {
        revenueGrowth: 'Moderate',
        earningsGrowth: 'Moderate',
        profitability: 'Strong',
        balanceSheet: 'Strong',
        cashFlow: 'Strong',
        valuation: 'Strong',
        competitiveAdvantage: 'Strong',
        dividend: 'Strong',
        growthPotential: 'Weak',
        keyRisks: 'Weak'
      },
      interesting: 'Ultra-safe cash parking yielding Bank of England benchmark rates without lockups.',
      investigation: 'Yield decreases immediately if the Bank of England reduces the base rate.',
      investorQuestions: ['How much cash is appropriate for your emergency reserve?', 'Are you holding dry powder for market corrections?']
    }
  ],
  levels: [
    { id: 1, title: 'Investing Foundations', desc: 'Core principles of capital, inflation, and risk' },
    { id: 2, title: 'Investment Types', desc: 'Shares, ETFs, Index Funds, Bonds, and Cash' },
    { id: 3, title: 'UK Investing', desc: 'Stocks & Shares ISA, SIPP, JISA, LISA & Tax rules' },
    { id: 4, title: 'Portfolio Building', desc: 'Asset allocation, ETF overlap, and rebalancing' },
    { id: 5, title: 'Stock Analysis', desc: 'Financial statements, P/E ratios, and moats' },
    { id: 6, title: 'Advanced Investing', desc: 'Factor strategies, dividend growth, and psychology' }
  ],
  lessons: [
    // Level 1: Foundations
    { id: 1, level: 1, title: 'What is Investing?', time: '2 min', xp: 50, completed: true, summary: 'Allocating capital into productive assets that generate compounding economic value over time.', example: 'Buying a piece of 3,700 global companies instead of letting cash sit in a bank account losing purchasing power to inflation.', takeaway: 'Investing owns ownership stakes in businesses and real assets that grow with human productivity.', quiz: { q: 'What is the primary advantage of investing over holding cash?', opts: ['Compounding returns that beat inflation', 'Guaranteed zero price fluctuation', 'Instant riches overnight'], ans: 0 } },
    { id: 2, level: 1, title: 'Saving vs Investing', time: '3 min', xp: 50, completed: true, summary: 'Cash provides short-term emergency liquidity; investments generate multi-decade wealth.', example: '3-6 months living expenses in an instant-access account; long-term retirement capital in global index funds.', takeaway: 'Never invest money you will need in the next 3 to 5 years.', quiz: { q: 'What is the recommended minimum time horizon for stock market investing?', opts: ['1 to 6 months', '5 to 10+ years', 'Overnight only'], ans: 1 } },
    { id: 3, level: 1, title: 'Compound Growth: 8th Wonder', time: '3 min', xp: 50, completed: false, summary: 'Compounding occurs when your investment returns begin earning their own returns.', example: '£500/month invested at 8% for 30 years yields £745,000 from just £180,000 of contributions.', takeaway: 'Time in the market matters exponentially more than timing the market.', quiz: { q: 'What factor accelerates compounding the most?', opts: ['Frequent day-trading', 'Long time horizons and reinvested dividends', 'Picking penny stocks'], ans: 1 } },
    { id: 4, level: 1, title: 'Inflation: The Silent Tax', time: '3 min', xp: 50, completed: false, summary: 'At 3% inflation, £10,000 cash loses half its purchasing power in approximately 24 years.', example: 'A pint of milk costing £0.50 twenty years ago costs £1.40 today.', takeaway: 'Holding 100% cash is a guaranteed loss of future living standards.', quiz: { q: 'How does inflation affect cash savings in a bank?', opts: ['Increases their purchasing power', 'Erodes their purchasing power over time', 'Has zero effect'], ans: 1 } },
    { id: 5, level: 1, title: 'Risk vs Reward Trade-Off', time: '4 min', xp: 50, completed: false, summary: 'Higher expected long-term returns always demand enduring short-term market volatility.', example: 'Global stocks fluctuate 15-20% in a given year but have historically delivered 7-10% annual gains over decades.', takeaway: 'Volatility is the entrance fee for building generational wealth.', quiz: { q: 'Can an investment offer guaranteed high returns with zero risk?', opts: ['Yes, if you pick the right guru', 'No, return is the compensation for taking risk', 'Yes, crypto guarantees it'], ans: 1 } },

    // Level 2: Investment Types
    { id: 6, level: 2, title: 'Shares (Equities) Explained', time: '3 min', xp: 60, completed: false, summary: 'A share represents fractional legal ownership in a commercial corporation.', example: 'Owning Apple or AstraZeneca stock entitles you to a portion of their net profits and assets.', takeaway: 'Shares provide dividend income and capital appreciation over business cycles.', quiz: { q: 'What does buying a share in a company make you?', opts: ['A lender to the company', 'A part owner (shareholder)', 'An employee'], ans: 1 } },
    { id: 7, level: 2, title: 'What is an ETF?', time: '3 min', xp: 60, completed: true, summary: 'Exchange Traded Funds hold hundreds of assets in a single basket traded like a stock on the LSE.', example: 'VWRP holds thousands of stocks worldwide for an annual fee of just 0.22%.', takeaway: 'ETFs provide instant professional diversification with low fees.', quiz: { q: 'Why are ETFs so popular among long-term investors?', opts: ['Instant diversification at ultra-low expense ratios', 'They guarantee you double your money', 'They avoid all taxes forever'], ans: 0 } },
    { id: 8, level: 2, title: 'Index Funds: Passive Power', time: '4 min', xp: 60, completed: false, summary: 'Passive index funds track entire benchmark markets without expensive active managers.', example: 'The S&P 500 index beats over 90% of active fund managers over 15-year periods.', takeaway: 'Do not search for the needle in the haystack; buy the whole haystack.', quiz: { q: 'What percentage of active managers beat index funds over 15 years?', opts: ['Over 90%', 'Fewer than 10-15%', '100%'], ans: 1 } },

    // Level 3: UK Investing
    { id: 9, level: 3, title: 'Stocks & Shares ISA Fortress', time: '4 min', xp: 75, completed: false, summary: 'The UK Government allows £20,000 per tax year to be invested 100% free of capital gains and dividend taxes forever.', example: 'Investing £20,000 in an ISA that grows to £1,000,000 yields zero tax when withdrawn.', takeaway: 'Maximize your ISA allowance every tax year before investing in taxable accounts.', quiz: { q: 'What is the annual UK Stocks & Shares ISA allowance for 2024/25?', opts: ['£10,000', '£20,000', '£50,000'], ans: 1 } },
    { id: 10, level: 3, title: 'SIPP: Pension Tax Relief', time: '4 min', xp: 75, completed: false, summary: 'Self-Invested Personal Pensions receive automatic 20% to 45% tax relief bonuses from HMRC upon deposit.', example: 'A basic-rate taxpayer depositing £800 gets an immediate £200 top-up from the government to make £1,000.', takeaway: 'SIPPs offer immediate upfront government tax relief for retirement capital.', quiz: { q: 'What is the immediate government top-up for basic rate taxpayers on SIPP deposits?', opts: ['Zero', '20% tax relief addition', '50% bonus'], ans: 1 } },

    // Level 4: Portfolio Building
    { id: 11, level: 4, title: 'The ETF Overlap Trap', time: '4 min', xp: 80, completed: false, summary: 'Holding multiple ETFs that own the same underlying companies creates unintended concentration risk.', example: 'Holding VWRP (All-World) and VUAG (S&P 500) gives you double exposure to Microsoft, Apple, and Nvidia.', takeaway: 'Check your ETF overlap to avoid paying double fees for the same underlying stocks.', quiz: { q: 'What happens when you hold both a Global All-World ETF and an S&P 500 ETF?', opts: ['Complete zero correlation', 'Significant overlap in large-cap US tech stocks', 'All fees are refunded'], ans: 1 } },
    { id: 12, level: 4, title: 'Core & Satellite Strategy', time: '4 min', xp: 80, completed: false, summary: 'Building 80-90% of your portfolio in broad index funds (Core) with 10-20% in high-conviction themes (Satellite).', example: '80% VWRP, 10% Technology ETF, 10% select individual UK blue chips.', takeaway: 'Protects downside while allowing measured exploration.', quiz: { q: 'What is the recommended size of the Core in a Core-Satellite portfolio?', opts: ['10-20%', '80-90%', '50% cash'], ans: 1 } }
  ],
  chatMessages: [
    { sender: 'ai', text: 'Good day, Johnkennedy! I am your EB Wealth AI Coach. I can explain investment concepts, clarify UK ISA and SIPP tax wrappers, analyze potential ETF overlap, or stress-test your monthly compounding plan. How may I assist your portfolio journey today?' }
  ],
  communityPosts: [
    { id: 1, author: 'James Henderson', category: 'UK Investing', title: 'Why 100% VWRP is the gold standard for UK Stocks & Shares ISA', content: 'With over 3,700 stocks and automatic dividend reinvesting (Acc), VWRP eliminates single-market risk and currency conversion fees for UK residents.', likes: 42, comments: 16, time: '2h ago' },
    { id: 2, author: 'Sophia Patel', category: 'ISA & Tax', title: 'Maximizing the £20,000 allowance before April 5th', content: 'Remember that uninvested cash inside a Stocks & Shares ISA still counts toward your allowance limit. Ensure you fund your account in time.', likes: 31, comments: 9, time: '5h ago' },
    { id: 3, author: 'Oliver Wright', category: 'JISA & Junior Accounts', title: 'Junior ISA compounding over 18 years is staggering', content: 'Just £100/month at a 7% annualized return equals ~£43,000 on your child’s 18th birthday, entirely tax-free.', likes: 54, comments: 22, time: '1d ago' }
  ],
  events: [
    { id: 1, title: 'UK Tax-Year-End Wealth Masterclass 2024/25', date: 'Thursday, 24 Oct • 18:30 GMT', host: 'EB Wealth Institutional Desk', spaces: '18 spaces left', price: 'Free for Members', description: 'Comprehensive walkthrough on how to maximize your £20,000 ISA, £3,000 CGT exemption, and SIPP pension tax relief.' },
    { id: 2, title: 'Global ETF Asset Allocation & Rebalancing', date: 'Tuesday, 29 Oct • 19:00 GMT', host: 'Senior Portfolio Strategist', spaces: '24 spaces left', price: 'Free for Members', description: 'Deep dive into market-cap weighting versus equal weighting with live Q&A session.' },
    { id: 3, title: 'JISA & Children Wealth Masterclass', date: 'Saturday, 9 Nov • 11:00 GMT', host: 'EB Wealth Education Lead', spaces: '40 spaces left', price: '£29 (Free for Pro)', description: 'Setting up compound interest engines for children using Junior ISAs and bare trusts.' }
  ],
  marketNews: [
    { id: 1, title: 'Bank of England Holds Base Rate at 5.00% Amid Steady Inflation', source: 'LSE Market Wire', time: '1 hour ago', snippet: 'Monetary Policy Committee signals measured approach to future interest rate adjustments, bolstering gilt yields.' },
    { id: 2, title: 'FTSE 100 Gains 0.4% as Healthcare and Defense Giants Rally', source: 'Financial Intelligence', time: '3 hours ago', snippet: 'AstraZeneca and BAE Systems lead benchmark index upward amidst positive clinical data releases.' },
    { id: 3, title: 'HMRC Reminds High Earners of Pension Tapering Rules Ahead of Autumn Budget', source: 'UK Tax Review', time: '1 day ago', snippet: 'Financial planners urge strategic utilization of SIPP carry-forward allowances prior to potential fiscal policy amendments.' }
  ]
};

const appEl = document.getElementById('app');

// Navigation Function
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
    state.currentView = 'dashboard';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

// Main Render
function render() {
  const isLanding = state.currentView === 'landing';

  appEl.innerHTML = `
    <!-- Top Desktop Navbar -->
    ${renderDesktopNavbar()}

    <!-- Main Dynamic View Content -->
    <main class="main-content">
      ${renderCurrentScreen()}
    </main>

    <!-- Floating Mobile Bottom Dock (Active on screens < 900px) -->
    ${!isLanding ? renderMobileDock() : ''}

    <!-- Floating AI Wealth Coach FAB -->
    ${['dashboard', 'landing'].includes(state.currentView) ? `
      <button class="fab-ai-coach" onclick="window.navigateTo('ai_coach')" title="Ask EB Wealth AI Coach">
        <svg style="width:26px;height:26px;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
        </svg>
      </button>
    ` : ''}

    <!-- Modals -->
    ${state.showProModal ? renderProModal() : ''}
    ${state.showAddHoldingModal ? renderAddHoldingModal() : ''}
  `;
}

// Desktop Top Navigation Bar
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
          <li><button class="desktop-nav-item ${v === 'landing' ? 'active' : ''}" onclick="window.navigateTo('landing')">Home</button></li>
          <li><button class="desktop-nav-item ${v === 'dashboard' ? 'active' : ''}" onclick="window.navigateTo('dashboard')">Dashboard</button></li>
          <li><button class="desktop-nav-item ${v === 'learn' || v === 'lesson_detail' ? 'active' : ''}" onclick="window.navigateTo('learn')">Learn</button></li>
          <li><button class="desktop-nav-item ${v === 'portfolio' ? 'active' : ''}" onclick="window.navigateTo('portfolio')">Portfolio</button></li>
          <li><button class="desktop-nav-item ${v === 'etf_overlap' ? 'active' : ''}" onclick="window.navigateTo('etf_overlap')">ETF Overlap</button></li>
          <li><button class="desktop-nav-item ${v === 'research' || v === 'asset_detail' ? 'active' : ''}" onclick="window.navigateTo('research')">Research</button></li>
          <li><button class="desktop-nav-item ${v === 'simulator' ? 'active' : ''}" onclick="window.navigateTo('simulator')">Simulator</button></li>
          <li><button class="desktop-nav-item ${v === 'ai_coach' ? 'active' : ''}" onclick="window.navigateTo('ai_coach')">AI Coach</button></li>
          <li><button class="desktop-nav-item ${v === 'community' ? 'active' : ''}" onclick="window.navigateTo('community')">Community</button></li>
          <li><button class="desktop-nav-item ${v === 'events' ? 'active' : ''}" onclick="window.navigateTo('events')">Events</button></li>
          <li><button class="desktop-nav-item ${v === 'admin' ? 'active' : ''}" onclick="window.navigateTo('admin')">Admin</button></li>
        </ul>
      </nav>

      <div class="desktop-nav-right">
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

// Mobile Floating Bottom Dock (Screen < 900px)
function renderMobileDock() {
  const v = state.currentView;
  return `
    <nav class="mobile-bottom-dock">
      <button class="dock-btn ${v === 'dashboard' ? 'active' : ''}" onclick="window.navigateTo('dashboard')">
        <div class="dock-icon-box"><svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></div>
        <span>Home</span>
      </button>

      <button class="dock-btn ${v === 'learn' ? 'active' : ''}" onclick="window.navigateTo('learn')">
        <div class="dock-icon-box"><svg viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z"/></svg></div>
        <span>Learn</span>
      </button>

      <button class="dock-btn ${v === 'portfolio' ? 'active' : ''}" onclick="window.navigateTo('portfolio')">
        <div class="dock-icon-box"><svg viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.95 7.5C20.61 4.27 17.2 2 13 2z"/></svg></div>
        <span>Portfolio</span>
      </button>

      <button class="dock-btn ${v === 'ai_coach' ? 'active' : ''}" onclick="window.navigateTo('ai_coach')">
        <div class="dock-icon-box"><svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>
        <span>AI Coach</span>
      </button>

      <button class="dock-btn ${v === 'profile' ? 'active' : ''}" onclick="window.navigateTo('profile')">
        <div class="dock-icon-box"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
        <span>Profile</span>
      </button>
    </nav>
  `;
}

// Router
function renderCurrentScreen() {
  switch (state.currentView) {
    case 'landing': return renderLandingPage();
    case 'dashboard': return renderDashboard();
    case 'learn': return renderLearn();
    case 'lesson_detail': return renderLessonDetail();
    case 'portfolio': return renderPortfolio();
    case 'etf_overlap': return renderETFOverlap();
    case 'research': return renderResearch();
    case 'asset_detail': return renderAssetDetail();
    case 'simulator': return renderSimulator();
    case 'ai_coach': return renderAICoach();
    case 'community': return renderCommunity();
    case 'events': return renderEvents();
    case 'news': return renderNews();
    case 'profile': return renderProfile();
    case 'onboarding': return renderOnboarding();
    case 'admin': return renderAdmin();
    default: return renderDashboard();
  }
}

// 1. PUBLIC HIGH-CONVERTING LANDING PAGE
function renderLandingPage() {
  return `
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
        <button class="btn-primary-glow" onclick="window.navigateTo('onboarding')">
          Start Learning Free →
        </button>
        <button class="btn-secondary-glass" onclick="window.navigateTo('dashboard')">
          Explore EB Wealth Demo
        </button>
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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <div style="font-size: 13px; color: #94A3B8;">INVESTOR PORTFOLIO SNAPSHOT</div>
              <div style="font-size: 28px; font-weight: 900; color: #FFFFFF;">£142,850.20</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #10B981; font-weight: 800;">+£24,350.20 (+20.5%)</div>
              <div style="font-size: 11px; color: #94A3B8;">Total Uncapped Gain</div>
            </div>
          </div>
          <div class="grid-4" style="margin-bottom: 16px;">
            <div class="stat-tile">
              <span class="stat-label">Stocks & Shares ISA</span>
              <span class="stat-value" style="font-size: 18px;">£8,450 / £20k</span>
              <span class="stat-sub" style="color: #00F0FF;">£11,550 Remaining</span>
            </div>
            <div class="stat-tile">
              <span class="stat-label">ETF Overlap Risk</span>
              <span class="stat-value" style="font-size: 18px; color: #F43F5E;">58.4%</span>
              <span class="stat-sub" style="color: #F43F5E;">VWRP vs VUAG</span>
            </div>
            <div class="stat-tile">
              <span class="stat-label">Curriculum Progress</span>
              <span class="stat-value" style="font-size: 18px; color: #FBBF24;">Level 2</span>
              <span class="stat-sub" style="color: #94A3B8;">7/10 Lessons Completed</span>
            </div>
            <div class="stat-tile">
              <span class="stat-label">AI Wealth Coach</span>
              <span class="stat-value" style="font-size: 18px; color: #10B981;">Online</span>
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
          <div class="feature-icon-box icon-cyan-glow">❓</div>
          <div class="feature-card-title">What to invest in</div>
          <div class="feature-card-desc">Paralysis by analysis across 10,000+ individual stocks and index funds with no clear starting point.</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box icon-gold-glow">⚖️</div>
          <div class="feature-card-title">How much risk to take</div>
          <div class="feature-card-desc">Understanding volatility without panicking when market cycles fluctuate or sentiment shifts.</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box icon-emerald-glow">📊</div>
          <div class="feature-card-title">Which ETF to choose</div>
          <div class="feature-card-desc">Distinguishing between S&P 500, All-World, accumulating (Acc) vs distributing (Dist) UCITS funds.</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box icon-cyan-glow">🔍</div>
          <div class="feature-card-title">Whether investments overlap</div>
          <div class="feature-card-desc">Paying double expense fees to hold the exact same mega-cap US tech companies inside multiple funds.</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box icon-gold-glow">🌐</div>
          <div class="feature-card-title">How to diversify properly</div>
          <div class="feature-card-desc">Balancing global equities, fixed income bonds, tax wrappers, and cash reserves for true stability.</div>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box icon-emerald-glow">🎯</div>
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
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">🎓</div>
          <div class="feature-card-title">1. Learn</div>
          <div class="feature-card-desc">Structured 6-level investor curriculum with short interactive lessons, quizzes, and earned XP.</div>
        </div>
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">🔬</div>
          <div class="feature-card-title">2. Analyse</div>
          <div class="feature-card-desc">Dedicated ETF Overlap Checker and institutional 10-point Stock Scorecards.</div>
        </div>
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">📈</div>
          <div class="feature-card-title">3. Track</div>
          <div class="feature-card-desc">Multi-wrapper portfolio tracking across Stocks & Shares ISA, SIPP, JISA, and GIA.</div>
        </div>
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">⚡</div>
          <div class="feature-card-title">4. Simulate</div>
          <div class="feature-card-desc">Interactive compound growth visualizer comparing contributions over 10, 20, and 30-year horizons.</div>
        </div>
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">🤖</div>
          <div class="feature-card-title">5. Ask</div>
          <div class="feature-card-desc">Conversational AI Wealth Coach offering instant educational clarity on complex financial concepts.</div>
        </div>
        <div class="feature-card">
          <div style="font-size: 24px; margin-bottom: 10px;">🌱</div>
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
  `;
}

// 2. MULTI-STEP ONBOARDING FLOW
function renderOnboarding() {
  const step = state.onboardingStep;

  return `
    <div style="max-width: 680px; margin: 40px auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 12px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">ONBOARDING STEP ${step} OF 6</span>
        <button style="background: none; border: none; color: #94A3B8; font-size: 12px; cursor: pointer;" onclick="window.navigateTo('dashboard')">Skip to Dashboard →</button>
      </div>

      <div class="progress-container">
        <div class="progress-fill-cyan" style="width: ${(step / 6) * 100}%;"></div>
      </div>

      <div class="cyber-card" style="margin-top: 24px;">
        ${renderOnboardingStepContent(step)}
      </div>
    </div>
  `;
}

function renderOnboardingStepContent(step) {
  switch (step) {
    case 1:
      return `
        <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">What best describes your investing background?</h2>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 24px;">We adapt our educational language and course pacing to your comfort level.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${['Complete beginner (Never invested before)', 'Beginner (Have opened an account, still learning)', 'Intermediate (Invest regularly in index funds/ETFs)', 'Experienced (Active long-term portfolio management)'].map((opt, i) => `
            <button class="btn-secondary-glass" style="text-align: left; padding: 16px; border-color: ${state.onboardingData.experience.includes(opt.split(' ')[0]) ? '#00F0FF' : 'rgba(255,255,255,0.15)'};" onclick="window.selectOnboarding('experience', '${opt.split(' ')[0]}')">
              ${opt}
            </button>
          `).join('')}
        </div>
      `;
    case 2:
      return `
        <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">What is your primary financial goal?</h2>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 24px;">Your objective dictates your asset allocation and tax wrapper selection.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${['Build long-term wealth', 'Retirement & Pension optimization', 'Financial independence (FIRE)', 'Children’s future (Junior ISA)', 'General investing & beat inflation', 'Learn before committing money'].map(goal => `
            <button class="btn-secondary-glass" style="text-align: left; padding: 16px; border-color: ${state.onboardingData.goal === goal ? '#00F0FF' : 'rgba(255,255,255,0.15)'};" onclick="window.selectOnboarding('goal', '${goal}')">
              ${goal}
            </button>
          `).join('')}
        </div>
      `;
    case 3:
      return `
        <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">How long do you plan to invest?</h2>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 24px;">Time horizon is the single greatest determinant of compound interest success.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${['Less than 5 years (Short-term / preservation)', '5–10 years (Balanced growth)', '10–20 years (Long-term compounding)', '20+ years (Generational wealth)'].map(h => `
            <button class="btn-secondary-glass" style="text-align: left; padding: 16px;" onclick="window.selectOnboarding('horizon', '${h}')">
              ${h}
            </button>
          `).join('')}
        </div>
      `;
    case 4:
      return `
        <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">How much could you potentially invest each month?</h2>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 24px;">Regular monthly contributions compound exponentially over time.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${['Under £100 per month', '£100 – £250 per month', '£250 – £500 per month', '£500 – £1,000 per month', '£1,000+ per month'].map(m => `
            <button class="btn-secondary-glass" style="text-align: left; padding: 16px;" onclick="window.selectOnboarding('monthly', '${m}')">
              ${m}
            </button>
          `).join('')}
        </div>
      `;
    case 5:
      return `
        <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">How comfortable are you with short-term market swings?</h2>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 24px;">Short-term volatility is the price paid for long-term equity returns.</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${['Conservative (I prefer capital safety and cash yields)', 'Balanced (I can tolerate 10-15% paper drawdowns)', 'Growth (I view market drops as buying opportunities)', 'High Volatility Tolerance (100% global equity compounding)'].map(r => `
            <button class="btn-secondary-glass" style="text-align: left; padding: 16px;" onclick="window.selectOnboarding('risk', '${r}')">
              ${r}
            </button>
          `).join('')}
        </div>
      `;
    case 6:
      return `
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
          <h2 style="font-size: 24px; font-weight: 900; color: #FFFFFF;">Your EB Investor Profile is Ready</h2>
          <p style="font-size: 13px; color: #94A3B8;">Calibrated based on your time horizon and risk parameters.</p>
        </div>

        <div style="background: rgba(0, 240, 255, 0.08); border: 1.5px solid #00F0FF; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-size: 11px; font-weight: 800; color: #00F0FF; letter-spacing: 0.8px;">OFFICIAL EB INVESTOR MANDATE</span>
            <span style="font-size: 11px; color: #FBBF24; font-weight: 700;">REF: EB-8849-GB</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
            <div>
              <div style="color: #94A3B8; font-size: 11px;">EXPERIENCE LEVEL</div>
              <div style="font-weight: 800; color: #fff; margin-top: 2px;">${state.onboardingData.experience}</div>
            </div>
            <div>
              <div style="color: #94A3B8; font-size: 11px;">PRIMARY GOAL</div>
              <div style="font-weight: 800; color: #fff; margin-top: 2px;">${state.onboardingData.goal}</div>
            </div>
            <div>
              <div style="color: #94A3B8; font-size: 11px;">TIME HORIZON</div>
              <div style="font-weight: 800; color: #fff; margin-top: 2px;">${state.onboardingData.horizon}</div>
            </div>
            <div>
              <div style="color: #94A3B8; font-size: 11px;">CALIBRATED CURRICULUM</div>
              <div style="font-weight: 800; color: #00F0FF; margin-top: 2px;">Level 1 — Foundations</div>
            </div>
          </div>
        </div>

        <p style="font-size: 11px; color: #64748B; margin-bottom: 24px; line-height: 1.5;">
          *Disclaimer: This is an educational profile designed to guide your study through the EB Wealth Academy and does not constitute regulated financial advice.
        </p>

        <button class="btn-primary-glow" style="width: 100%;" onclick="window.finishOnboarding()">
          Enter EB Wealth Dashboard →
        </button>
      `;
  }
}

// 3. INVESTMENT DASHBOARD
function renderDashboard() {
  const totalVal = state.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalGain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : '0.0';

  return `
    <!-- Top Greeting & Level Banner -->
    <div class="dashboard-header">
      <div>
        <h1 class="greeting-text">Good afternoon, ${state.user.firstName}</h1>
        <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">Welcome to your institutional wealth vault & learning cockpit.</div>
      </div>
      <div class="level-badge-box">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #FBBF24; color: #040B14; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 14px;">★</div>
        <div>
          <div style="font-size: 12px; font-weight: 900; color: #FFFFFF;">${state.user.levelTitle}</div>
          <div style="font-size: 10px; color: #00F0FF;">${state.user.xp} XP Points • ${state.user.streakDays}-Day Learning Streak</div>
        </div>
      </div>
    </div>

    <!-- Portfolio Snapshot 5-Card Grid -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-tile">
        <span class="stat-label">Total Portfolio Value</span>
        <span class="stat-value">£${totalVal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span class="stat-sub" style="color: #10B981;">+£${totalGain.toLocaleString('en-GB', { minimumFractionDigits: 2 })} (+${gainPct}%)</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">Total Capital Contributed</span>
        <span class="stat-value">£${totalCost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span class="stat-sub" style="color: #94A3B8;">Across ${state.holdings.length} Active Positions</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">2024/25 ISA Capacity</span>
        <span class="stat-value">£${state.user.isaUsed.toLocaleString('en-GB')} / £20k</span>
        <span class="stat-sub" style="color: #00F0FF;">£${(state.user.isaLimit - state.user.isaUsed).toLocaleString('en-GB')} Remaining Tax-Free</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">Monthly Compounding</span>
        <span class="stat-value">£${state.user.monthlyContribution}/mo</span>
        <span class="stat-sub" style="color: #FBBF24;">Target: 8.5% Annualized</span>
      </div>
    </div>

    <!-- Main Dashboard Row: Learning Progress + Portfolio Health -->
    <div class="grid-2" style="margin-bottom: 24px;">
      <!-- Card 1: Learning Progress -->
      <div class="cyber-card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px;">ACADEMY MOMENTUM</span>
          <span style="font-size: 12px; color: #94A3B8;">7 of 12 Lessons Completed</span>
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">Level 2: Investment Types & Vehicles</div>
        <div style="font-size: 12px; color: #94A3B8;">Next up: "Stocks, Bonds & Cash Explained"</div>
        <div class="progress-container">
          <div class="progress-fill-cyan" style="width: 58%;"></div>
        </div>
        <button class="btn-primary-glow" style="width: 100%; margin-top: 12px; padding: 12px;" onclick="window.navigateTo('learn')">
          Continue Learning (+60 XP) →
        </button>
      </div>

      <!-- Card 2: Portfolio Health Indicators -->
      <div class="cyber-card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 800; color: #FBBF24; letter-spacing: 0.5px;">PORTFOLIO HEALTH INDICATORS</span>
          <span style="font-size: 11px; color: #10B981; font-weight: 700;">● Educational Analysis</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Diversification Score:</span>
            <span style="color: #10B981; font-weight: 700;">High (Global Multi-Asset)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Geographic Exposure:</span>
            <span style="color: #FFFFFF; font-weight: 700;">64% US • 24% Global ex-US • 12% UK</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">ETF Overlap Risk:</span>
            <span style="color: #F43F5E; font-weight: 700;">58.4% Detected (VWRP & VUAG)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">HMRC Tax Fortress:</span>
            <span style="color: #00F0FF; font-weight: 700;">72% Sheltered in ISA / SIPP</span>
          </div>
        </div>
        <button class="btn-secondary-glass" style="width: 100%; margin-top: 14px; padding: 10px; font-size: 12px;" onclick="window.navigateTo('etf_overlap')">
          Inspect ETF Overlap →
        </button>
      </div>
    </div>

    <!-- Quick Tool Launchpad -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="cyber-card" style="cursor: pointer; margin-bottom: 0;" onclick="window.navigateTo('etf_overlap')">
        <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
        <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">ETF Overlap Checker</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Analyze duplicate company holdings between funds.</div>
      </div>
      <div class="cyber-card" style="cursor: pointer; margin-bottom: 0;" onclick="window.navigateTo('simulator')">
        <div style="font-size: 24px; margin-bottom: 8px;">📈</div>
        <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">Compound Simulator</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Forecast 10, 20 & 30-year wealth trajectories.</div>
      </div>
      <div class="cyber-card" style="cursor: pointer; margin-bottom: 0;" onclick="window.navigateTo('research')">
        <div style="font-size: 24px; margin-bottom: 8px;">🔬</div>
        <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">EB Stock Scorecards</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Review 10-point educational company metrics.</div>
      </div>
      <div class="cyber-card" style="cursor: pointer; margin-bottom: 0;" onclick="window.navigateTo('ai_coach')">
        <div style="font-size: 24px; margin-bottom: 8px;">🤖</div>
        <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">AI Wealth Coach</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Ask questions on stocks, ETFs, and UK ISA rules.</div>
      </div>
    </div>
  `;
}

// 4. LEARNING ACADEMY
function renderLearn() {
  const selectedLvl = state.selectedLevel;
  const filteredLessons = state.lessons.filter(l => l.level === selectedLvl);

  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Wealth Academy</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Structured 6-level investment curriculum from foundations to advanced wealth mastery.</div>
    </div>

    <!-- 6 Level Navigation Tabs -->
    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 24px;">
      ${state.levels.map(lvl => `
        <button class="btn-secondary-glass" style="padding: 10px 18px; white-space: nowrap; border-color: ${selectedLvl === lvl.id ? '#00F0FF' : 'rgba(255,255,255,0.15)'}; background: ${selectedLvl === lvl.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.05)'}; color: ${selectedLvl === lvl.id ? '#00F0FF' : '#FFFFFF'};" onclick="window.selectLevel(${lvl.id})">
          Level ${lvl.id}: ${lvl.title}
        </button>
      `).join('')}
    </div>

    <!-- Active Level Header Banner -->
    <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
      <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">LEVEL ${selectedLvl} MODULES</div>
      <div style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin: 4px 0;">${state.levels[selectedLvl - 1].title}</div>
      <div style="font-size: 13px; color: #94A3B8;">${state.levels[selectedLvl - 1].desc}</div>
    </div>

    <!-- Lesson Cards Grid -->
    <div class="grid-2">
      ${filteredLessons.map(lesson => `
        <div class="cyber-card" style="cursor: pointer;" onclick="window.navigateTo('lesson_detail', ${lesson.id})">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 800; color: ${lesson.completed ? '#10B981' : '#00F0FF'};">
              ${lesson.completed ? '✓ COMPLETED' : 'INCOMPLETE'}
            </span>
            <div style="display: flex; gap: 8px;">
              <span style="font-size: 11px; color: #94A3B8;">⏱ ${lesson.time}</span>
              <span style="font-size: 11px; font-weight: 800; color: #FBBF24;">+${lesson.xp} XP</span>
            </div>
          </div>
          <div style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">${lesson.title}</div>
          <div style="font-size: 12px; color: #94A3B8; line-height: 1.5; margin-bottom: 14px;">${lesson.summary}</div>
          <button class="btn-secondary-glass" style="width: 100%; padding: 8px; font-size: 12px;">
            ${lesson.completed ? 'Review Lesson & Quiz' : 'Start Lesson →'}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. LESSON DETAIL & QUIZ
function renderLessonDetail() {
  const lesson = state.lessons.find(l => l.id === state.selectedLessonId) || state.lessons[0];

  return `
    <div style="max-width: 760px; margin: 0 auto;">
      <button class="btn-secondary-glass" style="margin-bottom: 20px; padding: 8px 16px; font-size: 12px;" onclick="window.navigateTo('learn')">
        ← Back to Academy
      </button>

      <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 800; color: #00F0FF;">LEVEL ${lesson.level} • LESSON ${lesson.id}</span>
          <span style="font-size: 12px; font-weight: 800; color: #FBBF24;">+${lesson.xp} XP Available</span>
        </div>
        <h1 style="font-size: 26px; font-weight: 900; color: #FFFFFF; margin-bottom: 16px;">${lesson.title}</h1>

        <div style="font-size: 15px; color: #CBD5E1; line-height: 1.7; margin-bottom: 24px;">
          ${lesson.summary}
        </div>

        <!-- Real-world example card -->
        <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid #FBBF24; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 4px;">PRACTICAL UK EXAMPLE</div>
          <div style="font-size: 13px; color: #FFFFFF; line-height: 1.6;">${lesson.example}</div>
        </div>

        <!-- Key Takeaway -->
        <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10B981; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
          <div style="font-size: 12px; font-weight: 800; color: #10B981; margin-bottom: 4px;">KEY TAKEAWAY</div>
          <div style="font-size: 13px; color: #FFFFFF;">${lesson.takeaway}</div>
        </div>

        <!-- Interactive 3-Question Knowledge Quiz -->
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px;">
          <div style="font-size: 13px; font-weight: 800; color: #00F0FF; letter-spacing: 0.5px; margin-bottom: 8px;">KNOWLEDGE CHECKPOINT</div>
          <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-bottom: 16px;">${lesson.quiz.q}</div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${lesson.quiz.opts.map((opt, idx) => `
              <button class="btn-secondary-glass" style="text-align: left; padding: 14px; font-size: 13px;" onclick="window.answerQuiz(${lesson.id}, ${idx})">
                ${String.fromCharCode(65 + idx)}. ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 6. PORTFOLIO TRACKER
function renderPortfolio() {
  const totalVal = state.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalGain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(1) : '0.0';

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">Portfolio Constellation</h1>
        <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Track your UK ISA, SIPP, and general holdings with live valuations.</div>
      </div>
      <button class="btn-primary-glow" onclick="window.openAddHoldingModal()">
        + Add UK Investment
      </button>
    </div>

    <!-- Tax Year 2024/25 Allowance Tracker -->
    <div class="cyber-card" style="border-color: rgba(251, 191, 36, 0.35);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 12px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px;">UK TAX YEAR 2024/2025 WRAPPERS</span>
        <span style="font-size: 12px; color: #94A3B8;">HMRC Regulated</span>
      </div>
      <div class="grid-3" style="gap: 16px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 4px;">
            <span>Stocks & Shares ISA</span>
            <span style="color: #00F0FF;">£${state.user.isaUsed.toLocaleString('en-GB')} / £20,000</span>
          </div>
          <div class="progress-container">
            <div class="progress-fill-cyan" style="width: ${(state.user.isaUsed / state.user.isaLimit) * 100}%;"></div>
          </div>
          <div style="font-size: 10px; color: #94A3B8;">£${(state.user.isaLimit - state.user.isaUsed).toLocaleString('en-GB')} remaining tax-free</div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 4px;">
            <span>SIPP Pension Allowance</span>
            <span style="color: #FBBF24;">£${state.user.sippUsed.toLocaleString('en-GB')} / £60,000</span>
          </div>
          <div class="progress-container">
            <div class="progress-fill-gold" style="width: ${(state.user.sippUsed / state.user.sippLimit) * 100}%;"></div>
          </div>
          <div style="font-size: 10px; color: #94A3B8;">Up to 45% tax relief eligible</div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 4px;">
            <span>Capital Gains Exemption</span>
            <span style="color: #10B981;">£3,000 Limit</span>
          </div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">Dividend Allowance: £500.00 Tax-Free</div>
        </div>
      </div>
    </div>

    <!-- Holdings Table -->
    <div class="cyber-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 14px; font-weight: 800; color: #FFFFFF;">Your Investment Holdings (${state.holdings.length})</span>
        <button class="btn-secondary-glass" style="padding: 6px 12px; font-size: 11px;" onclick="window.triggerCloudSync()">
          ⚡ Sync to Cloud Firestore
        </button>
      </div>

      <div style="overflow-x: auto;">
        <table class="holdings-table">
          <thead>
            <tr>
              <th>ASSET / TICKER</th>
              <th>ACCOUNT WRAPPER</th>
              <th>SHARES</th>
              <th>AVG BUY</th>
              <th>CURRENT</th>
              <th>TOTAL VALUE</th>
              <th>RETURN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${state.holdings.map((h, i) => {
              const val = h.shares * h.currentPrice;
              const cost = h.shares * h.avgBuyPrice;
              const diff = val - cost;
              const diffPct = cost > 0 ? ((diff / cost) * 100).toFixed(1) : '0.0';

              return `
                <tr>
                  <td>
                    <div style="font-weight: 800; color: #00F0FF;">${h.ticker}</div>
                    <div style="font-size: 11px; color: #94A3B8;">${h.name}</div>
                  </td>
                  <td>
                    <span style="background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 6px; padding: 2px 8px; font-size: 11px; color: #00F0FF;">
                      ${h.accountType || 'Stocks & Shares ISA'}
                    </span>
                  </td>
                  <td>${h.shares}</td>
                  <td>£${Number(h.avgBuyPrice).toFixed(2)}</td>
                  <td>£${Number(h.currentPrice).toFixed(2)}</td>
                  <td style="font-weight: 800;">£${val.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style="color: ${diff >= 0 ? '#10B981' : '#F43F5E'}; font-weight: 700;">
                    ${diff >= 0 ? '+' : ''}£${diff.toFixed(2)} (${diffPct}%)
                  </td>
                  <td>
                    <button style="background: none; border: none; color: #F43F5E; cursor: pointer; font-size: 13px;" onclick="window.deleteHolding(${i})" title="Remove">✕</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. DEDICATED ETF OVERLAP CHECKER
function renderETFOverlap() {
  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">ETF Overlap Analyzer</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Identify duplicate holdings and unintended concentration risk across your funds.</div>
    </div>

    <!-- Comparison Selector Chips -->
    <div class="cyber-card">
      <div style="font-size: 12px; font-weight: 800; color: #00F0FF; margin-bottom: 12px;">SELECT ETFS TO COMPARE:</div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${['VWRP (FTSE All-World)', 'VUAG (S&P 500)', 'IITU (US Tech)', 'EQGB (Nasdaq 100 Hedged)', 'ISF (FTSE 100)'].map(etf => {
          const code = etf.split(' ')[0];
          const isSel = state.overlapSelected.includes(code);
          return `
            <button class="btn-secondary-glass" style="border-color: ${isSel ? '#00F0FF' : 'rgba(255,255,255,0.15)'}; background: ${isSel ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)'}; color: ${isSel ? '#00F0FF' : '#FFFFFF'};" onclick="window.toggleOverlapETF('${code}')">
              ${isSel ? '✓ ' : '+ '}${etf}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Overlap Gauge & Educational Warning -->
    <div class="overlap-gauge-box">
      <div style="font-size: 13px; font-weight: 800; color: #F43F5E; letter-spacing: 1px;">OVERLAP DETECTED</div>
      <div class="overlap-pct-huge">58.4%</div>
      <div style="font-size: 14px; color: #FFFFFF; font-weight: 700; margin: 4px 0 8px 0;">Between Vanguard FTSE All-World (VWRP) & Vanguard S&P 500 (VUAG)</div>
      <p style="font-size: 12px; color: #CBD5E1; max-width: 600px; margin: 0 auto; line-height: 1.5;">
        This combination significantly increases your concentration in US Large-Cap technology companies. Holding both funds means you are paying two separate ongoing fees while substantially replicating the same top 10 companies.
      </p>
    </div>

    <!-- Overlapping Holdings Breakdown Table -->
    <div class="cyber-card">
      <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-bottom: 16px;">Top Shared Company Holdings</div>
      <table class="holdings-table">
        <thead>
          <tr>
            <th>COMPANY</th>
            <th>WEIGHT IN VWRP</th>
            <th>WEIGHT IN VUAG</th>
            <th>COMBINED EXPOSURE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Microsoft Corp (MSFT)</strong></td>
            <td>3.1%</td>
            <td>6.4%</td>
            <td style="color: #F43F5E; font-weight: 900;">9.5%</td>
          </tr>
          <tr>
            <td><strong>Apple Inc (AAPL)</strong></td>
            <td>2.9%</td>
            <td>6.1%</td>
            <td style="color: #F43F5E; font-weight: 900;">9.0%</td>
          </tr>
          <tr>
            <td><strong>NVIDIA Corp (NVDA)</strong></td>
            <td>2.6%</td>
            <td>5.8%</td>
            <td style="color: #F43F5E; font-weight: 900;">8.4%</td>
          </tr>
          <tr>
            <td><strong>Amazon.com Inc (AMZN)</strong></td>
            <td>1.9%</td>
            <td>3.5%</td>
            <td style="color: #FBBF24; font-weight: 800;">5.4%</td>
          </tr>
          <tr>
            <td><strong>Alphabet Inc (GOOGL)</strong></td>
            <td>1.8%</td>
            <td>3.2%</td>
            <td style="color: #FBBF24; font-weight: 800;">5.0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// 8. RESEARCH & STOCK SCORECARDS
function renderResearch() {
  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Research Galaxy</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Legitimate LSE market data and 10-point educational stock scorecards.</div>
    </div>

    <!-- Search Bar -->
    <div class="cyber-card" style="padding: 14px; display: flex; gap: 10px;">
      <input type="text" placeholder="Search UK shares, ETFs, REITs by ticker or name..." style="flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 14px;" oninput="window.filterResearch(this.value)" />
      <span style="color: #00F0FF; font-weight: 700;">🔍 Search</span>
    </div>

    <!-- Asset Cards Grid -->
    <div class="grid-3">
      ${state.assets.map(a => `
        <div class="cyber-card" style="cursor: pointer;" onclick="window.navigateTo('asset_detail', '${a.ticker}')">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 18px; font-weight: 900; color: #00F0FF;">${a.ticker}</span>
            <span style="font-size: 12px; color: #10B981; font-weight: 800;">${a.change}</span>
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">${a.name}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-bottom: 12px;">${a.market}</div>

          <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
            <div>
              <div style="color: #94A3B8; font-size: 10px;">PRICE</div>
              <div style="font-weight: 800; color: #FFFFFF;">${a.price}</div>
            </div>
            <div>
              <div style="color: #94A3B8; font-size: 10px;">P/E RATIO</div>
              <div style="font-weight: 800; color: #FBBF24;">${a.peRatio}</div>
            </div>
            <div>
              <div style="color: #94A3B8; font-size: 10px;">DIV YIELD</div>
              <div style="font-weight: 800; color: #10B981;">${a.divYield.split(' ')[0]}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 9. ASSET DETAIL & 10-POINT SCORECARD
function renderAssetDetail() {
  const asset = state.assets.find(a => a.ticker === state.selectedTicker) || state.assets[0];

  return `
    <div style="max-width: 860px; margin: 0 auto;">
      <button class="btn-secondary-glass" style="margin-bottom: 20px; padding: 8px 16px; font-size: 12px;" onclick="window.navigateTo('research')">
        ← Back to Research
      </button>

      <div class="cyber-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
          <div>
            <span style="font-size: 28px; font-weight: 900; color: #00F0FF;">${asset.ticker}</span>
            <span style="font-size: 18px; color: #FFFFFF; font-weight: 700; margin-left: 10px;">${asset.name}</span>
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #FFFFFF;">${asset.price}</div>
        </div>
        <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6; margin-bottom: 20px;">${asset.description}</p>

        <!-- 10-Point EB Stock Scorecard -->
        <div style="background: rgba(0, 0, 0, 0.4); border-radius: 14px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 800; color: #FBBF24; letter-spacing: 0.8px; margin-bottom: 14px;">EB EDUCATIONAL SCORECARD</div>
          <div class="grid-2" style="gap: 10px; font-size: 12px;">
            ${Object.entries(asset.scorecard).map(([key, val]) => `
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span style="color: #94A3B8; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}:</span>
                <span style="font-weight: 800; color: ${val === 'Strong' ? '#10B981' : val === 'Moderate' ? '#FBBF24' : '#F43F5E'};">${val}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- What Looks Interesting & Key Questions -->
        <div class="grid-2" style="margin-bottom: 24px;">
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 800; color: #10B981; margin-bottom: 6px;">WHAT LOOKS INTERESTING</div>
            <div style="font-size: 13px; color: #fff;">${asset.interesting}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">WHAT NEEDS INVESTIGATION</div>
            <div style="font-size: 13px; color: #fff;">${asset.investigation}</div>
          </div>
        </div>

        <button class="btn-primary-glow" style="width: 100%;" onclick="window.addHoldingQuick('${asset.ticker}', '${asset.name}', ${asset.priceNum})">
          + Add ${asset.ticker} to My Portfolio
        </button>
      </div>
    </div>
  `;
}

// 10. COMPOUND GROWTH SIMULATOR
function renderSimulator() {
  const P = state.simInitial;
  const PMT = state.simMonthly;
  const t = state.simYears;
  const r = state.simRate / 100;
  const n = 12;

  // A = P(1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ]
  const compoundPrincipal = P * Math.pow(1 + r / n, n * t);
  const compoundMonthly = PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
  const finalVal = compoundPrincipal + compoundMonthly;
  const totalContributions = P + (PMT * 12 * t);
  const totalInterest = finalVal - totalContributions;

  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">Compound Wealth Simulator</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Forecast your compounding hockey-stick curve over 10 to 40-year horizons.</div>
    </div>

    <div class="grid-2">
      <!-- Controls -->
      <div class="cyber-card">
        <div class="slider-group">
          <div class="slider-label-row">
            <span style="color: #94A3B8;">Initial Deposit:</span>
            <span style="color: #00F0FF; font-weight: 900;">£${P.toLocaleString('en-GB')}</span>
          </div>
          <input type="range" min="0" max="50000" step="500" value="${P}" oninput="window.updateSim('simInitial', this.value)" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span style="color: #94A3B8;">Monthly Contribution:</span>
            <span style="color: #00F0FF; font-weight: 900;">£${PMT.toLocaleString('en-GB')} / mo</span>
          </div>
          <input type="range" min="25" max="3000" step="25" value="${PMT}" oninput="window.updateSim('simMonthly', this.value)" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span style="color: #94A3B8;">Time Horizon:</span>
            <span style="color: #FBBF24; font-weight: 900;">${t} Years</span>
          </div>
          <input type="range" min="1" max="40" step="1" value="${t}" oninput="window.updateSim('simYears', this.value)" />
        </div>

        <div class="slider-group">
          <div class="slider-label-row">
            <span style="color: #94A3B8;">Expected Annual Return:</span>
            <span style="color: #10B981; font-weight: 900;">${state.simRate}%</span>
          </div>
          <input type="range" min="3.0" max="15.0" step="0.5" value="${state.simRate}" oninput="window.updateSim('simRate', this.value)" />
        </div>
      </div>

      <!-- Results Display -->
      <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
        <div style="font-size: 12px; font-weight: 800; color: #00F0FF; letter-spacing: 0.8px;">PROJECTED WEALTH POOL</div>
        <div style="font-size: 42px; font-weight: 900; color: #FFFFFF; margin: 8px 0;">£${Math.round(finalVal).toLocaleString('en-GB')}</div>

        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px;">
          <span style="color: #94A3B8;">Total Principal Contributed:</span>
          <span style="color: #FFFFFF; font-weight: 800;">£${Math.round(totalContributions).toLocaleString('en-GB')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px;">
          <span style="color: #94A3B8;">Compound Interest Growth:</span>
          <span style="color: #10B981; font-weight: 900;">+£${Math.round(totalInterest).toLocaleString('en-GB')}</span>
        </div>

        <!-- Monthly Comparison Table -->
        <div style="margin-top: 16px; background: rgba(0,0,0,0.4); border-radius: 10px; padding: 12px; font-size: 11px;">
          <div style="color: #FBBF24; font-weight: 800; margin-bottom: 6px;">COMPARISON AT ${t} YEARS:</div>
          <div style="display: flex; justify-content: space-between; color: #94A3B8;">
            <span>£100/mo: £${Math.round(PMTToTotal(100, t, r)).toLocaleString('en-GB')}</span>
            <span>£250/mo: £${Math.round(PMTToTotal(250, t, r)).toLocaleString('en-GB')}</span>
            <span>£500/mo: £${Math.round(PMTToTotal(500, t, r)).toLocaleString('en-GB')}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function PMTToTotal(pmt, years, rate) {
  return pmt * ((Math.pow(1 + rate / 12, 12 * years) - 1) / (rate / 12));
}

// 11. AI WEALTH COACH
function renderAICoach() {
  return `
    <div style="max-width: 840px; margin: 0 auto;">
      <div style="margin-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Wealth AI Coach</h1>
        <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Institutional investment assistant. Clear answers on stocks, ETFs, and UK ISA tax rules.</div>
      </div>

      <!-- Quick Prompt Chips -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px;">
        <button class="btn-secondary-glass" style="font-size: 12px; white-space: nowrap;" onclick="window.sendPrompt('Explain ETFs to me.')">What is an ETF?</button>
        <button class="btn-secondary-glass" style="font-size: 12px; white-space: nowrap;" onclick="window.sendPrompt('What is the difference between VWRP and VUAG?')">VWRP vs VUAG</button>
        <button class="btn-secondary-glass" style="font-size: 12px; white-space: nowrap;" onclick="window.sendPrompt('How does the UK £20,000 Stocks & Shares ISA allowance work?')">UK ISA Rules</button>
        <button class="btn-secondary-glass" style="font-size: 12px; white-space: nowrap;" onclick="window.sendPrompt('Why might my portfolio have high US exposure?')">US Tech Concentration</button>
      </div>

      <!-- Message Thread -->
      <div class="cyber-card" style="min-height: 380px; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
          ${state.chatMessages.map(m => `
            <div style="display: flex; justify-content: ${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
              <div style="max-width: 80%; padding: 14px 18px; border-radius: 16px; font-size: 14px; line-height: 1.6; ${m.sender === 'user' ? 'background: #00F0FF; color: #040B14; font-weight: 700;' : 'background: rgba(10, 24, 46, 0.9); border: 1px solid rgba(0, 240, 255, 0.3); color: #FFFFFF;'}">
                ${m.text}
              </div>
            </div>
          `).join('')}
        </div>

        <form onsubmit="window.submitChat(event)" style="display: flex; gap: 10px;">
          <input type="text" id="ai-chat-input" placeholder="Ask any question about stocks, ETFs, compound interest, or UK ISA allowances..." style="flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 12px; padding: 14px 18px; color: #fff; font-size: 14px;" required />
          <button type="submit" class="btn-primary-glow" style="padding: 14px 24px;">Send</button>
        </form>
      </div>
    </div>
  `;
}

// 12. COMMUNITY FORUM
function renderCommunity() {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Investor Community</h1>
        <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Discussions, strategies, and questions from everyday UK wealth builders.</div>
      </div>
      <button class="btn-primary-glow" onclick="alert('Community post editor: Share your strategy or question with the community.')">
        + New Discussion
      </button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${state.communityPosts.map(p => `
        <div class="cyber-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 800; color: #00F0FF; background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 4px;">${p.category}</span>
            <span style="font-size: 11px; color: #94A3B8;">${p.time} • Posted by ${p.author}</span>
          </div>
          <div style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">${p.title}</div>
          <div style="font-size: 13px; color: #CBD5E1; line-height: 1.6; margin-bottom: 14px;">${p.content}</div>
          <div style="display: flex; gap: 16px; font-size: 12px; color: #94A3B8;">
            <span>👍 ${p.likes} Upvotes</span>
            <span>💬 ${p.comments} Replies</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 13. MASTERCLASSES & EVENTS
function renderEvents() {
  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Wealth Masterclasses & Live Q&A</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Live webinars, interactive coaching, and tax-year planning workshops.</div>
    </div>

    <div class="grid-3">
      ${state.events.map(e => `
        <div class="cyber-card">
          <div style="font-size: 11px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">${e.spaces}</div>
          <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">${e.title}</div>
          <div style="font-size: 12px; color: #00F0FF; font-weight: 700; margin-bottom: 4px;">📅 ${e.date}</div>
          <div style="font-size: 12px; color: #94A3B8; margin-bottom: 12px;">Host: ${e.host}</div>
          <p style="font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 18px;">${e.description}</p>
          <button class="btn-primary-glow" style="width: 100%; padding: 10px; font-size: 12px;" onclick="window.toggleRegister(${e.id})">
            ${state.registeredEvents.includes(e.id) ? '✓ Registered' : 'Register Free'}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

// 14. MARKET NEWS
function renderNews() {
  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">LSE & Global Market News</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Curated institutional wire summaries for long-term UK investors.</div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${state.marketNews.map(n => `
        <div class="cyber-card">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #00F0FF;">${n.source}</span>
            <span style="font-size: 11px; color: #94A3B8;">${n.time}</span>
          </div>
          <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">${n.title}</div>
          <div style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">${n.snippet}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// 15. PROFILE & IDENTITY
function renderProfile() {
  return `
    <div style="max-width: 760px; margin: 0 auto;">
      <div class="cyber-card" style="border-color: rgba(0, 240, 255, 0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">
            VERIFIED WEALTH CLIENT
          </span>
          <span style="font-size: 12px; color: #94A3B8; font-weight: 700;">${state.user.ref}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 20px;">
          <div class="user-avatar-circle" style="width: 64px; height: 64px; font-size: 26px;">
            ${(state.user.firstName || 'J').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-size: 24px; font-weight: 900; color: #FFFFFF;">${state.user.firstName}</div>
            <div style="font-size: 13px; color: #94A3B8;">${state.user.email}</div>
            <div style="font-size: 12px; color: #00F0FF; font-weight: 700; margin-top: 4px;">${state.user.region}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div>
            <div style="font-size: 11px; color: #94A3B8; font-weight: 700;">MEMBERSHIP TIER</div>
            <div style="font-size: 16px; font-weight: 900; color: #FFFFFF;">${state.user.isPro ? 'EB Wealth Pro Member' : 'Standard Investor'}</div>
          </div>
          <button class="btn-pro-pill" onclick="window.openProModal()">
            ${state.user.isPro ? 'Manage Pro' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid-2">
        <button class="btn-secondary-glass" style="padding: 14px;" onclick="window.navigateTo('onboarding')">
          Recalibrate Investor Mandate →
        </button>
        <button class="btn-secondary-glass" style="padding: 14px; border-color: rgba(251, 191, 36, 0.4); color: #FBBF24;" onclick="window.navigateTo('admin')">
          👑 EB Wealth Admin Console →
        </button>
      </div>

      <div style="margin-top: 20px; display: flex; gap: 12px;">
        <button class="btn-primary-glow" style="flex: 1;" onclick="window.triggerCloudSync()">
          ⚡ Force Cloud Firestore Sync
        </button>
        <button class="btn-secondary-glass" style="border-color: #F43F5E; color: #F43F5E;" onclick="window.signOut()">
          Sign Out
        </button>
      </div>
    </div>
  `;
}

// 16. ADMIN CONSOLE
function renderAdmin() {
  return `
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; color: #FFFFFF;">EB Wealth Admin Console</h1>
      <div style="font-size: 14px; color: #94A3B8; margin-top: 4px;">Platform analytics, revenue & curriculum management.</div>
    </div>

    <!-- Executive Business Metrics -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-tile">
        <span class="stat-label">Total Users</span>
        <span class="stat-value">4,820</span>
        <span class="stat-sub" style="color: #10B981;">+14% Month-on-Month</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">Pro Subscribers</span>
        <span class="stat-value">1,248</span>
        <span class="stat-sub" style="color: #FBBF24;">£12,410 MRR</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">Course Completion</span>
        <span class="stat-value">68.4%</span>
        <span class="stat-sub" style="color: #00F0FF;">High Engagement</span>
      </div>
      <div class="stat-tile">
        <span class="stat-label">AI Coach Queries</span>
        <span class="stat-value">32,940</span>
        <span class="stat-sub" style="color: #10B981;">99.8% Safety Pass</span>
      </div>
    </div>

    <!-- Top Performing Educational Content -->
    <div class="cyber-card">
      <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-bottom: 14px;">Top Performing Educational Content</div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <span>Level 3: Stocks & Shares ISA Tax Fortress</span>
        <span style="color: #10B981; font-weight: 800;">3,890 completions (94% quiz pass)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <span>Level 4: The ETF Overlap Trap</span>
        <span style="color: #10B981; font-weight: 800;">3,410 completions (91% quiz pass)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0;">
        <span>Level 1: What is Investing?</span>
        <span style="color: #10B981; font-weight: 800;">4,210 completions (98% quiz pass)</span>
      </div>
    </div>
  `;
}

// Modals
function renderProModal() {
  return `
    <div class="modal-overlay" onclick="window.closeModals()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 22px; font-weight: 900; color: #FFFFFF;">Upgrade to EB Wealth Pro</h2>
          <button style="background: none; border: none; color: #94A3B8; font-size: 22px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 20px;">Unlock all 6 levels, unlimited AI coaching, stock scorecards, and the ETF overlap analyzer.</p>
        <div style="background: rgba(0, 240, 255, 0.1); border: 1px solid #00F0FF; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 28px; font-weight: 900; color: #FFFFFF;">£9.99 <span style="font-size: 14px; color: #94A3B8;">/ month</span></div>
          <div style="font-size: 12px; color: #10B981; font-weight: 700; margin-top: 4px;">✓ 14-Day Free Trial • Cancel Anytime</div>
        </div>
        <button class="btn-primary-glow" style="width: 100%;" onclick="window.upgradeToPro()">
          Activate Pro Membership →
        </button>
      </div>
    </div>
  `;
}

function renderAddHoldingModal() {
  return `
    <div class="modal-overlay" onclick="window.closeModals()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="font-size: 20px; font-weight: 900; color: #FFFFFF;">Add UK Investment Holding</h2>
          <button style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;" onclick="window.closeModals()">✕</button>
        </div>
        <form onsubmit="window.saveHolding(event)">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">TICKER (e.g. VWRP, VUAG, AZN)</label>
              <input type="text" id="holding-ticker" required style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
            </div>
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">ASSET NAME</label>
              <input type="text" id="holding-name" required placeholder="e.g. Vanguard FTSE All-World" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
            </div>
            <div>
              <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">ACCOUNT WRAPPER</label>
              <select id="holding-account" style="width: 100%; background: #071322; border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;">
                <option value="Stocks & Shares ISA">Stocks & Shares ISA</option>
                <option value="SIPP">SIPP Pension</option>
                <option value="Junior ISA (JISA)">Junior ISA (JISA)</option>
                <option value="Lifetime ISA (LISA)">Lifetime ISA (LISA)</option>
                <option value="General Investment Account">General Investment Account (GIA)</option>
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">SHARES</label>
                <input type="number" step="any" id="holding-shares" required placeholder="10" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
              <div>
                <label style="font-size: 11px; color: #94A3B8; font-weight: 700;">CURRENT PRICE (£)</label>
                <input type="number" step="any" id="holding-price" required placeholder="112.40" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 8px; padding: 10px; color: #fff; margin-top: 4px;" />
              </div>
            </div>
            <button type="submit" class="btn-primary-glow" style="margin-top: 12px;">Save Investment</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Global Handlers
window.navigateTo = navigateTo;
window.navigateBack = navigateBack;

window.selectLevel = function(lvl) {
  state.selectedLevel = lvl;
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

window.closeModals = function() {
  state.showProModal = false;
  state.showAddHoldingModal = false;
  render();
};

window.upgradeToPro = function() {
  state.user.isPro = true;
  state.user.tierStatus = 'Pro Wealth Member';
  state.showProModal = false;
  alert('Congratulations! Your EB Wealth Pro membership is now active.');
  render();
};

window.saveHolding = function(e) {
  e.preventDefault();
  const ticker = document.getElementById('holding-ticker').value.toUpperCase().trim();
  const name = document.getElementById('holding-name').value.trim();
  const accountType = document.getElementById('holding-account').value;
  const shares = parseFloat(document.getElementById('holding-shares').value) || 1;
  const currentPrice = parseFloat(document.getElementById('holding-price').value) || 100;

  state.holdings.push({
    ticker,
    name,
    accountType,
    shares,
    avgBuyPrice: currentPrice,
    currentPrice,
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  state.showAddHoldingModal = false;
  render();
};

window.deleteHolding = function(index) {
  if (confirm('Delete this holding from your portfolio?')) {
    state.holdings.splice(index, 1);
    localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
    render();
  }
};

window.addHoldingQuick = function(ticker, name, price) {
  state.holdings.push({
    ticker,
    name,
    accountType: 'Stocks & Shares ISA',
    shares: 10,
    avgBuyPrice: price,
    currentPrice: price,
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
  alert(`Added 10 shares of ${ticker} to your portfolio!`);
  window.navigateTo('portfolio');
};

window.toggleOverlapETF = function(code) {
  if (state.overlapSelected.includes(code)) {
    if (state.overlapSelected.length > 2) {
      state.overlapSelected = state.overlapSelected.filter(c => c !== code);
    } else {
      alert('Keep at least 2 ETFs selected for overlap analysis.');
    }
  } else {
    state.overlapSelected.push(code);
  }
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
    if (promptText.toLowerCase().includes('vwrp') || promptText.toLowerCase().includes('vuag')) {
      response = "VWRP covers over 3,700 global companies with ~64% US exposure. VUAG tracks the 500 largest US corporations exclusively. Holding both results in 58.4% overlap in top tech stocks (Microsoft, Apple, Nvidia). For maximum simplicity, many investors choose VWRP as their single global core.";
    }
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
  if (choiceIndex === lesson.quiz.ans) {
    lesson.completed = true;
    state.user.xp += lesson.xp;
    alert(`🎉 Correct! You earned +${lesson.xp} XP points!`);
    render();
  } else {
    alert('Not quite right. Review the lesson summary and try again!');
  }
};

window.toggleRegister = function(id) {
  if (state.registeredEvents.includes(id)) {
    state.registeredEvents = state.registeredEvents.filter(x => x !== id);
  } else {
    state.registeredEvents.push(id);
    alert('You have registered for this masterclass! Check your email for Zoom calendar invites.');
  }
  render();
};

window.selectOnboarding = function(key, value) {
  state.onboardingData[key] = value;
  state.onboardingStep++;
  render();
};

window.finishOnboarding = function() {
  state.user.experienceLevel = state.onboardingData.experience;
  state.user.primaryGoal = state.onboardingData.goal;
  window.navigateTo('dashboard');
};

window.triggerCloudSync = async function() {
  try {
    await firebaseService.syncProfile(state.user);
    await firebaseService.syncHoldings(state.holdings);
    alert(`⚡ Cloud Firestore Synchronized Successfully!\nDatabase: ${firebaseService.databaseId || 'Active'}\nProject: com-aistudio-ebwealth-kq-f6b41\n\nYour portfolio holdings and profile state are in live sync across Android, iOS, and Web.`);
  } catch (err) {
    alert(`Local cache synchronized. Active offline fallback mode for Firestore: ${err.message || 'Complete'}`);
  }
  render();
};

window.signOut = function() {
  if (confirm('Sign out from EB Wealth?')) {
    state.currentView = 'landing';
    render();
  }
};

// Initial Render
render();
