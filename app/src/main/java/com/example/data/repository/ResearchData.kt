package com.example.data.repository

import com.example.data.model.EBStockScorecard
import com.example.data.model.ResearchAsset
import com.example.data.model.ScorecardDimension
import com.example.data.model.ScorecardRating

object ResearchData {
    val assets: List<ResearchAsset> = listOf(
        ResearchAsset(
            ticker = "VWRP",
            name = "Vanguard FTSE All-World UCITS ETF (Acc)",
            assetType = "ETF",
            market = "London Stock Exchange (LSE)",
            priceGbp = 112.40,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.42,
            marketCap = "£18.4 Billion",
            peRatio = "19.8x",
            dividendYield = "1.8% (Accumulated)",
            revenueSummary = "Tracks FTSE All-World Index across ~3,600 large and mid-cap stocks in 49 countries.",
            profitability = "Consolidated global corporate earnings yield ~5.1%",
            growthRate = "Long-term global equity annualized return ~7.2%",
            sector = "Globally Diversified",
            geography = "Global (61% US, 15% Europe, 10% Emerging, 4% UK, 10% Asia-Pac)",
            description = "The gold standard core holding for passive global wealth builders. Automatically rebalances across thousands of global corporations in both developed and emerging markets.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.STRONG, "Global index aggregate revenue has grown steadily with world GDP."),
                    ScorecardDimension("Earnings growth", ScorecardRating.STRONG, "Underlying corporate earnings driven by global innovation and trade."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Captures highest-margin corporate leaders globally."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "Self-cleansing index removes bankrupt companies and adds new leaders automatically."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "High aggregate free cash flow generation from top index constituents."),
                    ScorecardDimension("Valuation", ScorecardRating.MODERATE, "Valuation slightly elevated relative to 20-year historical averages due to US tech weights."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "Ultra-low Ongoing Charges Figure (0.22% OCF) and immense liquidity."),
                    ScorecardDimension("Dividend", ScorecardRating.MODERATE, "Dividends automatically reinvested into fund units for compounding."),
                    ScorecardDimension("Growth potential", ScorecardRating.STRONG, "Continues to capture global human productivity and economic progress."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "High geographic concentration in the United States (~61%).")
                ),
                whatLooksInteresting = listOf(
                    "One-stop complete global diversification in a single trade.",
                    "Accumulating structure (Acc) eliminates tax drag of uninvested cash dividends.",
                    "Low fee of only £2.20 per £1,000 invested per year."
                ),
                whatNeedsInvestigation = listOf(
                    "Verify your comfort with 60%+ weighting to the US dollar and American corporations.",
                    "Compare platform transaction fees for buying London-listed GBP denominated units."
                ),
                keyRisks = listOf(
                    "Global equity market bear markets can experience drawdowns of 20% to 40%.",
                    "Currency fluctuations between British Pound and foreign currencies."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "Does this ETF already form the core foundation of my portfolio?",
                    "Do I already hold other funds (like S&P 500) that unnecessarily duplicate these holdings?"
                )
            )
        ),
        ResearchAsset(
            ticker = "VUAG",
            name = "Vanguard S&P 500 UCITS ETF (Acc)",
            assetType = "ETF",
            market = "London Stock Exchange (LSE)",
            priceGbp = 86.15,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.68,
            marketCap = "£32.1 Billion",
            peRatio = "24.5x",
            dividendYield = "1.4% (Accumulated)",
            revenueSummary = "Tracks the 500 leading publicly traded companies in the United States.",
            profitability = "Exceptionally high return on invested capital across top US companies.",
            growthRate = "Historic 10-year annualized total return ~12.4%",
            sector = "US Large Cap (31% Tech, 13% Financials, 12% Healthcare)",
            geography = "United States (100% domiciled, global revenue generation)",
            description = "Provides low-cost exposure to 500 of the largest, most profitable corporations in America. Warren Buffett has repeatedly recommended low-cost S&P 500 index funds for individual investors.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.STRONG, "Top US mega-cap tech giants driving double-digit revenue expansion."),
                    ScorecardDimension("Earnings growth", ScorecardRating.STRONG, "Strong pricing power and technological leadership."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "World-leading net profit margins."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "Top holdings maintain massive net cash reserves."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "Enormous free cash flow supporting massive share repurchase programs."),
                    ScorecardDimension("Valuation", ScorecardRating.MODERATE, "Trading above 10-year historical forward P/E medians."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "Extremely low fee (0.07% OCF) makes it one of the cheapest funds available."),
                    ScorecardDimension("Dividend", ScorecardRating.WEAK, "Low dividend yield as US tech companies favor share buybacks over cash payouts."),
                    ScorecardDimension("Growth potential", ScorecardRating.STRONG, "Center of global artificial intelligence and cloud computing revolution."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Top 10 holdings represent over 33% of the entire fund weight.")
                ),
                whatLooksInteresting = listOf(
                    "Rock-bottom expense ratio of 0.07% per annum.",
                    "Unrivaled corporate profitability and innovation track record."
                ),
                whatNeedsInvestigation = listOf(
                    "Are you comfortable with zero direct exposure to European, UK or Asian markets?",
                    "How will US dollar swings against GBP affect your localized returns?"
                ),
                keyRisks = listOf(
                    "High concentration in top tech names (Apple, Microsoft, NVIDIA, Alphabet, Amazon).",
                    "Vulnerability to US macroeconomic contractions or regulatory antitrust shifts."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "If I already own VWRP, do I actually need VUAG, or am I creating overlap?",
                    "What is my tolerance if tech stocks experience a prolonged valuation reset?"
                )
            )
        ),
        ResearchAsset(
            ticker = "AZN",
            name = "AstraZeneca PLC",
            assetType = "Stock",
            market = "London Stock Exchange (LSE)",
            priceGbp = 118.60,
            priceCurrencySymbol = "£",
            dayChangePercent = -0.32,
            marketCap = "£184.2 Billion",
            peRatio = "33.2x (Forward P/E 16.5x)",
            dividendYield = "2.1%",
            revenueSummary = "Global biopharmaceutical giant specializing in oncology, rare diseases, and cardiovascular treatments.",
            profitability = "Operating margins expanding toward 30% on high-margin cancer therapies.",
            growthRate = "Management target of $80 Billion revenue by 2030 (8% CAGR)",
            sector = "Healthcare & Pharmaceuticals",
            geography = "Global (UK HQ, US 42%, Europe 20%, Emerging Markets 28%)",
            description = "One of the most valuable companies on the London Stock Exchange. Renowned for its world-class pipeline of patented oncology medicines and global commercial distribution.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.STRONG, "Consistent double-digit revenue growth driven by oncology drugs."),
                    ScorecardDimension("Earnings growth", ScorecardRating.STRONG, "Expanding operating leverage as pipeline candidates gain FDA approvals."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Gross margins consistently above 80% on proprietary medicines."),
                    ScorecardDimension("Balance sheet", ScorecardRating.MODERATE, "Net debt manageable but elevated following Alexion acquisition."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "Robust operating cash flows reinvested heavily into R&D ($10B+ annually)."),
                    ScorecardDimension("Valuation", ScorecardRating.MODERATE, "Commands a valuation premium relative to European pharma peers."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "Extensive global patent protection and deep scientific moat."),
                    ScorecardDimension("Dividend", ScorecardRating.MODERATE, "Stable progressive dividend policy with 20+ year payment record."),
                    ScorecardDimension("Growth potential", ScorecardRating.STRONG, "20+ Phase 3 clinical trial readouts planned over the next 3 years."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Patent expiration cliffs and regulatory clinical trial setbacks.")
                ),
                whatLooksInteresting = listOf(
                    "Premier oncology drug franchise with substantial pricing power.",
                    "Ambitious target to launch 20 new medicines before 2030.",
                    "Defensive healthcare demand resilient through economic recessions."
                ),
                whatNeedsInvestigation = listOf(
                    "Examine the patent expiry schedule for key blockbuster treatments.",
                    "Monitor ongoing drug pricing regulatory developments in the United States."
                ),
                keyRisks = listOf(
                    "Clinical trial failures or safety concerns during trials.",
                    "Pricing pressures from government health programs and NHS procurement."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "Am I comfortable holding individual single-stock risk compared to a healthcare ETF?",
                    "Does AstraZeneca's 2% dividend yield meet my current investment objectives?"
                )
            )
        ),
        ResearchAsset(
            ticker = "LGEN",
            name = "Legal & General Group PLC",
            assetType = "Stock",
            market = "London Stock Exchange (LSE)",
            priceGbp = 2.38,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.51,
            marketCap = "£14.2 Billion",
            peRatio = "10.4x",
            dividendYield = "8.6%",
            revenueSummary = "Major UK financial services, life insurance, pension risk transfer, and asset management provider.",
            profitability = "High solvency II capital coverage ratio (~224%) supporting dividend safety.",
            growthRate = "Institutional pension risk transfer volume growing ~7% annually.",
            sector = "Financials & Insurance",
            geography = "Primarily UK & United States",
            description = "A stalwart of the FTSE 100 known for its substantial dividend payouts. Legal & General is a market leader in UK pension de-risking and long-term retirement solutions.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.MODERATE, "Steady, non-cyclical growth in annuity and pension risk transfer volumes."),
                    ScorecardDimension("Earnings growth", ScorecardRating.MODERATE, "Modest core operating profit growth aligned with UK financial markets."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Return on equity consistently above 18%."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "Robust regulatory Solvency II ratio providing buffer against market shocks."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "High operational capital generation covering dividend payments 1.2x."),
                    ScorecardDimension("Valuation", ScorecardRating.STRONG, "Attractively valued at low forward P/E and deep discount to net assets."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "Dominant brand trust and scale in UK institutional workplace pensions."),
                    ScorecardDimension("Dividend", ScorecardRating.STRONG, "One of the highest reliable dividend yields on the London market (~8.6%)."),
                    ScorecardDimension("Growth potential", ScorecardRating.MODERATE, "Expansion into US pension risk transfer market."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Sensitivity to real estate asset values and credit market spreads.")
                ),
                whatLooksInteresting = listOf(
                    "Market-leading dividend yield of 8.6% ideal for income portfolios.",
                    "Beneficiary of aging UK demographics requiring defined benefit pension transfers.",
                    "Conservative capital management and disciplined underwriting."
                ),
                whatNeedsInvestigation = listOf(
                    "Review dividend coverage ratio during periods of market stress.",
                    "Assess direct investment portfolio exposure to commercial UK real estate."
                ),
                keyRisks = listOf(
                    "Prolonged UK macroeconomic stagnation.",
                    "Unexpected spikes in longevity rates impacting annuity liabilities."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "Do I want high immediate dividend cash flow or higher long-term capital growth?",
                    "Am I reinvesting this dividend inside my ISA to harness compounding?"
                )
            )
        ),
        ResearchAsset(
            ticker = "SHEL",
            name = "Shell PLC",
            assetType = "Stock",
            market = "London Stock Exchange (LSE)",
            priceGbp = 28.45,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.85,
            marketCap = "£178.6 Billion",
            peRatio = "11.2x",
            dividendYield = "4.2%",
            revenueSummary = "Global energy supermajor producing oil, liquefied natural gas (LNG), and expanding low-carbon energy solutions.",
            profitability = "Industry-leading global LNG trading margins generating billions in quarterly cash flow.",
            growthRate = "Disciplined capital expenditure target of $22-25B with priority on shareholder distributions.",
            sector = "Energy & Natural Resources",
            geography = "Global (UK Headquartered)",
            description = "The largest constituent of the UK stock market by free cash flow. Generates massive liquidity from its premier global LNG franchise and uses proceeds for substantial share buybacks.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.MODERATE, "Revenues fluctuate with underlying commodity price cycles."),
                    ScorecardDimension("Earnings growth", ScorecardRating.STRONG, "Cost discipline and LNG volume optimization driving steady earnings."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Return on capital employed (ROCE) exceeding 15%."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "Net debt systematically reduced below $40 Billion."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "Generating over $35 Billion in annual operating cash flow."),
                    ScorecardDimension("Valuation", ScorecardRating.STRONG, "Trades at attractive discount to US counterparts Exxon and Chevron."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "World's preeminent integrated gas and LNG supply chain."),
                    ScorecardDimension("Dividend", ScorecardRating.STRONG, "Committed progressive dividend growth (+4% target) plus multi-billion dollar quarterly buybacks."),
                    ScorecardDimension("Growth potential", ScorecardRating.MODERATE, "Steady LNG demand growth across Asia offset by energy transition headwinds."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Long-term decarbonization policies and commodity price volatility.")
                ),
                whatLooksInteresting = listOf(
                    "High cash return to shareholders via combined dividend and share buybacks.",
                    "Dominant market position in LNG, the crucial transition fuel for Asian economies."
                ),
                whatNeedsInvestigation = listOf(
                    "Long-term capital allocation between hydrocarbon returns and renewable energy projects."
                ),
                keyRisks = listOf(
                    "Global oil and natural gas price downturns.",
                    "Windfall taxes and regulatory emissions mandates."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "How does energy sector cyclicality fit my long-term portfolio volatility tolerance?",
                    "Am I comfortable holding fossil fuel producers in my portfolio?"
                )
            )
        ),
        ResearchAsset(
            ticker = "ULVR",
            name = "Unilever PLC",
            assetType = "Stock",
            market = "London Stock Exchange (LSE)",
            priceGbp = 47.30,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.22,
            marketCap = "£117.8 Billion",
            peRatio = "19.4x",
            dividendYield = "3.4%",
            revenueSummary = "Global consumer staples giant owning over 400 iconic brands (Dove, Ben & Jerry's, Hellmann's, Domestos, Knorr).",
            profitability = "Gross margins expanding above 44% with strong pricing power across 190+ countries.",
            growthRate = "Underlying sales growth (USG) consistent at 4-6% annually.",
            sector = "Consumer Staples",
            geography = "Global (UK HQ, 58% Emerging Markets, 42% Developed)",
            description = "A defensive fortress on the London market. Over 3.4 billion people use a Unilever product every single day, providing exceptionally resilient recurring cash flows regardless of recessions.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.MODERATE, "Predictable single-digit volume and price growth across everyday consumer goods."),
                    ScorecardDimension("Earnings growth", ScorecardRating.MODERATE, "Productivity programs driving modest annual EPS expansion."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Consistent high operating margins (~17%) across global beauty and personal care."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "A-grade credit rating with conservative leverage."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "Over 95% free cash flow conversion rate."),
                    ScorecardDimension("Valuation", ScorecardRating.MODERATE, "Trades in line with European consumer staple peers like Nestlé."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "Decades of brand equity, supermarket shelf dominance, and emerging market distribution networks."),
                    ScorecardDimension("Dividend", ScorecardRating.STRONG, "Unbroken dividend payment record spanning multiple decades."),
                    ScorecardDimension("Growth potential", ScorecardRating.MODERATE, "Expansion into premium beauty and health & wellbeing segments."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Private label supermarket copycats and input raw material inflation.")
                ),
                whatLooksInteresting = listOf(
                    "Remarkable defensive stability during recessions—people still buy soap and food.",
                    "58% revenue derived from fast-growing emerging markets in Asia and Latin America."
                ),
                whatNeedsInvestigation = listOf(
                    "Track the planned spin-off of the global ice cream division."
                ),
                keyRisks = listOf(
                    "Consumer trade-down to cheaper store-brand alternatives during high inflation.",
                    "Foreign currency exchange headwinds from emerging market currencies against GBP."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "Do I need defensive stability in my portfolio to buffer volatile tech holdings?",
                    "Is Unilever's steady 3.4% yield and modest growth suited to my wealth goals?"
                )
            )
        ),
        ResearchAsset(
            ticker = "ISF",
            name = "iShares Core FTSE 100 UCITS ETF",
            assetType = "ETF",
            market = "London Stock Exchange (LSE)",
            priceGbp = 8.42,
            priceCurrencySymbol = "£",
            dayChangePercent = 0.35,
            marketCap = "£12.8 Billion",
            peRatio = "13.2x",
            dividendYield = "3.8%",
            revenueSummary = "Tracks the 100 largest blue-chip multinational companies listed on the London Stock Exchange.",
            profitability = "High collective dividend payout ratio and defensive cash flow generation.",
            growthRate = "Historically lower capital growth than US markets, but higher dividend cash yield.",
            sector = "UK Blue Chip (Financials 20%, Consumer 16%, Healthcare 13%, Energy 13%)",
            geography = "UK Listed (~75% revenue derived from outside the UK)",
            description = "The flagship domestic UK index fund. With an ultra-low 0.07% OCF fee, it offers low-cost access to the British market's largest dividend payers and multinational operators.",
            scorecard = EBStockScorecard(
                dimensions = listOf(
                    ScorecardDimension("Revenue growth", ScorecardRating.MODERATE, "Mature blue-chip multinationals with steady global sales."),
                    ScorecardDimension("Earnings growth", ScorecardRating.MODERATE, "Driven by global trade, energy cycles, and financial interest rates."),
                    ScorecardDimension("Profitability", ScorecardRating.STRONG, "Solid free cash flow yields supporting high shareholder payouts."),
                    ScorecardDimension("Balance sheet", ScorecardRating.STRONG, "Comprises established multi-billion pound corporate giants."),
                    ScorecardDimension("Cash flow", ScorecardRating.STRONG, "Substantial aggregate dividend distributions."),
                    ScorecardDimension("Valuation", ScorecardRating.STRONG, "Attractively priced at P/E ~13x compared to S&P 500 at ~24x."),
                    ScorecardDimension("Competitive advantage", ScorecardRating.STRONG, "0.07% annual management fee makes it extraordinarily cost-effective."),
                    ScorecardDimension("Dividend", ScorecardRating.STRONG, "High natural dividend yield (~3.8%) compared to global averages."),
                    ScorecardDimension("Growth potential", ScorecardRating.MODERATE, "Underweight in fast-growing technology sectors."),
                    ScorecardDimension("Key risks", ScorecardRating.MODERATE, "Heavy concentration in old-economy sectors (Banks, Oil, Mining).")
                ),
                whatLooksInteresting = listOf(
                    "Low valuation multiple provides margin of safety compared to expensive US indices.",
                    "Strong natural dividend yield ideal for UK ISA income reinvestment."
                ),
                whatNeedsInvestigation = listOf(
                    "Does your portfolio have too much home bias if you live and work in the UK?"
                ),
                keyRisks = listOf(
                    "Lagging performance during global technology-led bull markets.",
                    "Vulnerability to global commodities and interest rate downturns."
                ),
                questionsInvestorsShouldAsk = listOf(
                    "Am I overweighting the UK just because it is familiar to me?",
                    "How does pairing ISF with VWRP balance my global versus domestic dividend exposure?"
                )
            )
        )
    )

    fun findByQuery(query: String): List<ResearchAsset> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return assets
        return assets.filter {
            it.ticker.lowercase().contains(q) ||
            it.name.lowercase().contains(q) ||
            it.sector.lowercase().contains(q) ||
            it.assetType.lowercase().contains(q)
        }
    }
}
