package com.example.data.repository

import com.example.data.model.AcademyLevel
import com.example.data.model.Lesson
import com.example.data.model.QuizQuestion

object AcademyData {
    val levels: List<AcademyLevel> = listOf(
        AcademyLevel(
            levelNumber = 1,
            title = "Investing Foundations",
            description = "Master the mental models, time horizons, and mathematical laws behind wealth creation.",
            lessons = listOf(
                Lesson(
                    id = "foundations_1",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "What is Investing?",
                    subtitle = "Deploying capital into productive productive assets to build future wealth.",
                    readTime = "2 min",
                    xpReward = 50,
                    shortExplanation = "Investing is the act of putting money to work in assets—such as businesses, funds, or real estate—that have the potential to produce income and appreciate in value over time. Unlike saving in cash which merely preserves nominal units, investing aims to grow purchasing power above inflation.",
                    realWorldExample = "If you spend £100 on a pair of trainers, that £100 is gone. If you invest £100 into a global index fund owning thousands of global companies, your £100 participates in the earnings, dividends, and future productivity of those businesses.",
                    keyTakeaways = listOf(
                        "Investing means owning productive assets rather than just hoarding cash.",
                        "Returns come from corporate earnings, dividend distributions, and long-term capital growth.",
                        "All investing involves capital risk; the goal is managed risk for reasonable expected returns."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is the primary difference between holding cash and investing?",
                            options = listOf(
                                "Cash produces guaranteed 15% dividends yearly",
                                "Cash has zero purchasing power risk against inflation",
                                "Investing deploys money into productive assets that can grow purchasing power",
                                "Investing guarantees you can never lose your initial capital"
                            ),
                            correctIndex = 2,
                            explanation = "Cash loses purchasing power over time due to inflation, whereas investing aims to grow your real wealth through productive assets."
                        ),
                        QuizQuestion(
                            question = "Where do returns on equity investments primarily come from?",
                            options = listOf(
                                "Government prize draws",
                                "Underlying business profits, dividends, and earnings growth",
                                "Fixed bank interest rates set by the Bank of England",
                                "Guaranteed daily trading bonuses"
                            ),
                            correctIndex = 1,
                            explanation = "Stocks represent fractional ownership of companies; returns stem from company growth, productivity, and distributed dividends."
                        )
                    )
                ),
                Lesson(
                    id = "foundations_2",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "Saving vs Investing",
                    subtitle = "Knowing when to preserve safety cash and when to commit for growth.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "Saving is setting money aside in risk-free, liquid cash deposits for short-term goals (0–3 years) and emergency reserves. Investing is deploying surplus funds into assets with price fluctuations over longer horizons (5+ years) to beat inflation.",
                    realWorldExample = "Your 3–6 month emergency fund belongs in an instant-access high-yield savings account or Cash ISA. Your retirement or 20-year wealth fund belongs in a diversified investment portfolio.",
                    keyTakeaways = listOf(
                        "Always keep an emergency buffer in cash before committing to volatile investments.",
                        "Cash protects in the short term, but loses to inflation in the long term.",
                        "Investing requires a minimum recommended horizon of 5 years."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is the recommended minimum time horizon for stock market investing?",
                            options = listOf("3 weeks", "6 months", "At least 5 years", "12 hours"),
                            correctIndex = 2,
                            explanation = "Market volatility can produce downturns over short periods. A 5+ year horizon gives investments time to recover and compound."
                        )
                    )
                ),
                Lesson(
                    id = "foundations_3",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "The Magic of Compound Growth",
                    subtitle = "Earning returns on your original capital AND on past accumulated returns.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "Albert Einstein famously called compound interest the eighth wonder of the world. Compound growth occurs when your returns generate their own returns. Over 10, 20, or 30 years, compounding accelerates exponentially.",
                    realWorldExample = "Investing £250/month for 30 years at an illustrative 7% annual return totals £90,000 of your own money, but can compound into over £300,000! More than two-thirds of the final sum is compound growth.",
                    keyTakeaways = listOf(
                        "Time in the market matters more than timing the market.",
                        "Reinvesting dividends fuels the compounding engine.",
                        "Starting 5 years earlier can double your eventual retirement pot."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What drives the explosive curve of compound growth over long time horizons?",
                            options = listOf(
                                "High trading fees paid to brokers",
                                "Earning returns on previous accumulated returns and reinvested income",
                                "Constantly switching funds every month",
                                "Keeping 100% of wealth in bank current accounts"
                            ),
                            correctIndex = 1,
                            explanation = "As gains and dividends are reinvested, the base on which future percentage returns are calculated keeps expanding."
                        )
                    )
                ),
                Lesson(
                    id = "foundations_4",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "Inflation: The Silent Wealth Destroyer",
                    subtitle = "Why doing nothing with cash guarantees loss of purchasing power.",
                    readTime = "2 min",
                    xpReward = 50,
                    shortExplanation = "Inflation is the gradual rise in prices across an economy. If inflation runs at 4% annually, £100 today buys only what £45 buys in 20 years. Investing in companies capable of raising prices allows your wealth to keep pace.",
                    realWorldExample = "A pint of milk, a bus ticket, or a house costs many times what it did in 1980. Cash held in a biscuit tin lost over 80% of its purchasing power, while global stock markets outpaced inflation significantly.",
                    keyTakeaways = listOf(
                        "Cash is safe from nominal loss, but guaranteed to lose real purchasing power.",
                        "Great companies have 'pricing power' to pass costs along.",
                        "Your real return equals your investment return minus inflation."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "If your investment earns 7% and inflation is 3%, what is your approximate real return?",
                            options = listOf("10%", "4%", "21%", "0%"),
                            correctIndex = 1,
                            explanation = "Real return = Nominal Return (7%) - Inflation (3%) = 4% increase in actual purchasing power."
                        )
                    )
                ),
                Lesson(
                    id = "foundations_5",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "Risk vs Reward Dynamics",
                    subtitle = "Why there is no such thing as guaranteed high returns with zero risk.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "In financial markets, risk and return are inextricably linked. Higher expected returns exist solely to compensate investors for bearing uncertainty and volatility. Anyone promising 'guaranteed 20% returns with no risk' is committing fraud.",
                    realWorldExample = "Government Gilts offer lower, predictable yields because the UK government is unlikely to default. Emerging market stocks offer higher potential growth because their economic environments are more volatile.",
                    keyTakeaways = listOf(
                        "Return is the compensation you receive for accepting uncertainty.",
                        "Diversification is the only 'free lunch' that reduces risk without reducing expected return.",
                        "Match your portfolio risk to your sleep-at-night capacity."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What should you assume if someone offers guaranteed 25% returns with zero risk?",
                            options = listOf(
                                "They have discovered a secret algorithm",
                                "It is a dangerous scheme or scam; risk-free high return does not exist",
                                "They are backed by the Bank of England",
                                "It is standard ISA behavior"
                            ),
                            correctIndex = 1,
                            explanation = "Financial law dictates higher return always requires higher risk. Guaranteed high returns with zero risk are hallmarks of fraud."
                        )
                    )
                ),
                Lesson(
                    id = "foundations_6",
                    levelNumber = 1,
                    levelTitle = "Investing Foundations",
                    title = "Understanding Volatility",
                    subtitle = "Market swings are the fee for admission, not a penalty fine.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "Volatility refers to how rapidly and dramatically prices fluctuate in the short term. It is not identical to permanent loss of capital. Stock prices bounce up and down daily based on news, sentiment, and liquidity.",
                    realWorldExample = "During the 2008 financial crisis or the 2020 pandemic dip, global markets dropped 30–50% in weeks, only to recover and set all-time highs within a few years.",
                    keyTakeaways = listOf(
                        "Volatility is normal and expected in equity markets.",
                        "Selling in a panic turns a temporary paper loss into a permanent actual loss.",
                        "Downturns represent opportunities to buy quality shares at a discount."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "How should a 20-year horizon investor view a temporary 15% market correction?",
                            options = listOf(
                                "Panic and liquidate the entire account immediately",
                                "A normal, temporary dip and a chance to buy at lower prices",
                                "Proof that capitalism is finished forever",
                                "Reason to stop paying into their monthly direct debit"
                            ),
                            correctIndex = 1,
                            explanation = "Market corrections happen regularly. Long-term accumulators benefit by buying shares at lower prices."
                        )
                    )
                )
            )
        ),
        AcademyLevel(
            levelNumber = 2,
            title = "Investment Types",
            description = "Explore the building blocks: Shares, ETFs, Index Funds, Bonds, and REITs.",
            lessons = listOf(
                Lesson(
                    id = "types_etf",
                    levelNumber = 2,
                    levelTitle = "Investment Types",
                    title = "What is an ETF? (Exchange Traded Fund)",
                    subtitle = "One basket holding hundreds or thousands of securities traded on an exchange.",
                    readTime = "2 min",
                    xpReward = 50,
                    shortExplanation = "An ETF (Exchange Traded Fund) is a fund that trades on a stock exchange like an individual share, but holds a basket of underlying investments (like 3,000 global companies). When you buy 1 unit of an ETF, you get instant micro-ownership of every company in that basket.",
                    realWorldExample = "A single share of VWRP gives you exposure to Apple, Microsoft, Shell, AstraZeneca, Toyota, and thousands of other global businesses at a tiny cost of ~0.22% per year.",
                    keyTakeaways = listOf(
                        "Instant diversification in a single trade.",
                        "Low ongoing charges (OCF) compared to actively managed funds.",
                        "Traded liquidly during normal exchange hours."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is the primary benefit of investing via an ETF over a single stock?",
                            options = listOf(
                                "Zero trading fees guaranteed forever",
                                "Instant diversification across hundreds or thousands of companies",
                                "The government pays your monthly contribution",
                                "ETFs can never drop in value"
                            ),
                            correctIndex = 1,
                            explanation = "ETFs distribute your eggs across thousands of baskets, reducing single-company bankruptcy risk."
                        )
                    )
                ),
                Lesson(
                    id = "types_shares",
                    levelNumber = 2,
                    levelTitle = "Investment Types",
                    title = "Shares & Equities Explained",
                    subtitle = "Owning a legal fraction of an operating company.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "When a company issues shares, it sells fractions of ownership to the public. As a shareholder, you own a claim on the company's net assets, earnings, and dividend distributions.",
                    realWorldExample = "If a business has 1,000,000 shares and you own 1,000, you own 0.1% of the entire company. If it pays a £1,000,000 dividend pool, you receive £1,000.",
                    keyTakeaways = listOf(
                        "Stocks offer high long-term growth potential but higher individual volatility.",
                        "Single-stock picking requires rigorous research and carries bankruptcy risk.",
                        "Shareholders have limited liability; you can never lose more than you invest."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What do you legally own when you purchase a share in a company?",
                            options = listOf(
                                "A debt owed to you with guaranteed interest",
                                "A fractional equity ownership of that company",
                                "An employment contract with the CEO",
                                "A consumer voucher"
                            ),
                            correctIndex = 1,
                            explanation = "Equity means ownership. You own a proportionate part of the company."
                        )
                    )
                ),
                Lesson(
                    id = "types_bonds",
                    levelNumber = 2,
                    levelTitle = "Investment Types",
                    title = "Bonds & Fixed Income",
                    subtitle = "Lending money to governments and corporations in exchange for regular interest.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "A bond is essentially an IOU. When you buy a UK Government Gilt or corporate bond, you lend money to the issuer. They pay you fixed interest payments (coupons) and repay the principal at maturity.",
                    realWorldExample = "The UK Treasury issues Gilts to finance infrastructure. Investors receive 4% annual coupon payments and their principal back in 10 years.",
                    keyTakeaways = listOf(
                        "Bonds typically offer lower volatility than equities.",
                        "They provide income stability and buffer portfolio downturns.",
                        "Bond prices move inversely to central bank interest rates."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What happens to existing bond prices when general interest rates RISE?",
                            options = listOf(
                                "They generally fall, as newly issued bonds offer more attractive yields",
                                "They triple immediately",
                                "Nothing, bonds are unaffected by interest rates",
                                "They convert into cash automatically"
                            ),
                            correctIndex = 0,
                            explanation = "Bond prices and market yields have an inverse relationship."
                        )
                    )
                ),
                Lesson(
                    id = "types_reits",
                    levelNumber = 2,
                    levelTitle = "Investment Types",
                    title = "REITs: Real Estate Investment Trusts",
                    subtitle = "Gaining commercial and residential property exposure without being a landlord.",
                    readTime = "3 min",
                    xpReward = 50,
                    shortExplanation = "A REIT is a listed company that owns, operates, or finances income-generating real estate (warehouses, medical centers, offices, apartment complexes). In the UK, REITs must pay out at least 90% of taxable property profits as dividends.",
                    realWorldExample = "Instead of buying a £250,000 buy-to-let flat with tenant headaches and stamp duty, you can invest £500 into a logistics REIT that owns Amazon distribution warehouses.",
                    keyTakeaways = listOf(
                        "High dividend yield mandate (90% payout rule).",
                        "High liquidity compared to physical bricks-and-mortar property.",
                        "Sensitivities to interest rates and commercial occupancy."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "Why are REITs popular among income-focused investors?",
                            options = listOf(
                                "They are legally mandated in the UK to distribute at least 90% of tax-exempt property income as dividends",
                                "They guarantee property prices will never fall",
                                "They are backed by free tenant insurance from HMRC",
                                "They eliminate all stock market fluctuations"
                            ),
                            correctIndex = 0,
                            explanation = "The REIT tax regime requires passing the vast majority of rental profits directly to shareholders."
                        )
                    )
                )
            )
        ),
        AcademyLevel(
            levelNumber = 3,
            title = "UK Investing & Tax Wrappers",
            description = "Master the UK tax allowances: Stocks & Shares ISA, LISA, SIPP, JISA, and Capital Gains.",
            lessons = listOf(
                Lesson(
                    id = "uk_isa",
                    levelNumber = 3,
                    levelTitle = "UK Investing & Tax Wrappers",
                    title = "The Stocks & Shares ISA (Individual Savings Account)",
                    subtitle = "Your £20,000/year tax-free fortress for dividends and capital gains.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "The Stocks & Shares ISA is the crown jewel of UK personal finance. Every UK resident aged 18+ receives a £20,000 annual allowance. Any capital gains, share dividends, or interest earned inside an ISA are completely free from UK income and capital gains tax—forever!",
                    realWorldExample = "If you invest £20,000 in an ISA and it grows over 15 years to £150,000, you can withdraw every single penny with zero tax liability to HMRC.",
                    keyTakeaways = listOf(
                        "Annual allowance of £20,000 across all ISAs per tax year (6 April - 5 April).",
                        "Zero Capital Gains Tax (CGT) and zero Dividend Tax.",
                        "No requirement to declare ISA investments on your Self Assessment tax return."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is the maximum annual contribution allowance for an adult UK Stocks & Shares ISA?",
                            options = listOf("£1,000", "£5,000", "£20,000", "Unlimited"),
                            correctIndex = 2,
                            explanation = "The UK ISA allowance is £20,000 per tax year (shared across Cash, Stocks & Shares, and Innovative Finance ISAs)."
                        ),
                        QuizQuestion(
                            question = "How much UK Capital Gains Tax is due on profits earned inside an ISA?",
                            options = listOf("20%", "40%", "0% (Completely tax-free)", "10%"),
                            correctIndex = 2,
                            explanation = "All capital gains and dividend income earned inside an ISA are completely exempt from UK taxation."
                        )
                    )
                ),
                Lesson(
                    id = "uk_lisa",
                    levelNumber = 3,
                    levelTitle = "UK Investing & Tax Wrappers",
                    title = "Lifetime ISA (LISA): The 25% Government Bonus",
                    subtitle = "Up to £1,000/year free bonus for first-time buyers or retirement.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "Available to UK residents aged 18–39, the LISA allows saving up to £4,000 per tax year (which forms part of your £20k ISA allowance). The government adds an immediate 25% bonus (up to £1,000/year). Funds can be used tax-free for a first home up to £450,000 or for retirement after age 60.",
                    realWorldExample = "Deposit £4,000 in April. The UK government deposits £1,000 bonus into your account, giving you £5,000 to invest in funds immediately.",
                    keyTakeaways = listOf(
                        "25% government bonus on deposits up to £4,000/year.",
                        "Must be used for a first home (£450k limit) or withdrawn after age 60.",
                        "Unauthorised early withdrawals incur a 25% penalty (recouping bonus plus a small charge on original capital)."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is the government bonus percentage on Lifetime ISA deposits?",
                            options = listOf("10%", "25%", "50%", "5%"),
                            correctIndex = 1,
                            explanation = "The government adds 25% to your contributions up to £4,000 each year (£1,000 max bonus)."
                        )
                    )
                ),
                Lesson(
                    id = "uk_sipp",
                    levelNumber = 3,
                    levelTitle = "UK Investing & Tax Wrappers",
                    title = "SIPP: Self-Invested Personal Pension",
                    subtitle = "Claiming up to 40% or 45% tax relief on your retirement investments.",
                    readTime = "4 min",
                    xpReward = 60,
                    shortExplanation = "A SIPP gives you complete control over your pension investments. Contributions receive upfront tax relief at your marginal tax rate (e.g. 20% basic rate automatically added, plus 20%–25% claimable by higher/additional rate taxpayers via Self Assessment). Funds are locked until retirement age (currently 55, rising to 57 in 2028).",
                    realWorldExample = "A higher-rate taxpayer wanting to invest £1,000 in a SIPP only pays £600 net out of pocket after 40% total tax relief.",
                    keyTakeaways = listOf(
                        "Upfront income tax relief on personal contributions.",
                        "Tax-free growth within the fund.",
                        "Accessible from minimum pension age (57 from 2028 onwards), where 25% can be taken as a tax-free lump sum."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "Why does a higher-rate (40%) taxpayer find a SIPP particularly compelling?",
                            options = listOf(
                                "It allows buying lottery tickets tax-free",
                                "They can claim 40% total tax relief on pension contributions",
                                "They can withdraw money penalty-free at age 25",
                                "It guarantees market immunity"
                            ),
                            correctIndex = 1,
                            explanation = "Contributions receive basic 20% relief at source, and higher rate taxpayers claim the remaining 20% back."
                        )
                    )
                ),
                Lesson(
                    id = "uk_jisa",
                    levelNumber = 3,
                    levelTitle = "UK Investing & Tax Wrappers",
                    title = "Junior ISA (JISA): Compounding for Children",
                    subtitle = "Building an 18-year tax-free nest egg for the next generation.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "Parents or legal guardians can open a Junior ISA for a UK child under 18. The annual allowance is £9,000. All growth is tax-free. Crucially, the money is locked until the child turns 18, at which point it automatically converts into an adult Stocks & Shares ISA in their name.",
                    realWorldExample = "Contributing £100/month from birth to age 18 in a diversified global fund (assuming a 7% return) could produce a nest egg of ~£43,000 for university fees or house deposit.",
                    keyTakeaways = listOf(
                        "£9,000 annual allowance per child.",
                        "Locked safely until age 18; child takes legal ownership on their 18th birthday.",
                        "Gives young people an unbeatable head start on compounding."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "At what age does a Junior ISA become accessible and convert into an adult ISA?",
                            options = listOf("16", "18", "21", "25"),
                            correctIndex = 1,
                            explanation = "The child gains control of the funds on their 18th birthday."
                        )
                    )
                )
            )
        ),
        AcademyLevel(
            levelNumber = 4,
            title = "Portfolio Building & Overlap",
            description = "Diversification, asset allocation, avoiding ETF duplication, and core-satellite design.",
            lessons = listOf(
                Lesson(
                    id = "portfolio_overlap",
                    levelNumber = 4,
                    levelTitle = "Portfolio Building & Overlap",
                    title = "The ETF Overlap Trap",
                    subtitle = "Why holding multiple funds might actually reduce your true diversification.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "Many beginner investors buy 3 or 4 different funds thinking they are super-diversified—for example, VWRP (All-World), VUAG (S&P 500), and IITU (US Tech). However, because the S&P 500 is ~60% of the world index, you are actually tripling your concentration in the same 5 mega-cap US tech companies!",
                    realWorldExample = "If Microsoft is 4% of your World fund, 7% of your S&P 500 fund, and 16% of your Tech fund, your actual household wealth may be over 20% concentrated in a single company without you realizing it.",
                    keyTakeaways = listOf(
                        "More funds does not automatically mean more diversification.",
                        "Look through to the underlying top 10 holdings of each ETF.",
                        "Use the EB Wealth ETF Overlap Checker to monitor total concentration."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "If you own both an S&P 500 ETF and a Global All-World ETF, what happens?",
                            options = listOf(
                                "They cancel each other out and return zero",
                                "Significant overlap occurs because the US makes up ~60% of the Global index",
                                "Your account is closed for duplication",
                                "You achieve perfect non-correlated diversification"
                            ),
                            correctIndex = 1,
                            explanation = "Global index funds are market-cap weighted and already contain ~60% US equities, so buying both overlaps heavily."
                        )
                    )
                ),
                Lesson(
                    id = "portfolio_core_satellite",
                    levelNumber = 4,
                    levelTitle = "Portfolio Building & Overlap",
                    title = "The Core & Satellite Strategy",
                    subtitle = "Balancing peace-of-mind broad index funds with focused convictions.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "The Core & Satellite model uses a low-cost, ultra-broad global index fund for 70–90% of your portfolio (the 'Core'). The remaining 10–30% (the 'Satellites') can be allocated to thematic funds, individual dividend stocks, or emerging markets you believe in.",
                    realWorldExample = "80% in Vanguard FTSE All-World (Core), 10% in clean energy or UK dividend stocks, 10% in cash/short-term gilts.",
                    keyTakeaways = listOf(
                        "The Core does the heavy lifting of capturing general economic expansion.",
                        "Satellites allow you to express high-conviction ideas without risking your entire future.",
                        "Prevents catastrophic loss if any single stock falters."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What percentage typically forms the 'Core' in a Core & Satellite portfolio?",
                            options = listOf("5%", "20%", "70% to 90%", "0%"),
                            correctIndex = 2,
                            explanation = "The core should represent the broad foundation of the portfolio."
                        )
                    )
                )
            )
        ),
        AcademyLevel(
            levelNumber = 5,
            title = "Stock Analysis & Valuation",
            description = "Learn how to read financial statements: Revenue, Profit Margins, Free Cash Flow, and P/E.",
            lessons = listOf(
                Lesson(
                    id = "analysis_pe",
                    levelNumber = 5,
                    levelTitle = "Stock Analysis & Valuation",
                    title = "The P/E Ratio (Price-to-Earnings)",
                    subtitle = "How much are you paying for every £1 of net company profit?",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "The Price-to-Earnings (P/E) ratio compares a company's share price to its annual earnings per share (EPS). A P/E of 20 means investors are paying £20 for every £1 of annual net profit. Fast-growing companies command higher P/E ratios, while mature businesses trade at lower multiples.",
                    realWorldExample = "A high-growth cloud company might trade at P/E 35 because profits are doubling every 3 years. A mature UK utility like National Grid might trade at P/E 12.",
                    keyTakeaways = listOf(
                        "P/E indicates market expectations for future growth.",
                        "Always compare P/E against industry peers and historical medians.",
                        "A low P/E alone does not make a stock cheap—it could be a 'value trap'."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "If a share trades at £50 and has Earnings Per Share (EPS) of £2.50, what is its P/E ratio?",
                            options = listOf("10", "20", "50", "2.5"),
                            correctIndex = 1,
                            explanation = "£50 / £2.50 = 20."
                        )
                    )
                ),
                Lesson(
                    id = "analysis_fcf",
                    levelNumber = 5,
                    levelTitle = "Stock Analysis & Valuation",
                    title = "Free Cash Flow: The Ultimate Truth",
                    subtitle = "Why cash in the bank matters more than accounting profits.",
                    readTime = "3 min",
                    xpReward = 60,
                    shortExplanation = "Accounting profit can be altered by depreciation and non-cash items. Free Cash Flow (FCF) is the actual cold hard cash left over after paying all operating expenses and capital expenditures. FCF is what pays dividends, buys back shares, and pays off debt.",
                    realWorldExample = "A company can report accounting profits while running out of cash. Consistent positive and growing Free Cash Flow is the hallmark of financial quality.",
                    keyTakeaways = listOf(
                        "Free Cash Flow = Operating Cash Flow minus Capital Expenditures.",
                        "Cash flow pays the bills and dividends; profits are an opinion.",
                        "Look for companies that convert over 80% of net income into free cash flow."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What is Free Cash Flow primarily used for by healthy companies?",
                            options = listOf(
                                "Paying executive speeding tickets",
                                "Funding dividends, share buybacks, reinvestment, and debt reduction",
                                "Buying speculative cryptocurrency secretly",
                                "None of the above"
                            ),
                            correctIndex = 1,
                            explanation = "Free Cash Flow provides management with the discretionary firepower to reward shareholders and expand."
                        )
                    )
                )
            )
        ),
        AcademyLevel(
            levelNumber = 6,
            title = "Advanced & Behavioural Finance",
            description = "Conquer investor psychology, avoid panic selling, and maintain multi-decade discipline.",
            lessons = listOf(
                Lesson(
                    id = "adv_behavioural",
                    levelNumber = 6,
                    levelTitle = "Advanced & Behavioural Finance",
                    title = "Mastering Investor Psychology",
                    subtitle = "Your biggest risk in the market is looking at you in the mirror.",
                    readTime = "3 min",
                    xpReward = 70,
                    shortExplanation = "Decades of research show that the average investor underperforms the funds they invest in. Why? Because human psychology tempts us to buy when euphoria is peak and sell when fear is overwhelming. Wealthy long-term investors automate their contributions and ignore daily market noise.",
                    realWorldExample = "Investors who stayed invested through the 2008 crash recovered their money and made historic gains. Those who panicked and sold at the bottom missed the multi-year bull market that followed.",
                    keyTakeaways = listOf(
                        "Loss aversion causes the pain of a loss to feel twice as intense as the pleasure of an equal gain.",
                        "Dollar-cost averaging (investing fixed amounts monthly) removes emotional timing.",
                        "The best portfolio is the one you can stick with during bear markets."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "Why do systematic monthly direct debit investments help investor discipline?",
                            options = listOf(
                                "They eliminate bank charges completely",
                                "They automate buying without emotional hesitation regardless of short-term news",
                                "They guarantee the stock market will only rise",
                                "They increase trading leverage"
                            ),
                            correctIndex = 1,
                            explanation = "Automation removes emotional second-guessing and ensures you buy through both bull and bear markets."
                        )
                    )
                ),
                Lesson(
                    id = "adv_factors",
                    levelNumber = 6,
                    levelTitle = "Advanced & Behavioural Finance",
                    title = "Factor Investing & Economic Moats",
                    subtitle = "Identifying persistent drivers of excess risk-adjusted returns.",
                    readTime = "4 min",
                    xpReward = 70,
                    shortExplanation = "Academic finance (Fama-French) demonstrates that specific measurable characteristics—factors—have historically explained differences in returns. Key factors include Value (cheap relative to fundamentals), Quality (high margins and low debt), Momentum (winners keep winning), and Size (small caps outperforming over long horizons).",
                    realWorldExample = "Warren Buffett's Berkshire Hathaway has generated alpha not through magic, but by systematically buying high-Quality businesses with deep economic moats at fair Value valuations.",
                    keyTakeaways = listOf(
                        "Factors require multi-year patience; they experience prolonged periods of underperformance.",
                        "Economic moats (patents, brand loyalty, switching costs, network effects) protect high returns on capital.",
                        "Passive factor tilts can be captured through low-cost smart beta ETFs."
                    ),
                    quizQuestions = listOf(
                        QuizQuestion(
                            question = "What constitutes an economic 'moat' for a company according to value investors?",
                            options = listOf(
                                "A physical ditch filled with water around headquarters",
                                "A durable competitive advantage that prevents rivals from eroding excess profits",
                                "Paying the highest executive bonuses in the industry",
                                "Guaranteed government bailouts"
                            ),
                            correctIndex = 1,
                            explanation = "An economic moat protects a company's market share and profitability from competitive forces over decades."
                        )
                    )
                )
            )
        )
    )

    fun getLessonById(id: String): Lesson? {
        return levels.flatMap { it.lessons }.find { it.id == id }
    }
}
