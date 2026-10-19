import { level1Lessons } from './level1.js';
import { level2Lessons } from './level2.js';
import { level3Lessons } from './level3.js';
import { level4Lessons } from './level4.js';
import { level5Lessons } from './level5.js';
import { level6Lessons } from './level6.js';

export const academyLevels = [
  {
    level: 1,
    title: 'LEVEL 1: INVESTING FOUNDATIONS',
    subtitle: 'Core Economic Laws & Capital Compounding',
    description: 'Master the fundamental principles of capital allocation, inflation defense, compound growth, and market volatility.',
    icon: '🏛️',
    color: '#00F0FF',
    published: true,
    lessonCount: 8
  },
  {
    level: 2,
    title: 'LEVEL 2: INVESTMENT TYPES',
    subtitle: 'Asset Classes & Institutional Vehicles',
    description: 'Deep dive into shares, UCITS ETFs, low-cost index funds, sovereign Gilts, REITs, dividends, and growth stocks.',
    icon: '📊',
    color: '#10B981',
    published: true,
    lessonCount: 8
  },
  {
    level: 3,
    title: 'LEVEL 3: UK INVESTING & TAX WRAPPERS',
    subtitle: 'ISAs, SIPPs & UK HMRC Allowances',
    description: 'Maximize the £20,000 Stocks & Shares ISA, JISAs, Lifetime ISAs (LISA), SIPPs, and essential UK investment tax rules.',
    icon: '🇬🇧',
    color: '#FBBF24',
    published: true,
    lessonCount: 6
  },
  {
    level: 4,
    title: 'LEVEL 4: PORTFOLIO BUILDING',
    subtitle: 'Diversification & Asset Architecture',
    description: 'Construct resilient portfolios: asset allocation, geographic balance, avoiding ETF overlap, and Core & Satellite designs.',
    icon: '🛡️',
    color: '#818CF8',
    published: true,
    lessonCount: 8
  },
  {
    level: 5,
    title: 'LEVEL 5: STOCK ANALYSIS',
    subtitle: 'Financial Statements & Intrinsic Valuation',
    description: 'Analyze company balance sheets, Free Cash Flow, debt solvency, profit margins, P/E multiples, and Economic Moats.',
    icon: '🔍',
    color: '#F43F5E',
    published: true,
    lessonCount: 11
  },
  {
    level: 6,
    title: 'LEVEL 6: ADVANCED INVESTING',
    subtitle: 'Factor Models & Psychological Mastery',
    description: 'Master Fama-French factors, Dividend Growth (DGI), Peter Lynch GARP, Deep Value, and Behavioural Finance biases.',
    icon: '⚡',
    color: '#E879F9',
    published: true,
    lessonCount: 7
  }
];

export const defaultLessons = [
  ...level1Lessons,
  ...level2Lessons,
  ...level3Lessons,
  ...level4Lessons,
  ...level5Lessons,
  ...level6Lessons
];

// Helper to retrieve custom lessons stored by admin or fallback to defaults
export function getStoredLessons() {
  try {
    const custom = localStorage.getItem('eb_academy_custom_lessons');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length >= 48) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading custom lessons:', e);
  }
  return defaultLessons;
}

export function getStoredLevels() {
  try {
    const custom = localStorage.getItem('eb_academy_custom_levels');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length === 6) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading custom levels:', e);
  }
  return academyLevels;
}

// 5 Progressive Investor Tiers
export function getInvestorTier(xp = 0) {
  if (xp >= 2600) {
    return { levelNumber: 5, levelTitle: 'Master Wealth Builder', minXp: 2600, nextXp: 3500, badge: '🏆 MASTER' };
  } else if (xp >= 1600) {
    return { levelNumber: 4, levelTitle: 'Market Strategist', minXp: 1600, nextXp: 2600, badge: '⚔️ STRATEGIST' };
  } else if (xp >= 800) {
    return { levelNumber: 3, levelTitle: 'Portfolio Builder', minXp: 800, nextXp: 1600, badge: '🛡️ BUILDER' };
  } else if (xp >= 300) {
    return { levelNumber: 2, levelTitle: 'Capital Explorer', minXp: 300, nextXp: 800, badge: '🧭 EXPLORER' };
  } else {
    return { levelNumber: 1, levelTitle: 'Investor Starter', minXp: 0, nextXp: 300, badge: '🌱 STARTER' };
  }
}
