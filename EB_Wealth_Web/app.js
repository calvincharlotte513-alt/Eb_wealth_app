import { WebFirebaseService } from './firebase-config.js';

const firebaseService = new WebFirebaseService();

// State
let state = {
  currentView: 'dashboard',
  user: firebaseService.currentUser,
  isAuthRegister: false,
  holdings: JSON.parse(localStorage.getItem('eb_holdings') || 'null') || [
    { ticker: 'VWRP', name: 'Vanguard FTSE All-World UCITS ETF', assetType: 'ETF', allocationCategory: 'Global Equities', currency: 'GBP', shares: 145, avgBuyPrice: 92.40, currentPrice: 104.80 },
    { ticker: 'VUAG', name: 'Vanguard S&P 500 UCITS ETF', assetType: 'ETF', allocationCategory: 'US Equities', currency: 'GBP', shares: 80, avgBuyPrice: 71.10, currentPrice: 85.25 },
    { ticker: 'EQGB', name: 'Invesco EQQQ Nasdaq 100 GBP Hedged', assetType: 'ETF', allocationCategory: 'Tech Growth', currency: 'GBP', shares: 45, avgBuyPrice: 28.50, currentPrice: 34.10 },
    { ticker: 'ISF', name: 'iShares Core FTSE 100 UCITS ETF', assetType: 'ETF', allocationCategory: 'UK Equities', currency: 'GBP', shares: 500, avgBuyPrice: 7.45, currentPrice: 8.22 },
    { ticker: 'CSH2', name: 'Lyxor Smart Overnight Return Cash', assetType: 'Cash Equivalent', allocationCategory: 'Cash & Liquidity', currency: 'GBP', shares: 35, avgBuyPrice: 108.20, currentPrice: 111.45 }
  ],
  communityPosts: [
    { id: '1', authorName: 'James Henderson', category: 'UK Investing', title: 'Why 100% VWRP is the gold standard for UK Stocks & Shares ISA', content: 'With over 3,700 stocks and automatic dividend reinvesting (Acc), VWRP eliminates single-market risk and currency conversion fees for UK residents.', likesCount: 42, commentsCount: 16, createdAtFormatted: '2h ago' },
    { id: '2', authorName: 'Sophia Patel', category: 'ISA & Tax', title: 'Maximizing the £20,000 allowance before April 5th', content: 'Remember that uninvested cash inside a Stocks & Shares ISA still counts toward your allowance limit. Ensure you fund your account in time.', likesCount: 31, commentsCount: 9, createdAtFormatted: '5h ago' },
    { id: '3', authorName: 'Oliver Wright', category: 'JISA & Junior Accounts', title: 'Junior ISA compounding over 18 years is staggering', content: 'Just £100/month at a 7% annualized return equals ~£43,000 on your child’s 18th birthday, entirely tax-free.', likesCount: 54, commentsCount: 22, createdAtFormatted: '1d ago' }
  ],
  academyLessons: [
    { id: 'isa_basics', title: 'Stocks & Shares ISA Foundations', level: 'Beginner', duration: '8 min', xp: 50, completed: true, summary: 'Understand how the £20k annual UK ISA tax wrapper shelters your capital gains and dividends permanently from HMRC.' },
    { id: 'etf_mastery', title: 'All-World Index Investing & VWRP', level: 'Core', duration: '12 min', xp: 75, completed: false, summary: 'Why owning the global market cap via index tracker ETFs outperforms 90% of actively managed funds over 10+ years.' },
    { id: 'compound_growth', title: 'The Mathematics of Compounding', level: 'Wealth', duration: '10 min', xp: 60, completed: false, summary: 'How regular monthly DCA (Dollar/Pound-Cost Averaging) accelerates financial freedom through exponential compounding.' },
    { id: 'sipp_pensions', title: 'SIPP vs ISA Strategy for High Earners', level: 'Advanced', duration: '15 min', xp: 100, completed: false, summary: 'Capitalizing on 20% to 40% income tax relief on personal pension contributions versus ISA liquidity.' }
  ],
  chatMessages: [
    { sender: 'ai', text: 'Hello! I am your EB Wealth AI Coach. I can analyze your portfolio asset allocation, explain UK tax shelters (ISA & SIPP), or stress-test your monthly investment horizon. How can I assist your wealth strategy today?' }
  ]
};

// DOM Renderer
const appEl = document.getElementById('app');

function render() {
  if (!state.user) {
    renderAuth();
  } else {
    renderDashboardApp();
  }
}

// 1. AUTHENTICATION VIEW (No Landing Page - Direct to Login / Register)
function renderAuth() {
  appEl.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="card" style="max-width: 440px; width: 100%; text-align: center; border-color: var(--primary);">
        <div style="display: flex; justify-content: center; margin-bottom: 16px;">
          <div class="brand-badge" style="width: 56px; height: 56px; font-size: 24px;">EB</div>
        </div>
        <h1 class="brand-title" style="font-size: 28px; margin-bottom: 6px;">
          <span class="eb">EB </span><span class="wealth">WEALTH</span>
        </h1>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 24px;">
          Institutional-Grade UK Investment Education & Cloud Vault
        </p>

        <div style="display: flex; background: rgba(0, 240, 255, 0.08); border-radius: 10px; padding: 4px; margin-bottom: 20px;">
          <button id="tab-signin" class="btn" style="flex: 1; padding: 8px; font-size: 13px; ${!state.isAuthRegister ? 'background: var(--primary); color: #000;' : 'background: transparent; color: var(--text-secondary);'}">Sign In</button>
          <button id="tab-signup" class="btn" style="flex: 1; padding: 8px; font-size: 13px; ${state.isAuthRegister ? 'background: var(--primary); color: #000;' : 'background: transparent; color: var(--text-secondary);'}">Create Account</button>
        </div>

        <form id="auth-form" style="text-align: left;">
          ${state.isAuthRegister ? `
            <div class="form-group">
              <label class="form-label">FIRST NAME</label>
              <input type="text" id="auth-name" class="form-input" placeholder="e.g. Jordan" required />
            </div>
          ` : ''}
          <div class="form-group">
            <label class="form-label">EMAIL ADDRESS</label>
            <input type="email" id="auth-email" class="form-input" placeholder="name@ebwealth.co.uk" required />
          </div>
          <div class="form-group">
            <label class="form-label">PASSWORD</label>
            <input type="password" id="auth-pass" class="form-input" placeholder="••••••••" required />
          </div>

          <div id="auth-error" style="display: none; background: rgba(244, 63, 94, 0.15); border: 1px solid var(--rose); color: #fff; padding: 10px; border-radius: 8px; font-size: 12px; margin-bottom: 16px;"></div>

          <button type="submit" id="auth-submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
            ${state.isAuthRegister ? 'Unlock Investment Vault' : 'Sign In to EB Wealth'}
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; color: var(--text-muted);">
          <span style="color: var(--emerald);">●</span> Connected to Firebase Cloud Firestore
        </div>
      </div>
    </div>
  `;

  document.getElementById('tab-signin').onclick = () => { state.isAuthRegister = false; render(); };
  document.getElementById('tab-signup').onclick = () => { state.isAuthRegister = true; render(); };

  document.getElementById('auth-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    const btn = document.getElementById('auth-submit-btn');
    const errBox = document.getElementById('auth-error');

    btn.disabled = true;
    btn.innerText = 'Connecting...';
    errBox.style.display = 'none';

    try {
      if (state.isAuthRegister) {
        const name = document.getElementById('auth-name').value.trim();
        const res = await firebaseService.signUp(email, pass, name);
        state.user = res.user;
      } else {
        const res = await firebaseService.signIn(email, pass);
        state.user = res.user;
      }
      render();
    } catch (err) {
      errBox.innerText = err.message || 'Authentication error';
      errBox.style.display = 'block';
      btn.disabled = false;
      btn.innerText = state.isAuthRegister ? 'Unlock Investment Vault' : 'Sign In to EB Wealth';
    }
  };
}

// 2. MAIN APP INTERFACE (Dashboard, Portfolio, Academy, AI Coach, Community, Vault)
function renderDashboardApp() {
  const totalVal = state.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = state.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalGain = totalVal - totalCost;
  const gainPct = totalCost > 0 ? ((totalGain / totalCost) * 100).toFixed(2) : '0.00';

  appEl.innerHTML = `
    <!-- Top Nav -->
    <header class="navbar">
      <div class="brand" onclick="window.switchTab('dashboard')">
        <div class="brand-badge">EB</div>
        <div class="brand-title"><span class="eb">EB </span><span class="wealth">WEALTH</span></div>
      </div>

      <nav class="nav-links">
        <button class="nav-btn ${state.currentView === 'dashboard' ? 'active' : ''}" onclick="window.switchTab('dashboard')">Dashboard</button>
        <button class="nav-btn ${state.currentView === 'portfolio' ? 'active' : ''}" onclick="window.switchTab('portfolio')">Portfolio</button>
        <button class="nav-btn ${state.currentView === 'academy' ? 'active' : ''}" onclick="window.switchTab('academy')">Academy</button>
        <button class="nav-btn ${state.currentView === 'aicoach' ? 'active' : ''}" onclick="window.switchTab('aicoach')">AI Coach</button>
        <button class="nav-btn ${state.currentView === 'community' ? 'active' : ''}" onclick="window.switchTab('community')">Community</button>
        <button class="nav-btn ${state.currentView === 'vault' ? 'active' : ''}" onclick="window.switchTab('vault')">Vault</button>
      </nav>

      <div class="user-quick-profile">
        <span class="tier-badge">Pro Member</span>
        <button class="btn btn-outline" style="padding: 6px 12px; font-size: 12px;" onclick="window.switchTab('vault')">
          ${state.user.firstName || 'Investor'}
        </button>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-view">
      ${renderActiveTab(totalVal, totalGain, gainPct)}
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav">
      <button class="bottom-nav-item ${state.currentView === 'dashboard' ? 'active' : ''}" onclick="window.switchTab('dashboard')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        <span>Home</span>
      </button>
      <button class="bottom-nav-item ${state.currentView === 'portfolio' ? 'active' : ''}" onclick="window.switchTab('portfolio')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
        <span>Portfolio</span>
      </button>
      <button class="bottom-nav-item ${state.currentView === 'academy' ? 'active' : ''}" onclick="window.switchTab('academy')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
        <span>Academy</span>
      </button>
      <button class="bottom-nav-item ${state.currentView === 'aicoach' ? 'active' : ''}" onclick="window.switchTab('aicoach')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>
        <span>AI Coach</span>
      </button>
      <button class="bottom-nav-item ${state.currentView === 'community' ? 'active' : ''}" onclick="window.switchTab('community')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
        <span>Community</span>
      </button>
      <button class="bottom-nav-item ${state.currentView === 'vault' ? 'active' : ''}" onclick="window.switchTab('vault')">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Vault</span>
      </button>
    </nav>
  `;
}

function renderActiveTab(totalVal, totalGain, gainPct) {
  switch (state.currentView) {
    case 'dashboard':
      return `
        <!-- Metrics Row -->
        <div class="grid-3" style="margin-bottom: 24px;">
          <div class="card metric-box">
            <div class="metric-label">Total Portfolio Net Worth</div>
            <div class="metric-val">£${totalVal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="metric-sub text-emerald">▲ +£${totalGain.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+${gainPct}%) Total Return</div>
          </div>
          <div class="card metric-box">
            <div class="metric-label">2026/27 ISA Allowance Used</div>
            <div class="metric-val">£14,250.00 <span style="font-size: 14px; color: var(--text-muted);">/ £20,000</span></div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill progress-bar-cyan" style="width: 71.25%;"></div>
            </div>
            <div class="metric-sub text-gold">£5,750 remaining tax-free capacity</div>
          </div>
          <div class="card metric-box">
            <div class="metric-label">Investor XP & Streak</div>
            <div class="metric-val">${state.user.xp || 320} XP</div>
            <div class="metric-sub text-cyan">🔥 ${state.user.streakDays || 4}-Day Active Investing Streak</div>
          </div>
        </div>

        <!-- Asset Allocation & Quick Actions -->
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Asset Allocation Distribution</h2>
              <span class="ticker-badge">Diversified</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                  <span>Global Equities (VWRP)</span>
                  <span class="text-cyan font-weight-bold">48.2%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill progress-bar-cyan" style="width: 48.2%;"></div></div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                  <span>US Technology (VUAG + EQGB)</span>
                  <span class="text-emerald font-weight-bold">29.1%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill progress-bar-emerald" style="width: 29.1%;"></div></div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                  <span>UK Large Cap (ISF)</span>
                  <span class="text-gold font-weight-bold">11.8%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill progress-bar-gold" style="width: 11.8%;"></div></div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                  <span>Cash & Money Market (CSH2)</span>
                  <span style="color: #A7F3D0;" class="font-weight-bold">10.9%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="background: #A7F3D0; width: 10.9%;"></div></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Quick Actions & Vault Sync</h2>
              <span style="font-size: 11px; color: var(--emerald);">● Cloud Sync Online</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
              Your EB Wealth portfolio is protected and continuously synced with Firebase Cloud Firestore.
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn btn-primary" onclick="window.openAddHoldingModal()">+ Add New Asset / ETF Holding</button>
              <button class="btn btn-outline" onclick="window.triggerCloudSync()">Sync to Firebase Firestore Cloud</button>
              <button class="btn btn-outline" onclick="window.switchTab('aicoach')">Ask AI Coach for Portfolio Review</button>
            </div>
          </div>
        </div>
      `;

    case 'portfolio':
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Portfolio Holdings & Real-Time Tracking</h2>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Institutional-grade ETF & equity tracking denominated in GBP (£)</p>
            </div>
            <button class="btn btn-primary" onclick="window.openAddHoldingModal()">+ Add Holding</button>
          </div>

          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Units</th>
                  <th>Avg Buy</th>
                  <th>Live Price</th>
                  <th>Total Value</th>
                  <th>Unrealized P&L</th>
                </tr>
              </thead>
              <tbody>
                ${state.holdings.map(h => {
                  const val = h.shares * h.currentPrice;
                  const cost = h.shares * h.avgBuyPrice;
                  const pl = val - cost;
                  const plPct = cost > 0 ? ((pl / cost) * 100).toFixed(1) : '0';
                  const isPositive = pl >= 0;
                  return `
                    <tr>
                      <td><span class="ticker-badge">${h.ticker}</span></td>
                      <td style="font-weight: 600;">${h.name}</td>
                      <td><span style="font-size: 11px; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px;">${h.allocationCategory}</span></td>
                      <td>${h.shares}</td>
                      <td>£${Number(h.avgBuyPrice).toFixed(2)}</td>
                      <td>£${Number(h.currentPrice).toFixed(2)}</td>
                      <td style="font-weight: 700;">£${val.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td class="${isPositive ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                        ${isPositive ? '+' : ''}£${pl.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${isPositive ? '+' : ''}${plPct}%)
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'academy':
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">EB Wealth Academy</h2>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Master UK wealth building, index funds, and tax efficiency</p>
            </div>
            <span class="tier-badge">Earn XP on Completion</span>
          </div>

          <div class="grid-2">
            ${state.academyLessons.map(lesson => `
              <div class="card" style="margin-bottom: 0; background: rgba(0, 240, 255, 0.04); border-color: ${lesson.completed ? 'var(--emerald)' : 'var(--border-cyan)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="post-cat-badge">${lesson.level}</span>
                  <span style="font-size: 12px; color: var(--text-muted);">${lesson.duration} • +${lesson.xp} XP</span>
                </div>
                <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${lesson.title}</h3>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 16px;">${lesson.summary}</p>
                <button class="btn ${lesson.completed ? 'btn-outline' : 'btn-primary'}" style="width: 100%; font-size: 13px; padding: 8px;" onclick="window.completeLesson('${lesson.id}')">
                  ${lesson.completed ? '✓ Module Completed (+XP Claimed)' : 'Start Interactive Lesson'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'aicoach':
      return `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">EB Wealth AI Financial Coach</h2>
            <span style="font-size: 11px; color: var(--primary);">● Institutional Wealth Engine</span>
          </div>
          
          <div class="chat-window">
            <div class="chat-messages" id="chat-messages-container">
              ${state.chatMessages.map(m => `
                <div class="message-bubble ${m.sender === 'user' ? 'message-user' : 'message-ai'}">
                  ${m.text}
                </div>
              `).join('')}
            </div>

            <!-- Suggested chips -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="window.sendPredefinedMessage('How does the £20k UK ISA tax shelter protect my ETF gains?')">ISA Tax Rules</button>
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="window.sendPredefinedMessage('Compare VWRP (Global ETF) vs VUAG (S&P 500)')">VWRP vs VUAG</button>
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="window.sendPredefinedMessage('What is Dollar-Cost Averaging (DCA)?')">Compound Growth Strategy</button>
            </div>

            <form class="chat-input-bar" id="chat-form">
              <input type="text" id="chat-input" class="form-input" placeholder="Ask about asset allocation, ISA limits, or index funds..." required />
              <button type="submit" class="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      `;

    case 'community':
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Investor Community Discussions</h2>
              <p style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Collaborate with UK investors on portfolios, ISAs, and long-term compounding</p>
            </div>
            <button class="btn btn-primary" onclick="window.openCreatePostModal()">+ New Discussion</button>
          </div>

          <div id="posts-container">
            ${state.communityPosts.map(p => `
              <div class="post-card">
                <div class="post-header">
                  <span class="post-cat-badge">${p.category}</span>
                  <span style="font-size: 12px; color: var(--text-muted);">${p.createdAtFormatted}</span>
                </div>
                <h3 class="post-title">${p.title}</h3>
                <p class="post-content">${p.content}</p>
                <div class="post-footer">
                  <span style="font-weight: 600;">By ${p.authorName}</span>
                  <span>•</span>
                  <button class="like-btn" onclick="window.likePost('${p.id}')">
                    ❤️ ${p.likesCount} Likes
                  </button>
                  <span>•</span>
                  <span>💬 ${p.commentsCount} Replies</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'vault':
      return `
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Investor Profile & Security Vault</h2>
              <span class="tier-badge">Tier: Pro</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
              <div class="brand-badge" style="width: 56px; height: 56px; font-size: 20px;">
                ${(state.user.firstName || 'I').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 800;">${state.user.firstName || 'Investor'}</h3>
                <p style="font-size: 13px; color: var(--text-secondary);">${state.user.email}</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-secondary);">Investor Experience:</span>
                <span style="font-weight: 600;">${state.user.experienceLevel || 'Beginner'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-secondary);">Primary Wealth Goal:</span>
                <span style="font-weight: 600;">${state.user.primaryGoal || 'Build long-term wealth'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-secondary);">Total Gamified XP:</span>
                <span style="font-weight: 600;" class="text-cyan">${state.user.xp || 320} XP</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span style="color: var(--text-secondary);">Active Streak:</span>
                <span style="font-weight: 600;" class="text-gold">🔥 ${state.user.streakDays || 4} Days</span>
              </div>
            </div>

            <button class="btn btn-danger" style="width: 100%; margin-top: 24px;" onclick="window.handleSignOut()">
              Sign Out of EB Wealth
            </button>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Firebase Cloud Firestore Connection</h2>
              <span style="color: var(--emerald); font-size: 11px;">● LIVE</span>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px;">
              Your data is synchronized securely with the Google Cloud Firestore instance.
            </p>

            <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid var(--border-cyan); border-radius: 10px; padding: 14px; margin-bottom: 18px; font-size: 12px; line-height: 1.6;">
              <div><strong>Project ID:</strong> <code>com-aistudio-ebwealth-kq-f6b41</code></div>
              <div><strong>Database ID:</strong> <code>ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3</code></div>
              <div><strong>Last Cloud Sync:</strong> <span id="vault-sync-time" class="text-cyan">${firebaseService.lastSync}</span></div>
            </div>

            <button class="btn btn-primary" style="width: 100%;" onclick="window.triggerCloudSync()">
              ⚡ Push Instant Sync to Firebase
            </button>
          </div>
        </div>
      `;
  }
}

// Window Global Handlers
window.switchTab = (tab) => {
  state.currentView = tab;
  render();
};

window.handleSignOut = () => {
  firebaseService.signOut();
  state.user = null;
  render();
};

window.triggerCloudSync = async () => {
  const btn = event?.target;
  if (btn) btn.innerText = 'Syncing...';
  await firebaseService.syncProfile(state.user);
  await firebaseService.syncHoldings(state.holdings);
  const time = firebaseService.lastSync;
  alert(`✓ Synced ${state.holdings.length} holdings and wealth profile to Firebase Cloud Firestore!\nTimestamp: ${time}`);
  render();
};

window.likePost = (postId) => {
  const p = state.communityPosts.find(x => x.id === postId);
  if (p) {
    p.likesCount += 1;
    render();
  }
};

window.completeLesson = (lessonId) => {
  const l = state.academyLessons.find(x => x.id === lessonId);
  if (l && !l.completed) {
    l.completed = true;
    state.user.xp = (state.user.xp || 320) + l.xp;
    firebaseService.syncProfile(state.user);
    alert(`🎉 Module completed! +${l.xp} XP awarded to your investor profile.`);
    render();
  }
};

window.sendPredefinedMessage = (text) => {
  state.chatMessages.push({ sender: 'user', text });
  generateAIResponse(text);
  render();
  setTimeout(scrollChat, 50);
};

// Add Holding Modal
window.openAddHoldingModal = () => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-add-holding';
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 16px;">Add New Portfolio Holding</h2>
      <form id="add-holding-form">
        <div class="form-group">
          <label class="form-label">TICKER SYMBOL</label>
          <input type="text" id="h-ticker" class="form-input" placeholder="e.g. SMT, CSPX, VHYL" required />
        </div>
        <div class="form-group">
          <label class="form-label">SECURITY NAME</label>
          <input type="text" id="h-name" class="form-input" placeholder="e.g. Scottish Mortgage Inv Trust" required />
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">UNITS / SHARES</label>
            <input type="number" step="any" id="h-shares" class="form-input" placeholder="50" required />
          </div>
          <div class="form-group">
            <label class="form-label">AVG BUY PRICE (£)</label>
            <input type="number" step="any" id="h-avg" class="form-input" placeholder="10.50" required />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">CURRENT PRICE (£)</label>
          <input type="number" step="any" id="h-curr" class="form-input" placeholder="11.20" required />
        </div>
        <div class="form-group">
          <label class="form-label">ALLOCATION CATEGORY</label>
          <select id="h-cat" class="form-select">
            <option value="Global Equities">Global Equities</option>
            <option value="US Equities">US Equities</option>
            <option value="UK Equities">UK Equities</option>
            <option value="Tech Growth">Tech Growth</option>
            <option value="Cash & Liquidity">Cash & Liquidity</option>
            <option value="Fixed Income">Fixed Income / Bonds</option>
          </select>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('modal-add-holding').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Save Holding</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('add-holding-form').onsubmit = (e) => {
    e.preventDefault();
    const newH = {
      ticker: document.getElementById('h-ticker').value.trim().toUpperCase(),
      name: document.getElementById('h-name').value.trim(),
      shares: parseFloat(document.getElementById('h-shares').value),
      avgBuyPrice: parseFloat(document.getElementById('h-avg').value),
      currentPrice: parseFloat(document.getElementById('h-curr').value),
      allocationCategory: document.getElementById('h-cat').value,
      currency: 'GBP',
      assetType: 'ETF'
    };
    state.holdings.push(newH);
    firebaseService.syncHoldings(state.holdings);
    modal.remove();
    render();
  };
};

// Create Post Modal with Category Dropdown
window.openCreatePostModal = () => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-create-post';
  modal.innerHTML = `
    <div class="modal-content">
      <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 16px;">Create Discussion Post</h2>
      <form id="create-post-form">
        <div class="form-group">
          <label class="form-label">TOPIC CATEGORY</label>
          <select id="post-cat" class="form-select" required>
            <option value="UK Investing">UK Investing</option>
            <option value="ETFs">ETFs</option>
            <option value="Beginners">Beginners</option>
            <option value="Stocks">Stocks</option>
            <option value="JISA & Junior Accounts">JISA & Junior Accounts</option>
            <option value="Wealth Building">Wealth Building</option>
            <option value="ISA & Tax">ISA & Tax</option>
            <option value="Portfolio Review">Portfolio Review</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">HEADLINE / TITLE</label>
          <input type="text" id="post-title" class="form-input" placeholder="e.g. Best low-cost global tracker for 2026?" required />
        </div>
        <div class="form-group">
          <label class="form-label">POST CONTENT</label>
          <textarea id="post-content" class="form-textarea" rows="4" placeholder="Share your insights, strategy, or question for the community..." required></textarea>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('modal-create-post').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex: 1;">Publish to Community</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('create-post-form').onsubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      id: String(Date.now()),
      category: document.getElementById('post-cat').value,
      title: document.getElementById('post-title').value.trim(),
      content: document.getElementById('post-content').value.trim(),
      authorName: state.user.firstName || 'Investor',
      likesCount: 1,
      commentsCount: 0,
      createdAtFormatted: 'Just now'
    };
    state.communityPosts.unshift(newPost);
    await firebaseService.createCommunityPost(newPost);
    modal.remove();
    render();
  };
};

function generateAIResponse(prompt) {
  setTimeout(() => {
    let reply = "That's a sound wealth building principle. In the UK, the annual £20,000 ISA allowance offers complete shelter against Capital Gains Tax (CGT) and dividend tax. Combining global market-cap weighting with regular dollar/pound-cost averaging consistently beats market timing.";
    const p = prompt.toLowerCase();
    if (p.includes('vwrp') || p.includes('vuag')) {
      reply = "VWRP (Vanguard FTSE All-World) gives you exposure to ~3,700 companies across 49 countries (including ~60% US plus emerging markets). VUAG tracks purely the US S&P 500 (500 companies). Holding VWRP provides broader diversification with zero single-country concentration risk.";
    } else if (p.includes('tax') || p.includes('allowance') || p.includes('isa')) {
      reply = "Every UK tax resident aged 18+ receives a £20,000 annual Stocks & Shares ISA allowance. All capital growth and dividends inside an ISA remain 100% tax-free forever without needing to be declared on HMRC Self Assessment.";
    } else if (p.includes('dca') || p.includes('compound') || p.includes('average')) {
      reply = "Pound-Cost Averaging (investing a fixed sum like £500 each month regardless of share price) eliminates emotional timing. When prices dip, you automatically acquire more units; when prices rise, your earlier purchases compound exponentially.";
    }
    state.chatMessages.push({ sender: 'ai', text: reply });
    render();
    setTimeout(scrollChat, 50);
  }, 600);
}

function scrollChat() {
  const container = document.getElementById('chat-messages-container');
  if (container) container.scrollTop = container.scrollHeight;
}

// Initial Boot
render();
