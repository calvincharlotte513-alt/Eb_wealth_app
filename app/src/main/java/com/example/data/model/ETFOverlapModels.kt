package com.example.data.model

data class ETFHoldingItem(
    val companyName: String,
    val ticker: String,
    val weightPercent: Double,
    val sector: String
)

data class ETFDefinition(
    val ticker: String,
    val name: String,
    val fundProvider: String,
    val ongoingChargeOcf: String, // e.g. "0.22%"
    val benchmark: String,
    val usWeightPercent: Double,
    val ukWeightPercent: Double,
    val globalOtherWeightPercent: Double,
    val topHoldings: List<ETFHoldingItem>,
    val sectorWeights: Map<String, Double>
)

data class OverlappingCompany(
    val companyName: String,
    val ticker: String,
    val sector: String,
    val etfWeights: Map<String, Double>, // ETF ticker -> weight percent
    val combinedWeight: Double
)

data class ETFOverlapAnalysisResult(
    val selectedEtfs: List<ETFDefinition>,
    val overlappingCompanies: List<OverlappingCompany>,
    val topCombinedHoldings: List<OverlappingCompany>,
    val totalOverlapScorePercent: Double,
    val combinedUsExposure: Double,
    val combinedUkExposure: Double,
    val dominantSector: String,
    val educationalInsight: String
)
