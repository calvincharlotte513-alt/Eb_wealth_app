package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "portfolio_holdings")
data class HoldingEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int = 1,
    val name: String,
    val ticker: String,
    val assetType: String, // ETF, Stock, Index Fund, Bond, REIT, Cash
    val shares: Double,
    val avgPurchasePrice: Double,
    val currentPrice: Double,
    val accountType: String, // Stocks & Shares ISA, JISA, LISA, SIPP, General Investment Account, Other
    val purchaseDate: String = "2024-01-15",
    val currency: String = "GBP",
    val geography: String = "Global", // Global, US, UK, Europe, Emerging Markets
    val sector: String = "Diversified" // Technology, Diversified, Healthcare, Financials, Energy, etc.
) {
    val totalCost: Double get() = shares * avgPurchasePrice
    val currentValue: Double get() = shares * currentPrice
    val gainLoss: Double get() = currentValue - totalCost
    val gainLossPercentage: Double get() = if (totalCost > 0) (gainLoss / totalCost) * 100 else 0.0
}

data class PortfolioSummary(
    val totalValue: Double,
    val totalCost: Double,
    val totalGainLoss: Double,
    val totalGainLossPercentage: Double,
    val holdingsCount: Int,
    val monthlyEstimate: Double = 250.0,
    val diversificationScore: String = "Good",
    val geographicBreakdown: Map<String, Double> = emptyMap(),
    val sectorBreakdown: Map<String, Double> = emptyMap(),
    val accountBreakdown: Map<String, Double> = emptyMap()
)
