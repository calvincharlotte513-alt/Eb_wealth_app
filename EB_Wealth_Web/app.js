// ============================================================
//  EB Wealth PWA — app.js
//  Complete Single-Page App — No framework dependencies
// ============================================================

import { WebFirebaseService } from './firebase-config.js';

// ── Firebase (graceful fallback if config missing) ──────────
let firebase;
try {
  firebase = new WebFirebaseService();
} catch (e) {
  firebase = {
    currentUser: null,
    signIn: async () => { throw new Error('Offline mode'); },
    register: async () => { throw new Error('Offline mode'); },
    signOut: async () => {},
    saveUserData: async () => {},
    getUserData: async () => null,
    askAI: async (prompt) => getLocalAIResponse(prompt)
  };
}

// ============================================================
//  SEED DATA
// ============================================================

const SEED_HOLDINGS = [
  { id: 1, ticker: 'VWRP', name: 'Vanguard FTSE All-World UCITS ETF', assetType: 'ETF', shares: 45, avgPrice: 104.20, currentPrice: 112.40, accountType: 'Stocks & Shares ISA', geography: 'Global', sector: 'Diversified' },
  { id: 2, ticker: 'VUAG', name: 'Vanguard S&P 500 UCITS ETF', assetType: 'ETF', shares: 25, avgPrice: 79.10, currentPrice: 85.25, accountType: 'Stocks & Shares ISA', geography: 'US', sector: 'Diversified' },
  { id: 3, ticker: 'AZN', name: 'AstraZeneca PLC', assetType: 'Stock', shares: 10, avgPrice: 98.40, currentPrice: 112.20, accountType: 'General Investment Account', geography: 'UK', sector: 'Healthcare' }
];

const SEED_POSTS = [
  { id: 1, author: 'Sarah K.', level: 'Confident Investor', category: 'ETFs', title: 'Why I switched from VUSA to VWRP', content: 'After 2 years of holding VUSA, I made the switch to VWRP for better global diversification. Here is why... VWRP gives exposure to 3,700+ stocks across 49 countries, whereas VUSA only tracks the S&P 500. While US dominance is undeniable, VWRP naturally adjusts its US weighting as markets evolve. For long-term investors, this automatic rebalancing is invaluable.', likes: 24, comments: 8, time: '2h ago', liked: false },
  { id: 2, author: 'Marcus L.', level: 'Strategic Investor', category: 'ISA/SIPP', title: 'ISA vs SIPP: My experience managing both', content: 'I have been running both wrappers for 5 years. My strategy is to max ISA first, then top up SIPP. The ISA gives me flexibility to access funds if needed, while the SIPP locks away money for retirement with that sweet tax relief on the way in. Basic rate taxpayers get 20% relief — higher rate taxpayers even more.', likes: 41, comments: 15, time: '5h ago', liked: false },
  { id: 3, author: 'Emma R.', level: 'Developing Investor', category: 'UK Investing', title: 'First £10k invested — lessons learned', content: 'It took me 8 months to reach my first £10,000 milestone. The biggest lesson: consistency over timing. I tried timing the market in months 1-3 and made zero progress. Switched to a standing order of £500/month into VWRP and everything changed. Pound cost averaging removes the anxiety of trying to pick the right time.', likes: 67, comments: 23, time: '1d ago', liked: false },
  { id: 4, author: 'James T.', level: 'EB Wealth Builder', category: 'ETFs', title: 'EQQQ vs VWRP — the Nasdaq question', content: 'A lot of beginners ask about Nasdaq exposure. Here is my breakdown of whether EQQQ adds real value. VWRP already holds around 28% in tech (Apple, Microsoft, Nvidia etc). Adding EQQQ concentrates further into US tech. This can boost returns in bull markets but dramatically increases volatility. Only suitable if you have a 15+ year horizon and can stomach 40%+ drawdowns.', likes: 89, comments: 31, time: '2d ago', liked: false },
  { id: 5, author: 'Priya M.', level: 'Confident Investor', category: 'Property', title: 'REITs vs physical property for passive income', content: 'Both have merits. REITs offer liquidity, physical property offers leverage. My portfolio uses both. UK REITs must pay out 90% of rental income as dividends, making them excellent income generators. VHYL includes REITs in its dividend-focused basket. Physical property offers leverage that amplifies returns but also risk and requires active management.', likes: 35, comments: 12, time: '3d ago', liked: false }
];

const SEED_EVENTS = [
  { id: 1, title: 'ISA Deadline Workshop', date: '30 Oct 2026', time: '7:00 PM GMT', type: 'Webinar', description: 'Learn how to make the most of your remaining ISA allowance before the April deadline. Includes live Q&A with EB Wealth certified coaches.', registered: false },
  { id: 2, title: 'ETF Masterclass: Building a Global Portfolio', date: '15 Nov 2026', time: '6:30 PM GMT', type: 'Workshop', description: 'Deep dive into ETF selection, OCF comparison, and building a low-cost globally diversified portfolio. Practical exercises included.', registered: false },
  { id: 3, title: 'Dividend Strategy Webinar', date: '5 Dec 2026', time: '7:30 PM GMT', type: 'Webinar', description: 'Income investing for the UK investor. Dividend ETFs, REIT allocations, and tax-efficient strategies inside your ISA.', registered: true }
];

const SEED_NEWS = [
  { id: 1, headline: 'Bank of England holds rates at 4.75% as inflation edges toward target', source: 'Financial Times', time: '2h ago', category: 'Macro' },
  { id: 2, headline: 'FTSE 100 climbs to 6-week high as mining stocks rally on China stimulus', source: 'Reuters', time: '4h ago', category: 'UK Markets' },
  { id: 3, headline: 'Vanguard announces OCF cut on VWRP to 0.19% from January', source: 'This is Money', time: '1d ago', category: 'ETFs' },
  { id: 4, headline: 'ISA subscriptions hit record £87bn in 2025/26 tax year', source: 'HMRC', time: '2d ago', category: 'ISA/SIPP' },
  { id: 5, headline: 'AstraZeneca shares surge 4.2% on positive Phase 3 trial data', source: 'Bloomberg', time: '3d ago', category: 'Stocks' }
];

const ACADEMY_LEVELS = [
  {
    level: 1, title: 'Investor Starter', description: 'Core investing foundations for beginners',
    lessons: [
      {
        id: 'L1_1', title: 'What Is Investing?', subtitle: 'Why your money works harder invested than saved', readTime: '5 min', xp: 50,
        explanation: 'Investing is putting your money to work by purchasing assets that have the potential to grow in value over time. Unlike saving in a bank account which earns low interest, investing in stocks, ETFs, and bonds has historically returned 7-10% annually over long periods.',
        example: 'If you invest £5,000 today in a global ETF like VWRP averaging 8% per year, after 30 years you would have £50,313 — 10x your original investment — without adding another penny.',
        takeaways: [
          'Investing beats inflation over the long term',
          'Compound growth is the eighth wonder of the world',
          'Starting early matters more than the amount you invest',
          'Risk and return are always linked'
        ],
        quiz: [
          { q: 'What is the primary advantage of investing over saving?', options: ['Higher guaranteed returns', 'Long-term growth that beats inflation', 'No risk of losing money', 'Daily liquidity'], correct: 1, explain: 'Investing provides long-term growth potential that historically beats inflation, unlike savings accounts.' },
          { q: 'Which UCITS ETF covers over 3,700 global stocks?', options: ['VUAG', 'ISF', 'VWRP', 'CSPX'], correct: 2, explain: 'VWRP (Vanguard FTSE All-World) covers 3,700+ stocks across 49 countries.' },
          { q: 'What is compound growth?', options: ['Growth on your original investment only', 'Growth on both your principal and accumulated returns', 'A guaranteed 7% annual return', 'Interest paid monthly by your broker'], correct: 1, explain: 'Compound growth means you earn returns on your original investment AND on previous returns.' }
        ]
      },
      {
        id: 'L1_2', title: 'Stock Market Fundamentals', subtitle: 'How shares, exchanges and prices work', readTime: '6 min', xp: 50,
        explanation: 'The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. In the UK, the main exchange is the London Stock Exchange (LSE). Share prices are determined by supply and demand — driven by company performance, economic news, and investor sentiment.',
        example: 'When AstraZeneca reports strong drug trial results, demand for AZN shares increases. More buyers than sellers push the price up. If you owned 10 shares at £98, they might jump to £112 — a £140 gain.',
        takeaways: [
          'Shares represent fractional ownership of a company',
          'The LSE is the UK primary exchange',
          'Prices move based on supply and demand',
          'Market cap = share price × total shares outstanding'
        ],
        quiz: [
          { q: 'What does owning a share represent?', options: ['A loan to a company', 'Fractional ownership in a company', 'A guaranteed dividend payment', 'A government bond'], correct: 1, explain: 'Shares represent fractional ownership — you own a small piece of the company.' },
          { q: 'What is the UK primary stock exchange?', options: ['NYSE', 'NASDAQ', 'London Stock Exchange', 'Euronext'], correct: 2, explain: 'The London Stock Exchange (LSE) is the primary UK stock exchange, home to the FTSE 100 and FTSE 250.' },
          { q: 'What primarily drives share price changes?', options: ['Government policy alone', 'Supply and demand from buyers and sellers', 'The company CEO decisions only', 'Random fluctuation'], correct: 1, explain: 'Share prices are determined by supply and demand — when more people want to buy than sell, prices rise.' }
        ]
      },
      {
        id: 'L1_3', title: 'ISA vs SIPP Explained', subtitle: 'Maximise your tax-free investing wrappers', readTime: '7 min', xp: 75,
        explanation: 'The UK offers two powerful tax-free investment wrappers: the ISA (Individual Savings Account) and SIPP (Self-Invested Personal Pension). ISAs allow you to invest up to £20,000 per tax year with no capital gains or income tax on returns. SIPPs allow pension contributions with 20-45% tax relief on the way in.',
        example: 'A basic rate taxpayer contributing £800 to a SIPP receives £200 government top-up (20% relief), making it £1,000 invested. A higher rate taxpayer can claim an additional 20% via self-assessment — so a £600 contribution becomes £1,000.',
        takeaways: [
          'ISA: £20,000/year limit, tax-free growth and withdrawals',
          'SIPP: Tax relief on contributions, access from age 57',
          'Use ISA first for flexibility',
          'SIPP for long-term pension building with tax advantages'
        ],
        quiz: [
          { q: 'What is the annual ISA allowance for 2025/26?', options: ['£15,000', '£20,000', '£25,000', '£50,000'], correct: 1, explain: 'The annual ISA allowance is £20,000 per tax year (April 6 – April 5).' },
          { q: 'When can you access a SIPP?', options: ['Any time after investing', 'From age 55 (rising to 57 in 2028)', 'Only at state retirement age', 'After 10 years of contributions'], correct: 1, explain: 'SIPPs can currently be accessed from age 55, rising to 57 in 2028.' },
          { q: 'What tax relief does a basic rate taxpayer get on SIPP contributions?', options: ['No tax relief', '10% relief', '20% relief', '45% relief'], correct: 2, explain: 'Basic rate taxpayers get 20% tax relief, so a £800 contribution becomes £1,000 in the SIPP.' }
        ]
      },
      {
        id: 'L1_4', title: 'ETFs & Index Funds', subtitle: 'Low-cost passive investing explained', readTime: '6 min', xp: 50,
        explanation: 'ETFs (Exchange-Traded Funds) are baskets of stocks that track an index like the FTSE All-World or S&P 500. They offer instant diversification across hundreds or thousands of companies with a single purchase. UK UCITS ETFs are regulated, currency-hedged options listed on the LSE.',
        example: 'VWRP (TER 0.22%) holds 3,700 stocks across 49 countries. If you invest £10,000, you effectively own tiny fractions of Apple, Microsoft, Samsung, HSBC, and thousands more — spreading your risk globally.',
        takeaways: [
          'ETFs track indexes passively — lower costs than active funds',
          'TER (Total Expense Ratio) is the annual cost — lower is better',
          'UCITS ETFs are EU-regulated and suitable for UK investors',
          'Accumulating ETFs reinvest dividends automatically'
        ],
        quiz: [
          { q: 'What does TER stand for?', options: ['Total Earnings Return', 'Total Expense Ratio', 'Tax Equivalent Rate', 'Trade Execution Rate'], correct: 1, explain: 'TER (Total Expense Ratio) is the annual cost of owning an ETF, expressed as a percentage.' },
          { q: 'What does an accumulating ETF do with dividends?', options: ['Pay them out quarterly', 'Reinvest them automatically', 'Hold them in cash', 'Donate to charity'], correct: 1, explain: 'Accumulating ETFs reinvest dividends back into the fund, enhancing compound growth.' },
          { q: 'How many stocks does VWRP hold?', options: ['500', '1,200', '3,700+', '10,000+'], correct: 2, explain: 'VWRP holds over 3,700 stocks across 49 developed and emerging market countries.' }
        ]
      },
      {
        id: 'L1_5', title: 'Building Your First Portfolio', subtitle: 'Diversification, allocation and getting started', readTime: '8 min', xp: 100,
        explanation: 'A well-built portfolio balances risk across different asset classes, geographies, and sectors. For most UK beginners, a simple two-ETF portfolio (e.g. VWRP 80% + VHYL 20%) provides excellent global diversification with income. Adding bonds reduces volatility for shorter time horizons.',
        example: 'The classic "three-fund portfolio": 70% global equities (VWRP), 20% bonds (VAGS), 10% UK equities (ISF). This has historically delivered 6-8% annual returns with significantly less volatility than a 100% equity portfolio.',
        takeaways: [
          'Never put all eggs in one basket — diversify globally',
          'Rebalance annually to maintain target allocation',
          'Keep costs low — avoid high-TER active funds',
          'Automate monthly contributions for pound-cost averaging'
        ],
        quiz: [
          { q: 'What is pound-cost averaging?', options: ['Buying at the lowest price each month', 'Investing a fixed amount regularly regardless of price', 'Converting currencies at the best rate', 'Averaging multiple broker fees'], correct: 1, explain: 'Pound-cost averaging means investing a fixed amount regularly — you buy more shares when prices are low and fewer when high.' },
          { q: 'What is the benefit of annual portfolio rebalancing?', options: ['Maximises short-term gains', 'Eliminates all risk', 'Maintains your target asset allocation', 'Avoids all tax liability'], correct: 2, explain: 'Rebalancing restores your target allocation when markets shift one asset class higher or lower.' },
          { q: 'For a beginner with 20+ years horizon, which allocation is most appropriate?', options: ['100% government bonds', '100% cash savings', 'High equity, low bond allocation', 'Equal split across all asset classes'], correct: 2, explain: 'Long time horizons allow riding out market volatility — higher equity allocation historically provides better long-term returns.' }
        ]
      }
    ]
  },
  { level: 2, title: 'Developing Investor', description: 'Technical analysis and deeper market knowledge', lessons: [] },
  { level: 3, title: 'Confident Investor', description: 'Advanced strategies and tax optimisation', lessons: [] },
  { level: 4, title: 'Strategic Investor', description: 'Portfolio management and wealth preservation', lessons: [] },
  { level: 5, title: 'EB Wealth Builder', description: 'Institutional-grade investment strategies', lessons: [] }
];

const ETF_OVERLAPS = {
  'VWRP+VUAG': 62, 'VUAG+VWRP': 62,
  'VWRP+VUSA': 58, 'VUSA+VWRP': 58,
  'VWRP+IWDA': 71, 'IWDA+VWRP': 71,
  'VUAG+VUSA': 95, 'VUSA+VUAG': 95,
  'VWRP+EQQQ': 28, 'EQQQ+VWRP': 28,
  'VWRP+VHYL': 45, 'VHYL+VWRP': 45,
  'VWRP+ISF':  25, 'ISF+VWRP':  25,
  'VUAG+EQQQ': 55, 'EQQQ+VUAG': 55,
  'VUSA+EQQQ': 52, 'EQQQ+VUSA': 52
};

const ETF_TOP_HOLDINGS = {
  'VWRP': [
    { name: 'Apple Inc', w1: '4.1%', w2: '—', ov: '4.1%' },
    { name: 'Microsoft Corp', w1: '3.8%', w2: '—', ov: '3.8%' },
    { name: 'NVIDIA Corp', w1: '3.1%', w2: '—', ov: '3.1%' },
    { name: 'Amazon.com Inc', w1: '2.3%', w2: '—', ov: '2.3%' },
    { name: 'Alphabet Inc', w1: '1.9%', w2: '—', ov: '1.9%' }
  ]
};

// ============================================================
//  STATE
// ============================================================

let state = {
  view: 'auth',
  user: null,
  holdings: JSON.parse(localStorage.getItem('eb_holdings') || 'null') || [],
  lessonProgress: JSON.parse(localStorage.getItem('eb_lesson_progress') || '{}'),
  communityPosts: JSON.parse(localStorage.getItem('eb_posts') || 'null') || [],
  chatMessages: JSON.parse(localStorage.getItem('eb_chat') || '[]'),
  events: JSON.parse(localStorage.getItem('eb_events') || 'null') || [],
  news: SEED_NEWS,
  selectedLesson: null,
  selectedTicker: null,
  overlapSelected: ['VWRP', 'VUAG'],
  simInitial: 5000,
  simMonthly: 500,
  simYears: 20,
  simRate: 8.5,
  navHistory: [],
  showAddHolding: false,
  showNewPost: false,
  authTab: 'signin',
  authLoading: false,
  authError: '',
  onboardingStep: 0,
  onboardingData: {},
  communityTab: 'posts',
  communityFilter: 'All',
  expandedPostId: null,
  quizAnswers: {},
  quizSubmitted: false,
  openLevelId: 1,
  isTyping: false,
  xp: parseInt(localStorage.getItem('eb_xp') || '0'),
  streak: parseInt(localStorage.getItem('eb_streak') || '3'),
  isaUsed: 8450
};

// Seed data if empty
if (!state.holdings.length) state.holdings = [...SEED_HOLDINGS];
if (!state.communityPosts.length) state.communityPosts = [...SEED_POSTS];
if (!state.events.length) state.events = [...SEED_EVENTS];

// Check if user already logged in locally
const localUser = localStorage.getItem('eb_user');
if (localUser) {
  try {
    state.user = JSON.parse(localUser);
    state.view = 'dashboard';
  } catch (e) {}
}

// ============================================================
//  STATE MANAGEMENT
// ============================================================

function setState(updates) {
  Object.assign(state, updates);
  persistState();
  render();
}

function persistState() {
  try {
    localStorage.setItem('eb_holdings', JSON.stringify(state.holdings));
    localStorage.setItem('eb_lesson_progress', JSON.stringify(state.lessonProgress));
    localStorage.setItem('eb_posts', JSON.stringify(state.communityPosts));
    localStorage.setItem('eb_chat', JSON.stringify(state.chatMessages));
    localStorage.setItem('eb_events', JSON.stringify(state.events));
    localStorage.setItem('eb_xp', String(state.xp));
    localStorage.setItem('eb_streak', String(state.streak));
    if (state.user) localStorage.setItem('eb_user', JSON.stringify(state.user));
  } catch (e) {}
}

// ============================================================
//  UTILITIES
// ============================================================

function fmt(n, d = 2) {
  return '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtPct(n, d = 2) {
  return (n >= 0 ? '+' : '') + Number(n).toFixed(d) + '%';
}

function fmtNum(n, d = 2) {
  return Number(n).toFixed(d);
}

function gainClass(val) {
  return val >= 0 ? 'pos' : 'neg';
}

function gainBadgeClass(val) {
  return val >= 0 ? 'positive' : 'negative';
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getFirstName() {
  if (!state.user) return 'Investor';
  const n = state.user.displayName || state.user.name || state.user.email || '';
  return n.split(' ')[0] || 'Investor';
}

function getLevelTitle(xp) {
  if (xp < 200)  return { title: 'Investor Starter',    num: 1 };
  if (xp < 500)  return { title: 'Developing Investor', num: 2 };
  if (xp < 1000) return { title: 'Confident Investor',  num: 3 };
  if (xp < 2000) return { title: 'Strategic Investor',  num: 4 };
  return              { title: 'EB Wealth Builder',  num: 5 };
}

function getLevelXPRange(xp) {
  if (xp < 200)  return { min: 0, max: 200 };
  if (xp < 500)  return { min: 200, max: 500 };
  if (xp < 1000) return { min: 500, max: 1000 };
  if (xp < 2000) return { min: 1000, max: 2000 };
  return              { min: 2000, max: 3000 };
}

function calcPortfolio() {
  let totalValue = 0, totalCost = 0;
  state.holdings.forEach(h => {
    totalValue += h.shares * h.currentPrice;
    totalCost  += h.shares * h.avgPrice;
  });
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;
  return { totalValue, totalCost, gain, gainPct };
}

function calcHolding(h) {
  const value = h.shares * h.currentPrice;
  const cost  = h.shares * h.avgPrice;
  const gain  = value - cost;
  const pct   = cost > 0 ? (gain / cost) * 100 : 0;
  return { value, cost, gain, pct };
}

function showToast(msg, type = 'gold', duration = 2500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function navigate(view, extras = {}) {
  state.navHistory.push(state.view);
  setState({ view, ...extras });
}

function goBack() {
  const prev = state.navHistory.pop();
  if (prev) setState({ view: prev });
  else setState({ view: 'dashboard' });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
//  AI COACH
// ============================================================

function getLocalAIResponse(prompt) {
  const p = (prompt || '').toLowerCase();
  if (p.includes('vwrp')) return 'VWRP is Vanguard FTSE All-World UCITS ETF — it tracks 3,700+ stocks across 49 countries with a TER of 0.22%. It is one of the most recommended ETFs for UK investors seeking global diversification in a single fund. The accumulating version reinvests dividends automatically for maximum compound growth.';
  if (p.includes('isa')) return 'The Stocks & Shares ISA is your most powerful UK investment wrapper. You can invest up to £20,000 per tax year (April 6 – April 5) with zero capital gains tax and zero income tax on any returns. Always max your ISA before investing in a General Investment Account (GIA).';
  if (p.includes('sipp') || p.includes('pension')) return 'A SIPP (Self-Invested Personal Pension) gives you 20-45% tax relief on contributions depending on your tax band. The money grows tax-free but can only be accessed from age 57 (from 2028). Ideal for long-term retirement building alongside your ISA.';
  if (p.includes('etf') || p.includes('index fund')) return 'ETFs (Exchange-Traded Funds) are the most efficient way to invest for most people. Look for: 1) Low TER (under 0.25%), 2) UCITS regulated, 3) Accumulating share class for compound growth, 4) Physical replication. VWRP, VUAG, and VHYL are excellent UK-listed options.';
  if (p.includes('beginner') || p.includes('start')) return 'For beginners, the EB Wealth recommended starting path: 1) Open a Stocks & Shares ISA with a platform like Vanguard, InvestEngine, or Freetrade, 2) Set up a monthly standing order of whatever you can afford, 3) Start with VWRP for global diversification, 4) Increase contributions as your income grows. Simplicity and consistency beat complexity every time.';
  if (p.includes('diversi')) return 'Diversification spreads risk across different assets. For UK investors: hold global ETFs (not just UK stocks), include different sectors (tech, healthcare, energy), and consider some bonds if your horizon is under 10 years. VWRP already gives you 49-country diversification in one fund.';
  if (p.includes('pound cost') || p.includes('monthly') || p.includes('dca')) return 'Pound-cost averaging (PCA) means investing a fixed amount every month regardless of market conditions. When markets fall, your £200/month buys more shares. When they rise, you benefit from your earlier lower-cost purchases. It removes the impossible task of timing the market.';
  if (p.includes('risk')) return 'Your risk profile should match your time horizon. Under 5 years: 40-60% equities, rest in bonds/cash. 5-10 years: 70-80% equities. 10-20 years: 80-90% equities. 20+ years: 90-100% equities. Young investors can afford more risk — time smooths out volatility.';
  if (p.includes('vuag') || p.includes('s&p 500') || p.includes('sp500')) return 'VUAG tracks the S&P 500 — the 500 largest US companies. With a TER of 0.07%, it is one of the cheapest ETFs available. It is great for US concentration, but remember you are entirely dependent on the US market. Combined with VWRP, you will increase your US weighting significantly — check the ETF Overlap tool to see the overlap percentage.';
  if (p.includes('overlap')) return 'ETF overlap occurs when two funds hold the same underlying stocks. High overlap means you are less diversified than you think. For example, VWRP and VUAG share about 62% of holdings since VWRP already has significant US exposure. Use the ETF Overlap Checker in the Portfolio section to analyse your specific holdings.';
  if (p.includes('tax') || p.includes('capital gains')) return 'UK investors can use their ISA allowance (£20,000/year) to shelter all gains from Capital Gains Tax. Outside an ISA, the CGT annual exempt amount is £3,000 for 2024/25. Higher rate taxpayers pay 20% CGT on investment gains above this threshold. Always maximise your ISA before investing in a GIA.';
  if (p.includes('compound') || p.includes('interest')) return 'Compound interest is the process where your returns generate their own returns. Einstein allegedly called it the eighth wonder of the world. A £10,000 investment growing at 8% annually becomes £46,610 after 20 years without adding anything extra. The key variable is time — starting 10 years earlier nearly doubles your outcome.';
  return 'That is a great question! As your EB Wealth AI Coach, my advice is always anchored in long-term, evidence-based UK investing principles. Consider: consistent monthly contributions, low-cost UCITS ETFs, maximising your ISA allowance, and ignoring short-term market noise. What specific aspect of investing would you like to explore further?';
}

async function sendAIMessage(prompt) {
  const userMsg = { role: 'user', content: prompt, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
  const newMessages = [...state.chatMessages, userMsg];
  setState({ chatMessages: newMessages, isTyping: true });
  scrollChat();

  try {
    let response;
    if (firebase && firebase.askAI) {
      response = await Promise.race([
        firebase.askAI(prompt),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
      ]);
    } else {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      response = getLocalAIResponse(prompt);
    }
    const aiMsg = { role: 'ai', content: response, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
    setState({ chatMessages: [...state.chatMessages.filter(m => m !== userMsg), userMsg, aiMsg], isTyping: false });
  } catch (e) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const fallback = getLocalAIResponse(prompt);
    const aiMsg = { role: 'ai', content: fallback, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) };
    setState({ chatMessages: [...state.chatMessages, aiMsg], isTyping: false });
  }
  scrollChat();
}

function scrollChat() {
  requestAnimationFrame(() => {
    const msgs = document.querySelector('.ai-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  });
}

// ============================================================
//  COMPOUND SIMULATOR CALCULATION
// ============================================================

function calcCompound(P, pmt, years, rate) {
  const r = rate / 100 / 12;
  const n = years * 12;
  let fv;
  if (r === 0) {
    fv = P + pmt * n;
  } else {
    fv = P * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
  }
  const totalInvested = P + pmt * n;
  const growth = fv - totalInvested;
  const growthPct = totalInvested > 0 ? (growth / totalInvested) * 100 : 0;
  return { fv, totalInvested, growth, growthPct };
}

function calcCompoundYearly(P, pmt, years, rate) {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const res = calcCompound(P, pmt, y, rate);
    rows.push({ year: y, value: res.fv, invested: res.totalInvested, growth: res.growth });
  }
  return rows;
}

// ============================================================
//  AUTH HANDLERS
// ============================================================

async function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const pass  = document.getElementById('signin-pass').value;
  if (!email || !pass) { setState({ authError: 'Please enter email and password.' }); return; }
  setState({ authLoading: true, authError: '' });

  try {
    const user = await firebase.signIn(email, pass);
    const userData = { uid: user.uid, email: user.email, displayName: user.displayName || email.split('@')[0], name: user.displayName || email.split('@')[0] };
    localStorage.setItem('eb_user', JSON.stringify(userData));
    const savedData = await firebase.getUserData(user.uid).catch(() => null);
    if (savedData) {
      if (savedData.holdings) state.holdings = savedData.holdings;
      if (savedData.xp) state.xp = savedData.xp;
      if (savedData.lessonProgress) state.lessonProgress = savedData.lessonProgress;
    }
    setState({ authLoading: false, user: userData, view: 'dashboard', navHistory: [] });
  } catch (err) {
    // Local fallback auth
    if (email && pass.length >= 6) {
      const userData = { uid: 'local_' + Date.now(), email, displayName: email.split('@')[0], name: email.split('@')[0] };
      localStorage.setItem('eb_user', JSON.stringify(userData));
      setState({ authLoading: false, user: userData, view: 'dashboard', navHistory: [] });
    } else {
      setState({ authLoading: false, authError: 'Invalid credentials. Try again or use demo: demo@ebwealth.com / password123' });
    }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  if (!name || !email || !pass) { setState({ authError: 'Please fill all fields.' }); return; }
  if (pass.length < 6) { setState({ authError: 'Password must be at least 6 characters.' }); return; }
  setState({ authLoading: true, authError: '' });

  try {
    const user = await firebase.register(email, pass, name);
    const userData = { uid: user.uid, email: user.email, displayName: name, name };
    localStorage.setItem('eb_user', JSON.stringify(userData));
    setState({ authLoading: false, user: userData, view: 'onboarding', onboardingStep: 0, onboardingData: {} });
  } catch (err) {
    const userData = { uid: 'local_' + Date.now(), email, displayName: name, name };
    localStorage.setItem('eb_user', JSON.stringify(userData));
    setState({ authLoading: false, user: userData, view: 'onboarding', onboardingStep: 0, onboardingData: {}, authError: '' });
  }
}

async function handleLogout() {
  try { await firebase.signOut(); } catch (e) {}
  localStorage.removeItem('eb_user');
  setState({ user: null, view: 'auth', authTab: 'signin', authError: '', navHistory: [] });
}

// ============================================================
//  PORTFOLIO HANDLERS
// ============================================================

function addHolding(e) {
  e.preventDefault();
  const f = e.target;
  const h = {
    id: Date.now(),
    ticker:      f.ticker.value.trim().toUpperCase(),
    name:        f.holdingName.value.trim(),
    assetType:   f.assetType.value,
    shares:      parseFloat(f.shares.value) || 0,
    avgPrice:    parseFloat(f.avgPrice.value) || 0,
    currentPrice: parseFloat(f.currentPrice.value) || 0,
    accountType: f.accountType.value,
    geography:   f.geography.value,
    sector:      f.sector.value
  };
  if (!h.ticker || !h.name || h.shares <= 0) { showToast('Please fill required fields', 'error'); return; }
  const newHoldings = [...state.holdings, h];
  setState({ holdings: newHoldings, showAddHolding: false });
  showToast(`${h.ticker} added to portfolio ✓`, 'success');
}

function deleteHolding(id) {
  if (!confirm('Remove this holding?')) return;
  setState({ holdings: state.holdings.filter(h => h.id !== id) });
  showToast('Holding removed', 'gold');
}

// ============================================================
//  ACADEMY HANDLERS
// ============================================================

function completeQuiz(lessonId, score, totalQ, xpReward) {
  const progress = { ...state.lessonProgress };
  const passed = score >= Math.ceil(totalQ * 0.6);
  if (!progress[lessonId] || score > (progress[lessonId].score || 0)) {
    progress[lessonId] = { completed: passed, score, total: totalQ, completedAt: new Date().toISOString() };
  }
  const newXp = state.xp + (passed && !(state.lessonProgress[lessonId]?.completed) ? xpReward : 0);
  setState({ lessonProgress: progress, xp: newXp, quizSubmitted: true });
  if (passed) showToast(`+${xpReward} XP earned! 🎉`, 'gold');
}

// ============================================================
//  COMMUNITY HANDLERS
// ============================================================

function toggleLike(postId) {
  const posts = state.communityPosts.map(p => {
    if (p.id === postId) return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
    return p;
  });
  setState({ communityPosts: posts });
}

function addPost(e) {
  e.preventDefault();
  const f = e.target;
  const post = {
    id: Date.now(),
    author: getFirstName() + ' ' + (state.user?.email?.[0]?.toUpperCase() || 'U') + '.',
    level: getLevelTitle(state.xp).title,
    category: f.postCategory.value,
    title: f.postTitle.value.trim(),
    content: f.postContent.value.trim(),
    likes: 0,
    comments: 0,
    time: 'Just now',
    liked: false
  };
  if (!post.title || !post.content) { showToast('Please fill all fields', 'error'); return; }
  const newPosts = [post, ...state.communityPosts];
  const newXp = state.xp + 25;
  setState({ communityPosts: newPosts, showNewPost: false, xp: newXp });
  showToast('+25 XP for contributing to the community! 🌟', 'gold');
}

function toggleEventRegistration(eventId) {
  const events = state.events.map(ev => {
    if (ev.id === eventId) return { ...ev, registered: !ev.registered };
    return ev;
  });
  const ev = events.find(e => e.id === eventId);
  setState({ events });
  showToast(ev.registered ? `Registered for ${ev.title} ✓` : `Unregistered from ${ev.title}`, ev.registered ? 'success' : 'gold');
}

// ============================================================
//  RENDER — MAIN ENTRY
// ============================================================

const SCROLL_POSITIONS = {};

function render() {
  // Save scroll
  const scrollEl = document.querySelector('.screen-with-nav, .ai-messages');
  if (scrollEl) SCROLL_POSITIONS[state.view] = scrollEl.scrollTop;

  const app = document.getElementById('app');
  if (!app) return;

  let html = '';
  switch (state.view) {
    case 'auth':        html = renderAuth(); break;
    case 'onboarding':  html = renderOnboarding(); break;
    case 'dashboard':   html = renderDashboard(); break;
    case 'portfolio':   html = renderPortfolio(); break;
    case 'academy':     html = renderAcademy(); break;
    case 'lesson':      html = renderLesson(); break;
    case 'etf':         html = renderETF(); break;
    case 'simulator':   html = renderSimulator(); break;
    case 'ai':          html = renderAI(); break;
    case 'community':   html = renderCommunity(); break;
    case 'events':      html = renderCommunity(); break;
    case 'news':        html = renderCommunity(); break;
    case 'profile':     html = renderProfile(); break;
    case 'asset_detail': html = renderAssetDetail(); break;
    default:            html = renderDashboard();
  }

  // Include bottom nav for main screens
  const mainViews = ['dashboard', 'portfolio', 'academy', 'community', 'profile'];
  const subViews  = ['lesson', 'etf', 'simulator', 'ai', 'asset_detail'];
  const showNav   = mainViews.includes(state.view) || subViews.includes(state.view);

  app.innerHTML = html + (showNav ? renderBottomNav() : '') + renderModals();

  // Restore scroll
  requestAnimationFrame(() => {
    const scrollEl2 = document.querySelector('.screen-with-nav');
    if (scrollEl2 && SCROLL_POSITIONS[state.view]) scrollEl2.scrollTop = SCROLL_POSITIONS[state.view];
    attachEvents();
    if (state.view === 'ai') scrollChat();
  });
}

// ============================================================
//  BOTTOM NAV
// ============================================================

function renderBottomNav() {
  const tabs = [
    { view: 'dashboard',  icon: '🏠', label: 'Dashboard' },
    { view: 'portfolio',  icon: '💼', label: 'Portfolio' },
    { view: 'academy',    icon: '🎓', label: 'Academy' },
    { view: 'community',  icon: '👥', label: 'Community' },
    { view: 'profile',    icon: '👤', label: 'Profile' }
  ];
  const activeView = ['lesson', 'etf', 'simulator'].includes(state.view) ? 'academy'
                   : state.view === 'asset_detail' ? 'portfolio'
                   : state.view === 'ai' ? 'community'
                   : state.view;
  return `<nav class="bottom-nav">
    ${tabs.map(t => `
      <div class="nav-item ${activeView === t.view ? 'active' : ''}" onclick="navTo('${t.view}')">
        <span class="nav-icon">${t.icon}</span>
        <span class="nav-label">${t.label}</span>
      </div>
    `).join('')}
  </nav>`;
}

// ============================================================
//  MODALS
// ============================================================

function renderModals() {
  let html = '';
  if (state.showAddHolding) html += renderAddHoldingModal();
  if (state.showNewPost)    html += renderNewPostModal();
  return html;
}

function renderAddHoldingModal() {
  return `
  <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <span class="modal-title">Add Holding</span>
        <button class="modal-close" onclick="setState({showAddHolding:false})">✕</button>
      </div>
      <div class="modal-body">
        <form class="modal-form" onsubmit="addHolding(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Ticker *</label>
              <input class="form-input" name="ticker" placeholder="VWRP" required>
            </div>
            <div class="form-group">
              <label class="form-label">Asset Type</label>
              <select class="form-select" name="assetType">
                <option>ETF</option><option>Stock</option><option>Bond</option><option>Investment Trust</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input class="form-input" name="holdingName" placeholder="Vanguard FTSE All-World UCITS ETF" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shares *</label>
              <input class="form-input" name="shares" type="number" step="0.001" min="0" placeholder="10" required>
            </div>
            <div class="form-group">
              <label class="form-label">Avg. Price (£)</label>
              <input class="form-input" name="avgPrice" type="number" step="0.01" min="0" placeholder="100.00">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Current Price (£)</label>
            <input class="form-input" name="currentPrice" type="number" step="0.01" min="0" placeholder="105.00">
          </div>
          <div class="form-group">
            <label class="form-label">Account Type</label>
            <select class="form-select" name="accountType">
              <option>Stocks & Shares ISA</option>
              <option>General Investment Account</option>
              <option>SIPP</option>
              <option>Lifetime ISA</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Geography</label>
              <select class="form-select" name="geography">
                <option>Global</option><option>US</option><option>UK</option>
                <option>Europe</option><option>Asia Pacific</option><option>Emerging Markets</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sector</label>
              <select class="form-select" name="sector">
                <option>Diversified</option><option>Technology</option><option>Healthcare</option>
                <option>Financials</option><option>Energy</option><option>Consumer</option>
                <option>Real Estate</option><option>Utilities</option>
              </select>
            </div>
          </div>
          <button class="btn-primary" type="submit" style="margin-top:8px">Add to Portfolio</button>
        </form>
      </div>
    </div>
  </div>`;
}

function renderNewPostModal() {
  return `
  <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-handle"></div>
      <div class="modal-header">
        <span class="modal-title">New Post</span>
        <button class="modal-close" onclick="setState({showNewPost:false})">✕</button>
      </div>
      <div class="modal-body">
        <form class="modal-form" onsubmit="addPost(event)">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" name="postCategory">
              <option>UK Investing</option><option>ETFs</option><option>ISA/SIPP</option>
              <option>Property</option><option>Crypto</option><option>General</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input class="form-input" name="postTitle" placeholder="Share your insight..." required>
          </div>
          <div class="form-group">
            <label class="form-label">Content *</label>
            <textarea class="form-input" name="postContent" rows="5" placeholder="Write your post..." required></textarea>
          </div>
          <div style="font-size:12px;color:var(--gold);margin-top:-6px;">✦ Earn +25 XP for posting</div>
          <button class="btn-primary" type="submit">Publish Post</button>
        </form>
      </div>
    </div>
  </div>`;
}

// ============================================================
//  SCREEN: AUTH
// ============================================================

function renderAuth() {
  const isSignIn = state.authTab === 'signin';
  return `
  <div class="auth-screen fade-in">
    <div class="auth-logo">
      <div class="auth-logo-icon">💰</div>
      <h1>EB Wealth</h1>
    </div>
    <p class="auth-tagline">UK Investment Education & Portfolio Tracker</p>

    <div class="auth-tabs" style="width:100%">
      <div class="auth-tab ${isSignIn ? 'active' : ''}" onclick="setState({authTab:'signin',authError:''})">Sign In</div>
      <div class="auth-tab ${!isSignIn ? 'active' : ''}" onclick="setState({authTab:'register',authError:''})">Register</div>
    </div>

    ${state.authError ? `<div class="auth-error">${escapeHtml(state.authError)}</div>` : ''}

    ${state.authLoading ? `<div class="auth-spinner"><div class="spinner"></div></div>` : isSignIn ? `
      <form class="auth-form" onsubmit="handleSignIn(event)">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input id="signin-email" class="form-input" type="email" placeholder="you@example.com" autocomplete="email" value="">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input id="signin-pass" class="form-input" type="password" placeholder="••••••••" autocomplete="current-password">
        </div>
        <button class="btn-primary" type="submit">Sign In</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:12px;color:var(--text2)">Demo: demo@ebwealth.com / password123</p>
    ` : `
      <form class="auth-form" onsubmit="handleRegister(event)">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input id="reg-name" class="form-input" type="text" placeholder="Alex Johnson" autocomplete="name">
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input id="reg-email" class="form-input" type="email" placeholder="you@example.com" autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label">Password (min 6 chars)</label>
          <input id="reg-pass" class="form-input" type="password" placeholder="••••••••" autocomplete="new-password">
        </div>
        <button class="btn-primary" type="submit">Create Account</button>
      </form>
    `}
  </div>`;
}

// ============================================================
//  SCREEN: ONBOARDING
// ============================================================

const ONBOARDING_STEPS = [
  {
    title: 'What is your experience level?',
    subtitle: 'Help us personalise your learning path',
    key: 'experience',
    options: [
      { icon: '🌱', label: 'Beginner',     sub: 'Just getting started with investing' },
      { icon: '📈', label: 'Intermediate', sub: 'Invested for 1-3 years' },
      { icon: '💼', label: 'Advanced',     sub: '3+ years of active investing' },
      { icon: '🏆', label: 'Expert',       sub: 'Professional or institutional level' }
    ]
  },
  {
    title: 'What is your primary goal?',
    subtitle: 'We will tailor content to match your objective',
    key: 'goal',
    options: [
      { icon: '🌍', label: 'Long-term wealth', sub: 'Grow wealth over 10-20+ years' },
      { icon: '🛡️', label: 'ISA maximisation', sub: 'Make the most of tax-free wrappers' },
      { icon: '💰', label: 'Dividend income',  sub: 'Generate regular passive income' },
      { icon: '🏠', label: 'Save for property', sub: 'Build a house deposit or portfolio' }
    ]
  },
  {
    title: 'What is your time horizon?',
    subtitle: 'How long do you plan to stay invested?',
    key: 'horizon',
    options: [
      { icon: '⏱️', label: '1–3 years',   sub: 'Short term investing' },
      { icon: '📅', label: '3–5 years',   sub: 'Medium term' },
      { icon: '📆', label: '5–10 years',  sub: 'Long term' },
      { icon: '🗓️', label: '10–20 years', sub: 'Very long term' },
      { icon: '♾️', label: '20+ years',   sub: 'Legacy / retirement building' }
    ]
  },
  {
    title: 'Monthly investment capacity?',
    subtitle: 'How much can you invest per month?',
    key: 'capacity',
    options: [
      { icon: '💵', label: 'Under £150',    sub: 'Starting out' },
      { icon: '💴', label: '£150–£500',     sub: 'Building momentum' },
      { icon: '💷', label: '£500–£1,000',   sub: 'Serious investor' },
      { icon: '🏦', label: '£1,000+',       sub: 'High capacity' }
    ]
  },
  {
    title: 'What is your risk tolerance?',
    subtitle: 'How comfortable are you with market volatility?',
    key: 'risk',
    options: [
      { icon: '🛡️', label: 'Conservative',   sub: 'Prefer stability, lower risk' },
      { icon: '⚖️', label: 'Medium',          sub: 'Balanced risk / reward' },
      { icon: '📊', label: 'Medium-High',     sub: 'Comfortable with volatility' },
      { icon: '🚀', label: 'High',            sub: 'Maximum growth focus' }
    ]
  }
];

function renderOnboarding() {
  const step = ONBOARDING_STEPS[state.onboardingStep];
  const selected = state.onboardingData[step.key];
  const isLast = state.onboardingStep === ONBOARDING_STEPS.length - 1;

  return `
  <div class="onboarding-screen fade-in">
    <div class="onboarding-header">
      <div class="onboarding-step-label">Step ${state.onboardingStep + 1} of ${ONBOARDING_STEPS.length}</div>
      <h2 class="onboarding-title">${step.title}</h2>
      <p class="onboarding-subtitle">${step.subtitle}</p>
    </div>

    <div class="onboarding-dots">
      ${ONBOARDING_STEPS.map((_, i) => `
        <div class="onboarding-dot ${i < state.onboardingStep ? 'done' : i === state.onboardingStep ? 'active' : ''}"></div>
      `).join('')}
    </div>

    <div class="onboarding-options">
      ${step.options.map(o => `
        <div class="onboarding-option ${selected === o.label ? 'selected' : ''}"
             onclick="selectOnboardingOption('${escapeHtml(o.label)}')">
          <div class="onboarding-option-icon">${o.icon}</div>
          <div class="onboarding-option-text">
            <h4>${escapeHtml(o.label)}</h4>
            <p>${escapeHtml(o.sub)}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="onboarding-actions">
      ${state.onboardingStep > 0 ? `<button class="btn-secondary" onclick="onboardingBack()">← Back</button>` : ''}
      <button class="btn-primary" onclick="onboardingNext()" ${!selected ? 'style="opacity:0.5"' : ''}>
        ${isLast ? 'Get Started 🚀' : 'Next →'}
      </button>
    </div>
  </div>`;
}

function selectOnboardingOption(label) {
  const step = ONBOARDING_STEPS[state.onboardingStep];
  setState({ onboardingData: { ...state.onboardingData, [step.key]: label } });
}

function onboardingNext() {
  const step = ONBOARDING_STEPS[state.onboardingStep];
  if (!state.onboardingData[step.key]) { showToast('Please select an option', 'error'); return; }
  if (state.onboardingStep < ONBOARDING_STEPS.length - 1) {
    setState({ onboardingStep: state.onboardingStep + 1 });
  } else {
    // Save onboarding data
    const profileData = { ...state.onboardingData, completedAt: new Date().toISOString() };
    localStorage.setItem('eb_profile', JSON.stringify(profileData));
    try {
      if (state.user && firebase.saveUserData) {
        firebase.saveUserData(state.user.uid, { profile: profileData });
      }
    } catch (e) {}
    setState({ view: 'dashboard', navHistory: [] });
    showToast('Welcome to EB Wealth! 🎉', 'gold', 3000);
  }
}

function onboardingBack() {
  if (state.onboardingStep > 0) setState({ onboardingStep: state.onboardingStep - 1 });
}

// ============================================================
//  SCREEN: DASHBOARD
// ============================================================

function renderDashboard() {
  const { totalValue, gain, gainPct } = calcPortfolio();
  const level = getLevelTitle(state.xp);
  const { min, max } = getLevelXPRange(state.xp);
  const xpPct = Math.min(100, ((state.xp - min) / (max - min)) * 100) || 0;
  const isaPct = (state.isaUsed / 20000) * 100;
  const completedLessons = Object.values(state.lessonProgress).filter(p => p.completed).length;
  const topHoldings = state.holdings.slice(0, 3);

  // Next lesson
  const allLessons = ACADEMY_LEVELS[0].lessons;
  const nextLesson = allLessons.find(l => !state.lessonProgress[l.id]?.completed) || allLessons[0];

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="dashboard-header">
      <div class="dashboard-greeting">${getGreeting()},</div>
      <div class="dashboard-greeting-name">${escapeHtml(getFirstName())} 👋</div>
    </div>

    <!-- Portfolio Summary -->
    <div class="portfolio-summary-card">
      <div class="portfolio-total-label">Total Portfolio Value</div>
      <div class="portfolio-total-value">${fmt(totalValue)}</div>
      <div class="portfolio-gain">
        <span class="gain-badge ${gainBadgeClass(gain)}">
          ${gain >= 0 ? '▲' : '▼'} ${fmt(Math.abs(gain))} (${fmtPct(gainPct)})
        </span>
        <span style="font-size:12px;color:var(--text3)">All time</span>
      </div>
    </div>

    <!-- XP Progress -->
    <div class="xp-section">
      <div class="xp-header">
        <span class="xp-level-badge">⭐ ${escapeHtml(level.title)}</span>
        <span class="xp-values">${state.xp} / ${max} XP</span>
      </div>
      <div class="xp-bar-track">
        <div class="xp-bar-fill" style="width:${xpPct}%"></div>
      </div>
    </div>

    <!-- ISA Allowance -->
    <div class="isa-section">
      <div class="isa-header">
        <span class="isa-label">🛡️ ISA Allowance 2025/26</span>
        <span class="isa-value">${fmt(state.isaUsed)} / £20,000</span>
      </div>
      <div class="isa-bar-track">
        <div class="isa-bar-fill" style="width:${isaPct}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:6px">${fmt(20000 - state.isaUsed)} remaining this tax year</div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon">💼</div>
        <div class="stat-value">${state.holdings.length}</div>
        <div class="stat-label">Holdings</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-value">${state.streak}</div>
        <div class="stat-label">Day Streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">${level.num}</div>
        <div class="stat-label">Level</div>
      </div>
    </div>

    <!-- Continue Learning -->
    <div class="section-heading"><h3>📚 Continue Learning</h3></div>
    <div class="continue-card" onclick="navigate('lesson',{selectedLesson:'${nextLesson.id}'})">
      <div class="continue-icon">🎯</div>
      <div class="continue-text">
        <h4>${escapeHtml(nextLesson.title)}</h4>
        <p>${escapeHtml(nextLesson.readTime)} · +${nextLesson.xp} XP</p>
      </div>
      <div class="continue-arrow">›</div>
    </div>

    <!-- Recent Holdings -->
    ${topHoldings.length ? `
      <div class="section-heading">
        <h3>📊 Recent Holdings</h3>
        <a onclick="navTo('portfolio')" style="cursor:pointer">View all</a>
      </div>
      ${topHoldings.map(h => {
        const c = calcHolding(h);
        return `
        <div class="holding-card" onclick="navigate('asset_detail',{selectedTicker:'${h.id}'})">
          <div class="holding-ticker-badge">${escapeHtml(h.ticker)}</div>
          <div class="holding-info">
            <div class="holding-name">${escapeHtml(h.name)}</div>
            <div class="holding-meta">${h.shares} shares · ${escapeHtml(h.accountType.replace('Stocks & Shares ', ''))}</div>
          </div>
          <div class="holding-values">
            <div class="holding-value">${fmt(c.value)}</div>
            <div class="holding-gain ${gainClass(c.pct)}">${fmtPct(c.pct)}</div>
          </div>
        </div>`;
      }).join('')}
    ` : ''}

    <!-- Market Pulse -->
    <div class="section-heading">
      <h3>📰 Market Pulse</h3>
      <a onclick="navTo('community');setState({communityTab:'news'})" style="cursor:pointer">More</a>
    </div>
    ${state.news.slice(0, 3).map(n => `
      <div class="news-card">
        <div class="news-category-tag">${escapeHtml(n.category)}</div>
        <div class="news-headline">${escapeHtml(n.headline)}</div>
        <div class="news-meta">
          <span>${escapeHtml(n.source)}</span>
          <span>·</span>
          <span>${escapeHtml(n.time)}</span>
        </div>
      </div>
    `).join('')}

    <div style="height:16px"></div>
  </div>
  <div class="fab" onclick="setState({showAddHolding:true})">+</div>`;
}

// ============================================================
//  SCREEN: PORTFOLIO
// ============================================================

function renderPortfolio() {
  const { totalValue, totalCost, gain, gainPct } = calcPortfolio();

  // Allocation breakdown
  const geoMap = {}, sectorMap = {}, acctMap = {};
  state.holdings.forEach(h => {
    const v = h.shares * h.currentPrice;
    geoMap[h.geography]   = (geoMap[h.geography]   || 0) + v;
    sectorMap[h.sector]   = (sectorMap[h.sector]    || 0) + v;
    acctMap[h.accountType] = (acctMap[h.accountType] || 0) + v;
  });

  const tv = totalValue || 1;
  const geoEntries    = Object.entries(geoMap).sort((a,b) => b[1]-a[1]);
  const sectorEntries = Object.entries(sectorMap).sort((a,b) => b[1]-a[1]);
  const acctEntries   = Object.entries(acctMap).sort((a,b) => b[1]-a[1]);

  const barColors = ['', 'blue', 'green', 'red'];

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header">
      <h2>Portfolio</h2>
      <button class="header-action-btn" onclick="setState({showAddHolding:true})">＋</button>
    </div>

    <!-- Portfolio Value Header -->
    <div class="portfolio-header-card">
      <div class="portfolio-total-label">Total Value</div>
      <div class="portfolio-total-value">${fmt(totalValue)}</div>
      <div class="portfolio-gain" style="margin-top:6px">
        <span class="gain-badge ${gainBadgeClass(gain)}">${gain >= 0 ? '▲' : '▼'} ${fmt(Math.abs(gain))} (${fmtPct(gainPct)})</span>
        <span style="font-size:11px;color:var(--text3);margin-left:8px">Total cost: ${fmt(totalCost)}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="portfolio-action-row">
      <button onclick="navigate('etf')">🔍 ETF Overlap</button>
      <button onclick="navigate('simulator')">📊 Simulator</button>
      <button onclick="refreshPrices()">🔄 Refresh</button>
    </div>

    <!-- Geographic Allocation -->
    <div class="allocation-section">
      <div class="allocation-title">🌍 Geographic Allocation</div>
      ${geoEntries.slice(0,5).map(([g, v], i) => `
        <div class="alloc-bar-row">
          <div class="alloc-bar-label"><span>${escapeHtml(g)}</span><span>${fmtNum((v/tv)*100,1)}%</span></div>
          <div class="alloc-bar-track"><div class="alloc-bar-fill ${barColors[i]}" style="width:${(v/tv)*100}%"></div></div>
        </div>
      `).join('')}
    </div>

    <!-- Sector Allocation -->
    <div class="allocation-section">
      <div class="allocation-title">🏭 Sector Allocation</div>
      ${sectorEntries.slice(0,5).map(([s, v], i) => `
        <div class="alloc-bar-row">
          <div class="alloc-bar-label"><span>${escapeHtml(s)}</span><span>${fmtNum((v/tv)*100,1)}%</span></div>
          <div class="alloc-bar-track"><div class="alloc-bar-fill ${barColors[i]}" style="width:${(v/tv)*100}%"></div></div>
        </div>
      `).join('')}
    </div>

    <!-- Account Type -->
    <div class="allocation-section">
      <div class="allocation-title">🏦 Account Type</div>
      ${acctEntries.map(([a, v]) => `
        <div class="alloc-bar-row">
          <div class="alloc-bar-label"><span>${escapeHtml(a)}</span><span>${fmtNum((v/tv)*100,1)}%</span></div>
          <div class="alloc-bar-track"><div class="alloc-bar-fill" style="width:${(v/tv)*100}%"></div></div>
        </div>
      `).join('')}
    </div>

    <!-- Holdings List -->
    <div class="section-heading"><h3>Holdings (${state.holdings.length})</h3></div>

    ${state.holdings.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No holdings yet</div>
        <div class="empty-state-text">Add your first holding to start tracking your portfolio.</div>
        <button class="btn-primary" style="margin-top:16px;width:auto;padding:12px 24px" onclick="setState({showAddHolding:true})">Add First Holding</button>
      </div>
    ` : state.holdings.map(h => {
      const c = calcHolding(h);
      return `
      <div style="position:relative;margin:0 16px 10px;">
        <div class="holding-card" style="margin:0" onclick="navigate('asset_detail',{selectedTicker:'${h.id}'})">
          <div class="holding-ticker-badge">${escapeHtml(h.ticker)}</div>
          <div class="holding-info">
            <div class="holding-name">${escapeHtml(h.name)}</div>
            <div class="holding-meta">${h.shares} sh @ ${fmt(h.avgPrice)} · ${escapeHtml(h.assetType)} · ${escapeHtml(h.geography)}</div>
            <div class="holding-meta" style="margin-top:2px;font-size:11px;color:var(--text3)">${escapeHtml(h.accountType)}</div>
          </div>
          <div class="holding-values">
            <div class="holding-value">${fmt(c.value)}</div>
            <div class="holding-gain ${gainClass(c.gain)}">${c.gain >= 0 ? '+' : ''}${fmt(Math.abs(c.gain))}</div>
            <div class="holding-gain ${gainClass(c.pct)}">${fmtPct(c.pct)}</div>
          </div>
        </div>
        <button onclick="deleteHolding(${h.id})" style="position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:var(--red-bg);border:1px solid var(--red);color:var(--red);font-size:12px;display:flex;align-items:center;justify-content:center;z-index:2">✕</button>
      </div>`;
    }).join('')}

    <div style="height:16px"></div>
  </div>
  <div class="fab" onclick="setState({showAddHolding:true})">+</div>`;
}

function refreshPrices() {
  // Simulate price refresh with small random changes
  const updated = state.holdings.map(h => ({
    ...h,
    currentPrice: parseFloat((h.currentPrice * (1 + (Math.random() * 0.006 - 0.003))).toFixed(2))
  }));
  setState({ holdings: updated });
  showToast('Prices refreshed ✓', 'success');
}

// ============================================================
//  SCREEN: ACADEMY
// ============================================================

function renderAcademy() {
  const completedCount = Object.values(state.lessonProgress).filter(p => p.completed).length;
  const totalLessons   = ACADEMY_LEVELS[0].lessons.length;
  const level = getLevelTitle(state.xp);

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header"><h2>Academy</h2></div>

    <!-- Banner -->
    <div class="academy-banner">
      <div class="academy-banner-icon">🎓</div>
      <div class="academy-banner-text">
        <h3>${escapeHtml(level.title)}</h3>
        <p>${completedCount}/${totalLessons} lessons completed · ${state.xp} XP earned</p>
      </div>
    </div>

    <!-- Levels -->
    ${ACADEMY_LEVELS.map(lvl => {
      if (lvl.level === 1) {
        const open = state.openLevelId === 1;
        return `
        <div class="level-section">
          <div class="level-header" onclick="setState({openLevelId:${open ? 0 : 1}})">
            <div class="level-badge">1</div>
            <div class="level-info">
              <div class="level-title">${escapeHtml(lvl.title)}</div>
              <div class="level-desc">${escapeHtml(lvl.description)}</div>
            </div>
            <div class="level-chevron ${open ? 'open' : ''}">▾</div>
          </div>
          ${open ? `
          <div class="lesson-list">
            ${lvl.lessons.map(l => {
              const done = state.lessonProgress[l.id]?.completed;
              return `
              <div class="lesson-item" onclick="navigate('lesson',{selectedLesson:'${l.id}',quizAnswers:{},quizSubmitted:false})">
                <div class="lesson-icon ${done ? 'done' : ''}">
                  ${done ? '✅' : '📖'}
                </div>
                <div class="lesson-text">
                  <div class="lesson-title">${escapeHtml(l.title)}</div>
                  <div class="lesson-meta">
                    <span>🕐 ${l.readTime}</span>
                    <span class="lesson-xp-badge">+${l.xp} XP</span>
                  </div>
                </div>
                <span style="color:var(--text3);font-size:16px">›</span>
              </div>`;
            }).join('')}
          </div>` : ''}
        </div>`;
      } else {
        return `
        <div class="locked-level" style="margin:0 16px 12px">
          <div class="locked-level-inner">
            <div class="level-badge locked">${lvl.level}</div>
            <div class="level-info">
              <div class="level-title">${escapeHtml(lvl.title)} 🔒</div>
              <div class="level-desc">${escapeHtml(lvl.description)}</div>
            </div>
          </div>
        </div>`;
      }
    }).join('')}

    <div style="height:16px"></div>
  </div>`;
}

// ============================================================
//  SCREEN: LESSON DETAIL
// ============================================================

function renderLesson() {
  // Find lesson
  let lesson = null;
  for (const lvl of ACADEMY_LEVELS) {
    const found = lvl.lessons.find(l => l.id === state.selectedLesson);
    if (found) { lesson = found; break; }
  }
  if (!lesson) return `<div class="screen"><div class="screen-header"><button class="back-btn" onclick="goBack()">←</button><h2>Lesson</h2></div><div class="empty-state"><div>Lesson not found.</div></div></div>`;

  const done = state.lessonProgress[lesson.id]?.completed;
  const letters = ['A', 'B', 'C', 'D'];

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <h2>Lesson</h2>
      ${done ? '<span style="color:var(--green);font-size:20px">✅</span>' : ''}
    </div>

    <!-- Content -->
    <div class="lesson-content">
      <div class="lesson-detail-header">
        <h1 class="lesson-detail-title">${escapeHtml(lesson.title)}</h1>
        <p class="lesson-detail-subtitle">${escapeHtml(lesson.subtitle)}</p>
        <div class="lesson-meta-row">
          <span class="lesson-meta-chip">🕐 ${lesson.readTime}</span>
          <span class="lesson-meta-chip gold">⭐ +${lesson.xp} XP</span>
          ${done ? '<span class="lesson-meta-chip" style="color:var(--green);background:var(--green-bg);border-color:var(--green)">✓ Completed</span>' : ''}
        </div>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">📖 Explanation</div>
        <p class="lesson-explanation">${escapeHtml(lesson.explanation)}</p>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">💡 Real-World Example</div>
        <div class="lesson-example">${escapeHtml(lesson.example)}</div>
      </div>

      <div class="lesson-section">
        <div class="lesson-section-title">🎯 Key Takeaways</div>
        <div class="lesson-takeaways">
          ${lesson.takeaways.map(t => `<div class="lesson-takeaway">${escapeHtml(t)}</div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Quiz -->
    <div class="quiz-section">
      <div class="quiz-title">🧠 Quick Quiz</div>

      ${state.quizSubmitted ? (() => {
        let score = 0;
        lesson.quiz.forEach((q, qi) => { if (state.quizAnswers[qi] === q.correct) score++; });
        const passed = score >= Math.ceil(lesson.quiz.length * 0.6);
        const emoji = score === lesson.quiz.length ? '🏆' : passed ? '🎉' : '📚';
        return `
        ${lesson.quiz.map((q, qi) => `
          <div class="quiz-question">
            <div class="quiz-q-text">${qi + 1}. ${escapeHtml(q.q)}</div>
            ${q.options.map((opt, oi) => `
              <div class="quiz-option ${oi === q.correct ? 'correct' : state.quizAnswers[qi] === oi && oi !== q.correct ? 'wrong' : ''}">
                <span class="quiz-option-letter">${letters[oi]}</span>
                ${escapeHtml(opt)}
                ${oi === q.correct ? ' ✓' : state.quizAnswers[qi] === oi && oi !== q.correct ? ' ✗' : ''}
              </div>
            `).join('')}
            ${state.quizAnswers[qi] !== undefined ? `<div class="quiz-explain">${escapeHtml(q.explain)}</div>` : ''}
          </div>
        `).join('')}
        <div class="quiz-score-card">
          <div class="quiz-score-emoji">${emoji}</div>
          <div class="quiz-score-title">${score}/${lesson.quiz.length} Correct</div>
          <div class="quiz-score-text">${passed ? 'Well done! You have mastered this lesson.' : 'Good effort! Review the content and try again.'}</div>
          ${passed ? `<div class="quiz-xp-award">+${lesson.xp} XP earned!</div>` : ''}
          <button class="btn-primary" style="margin-top:16px" onclick="resetQuiz()">
            ${passed ? '← Back to Academy' : '🔁 Try Again'}
          </button>
        </div>`;
      })() : `
        ${lesson.quiz.map((q, qi) => `
          <div class="quiz-question">
            <div class="quiz-q-text">${qi + 1}. ${escapeHtml(q.q)}</div>
            ${q.options.map((opt, oi) => `
              <div class="quiz-option ${state.quizAnswers[qi] === oi ? 'selected' : ''}"
                   onclick="selectQuizAnswer(${qi}, ${oi})">
                <span class="quiz-option-letter">${letters[oi]}</span>
                ${escapeHtml(opt)}
              </div>
            `).join('')}
          </div>
        `).join('')}
        <button class="btn-primary" onclick="submitQuiz('${lesson.id}', ${lesson.quiz.length}, ${lesson.xp})"
          ${Object.keys(state.quizAnswers).length < lesson.quiz.length ? 'style="opacity:0.5"' : ''}>
          Submit Answers
        </button>
      `}
    </div>

    <div style="height:24px"></div>
  </div>`;
}

function selectQuizAnswer(qi, oi) {
  setState({ quizAnswers: { ...state.quizAnswers, [qi]: oi } });
}

function submitQuiz(lessonId, totalQ, xpReward) {
  if (Object.keys(state.quizAnswers).length < totalQ) {
    showToast('Please answer all questions', 'error');
    return;
  }
  let score = 0;
  let lesson = null;
  for (const lvl of ACADEMY_LEVELS) {
    const found = lvl.lessons.find(l => l.id === lessonId);
    if (found) { lesson = found; break; }
  }
  if (!lesson) return;
  lesson.quiz.forEach((q, qi) => { if (state.quizAnswers[qi] === q.correct) score++; });
  completeQuiz(lessonId, score, totalQ, xpReward);
}

function resetQuiz() {
  const done = state.lessonProgress[state.selectedLesson]?.completed;
  if (done) { goBack(); }
  else { setState({ quizAnswers: {}, quizSubmitted: false }); }
}

// ============================================================
//  SCREEN: ETF OVERLAP
// ============================================================

function renderETF() {
  const etfs = ['VWRP', 'VUAG', 'VUSA', 'CSPX', 'IWDA', 'EQQQ', 'VHYL', 'ISF'];
  const [e1, e2] = state.overlapSelected;
  const key = `${e1}+${e2}`;
  const overlap = ETF_OVERLAPS[key] !== undefined ? ETF_OVERLAPS[key] : 15;
  const overlapClass = overlap < 20 ? 'low' : overlap < 50 ? 'medium' : 'high';
  const overlapLabel = overlap < 20 ? 'Low Overlap' : overlap < 50 ? 'Moderate Overlap' : 'High Overlap — Risk of over-concentration';

  const topHoldings = [
    { name: 'Apple Inc', w1: '4.1%', w2: '5.8%', ov: `${(overlap * 0.08).toFixed(1)}%` },
    { name: 'Microsoft Corp', w1: '3.8%', w2: '5.2%', ov: `${(overlap * 0.07).toFixed(1)}%` },
    { name: 'NVIDIA Corp', w1: '3.1%', w2: '4.5%', ov: `${(overlap * 0.06).toFixed(1)}%` },
    { name: 'Amazon.com', w1: '2.3%', w2: '3.1%', ov: `${(overlap * 0.05).toFixed(1)}%` },
    { name: 'Alphabet Inc', w1: '1.9%', w2: '2.8%', ov: `${(overlap * 0.04).toFixed(1)}%` }
  ];

  const summaryMap = {
    high: `⚠️ ${overlap}% of ${e1}'s holdings overlap with ${e2}. This is high overlap — holding both funds provides less diversification than you might think. Consider replacing one with a more complementary option.`,
    medium: `📊 ${overlap}% overlap between ${e1} and ${e2}. This is moderate overlap. Your portfolio has some concentration risk in shared holdings. This combination can work if you are intentionally increasing exposure to certain regions or sectors.`,
    low: `✅ ${overlap}% overlap between ${e1} and ${e2}. This is low overlap — these funds complement each other well and provide genuine diversification benefits when held together.`
  };

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <h2>ETF Overlap Checker</h2>
    </div>

    <div class="etf-screen">
      <p style="padding:0 16px;font-size:13px;color:var(--text2);margin-bottom:4px">Select two ETFs to compare overlap:</p>

      <div style="padding:8px 16px;font-size:12px;color:var(--gold);font-weight:600">ETF 1: ${e1}</div>
      <div class="etf-chips-wrapper" style="padding-top:4px;padding-bottom:4px">
        ${etfs.map(e => `
          <div class="etf-chip ${e1 === e ? 'selected' : ''}" onclick="selectETF1('${e}')">${e}</div>
        `).join('')}
      </div>

      <div style="padding:8px 16px;font-size:12px;color:var(--gold);font-weight:600">ETF 2: ${e2}</div>
      <div class="etf-chips-wrapper" style="padding-top:4px">
        ${etfs.map(e => `
          <div class="etf-chip ${e2 === e ? 'selected' : ''}" onclick="selectETF2('${e}')">${e}</div>
        `).join('')}
      </div>

      <div class="overlap-display">
        <div class="overlap-label">Combined Overlap</div>
        <div class="overlap-number ${overlapClass}">${overlap}%</div>
        <div class="overlap-subtitle">${overlapLabel}</div>
      </div>

      <div class="overlap-table">
        <div class="overlap-table-header">
          <span>Top Holdings</span>
          <span>${e1}</span>
          <span>${e2}</span>
          <span>Overlap</span>
        </div>
        ${topHoldings.map(r => `
          <div class="overlap-table-row">
            <span style="color:var(--text)">${escapeHtml(r.name)}</span>
            <span>${r.w1}</span>
            <span>${r.w2}</span>
            <span style="color:var(--${overlapClass === 'high' ? 'red' : overlapClass === 'medium' ? 'amber' : 'green'})">${r.ov}</span>
          </div>
        `).join('')}
      </div>

      <div class="overlap-summary">${summaryMap[overlapClass]}</div>
    </div>
  </div>`;
}

function selectETF1(etf) {
  if (etf === state.overlapSelected[1]) return showToast('Select different ETFs', 'error');
  setState({ overlapSelected: [etf, state.overlapSelected[1]] });
}

function selectETF2(etf) {
  if (etf === state.overlapSelected[0]) return showToast('Select different ETFs', 'error');
  setState({ overlapSelected: [state.overlapSelected[0], etf] });
}

// ============================================================
//  SCREEN: SIMULATOR
// ============================================================

function renderSimulator() {
  const { fv, totalInvested, growth, growthPct } = calcCompound(
    state.simInitial, state.simMonthly, state.simYears, state.simRate
  );
  const yearlyData = calcCompoundYearly(state.simInitial, state.simMonthly, state.simYears, state.simRate);
  const milestones = yearlyData.filter(r => r.year % 5 === 0 || r.year === 1 || r.year === state.simYears);

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <h2>Compound Simulator</h2>
    </div>

    <div class="simulator-inputs">

      <!-- Initial Investment -->
      <div class="sim-input-group">
        <div class="sim-input-label">
          <span>💰 Initial Investment</span>
          <span class="sim-input-value">${fmt(state.simInitial)}</span>
        </div>
        <input class="sim-slider" type="range" min="500" max="100000" step="500"
          value="${state.simInitial}"
          oninput="updateSim('simInitial', this.value)">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
          <span>£500</span><span>£100,000</span>
        </div>
      </div>

      <!-- Monthly Contribution -->
      <div class="sim-input-group">
        <div class="sim-input-label">
          <span>📅 Monthly Contribution</span>
          <span class="sim-input-value">${fmt(state.simMonthly)}</span>
        </div>
        <input class="sim-slider" type="range" min="0" max="2000" step="50"
          value="${state.simMonthly}"
          oninput="updateSim('simMonthly', this.value)">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
          <span>£0</span><span>£2,000</span>
        </div>
      </div>

      <!-- Years -->
      <div class="sim-input-group">
        <div class="sim-input-label">
          <span>📆 Investment Years</span>
          <span class="sim-input-value">${state.simYears} yrs</span>
        </div>
        <input class="sim-slider" type="range" min="1" max="40" step="1"
          value="${state.simYears}"
          oninput="updateSim('simYears', this.value)">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
          <span>1 yr</span><span>40 yrs</span>
        </div>
      </div>

      <!-- Annual Return -->
      <div class="sim-input-group">
        <div class="sim-input-label">
          <span>📈 Annual Return</span>
          <span class="sim-input-value">${state.simRate}%</span>
        </div>
        <input class="sim-slider" type="range" min="1" max="15" step="0.5"
          value="${state.simRate}"
          oninput="updateSim('simRate', this.value)">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
          <span>1%</span><span>15%</span>
        </div>
      </div>

    </div>

    <!-- Results -->
    <div class="sim-result-card">
      <div class="sim-result-main">
        <div class="sim-result-label">Future Portfolio Value</div>
        <div class="sim-result-value">${fmt(fv)}</div>
      </div>
      <div class="sim-result-grid">
        <div class="sim-result-item">
          <div class="sim-result-item-label">Total Invested</div>
          <div class="sim-result-item-value">${fmt(totalInvested)}</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Investment Growth</div>
          <div class="sim-result-item-value" style="color:var(--green)">${fmt(growth)}</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Growth Percentage</div>
          <div class="sim-result-item-value" style="color:var(--green)">+${fmtNum(growthPct, 1)}%</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Monthly @ ${state.simRate}% p.a.</div>
          <div class="sim-result-item-value">${fmt(state.simMonthly)}</div>
        </div>
      </div>
    </div>

    <!-- Year-by-year breakdown -->
    <div class="section-heading" style="margin:0 16px 12px"><h3>Year-by-Year Breakdown</h3></div>
    <div class="sim-table">
      <div class="sim-table-header">
        <span>Year</span>
        <span>Total Value</span>
        <span>Growth</span>
      </div>
      ${milestones.map(r => `
        <div class="sim-table-row">
          <span>Year ${r.year}</span>
          <span style="color:var(--text)">${fmt(r.value)}</span>
          <span style="color:var(--green)">+${fmt(r.growth)}</span>
        </div>
      `).join('')}
    </div>

    <div style="padding:16px;font-size:11px;color:var(--text3);line-height:1.5">
      * Projections are illustrative only. Past returns do not guarantee future performance. This tool uses compound interest formula and does not account for taxes, fees, or inflation.
    </div>
  </div>`;
}

function updateSim(key, val) {
  const num = parseFloat(val);
  state[key] = num;
  // Re-render just the result section without full render for slider smoothness
  const resultCard = document.querySelector('.sim-result-card');
  const table = document.querySelector('.sim-table');
  if (resultCard && table) {
    const { fv, totalInvested, growth, growthPct } = calcCompound(state.simInitial, state.simMonthly, state.simYears, state.simRate);
    const yearlyData = calcCompoundYearly(state.simInitial, state.simMonthly, state.simYears, state.simRate);
    const milestones = yearlyData.filter(r => r.year % 5 === 0 || r.year === 1 || r.year === state.simYears);

    resultCard.innerHTML = `
      <div class="sim-result-main">
        <div class="sim-result-label">Future Portfolio Value</div>
        <div class="sim-result-value">${fmt(fv)}</div>
      </div>
      <div class="sim-result-grid">
        <div class="sim-result-item">
          <div class="sim-result-item-label">Total Invested</div>
          <div class="sim-result-item-value">${fmt(totalInvested)}</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Investment Growth</div>
          <div class="sim-result-item-value" style="color:var(--green)">${fmt(growth)}</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Growth Percentage</div>
          <div class="sim-result-item-value" style="color:var(--green)">+${fmtNum(growthPct, 1)}%</div>
        </div>
        <div class="sim-result-item">
          <div class="sim-result-item-label">Monthly @ ${state.simRate}% p.a.</div>
          <div class="sim-result-item-value">${fmt(state.simMonthly)}</div>
        </div>
      </div>`;

    table.innerHTML = `
      <div class="sim-table-header">
        <span>Year</span>
        <span>Total Value</span>
        <span>Growth</span>
      </div>
      ${milestones.map(r => `
        <div class="sim-table-row">
          <span>Year ${r.year}</span>
          <span style="color:var(--text)">${fmt(r.value)}</span>
          <span style="color:var(--green)">+${fmt(r.growth)}</span>
        </div>
      `).join('')}`;

    // Update value displays
    document.querySelectorAll('.sim-input-value').forEach((el, i) => {
      if (i === 0) el.textContent = fmt(state.simInitial);
      if (i === 1) el.textContent = fmt(state.simMonthly);
      if (i === 2) el.textContent = state.simYears + ' yrs';
      if (i === 3) el.textContent = state.simRate + '%';
    });
  } else {
    // Fallback: full render
    persistState();
    render();
  }
}

// ============================================================
//  SCREEN: AI COACH
// ============================================================

function renderAI() {
  const quickPrompts = [
    'Should I add more to VWRP?',
    'Explain ISA allowance',
    'What is a good ETF for beginners?',
    'How does pound-cost averaging work?',
    'SIPP vs ISA — which first?',
    'Explain compound interest'
  ];

  return `
  <div class="screen fade-in" style="height:calc(100vh - 72px);height:calc(100dvh - 72px);display:flex;flex-direction:column;">
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <h2>🤖 AI Coach</h2>
      <button class="header-action-btn" onclick="clearChat()">🗑</button>
    </div>

    <div class="ai-messages" id="ai-messages">
      ${state.chatMessages.length === 0 ? `
        <div style="text-align:center;padding:32px 20px">
          <div style="font-size:48px;margin-bottom:12px">🤖</div>
          <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">Your EB Wealth AI Coach</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6">Ask me anything about UK investing — ISAs, ETFs, portfolio strategy, and more.</div>
        </div>
      ` : state.chatMessages.map(m => `
        <div class="chat-bubble ${m.role}">
          ${escapeHtml(m.content)}
          <div style="font-size:10px;opacity:0.5;margin-top:4px;text-align:${m.role === 'user' ? 'right' : 'left'}">${m.time || ''}</div>
        </div>
      `).join('')}

      ${state.isTyping ? `
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      ` : ''}
    </div>

    <div class="quick-prompts">
      ${quickPrompts.map(p => `
        <div class="quick-prompt-chip" onclick="sendQuickPrompt(${JSON.stringify(escapeHtml(p))})">${escapeHtml(p)}</div>
      `).join('')}
    </div>

    <div class="ai-input-bar">
      <input class="ai-input" id="ai-input" type="text" placeholder="Ask your AI coach..."
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();handleAISend()}"
        ${state.isTyping ? 'disabled' : ''}>
      <button class="ai-send-btn" onclick="handleAISend()" ${state.isTyping ? 'disabled' : ''}>➤</button>
    </div>
  </div>`;
}

function handleAISend() {
  const input = document.getElementById('ai-input');
  if (!input) return;
  const prompt = input.value.trim();
  if (!prompt || state.isTyping) return;
  input.value = '';
  sendAIMessage(prompt);
}

function sendQuickPrompt(prompt) {
  if (state.isTyping) return;
  sendAIMessage(prompt);
}

function clearChat() {
  setState({ chatMessages: [] });
  showToast('Chat cleared', 'gold');
}

// ============================================================
//  SCREEN: COMMUNITY
// ============================================================

function renderCommunity() {
  const tabs = ['posts', 'events', 'news'];
  const activeTab = state.communityTab || 'posts';

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header"><h2>Community</h2></div>

    <div class="community-tabs">
      ${[['posts','📝 Posts'], ['events','📅 Events'], ['news','📰 News']].map(([t, label]) => `
        <div class="community-tab ${activeTab === t ? 'active' : ''}"
             onclick="setState({communityTab:'${t}'})">
          ${label}
        </div>
      `).join('')}
    </div>

    ${activeTab === 'posts' ? renderPosts() : ''}
    ${activeTab === 'events' ? renderEvents() : ''}
    ${activeTab === 'news' ? renderNews() : ''}

    <div style="height:16px"></div>
  </div>
  ${activeTab === 'posts' ? `<div class="fab" onclick="setState({showNewPost:true})">+</div>` : ''}`;
}

function renderPosts() {
  const categories = ['All', 'UK Investing', 'ETFs', 'ISA/SIPP', 'Property', 'Crypto'];
  const filter = state.communityFilter || 'All';
  const filtered = filter === 'All' ? state.communityPosts : state.communityPosts.filter(p => p.category === filter);

  return `
  <div>
    <div class="filter-chips">
      ${categories.map(c => `
        <div class="filter-chip ${filter === c ? 'active' : ''}" onclick="setState({communityFilter:'${c}'})">
          ${c}
        </div>
      `).join('')}
    </div>

    ${filtered.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No posts yet</div>
        <div class="empty-state-text">Be the first to post in this category!</div>
      </div>
    ` : filtered.map(post => {
      const expanded = state.expandedPostId === post.id;
      return `
      <div class="post-card">
        <div class="post-author-row">
          <div class="post-avatar">${post.author[0]}</div>
          <div class="post-author-info">
            <div class="post-author-name">${escapeHtml(post.author)}</div>
            <div class="post-author-level">${escapeHtml(post.level)}</div>
          </div>
          <div class="post-time">${escapeHtml(post.time)}</div>
        </div>
        <div class="post-category-tag">${escapeHtml(post.category)}</div>
        <div class="post-title">${escapeHtml(post.title)}</div>
        <div class="${expanded ? '' : 'post-preview'}" onclick="togglePost(${post.id})">
          ${escapeHtml(post.content)}
        </div>
        ${expanded ? '' : `<div style="font-size:12px;color:var(--gold);margin-top:4px;cursor:pointer" onclick="togglePost(${post.id})">Read more</div>`}
        <div class="post-actions">
          <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            ${post.liked ? '❤️' : '🤍'} ${post.likes}
          </button>
          <button class="post-action-btn">
            💬 ${post.comments}
          </button>
          <button class="post-action-btn" onclick="sharePost(${post.id})">
            📤 Share
          </button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderEvents() {
  return `
  <div style="padding:12px 0">
    ${state.events.map(ev => `
      <div class="event-card">
        <div class="event-header">
          <div>
            <div class="event-type-badge">${escapeHtml(ev.type)}</div>
            <div class="event-title">${escapeHtml(ev.title)}</div>
          </div>
        </div>
        <div class="event-date">📅 ${escapeHtml(ev.date)} · ${escapeHtml(ev.time)}</div>
        <div class="event-desc">${escapeHtml(ev.description)}</div>
        <button class="event-register-btn ${ev.registered ? 'registered' : ''}"
                onclick="toggleEventRegistration(${ev.id})">
          ${ev.registered ? '✓ Registered — Click to Unregister' : '🎟 Register for Free'}
        </button>
      </div>
    `).join('')}
  </div>`;
}

function renderNews() {
  return `
  <div style="padding:12px 0">
    ${state.news.map(n => `
      <div class="news-card" style="margin:0 16px 10px">
        <div class="news-category-tag">${escapeHtml(n.category)}</div>
        <div class="news-headline">${escapeHtml(n.headline)}</div>
        <div class="news-meta">
          <span>📰 ${escapeHtml(n.source)}</span>
          <span>·</span>
          <span>${escapeHtml(n.time)}</span>
        </div>
      </div>
    `).join('')}
  </div>`;
}

function togglePost(id) {
  setState({ expandedPostId: state.expandedPostId === id ? null : id });
}

function sharePost(id) {
  if (navigator.share) {
    const post = state.communityPosts.find(p => p.id === id);
    if (post) navigator.share({ title: post.title, text: post.content.slice(0, 100) + '...' }).catch(() => {});
  } else {
    showToast('Link copied!', 'gold');
  }
}

// ============================================================
//  SCREEN: PROFILE
// ============================================================

function renderProfile() {
  const level = getLevelTitle(state.xp);
  const { min, max } = getLevelXPRange(state.xp);
  const xpPct = Math.min(100, ((state.xp - min) / (max - min)) * 100) || 0;
  const completedLessons = Object.values(state.lessonProgress).filter(p => p.completed).length;
  const profileData = (() => {
    try { return JSON.parse(localStorage.getItem('eb_profile') || '{}'); } catch(e) { return {}; }
  })();
  const lastSynced = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return `
  <div class="screen screen-with-nav fade-in">

    <div class="profile-header">
      <div class="profile-avatar">${getFirstName()[0].toUpperCase()}</div>
      <div class="profile-name">${escapeHtml(getFirstName())}</div>
      <div class="profile-email">${escapeHtml(state.user?.email || '')}</div>
      <div class="profile-level-badge">⭐ ${escapeHtml(level.title)}</div>
    </div>

    <!-- XP Bar -->
    <div class="xp-section" style="margin:0 16px 16px">
      <div class="xp-header">
        <span style="font-size:13px;font-weight:600;color:var(--text)">Level ${level.num} Progress</span>
        <span class="xp-values">${state.xp} / ${max} XP</span>
      </div>
      <div class="xp-bar-track">
        <div class="xp-bar-fill" style="width:${xpPct}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:6px">${max - state.xp} XP to next level</div>
    </div>

    <!-- Stats Grid -->
    <div class="profile-stats-grid">
      <div class="profile-stat-card">
        <div class="profile-stat-icon">⭐</div>
        <div class="profile-stat-value">${state.xp}</div>
        <div class="profile-stat-label">Total XP</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-icon">🔥</div>
        <div class="profile-stat-value">${state.streak}</div>
        <div class="profile-stat-label">Day Streak</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-icon">💼</div>
        <div class="profile-stat-value">${state.holdings.length}</div>
        <div class="profile-stat-label">Holdings</div>
      </div>
      <div class="profile-stat-card">
        <div class="profile-stat-icon">🎓</div>
        <div class="profile-stat-value">${completedLessons}</div>
        <div class="profile-stat-label">Lessons Done</div>
      </div>
    </div>

    <!-- Investment Profile -->
    <div class="profile-info-section">
      <div class="profile-info-header">Investment Profile</div>
      <div class="profile-info-row">
        <span class="profile-info-label">Experience</span>
        <span class="profile-info-value">${escapeHtml(profileData.experience || 'Not set')}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Primary Goal</span>
        <span class="profile-info-value">${escapeHtml(profileData.goal || 'Not set')}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Time Horizon</span>
        <span class="profile-info-value">${escapeHtml(profileData.horizon || 'Not set')}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Monthly Capacity</span>
        <span class="profile-info-value">${escapeHtml(profileData.capacity || 'Not set')}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Risk Profile</span>
        <span class="profile-info-value">${escapeHtml(profileData.risk || 'Not set')}</span>
      </div>
    </div>

    <!-- ISA Summary -->
    <div class="profile-info-section">
      <div class="profile-info-header">ISA Summary 2025/26</div>
      <div class="profile-info-row">
        <span class="profile-info-label">Used</span>
        <span class="profile-info-value t-gold">${fmt(state.isaUsed)}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Remaining</span>
        <span class="profile-info-value t-green">${fmt(20000 - state.isaUsed)}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Annual Limit</span>
        <span class="profile-info-value">£20,000</span>
      </div>
    </div>

    <!-- Sync Status -->
    <div class="profile-info-section">
      <div class="profile-info-header">Account Info</div>
      <div class="profile-info-row">
        <span class="profile-info-label">Last Synced</span>
        <span class="profile-info-value">${lastSynced}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Status</span>
        <span class="profile-info-value" style="color:var(--green)">✓ Online</span>
      </div>
    </div>

    <!-- Logout -->
    <button class="btn-logout" onclick="handleLogout()">🚪 Sign Out</button>

    <div class="version-text">EB Wealth v1.0 • PWA • Built with ❤️</div>

  </div>`;
}

// ============================================================
//  SCREEN: ASSET DETAIL
// ============================================================

function renderAssetDetail() {
  const holding = state.holdings.find(h => h.id === state.selectedTicker);
  if (!holding) return `
    <div class="screen">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <h2>Asset Detail</h2>
      </div>
      <div class="empty-state"><div class="empty-state-title">Asset not found</div></div>
    </div>`;

  const c = calcHolding(holding);
  const dayChange = (Math.random() * 2 - 1).toFixed(2);
  const dayChangePct = ((dayChange / holding.currentPrice) * 100).toFixed(2);

  return `
  <div class="screen screen-with-nav fade-in">
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <h2>${escapeHtml(holding.ticker)}</h2>
    </div>

    <div class="asset-header">
      <div class="asset-ticker">${escapeHtml(holding.ticker)}</div>
      <div class="asset-name">${escapeHtml(holding.name)}</div>
      <div class="asset-price">${fmt(holding.currentPrice)}</div>
      <div style="margin-top:6px">
        <span class="gain-badge ${parseFloat(dayChange) >= 0 ? 'positive' : 'negative'}">
          ${parseFloat(dayChange) >= 0 ? '▲' : '▼'} ${fmt(Math.abs(dayChange))} (${parseFloat(dayChangePct) >= 0 ? '+' : ''}${dayChangePct}%) today
        </span>
      </div>
    </div>

    <div class="asset-info-grid">
      <div class="asset-info-card">
        <div class="asset-info-label">Your Value</div>
        <div class="asset-info-value">${fmt(c.value)}</div>
      </div>
      <div class="asset-info-card">
        <div class="asset-info-label">Total Gain/Loss</div>
        <div class="asset-info-value" style="color:${c.gain >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${c.gain >= 0 ? '+' : ''}${fmt(c.gain)}
        </div>
      </div>
      <div class="asset-info-card">
        <div class="asset-info-label">Shares Held</div>
        <div class="asset-info-value">${fmtNum(holding.shares, 3)}</div>
      </div>
      <div class="asset-info-card">
        <div class="asset-info-label">Avg. Buy Price</div>
        <div class="asset-info-value">${fmt(holding.avgPrice)}</div>
      </div>
      <div class="asset-info-card">
        <div class="asset-info-label">Return %</div>
        <div class="asset-info-value" style="color:${c.pct >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${fmtPct(c.pct)}
        </div>
      </div>
      <div class="asset-info-card">
        <div class="asset-info-label">Asset Type</div>
        <div class="asset-info-value">${escapeHtml(holding.assetType)}</div>
      </div>
    </div>

    <div class="profile-info-section" style="margin:0 16px 16px">
      <div class="profile-info-header">Holding Details</div>
      <div class="profile-info-row">
        <span class="profile-info-label">Account</span>
        <span class="profile-info-value">${escapeHtml(holding.accountType)}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Geography</span>
        <span class="profile-info-value">${escapeHtml(holding.geography)}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Sector</span>
        <span class="profile-info-value">${escapeHtml(holding.sector)}</span>
      </div>
      <div class="profile-info-row">
        <span class="profile-info-label">Cost Basis</span>
        <span class="profile-info-value">${fmt(c.cost)}</span>
      </div>
    </div>

    <div style="display:flex;gap:10px;margin:0 16px 16px">
      <button class="btn-primary" style="flex:1;padding:14px" onclick="navigate('etf')">
        🔍 Check ETF Overlap
      </button>
      <button class="btn-secondary" style="flex:1;padding:14px" onclick="deleteHolding(${holding.id})">
        🗑 Remove
      </button>
    </div>
  </div>`;
}

// ============================================================
//  EVENT ATTACHMENT & GLOBAL FUNCTIONS
// ============================================================

function attachEvents() {
  // Auth form submission
  const signinForm = document.querySelector('#signin-email')?.closest('form');
  const registerForm = document.querySelector('#reg-name')?.closest('form');
  // Forms already use onsubmit inline

  // AI messages scroll
  const msgs = document.getElementById('ai-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function closeModalOnOverlay(e) {
  if (e.target === e.currentTarget) {
    setState({ showAddHolding: false, showNewPost: false });
  }
}

// ── Global function bindings (called from inline HTML handlers) ──
window.setState = setState;
window.navigate = navigate;
window.goBack = goBack;
window.navTo = (view) => {
  const communityViews = ['community', 'events', 'news'];
  if (communityViews.includes(view)) {
    setState({ view: 'community', communityTab: view === 'community' ? state.communityTab || 'posts' : view === 'events' ? 'events' : 'news', navHistory: [] });
  } else {
    setState({ view, navHistory: [] });
  }
};

window.handleSignIn = handleSignIn;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;

window.selectOnboardingOption = selectOnboardingOption;
window.onboardingNext = onboardingNext;
window.onboardingBack = onboardingBack;

window.addHolding = addHolding;
window.deleteHolding = deleteHolding;
window.refreshPrices = refreshPrices;

window.selectQuizAnswer = selectQuizAnswer;
window.submitQuiz = submitQuiz;
window.resetQuiz = resetQuiz;

window.selectETF1 = selectETF1;
window.selectETF2 = selectETF2;

window.updateSim = updateSim;

window.handleAISend = handleAISend;
window.sendQuickPrompt = sendQuickPrompt;
window.clearChat = clearChat;
window.sendAIMessage = sendAIMessage;

window.toggleLike = toggleLike;
window.addPost = addPost;
window.togglePost = togglePost;
window.sharePost = sharePost;
window.toggleEventRegistration = toggleEventRegistration;

window.closeModalOnOverlay = closeModalOnOverlay;

// ============================================================
//  INITIAL RENDER
// ============================================================

render();
