package com.example.data.repository

import com.example.data.database.PortfolioDao
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.concurrent.TimeUnit

data class LiveQuote(
    val ticker: String,
    val price: Double,
    val changePercent: Double,
    val timestamp: Long = System.currentTimeMillis()
)

class MarketDataService(private val portfolioDao: PortfolioDao) {

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    // Real-time quote cache
    private val quotesCache = mutableMapOf<String, LiveQuote>()

    suspend fun refreshQuotesForHoldings(tickers: List<String>): Map<String, LiveQuote> = withContext(Dispatchers.IO) {
        val updatedMap = mutableMapOf<String, LiveQuote>()

        for (ticker in tickers) {
            val quote = fetchQuote(ticker)
            if (quote != null) {
                updatedMap[ticker] = quote
                quotesCache[ticker] = quote
                // Persist new market price to local database
                portfolioDao.updatePriceForTicker(ticker, quote.price)
            }
        }
        updatedMap
    }

    private fun fetchQuote(ticker: String): LiveQuote? {
        val cleanTicker = ticker.trim().uppercase()
        // Map common UK tickers to market quote symbol
        val yahooSymbol = when (cleanTicker) {
            "VWRP" -> "VWRP.L"
            "VUAG" -> "VUAG.L"
            "AZN" -> "AZN.L"
            "LGEN" -> "LGEN.L"
            "SHEL" -> "SHEL.L"
            "ULVR" -> "ULVR.L"
            "ISF" -> "ISF.L"
            "IITU" -> "IITU.L"
            else -> cleanTicker
        }

        return try {
            val url = "https://query1.finance.yahoo.com/v8/finance/chart/$yahooSymbol?interval=1d&range=1d"
            val request = Request.Builder()
                .url(url)
                .header("User-Agent", "Mozilla/5.0")
                .build()

            val response = httpClient.newCall(request).execute()
            if (response.isSuccessful) {
                val jsonStr = response.body?.string() ?: return fallbackQuote(cleanTicker)
                val root = JSONObject(jsonStr)
                val chart = root.optJSONObject("chart")
                val resultArr = chart?.optJSONArray("result")
                if (resultArr != null && resultArr.length() > 0) {
                    val meta = resultArr.getJSONObject(0).optJSONObject("meta")
                    if (meta != null) {
                        val regularMarketPrice = meta.optDouble("regularMarketPrice", 0.0)
                        val prevClose = meta.optDouble("chartPreviousClose", regularMarketPrice)
                        val changePct = if (prevClose > 0) ((regularMarketPrice - prevClose) / prevClose) * 100 else 0.0

                        // UK London-listed shares are quoted in pence (GBp), convert to pounds (£) for stocks if necessary
                        val priceInPounds = if (cleanTicker in listOf("AZN", "LGEN", "SHEL", "ULVR") && regularMarketPrice > 100) {
                            regularMarketPrice / 100.0
                        } else {
                            regularMarketPrice
                        }

                        if (priceInPounds > 0.0) {
                            return LiveQuote(cleanTicker, priceInPounds, changePct)
                        }
                    }
                }
            }
            fallbackQuote(cleanTicker)
        } catch (e: Exception) {
            fallbackQuote(cleanTicker)
        }
    }

    private fun fallbackQuote(ticker: String): LiveQuote {
        val asset = ResearchData.assets.find { it.ticker.equals(ticker, ignoreCase = true) }
        return if (asset != null) {
            LiveQuote(asset.ticker, asset.priceGbp, asset.dayChangePercent)
        } else {
            LiveQuote(ticker, 100.0, 0.0)
        }
    }
}
