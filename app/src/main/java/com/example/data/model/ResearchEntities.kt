package com.example.data.model

enum class ScorecardRating(val label: String) {
    STRONG("Strong"),
    MODERATE("Moderate"),
    WEAK("Weak"),
    UNKNOWN("Unknown")
}

data class ScorecardDimension(
    val title: String,
    val rating: ScorecardRating,
    val summary: String
)

data class EBStockScorecard(
    val dimensions: List<ScorecardDimension>,
    val whatLooksInteresting: List<String>,
    val whatNeedsInvestigation: List<String>,
    val keyRisks: List<String>,
    val questionsInvestorsShouldAsk: List<String>
)

data class ResearchAsset(
    val ticker: String,
    val name: String,
    val assetType: String, // Stock, ETF, REIT, Index Fund
    val market: String, // London Stock Exchange (LSE), NYSE, NASDAQ
    val priceGbp: Double,
    val priceCurrencySymbol: String = "£",
    val dayChangePercent: Double,
    val marketCap: String,
    val peRatio: String,
    val dividendYield: String,
    val revenueSummary: String,
    val profitability: String,
    val growthRate: String,
    val sector: String,
    val geography: String,
    val description: String,
    val scorecard: EBStockScorecard
)
