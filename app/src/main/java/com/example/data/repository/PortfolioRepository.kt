package com.example.data.repository

import com.example.data.database.PortfolioDao
import com.example.data.model.HoldingEntity
import com.example.data.model.PortfolioSummary
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class PortfolioRepository(private val portfolioDao: PortfolioDao) {

    val holdings: Flow<List<HoldingEntity>> = portfolioDao.getAllHoldings()

    val portfolioSummary: Flow<PortfolioSummary> = holdings.map { list ->
        if (list.isEmpty()) {
            PortfolioSummary(
                totalValue = 0.0,
                totalCost = 0.0,
                totalGainLoss = 0.0,
                totalGainLossPercentage = 0.0,
                holdingsCount = 0,
                monthlyEstimate = 0.0,
                diversificationScore = "No Holdings"
            )
        } else {
            val totalValue = list.sumOf { it.currentValue }
            val totalCost = list.sumOf { it.totalCost }
            val gainLoss = totalValue - totalCost
            val gainLossPercent = if (totalCost > 0) (gainLoss / totalCost) * 100 else 0.0

            val geoMap = mutableMapOf<String, Double>()
            val sectorMap = mutableMapOf<String, Double>()
            val accountMap = mutableMapOf<String, Double>()

            for (h in list) {
                geoMap[h.geography] = (geoMap[h.geography] ?: 0.0) + h.currentValue
                sectorMap[h.sector] = (sectorMap[h.sector] ?: 0.0) + h.currentValue
                accountMap[h.accountType] = (accountMap[h.accountType] ?: 0.0) + h.currentValue
            }

            val count = list.size
            val score = when {
                count >= 4 && geoMap.size >= 2 -> "Strong"
                count >= 2 -> "Moderate"
                else -> "Concentrated"
            }

            PortfolioSummary(
                totalValue = totalValue,
                totalCost = totalCost,
                totalGainLoss = gainLoss,
                totalGainLossPercentage = gainLossPercent,
                holdingsCount = count,
                monthlyEstimate = 250.0,
                diversificationScore = score,
                geographicBreakdown = geoMap,
                sectorBreakdown = sectorMap,
                accountBreakdown = accountMap
            )
        }
    }

    suspend fun addHolding(holding: HoldingEntity) {
        portfolioDao.insertHolding(holding)
    }

    suspend fun updateHolding(holding: HoldingEntity) {
        portfolioDao.updateHolding(holding)
    }

    suspend fun deleteHolding(holding: HoldingEntity) {
        portfolioDao.deleteHolding(holding)
    }

    suspend fun deleteHoldingById(id: Int) {
        portfolioDao.deleteHoldingById(id)
    }
}
