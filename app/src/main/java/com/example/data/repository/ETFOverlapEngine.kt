package com.example.data.repository

import com.example.data.model.*

object ETFOverlapEngine {
    val availableEtfs: List<ETFDefinition> = listOf(
        ETFDefinition(
            ticker = "VWRP",
            name = "Vanguard FTSE All-World UCITS ETF (Acc)",
            fundProvider = "Vanguard Asset Management",
            ongoingChargeOcf = "0.22%",
            benchmark = "FTSE All-World Index",
            usWeightPercent = 61.2,
            ukWeightPercent = 3.9,
            globalOtherWeightPercent = 34.9,
            topHoldings = listOf(
                ETFHoldingItem("Microsoft Corp", "MSFT", 4.1, "Information Technology"),
                ETFHoldingItem("Apple Inc", "AAPL", 3.8, "Information Technology"),
                ETFHoldingItem("NVIDIA Corp", "NVDA", 3.2, "Information Technology"),
                ETFHoldingItem("Amazon.com Inc", "AMZN", 2.3, "Consumer Discretionary"),
                ETFHoldingItem("Alphabet Inc (Class A)", "GOOGL", 1.4, "Communication Services"),
                ETFHoldingItem("Meta Platforms Inc", "META", 1.3, "Communication Services"),
                ETFHoldingItem("Alphabet Inc (Class C)", "GOOG", 1.2, "Communication Services"),
                ETFHoldingItem("Eli Lilly & Co", "LLY", 0.9, "Healthcare"),
                ETFHoldingItem("Broadcom Inc", "AVGO", 0.9, "Information Technology"),
                ETFHoldingItem("Tesla Inc", "TSLA", 0.8, "Consumer Discretionary")
            ),
            sectorWeights = mapOf(
                "Information Technology" to 24.1,
                "Financials" to 15.2,
                "Healthcare" to 11.5,
                "Consumer Discretionary" to 10.8,
                "Industrials" to 10.2,
                "Communication Services" to 7.8,
                "Consumer Staples" to 6.3,
                "Energy" to 4.5,
                "Materials" to 3.8,
                "Utilities" to 2.9,
                "Real Estate" to 2.9
            )
        ),
        ETFDefinition(
            ticker = "VUAG",
            name = "Vanguard S&P 500 UCITS ETF (Acc)",
            fundProvider = "Vanguard Asset Management",
            ongoingChargeOcf = "0.07%",
            benchmark = "S&P 500 Index",
            usWeightPercent = 100.0,
            ukWeightPercent = 0.0,
            globalOtherWeightPercent = 0.0,
            topHoldings = listOf(
                ETFHoldingItem("Microsoft Corp", "MSFT", 6.8, "Information Technology"),
                ETFHoldingItem("Apple Inc", "AAPL", 6.2, "Information Technology"),
                ETFHoldingItem("NVIDIA Corp", "NVDA", 5.6, "Information Technology"),
                ETFHoldingItem("Amazon.com Inc", "AMZN", 3.6, "Consumer Discretionary"),
                ETFHoldingItem("Alphabet Inc (Class A)", "GOOGL", 2.1, "Communication Services"),
                ETFHoldingItem("Meta Platforms Inc", "META", 2.0, "Communication Services"),
                ETFHoldingItem("Alphabet Inc (Class C)", "GOOG", 1.8, "Communication Services"),
                ETFHoldingItem("Berkshire Hathaway Inc", "BRK.B", 1.6, "Financials"),
                ETFHoldingItem("Eli Lilly & Co", "LLY", 1.5, "Healthcare"),
                ETFHoldingItem("Broadcom Inc", "AVGO", 1.4, "Information Technology")
            ),
            sectorWeights = mapOf(
                "Information Technology" to 30.8,
                "Financials" to 13.1,
                "Healthcare" to 11.9,
                "Consumer Discretionary" to 10.3,
                "Communication Services" to 8.9,
                "Industrials" to 8.4,
                "Consumer Staples" to 5.9,
                "Energy" to 3.8,
                "Real Estate" to 2.3,
                "Materials" to 2.3,
                "Utilities" to 2.3
            )
        ),
        ETFDefinition(
            ticker = "IITU",
            name = "iShares S&P 500 Information Tech Sector UCITS ETF",
            fundProvider = "BlackRock iShares",
            ongoingChargeOcf = "0.15%",
            benchmark = "S&P 500 Information Technology Index",
            usWeightPercent = 100.0,
            ukWeightPercent = 0.0,
            globalOtherWeightPercent = 0.0,
            topHoldings = listOf(
                ETFHoldingItem("Microsoft Corp", "MSFT", 20.4, "Information Technology"),
                ETFHoldingItem("Apple Inc", "AAPL", 19.1, "Information Technology"),
                ETFHoldingItem("NVIDIA Corp", "NVDA", 17.5, "Information Technology"),
                ETFHoldingItem("Broadcom Inc", "AVGO", 4.6, "Information Technology"),
                ETFHoldingItem("Qualcomm Inc", "QCOM", 2.4, "Information Technology"),
                ETFHoldingItem("Advanced Micro Devices Inc", "AMD", 2.3, "Information Technology"),
                ETFHoldingItem("Salesforce Inc", "CRM", 2.1, "Information Technology"),
                ETFHoldingItem("Cisco Systems Inc", "CSCO", 1.9, "Information Technology"),
                ETFHoldingItem("Adobe Inc", "ADBE", 1.8, "Information Technology"),
                ETFHoldingItem("Accenture PLC", "ACN", 1.7, "Information Technology")
            ),
            sectorWeights = mapOf(
                "Information Technology" to 99.8,
                "Cash & Derivatives" to 0.2
            )
        ),
        ETFDefinition(
            ticker = "EQGB",
            name = "Invesco EQQQ NASDAQ-100 UCITS ETF (GBP Hedged)",
            fundProvider = "Invesco",
            ongoingChargeOcf = "0.30%",
            benchmark = "NASDAQ-100 Index",
            usWeightPercent = 98.2,
            ukWeightPercent = 0.5,
            globalOtherWeightPercent = 1.3,
            topHoldings = listOf(
                ETFHoldingItem("Apple Inc", "AAPL", 8.9, "Information Technology"),
                ETFHoldingItem("Microsoft Corp", "MSFT", 8.4, "Information Technology"),
                ETFHoldingItem("NVIDIA Corp", "NVDA", 7.8, "Information Technology"),
                ETFHoldingItem("Amazon.com Inc", "AMZN", 5.2, "Consumer Discretionary"),
                ETFHoldingItem("Broadcom Inc", "AVGO", 4.4, "Information Technology"),
                ETFHoldingItem("Meta Platforms Inc", "META", 4.2, "Communication Services"),
                ETFHoldingItem("Alphabet Inc (Class A)", "GOOGL", 2.8, "Communication Services"),
                ETFHoldingItem("Alphabet Inc (Class C)", "GOOG", 2.7, "Communication Services"),
                ETFHoldingItem("Tesla Inc", "TSLA", 2.6, "Consumer Discretionary"),
                ETFHoldingItem("Costco Wholesale Corp", "COST", 2.4, "Consumer Staples")
            ),
            sectorWeights = mapOf(
                "Information Technology" to 50.4,
                "Communication Services" to 15.6,
                "Consumer Discretionary" to 13.2,
                "Healthcare" to 6.8,
                "Consumer Staples" to 5.9,
                "Industrials" to 4.8,
                "Utilities" to 1.3,
                "Financials" to 0.5,
                "Energy" to 0.5,
                "Real Estate" to 0.5,
                "Materials" to 0.5
            )
        ),
        ETFDefinition(
            ticker = "ISF",
            name = "iShares Core FTSE 100 UCITS ETF",
            fundProvider = "BlackRock iShares",
            ongoingChargeOcf = "0.07%",
            benchmark = "FTSE 100 Index",
            usWeightPercent = 0.0,
            ukWeightPercent = 100.0,
            globalOtherWeightPercent = 0.0,
            topHoldings = listOf(
                ETFHoldingItem("Shell PLC", "SHEL", 8.4, "Energy"),
                ETFHoldingItem("AstraZeneca PLC", "AZN", 8.1, "Healthcare"),
                ETFHoldingItem("HSBC Holdings PLC", "HSBA", 6.2, "Financials"),
                ETFHoldingItem("Unilever PLC", "ULVR", 5.1, "Consumer Staples"),
                ETFHoldingItem("BP PLC", "BP.", 3.8, "Energy"),
                ETFHoldingItem("Glencore PLC", "GLEN", 2.9, "Materials"),
                ETFHoldingItem("GSK PLC", "GSK", 2.7, "Healthcare"),
                ETFHoldingItem("Rio Tinto PLC", "RIO", 2.6, "Materials"),
                ETFHoldingItem("British American Tobacco", "BATS", 2.5, "Consumer Staples"),
                ETFHoldingItem("Diageo PLC", "DGE", 2.3, "Consumer Staples")
            ),
            sectorWeights = mapOf(
                "Financials" to 19.8,
                "Consumer Staples" to 16.4,
                "Healthcare" to 13.2,
                "Energy" to 13.0,
                "Industrials" to 11.8,
                "Materials" to 8.9,
                "Consumer Discretionary" to 6.2,
                "Utilities" to 4.2,
                "Information Technology" to 1.5,
                "Real Estate" to 1.1,
                "Communication Services" to 3.9
            )
        )
    )

    fun analyzeOverlap(selectedTickers: List<String>): ETFOverlapAnalysisResult {
        val selectedEtfs = availableEtfs.filter { it.ticker in selectedTickers }
        if (selectedEtfs.isEmpty()) {
            return ETFOverlapAnalysisResult(
                selectedEtfs = emptyList(),
                overlappingCompanies = emptyList(),
                topCombinedHoldings = emptyList(),
                totalOverlapScorePercent = 0.0,
                combinedUsExposure = 0.0,
                combinedUkExposure = 0.0,
                dominantSector = "None",
                educationalInsight = "Select at least two ETFs to analyze portfolio overlap."
            )
        }

        val etfCount = selectedEtfs.size
        // Equal weighting among selected ETFs for portfolio simulation
        val weightPerEtf = 1.0 / etfCount

        val companyWeights = mutableMapOf<String, MutableMap<String, Double>>()
        val companySectors = mutableMapOf<String, String>()
        val companyTickers = mutableMapOf<String, String>()

        for (etf in selectedEtfs) {
            for (holding in etf.topHoldings) {
                val map = companyWeights.getOrPut(holding.companyName) { mutableMapOf() }
                map[etf.ticker] = holding.weightPercent
                companySectors[holding.companyName] = holding.sector
                companyTickers[holding.companyName] = holding.ticker
            }
        }

        val allCompanySummaries = companyWeights.map { (companyName, weights) ->
            val combined = weights.values.sum() * weightPerEtf
            OverlappingCompany(
                companyName = companyName,
                ticker = companyTickers[companyName] ?: "",
                sector = companySectors[companyName] ?: "Diversified",
                etfWeights = weights,
                combinedWeight = combined
            )
        }.sortedByDescending { it.combinedWeight }

        val overlapping = allCompanySummaries.filter { it.etfWeights.size > 1 }

        val avgUsExposure = selectedEtfs.map { it.usWeightPercent }.average()
        val avgUkExposure = selectedEtfs.map { it.ukWeightPercent }.average()

        val sectorTotals = mutableMapOf<String, Double>()
        for (etf in selectedEtfs) {
            for ((sector, weight) in etf.sectorWeights) {
                sectorTotals[sector] = (sectorTotals[sector] ?: 0.0) + (weight * weightPerEtf)
            }
        }
        val dominant = sectorTotals.maxByOrNull { it.value }?.key ?: "Diversified"

        val overlapPercent = if (overlapping.isNotEmpty()) {
            overlapping.sumOf { it.combinedWeight }
        } else {
            0.0
        }

        val topOverlappersNames = overlapping.take(3).joinToString(", ") { "${it.companyName} (${String.format("%.1f", it.combinedWeight)}%)" }

        val insight = if (overlapping.isNotEmpty()) {
            "OVERLAP DETECTED: This combination may increase your exposure to mega-cap companies like $topOverlappersNames. Holding multiple funds with the same underlying giants does not increase true diversification."
        } else {
            "LOW DIRECT OVERLAP: These funds complement each other with minimal duplicate holdings across the top constituents."
        }

        return ETFOverlapAnalysisResult(
            selectedEtfs = selectedEtfs,
            overlappingCompanies = overlapping,
            topCombinedHoldings = allCompanySummaries.take(8),
            totalOverlapScorePercent = overlapPercent,
            combinedUsExposure = avgUsExposure,
            combinedUkExposure = avgUkExposure,
            dominantSector = dominant,
            educationalInsight = insight
        )
    }
}
