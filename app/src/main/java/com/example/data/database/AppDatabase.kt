package com.example.data.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        UserAccountEntity::class,
        UserProfile::class,
        HoldingEntity::class,
        LessonProgressEntity::class,
        CommunityPostEntity::class,
        CommunityComment::class,
        MarketNewsEntity::class,
        EBEventEntity::class,
        ChatMessageEntity::class
    ],
    version = 4,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun portfolioDao(): PortfolioDao
    abstract fun academyDao(): AcademyDao
    abstract fun communityDao(): CommunityDao
    abstract fun commentDao(): CommentDao
    abstract fun newsDao(): NewsDao
    abstract fun eventDao(): EventDao
    abstract fun chatDao(): ChatDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "eb_wealth_database"
                )
                    .fallbackToDestructiveMigration()
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database)
                    }
                }
            }

            private suspend fun populateInitialData(database: AppDatabase) {
                val userDao = database.userDao()
                val portfolioDao = database.portfolioDao()
                val communityDao = database.communityDao()
                val eventDao = database.eventDao()
                val chatDao = database.chatDao()
                val academyDao = database.academyDao()

                // Initial Clean User Profile (Requires real signup/login)
                userDao.insertOrUpdateProfile(
                    UserProfile(
                        id = 1,
                        firstName = "",
                        email = "",
                        ageRange = "25–34",
                        country = "United Kingdom",
                        experienceLevel = "Beginner",
                        primaryGoal = "Build long-term wealth",
                        timeHorizon = "20+ years",
                        monthlyCapacity = "£150–£500",
                        riskProfile = "Medium",
                        xp = 0,
                        streakDays = 0,
                        isPro = false,
                        isOnboarded = false,
                        isLoggedIn = false,
                        isAdmin = false
                    )
                )

                // Initial Seed Lessons Progress
                academyDao.recordLessonProgress(
                    LessonProgressEntity(lessonId = "foundations_1", completed = true, quizScore = 100)
                )
                academyDao.recordLessonProgress(
                    LessonProgressEntity(lessonId = "foundations_2", completed = true, quizScore = 100)
                )
                academyDao.recordLessonProgress(
                    LessonProgressEntity(lessonId = "types_etf", completed = true, quizScore = 100)
                )

                // UK Focused Portfolio Holdings (Vanguard All-World, S&P 500, UK Dividend, Tech)
                portfolioDao.insertHolding(
                    HoldingEntity(
                        name = "Vanguard FTSE All-World UCITS ETF",
                        ticker = "VWRP",
                        assetType = "ETF",
                        shares = 45.0,
                        avgPurchasePrice = 96.50,
                        currentPrice = 112.40,
                        accountType = "Stocks & Shares ISA",
                        purchaseDate = "2023-11-12",
                        currency = "GBP",
                        geography = "Global",
                        sector = "Diversified"
                    )
                )
                portfolioDao.insertHolding(
                    HoldingEntity(
                        name = "Vanguard S&P 500 UCITS ETF",
                        ticker = "VUAG",
                        assetType = "ETF",
                        shares = 30.0,
                        avgPurchasePrice = 72.80,
                        currentPrice = 86.15,
                        accountType = "Stocks & Shares ISA",
                        purchaseDate = "2024-02-05",
                        currency = "GBP",
                        geography = "US",
                        sector = "Diversified"
                    )
                )
                portfolioDao.insertHolding(
                    HoldingEntity(
                        name = "AstraZeneca PLC",
                        ticker = "AZN",
                        assetType = "Stock",
                        shares = 12.0,
                        avgPurchasePrice = 104.00,
                        currentPrice = 118.60,
                        accountType = "General Investment Account",
                        purchaseDate = "2024-03-18",
                        currency = "GBP",
                        geography = "UK",
                        sector = "Healthcare"
                    )
                )
                portfolioDao.insertHolding(
                    HoldingEntity(
                        name = "Legal & General Group PLC",
                        ticker = "LGEN",
                        assetType = "Stock",
                        shares = 400.0,
                        avgPurchasePrice = 2.20,
                        currentPrice = 2.38,
                        accountType = "Stocks & Shares ISA",
                        purchaseDate = "2024-04-10",
                        currency = "GBP",
                        geography = "UK",
                        sector = "Financials"
                    )
                )

                // Initial Community Discussions
                communityDao.insertPost(
                    CommunityPostEntity(
                        authorName = "Marcus K.",
                        authorLevel = "Developing Investor",
                        category = "UK Investing",
                        title = "How I make the most of my £20,000 annual ISA allowance",
                        content = "Starting with automated monthly £250 direct debits into VWRP has removed all the market timing anxiety. Are others pairing with a LISA for property or retirement?",
                        likesCount = 38,
                        commentsCount = 14,
                        isLiked = false,
                        isSaved = true,
                        createdAtFormatted = "3 hours ago"
                    )
                )
                communityDao.insertPost(
                    CommunityPostEntity(
                        authorName = "Priya S.",
                        authorLevel = "Confident Investor",
                        category = "ETFs",
                        title = "Notice how much VUAG and VWRP overlap!",
                        content = "Ran the EB Overlap tool and realized Microsoft, Apple and NVIDIA make up a huge chunk of both funds. Decided to keep VWRP as core instead of doubling up.",
                        likesCount = 52,
                        commentsCount = 21,
                        isLiked = true,
                        isSaved = false,
                        createdAtFormatted = "1 day ago"
                    )
                )
                communityDao.insertPost(
                    CommunityPostEntity(
                        authorName = "David T.",
                        authorLevel = "Investor Starter",
                        category = "JISA",
                        title = "Setting up a Junior ISA for our 2-year old",
                        content = "Compound interest over an 18-year horizon for a newborn is mind-blowing. Doing £100/mo into a global index fund until they turn 18.",
                        likesCount = 44,
                        commentsCount = 9,
                        isLiked = false,
                        isSaved = false,
                        createdAtFormatted = "2 days ago"
                    )
                )

                // Upcoming EB Wealth Events & Masterclasses
                eventDao.insertEvents(
                    listOf(
                        EBEventEntity(
                            title = "EB Wealth Stocks & Shares Masterclass",
                            dateString = "Thursday, 22 October 2026",
                            timeString = "19:00 - 20:30 BST",
                            description = "A practical, jargon-free walkthrough on opening, funding, and selecting long-term index funds in a UK Stocks & Shares ISA.",
                            priceString = "Included in Pro (£35 General)",
                            spacesRemaining = 14,
                            host = "EB Senior Wealth Educators",
                            isRegistered = false
                        ),
                        EBEventEntity(
                            title = "ETF Investing & Overlap Masterclass",
                            dateString = "Saturday, 31 October 2026",
                            timeString = "11:00 - 12:30 BST",
                            description = "Learn how to dissect factsheets, understand total expense ratios (OCF), avoid hidden stock overlap, and build a resilient core-and-satellite portfolio.",
                            priceString = "Included in Pro (£45 General)",
                            spacesRemaining = 8,
                            host = "Portfolio Construction Lead",
                            isRegistered = true
                        ),
                        EBEventEntity(
                            title = "Junior ISA (JISA) & Family Wealth Workshop",
                            dateString = "Wednesday, 11 November 2026",
                            timeString = "19:30 - 20:45 BST",
                            description = "How parents, guardians and grandparents can invest tax-efficiently for their children's financial freedom up to age 18.",
                            priceString = "Free Community Event",
                            spacesRemaining = 26,
                            host = "EB Family Wealth Team",
                            isRegistered = false
                        ),
                        EBEventEntity(
                            title = "Portfolio Building & Rebalancing Clinic",
                            dateString = "Saturday, 28 November 2026",
                            timeString = "10:30 - 12:00 GMT",
                            description = "Hands-on interactive clinic reviewing diversification frameworks, global asset allocation, and rebalancing discipline without triggering tax events.",
                            priceString = "Included in Pro (£50 General)",
                            spacesRemaining = 6,
                            host = "EB Wealth Master Educators",
                            isRegistered = false
                        )
                    )
                )

                // Initial Welcome Chat Message from EB AI Coach
                chatDao.insertMessage(
                    ChatMessageEntity(
                        sender = "assistant",
                        content = "Welcome to EB AI Coach! I am your personal investment education assistant. I can explain complex financial concepts in plain English, help you understand UK tax wrappers like ISAs and SIPPs, dissect ETF overlap, or explain how compound growth works over 20+ years.\n\n*Note: I provide educational analysis and tools, not regulated personal financial advice.* How can I assist your wealth journey today?",
                        timestamp = System.currentTimeMillis()
                    )
                )

                // Initial Seed Comments
                val commentDao = database.commentDao()
                commentDao.insertComment(
                    CommunityComment(
                        postId = 1,
                        authorName = "Chloe M.",
                        authorLevel = "Developing Investor",
                        content = "Completely agree with automated direct debits. Automating on payday has helped me maximize my ISA without even noticing the cash leaving.",
                        timeFormatted = "1 hour ago"
                    )
                )
                commentDao.insertComment(
                    CommunityComment(
                        postId = 1,
                        authorName = "Liam W.",
                        authorLevel = "Confident Investor",
                        content = "I use a LISA for the 25% bonus alongside my Stocks & Shares ISA. Great combination for first-time buyers!",
                        timeFormatted = "30 mins ago"
                    )
                )

                // Initial UK Market News & Educational Briefs
                val newsDao = database.newsDao()
                newsDao.insertNews(
                    listOf(
                        MarketNewsEntity(
                            category = "UK Investing",
                            headline = "HMRC Reaffirms £20,000 Annual ISA Allowance Protection",
                            dateString = "4 October 2026",
                            source = "HM Treasury / UK Financial Brief",
                            summary = "The £20,000 Stocks & Shares ISA limit remains one of the world's most generous tax shelters, shielding capital gains and dividend yields completely from UK taxation.",
                            impactTag = "Tax Wrapper Update"
                        ),
                        MarketNewsEntity(
                            category = "ETFs",
                            headline = "Global Low-Cost Index Funds Cross £1.2 Trillion in UK Retail Inflows",
                            dateString = "3 October 2026",
                            source = "London Stock Exchange Bulletin",
                            summary = "UK retail investors increasingly favor ultra-low cost passive ETFs such as Vanguard FTSE All-World (VWRP) over actively managed mutual funds with high fee drag.",
                            impactTag = "Fee Efficiency"
                        ),
                        MarketNewsEntity(
                            category = "Economy",
                            headline = "Bank of England Highlights Long-Term Equity Compounding Over Cash Hoarding",
                            dateString = "2 October 2026",
                            source = "Bank of England Quarterly Bulletin",
                            summary = "Central bank analysis highlights that while cash savings provide vital liquidity for emergencies, 10-year holding periods of equities have outpaced UK CPI inflation in over 90% of rolling periods.",
                            impactTag = "Inflation Protection"
                        ),
                        MarketNewsEntity(
                            category = "Companies",
                            headline = "FTSE 100 Dividend Payouts Projected to Hit £84 Billion This Year",
                            dateString = "1 October 2026",
                            source = "FTSE Russell Dividend Monitor",
                            summary = "Income-focused UK stalwarts including AstraZeneca, Legal & General, Shell and Unilever continue to provide solid dividend cash flow for ISA reinvestment compounding.",
                            impactTag = "Dividend Reinvestment"
                        )
                    )
                )
            }
        }
    }
}
