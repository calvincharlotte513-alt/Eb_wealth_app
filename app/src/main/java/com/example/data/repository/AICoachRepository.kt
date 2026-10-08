package com.example.data.repository

import com.example.BuildConfig
import com.example.data.database.ChatDao
import com.example.data.model.ChatMessageEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class AICoachRepository(private val chatDao: ChatDao) {

    val messages: Flow<List<ChatMessageEntity>> = chatDao.getAllMessages()

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .build()

    suspend fun clearChatHistory() {
        chatDao.clearChat()
        // Re-insert initial welcome message
        chatDao.insertMessage(
            ChatMessageEntity(
                sender = "assistant",
                content = "Welcome to EB AI Coach! I am your personal investment education assistant. I can explain complex financial concepts in plain English, help you understand UK tax wrappers like ISAs and SIPPs, dissect ETF overlap, or explain how compound growth works over 20+ years.\n\n*Note: I provide educational analysis and tools, not regulated personal financial advice.* How can I assist your wealth journey today?",
                timestamp = System.currentTimeMillis()
            )
        )
    }

    suspend fun sendMessage(userPrompt: String) {
        val trimmed = userPrompt.trim()
        if (trimmed.isEmpty()) return

        // Save user message
        chatDao.insertMessage(
            ChatMessageEntity(
                sender = "user",
                content = trimmed,
                timestamp = System.currentTimeMillis()
            )
        )

        // Generate response
        val responseText = withContext(Dispatchers.IO) {
            val apiKey = try {
                BuildConfig.GEMINI_API_KEY
            } catch (e: Exception) {
                ""
            }

            if (!apiKey.isNullOrBlank() && apiKey != "MY_GEMINI_API_KEY") {
                tryCallGeminiApi(trimmed, apiKey) ?: generateComprehensiveEducationalFallback(trimmed)
            } else {
                generateComprehensiveEducationalFallback(trimmed)
            }
        }

        // Save assistant message
        chatDao.insertMessage(
            ChatMessageEntity(
                sender = "assistant",
                content = responseText,
                timestamp = System.currentTimeMillis()
            )
        )
    }

    private fun tryCallGeminiApi(prompt: String, apiKey: String): String? {
        return try {
            val systemInstruction = """
                You are the EB AI Wealth Coach, a UK-focused investment education assistant.
                Your core principles:
                1. Explain concepts clearly and simply for beginners and everyday investors.
                2. Explain assumptions and highlight financial market uncertainty.
                3. Never fabricate financial data or guarantee investment returns.
                4. Never give personalised buy/sell instructions. Never say "You should buy" or "You should sell".
                5. Use UK investing terminology (Stocks & Shares ISA, JISA, LISA, SIPP, GIA, HMRC allowances, Capital Gains Tax).
                6. For portfolio questions, always frame: "Here is an educational analysis of the information you provided."
                7. Always maintain the boundary between financial education and regulated financial advice.
                8. Encourage users to conduct their own due diligence and seek a qualified Independent Financial Adviser (IFA) if needed.
            """.trimIndent()

            val requestBodyJson = JSONObject().apply {
                val contents = JSONArray().apply {
                    put(JSONObject().apply {
                        put("role", "user")
                        put("parts", JSONArray().apply {
                            put(JSONObject().put("text", "System instruction: $systemInstruction\n\nUser Question: $prompt"))
                        })
                    })
                }
                put("contents", contents)
            }

            val request = Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey")
                .post(requestBodyJson.toString().toRequestBody("application/json".toMediaType()))
                .build()

            val response = httpClient.newCall(request).execute()
            if (response.isSuccessful) {
                val bodyStr = response.body?.string() ?: return null
                val root = JSONObject(bodyStr)
                val candidates = root.optJSONArray("candidates")
                if (candidates != null && candidates.length() > 0) {
                    val candidate = candidates.getJSONObject(0)
                    val contentObj = candidate.optJSONObject("content")
                    val parts = contentObj?.optJSONArray("parts")
                    if (parts != null && parts.length() > 0) {
                        return parts.getJSONObject(0).optString("text")
                    }
                }
            }
            null
        } catch (e: Exception) {
            null
        }
    }

    private fun generateComprehensiveEducationalFallback(prompt: String): String {
        val lower = prompt.lowercase()
        return when {
            lower.contains("vwrp") && lower.contains("vuag") || lower.contains("difference between") -> {
                """
                Here is an educational analysis comparing **VWRP** vs **VUAG**:

                • **VWRP (Vanguard FTSE All-World UCITS ETF)**:
                  - **Scope**: True global diversification (~3,600+ companies across ~49 developed and emerging nations).
                  - **Geography**: ~61% US, ~15% Europe, ~10% Emerging Markets, ~4% UK, ~10% Asia-Pacific.
                  - **OCF Fee**: 0.22% per year.
                  - **Core role**: 'Whole-world in one fund' foundation.

                • **VUAG (Vanguard S&P 500 UCITS ETF)**:
                  - **Scope**: Top 500 leading publicly traded US corporations only.
                  - **Geography**: 100% US-domiciled (though many earn revenue globally).
                  - **OCF Fee**: 0.07% per year (cheaper).
                  - **Core role**: Concentrated bet on American economic and tech dominance.

                **Key Educational Takeaway**:
                Because the US already makes up over 60% of VWRP, buying both funds means you are heavily overweighting mega-cap US tech companies (Apple, Microsoft, NVIDIA) across both funds.

                *Disclaimer: This is for educational illustration only and does not constitute personalised financial advice.*
                """.trimIndent()
            }
            lower.contains("etf") || lower.contains("exchange traded fund") -> {
                """
                **What is an ETF? (Exchange Traded Fund)**

                An ETF is essentially an investment basket holding hundreds or thousands of individual stocks or bonds. 

                **Why investors use ETFs:**
                1. **Instant Diversification**: Rather than risking everything on one company's success or failure, a single unit of a global ETF gives you microscopic pieces of thousands of businesses.
                2. **Low Cost**: Traditional managed funds often charge 1.0% to 1.5% annually. Passive index ETFs often charge between 0.07% and 0.25% (Ongoing Charges Figure).
                3. **Liquidity**: They trade on stock exchanges (like the London Stock Exchange) just like regular shares.
                4. **Accumulating (Acc) vs Distributing (Dist)**: Accumulating ETFs automatically reinvest dividends for you, accelerating compounding.

                *Disclaimer: All investing carries capital risk. Values can go down as well as up.*
                """.trimIndent()
            }
            lower.contains("isa") || lower.contains("lisa") || lower.contains("sipp") || lower.contains("tax") -> {
                """
                **UK Tax Wrappers Explained:**

                • **Stocks & Shares ISA**:
                  - £20,000 annual allowance (per tax year: 6 April to 5 April).
                  - All capital gains, dividends, and interest are 100% tax-free forever.
                  - Withdraw anytime with no penalties.

                • **Lifetime ISA (LISA)**:
                  - For UK residents aged 18–39.
                  - Maximum £4,000/year (counts towards your £20k ISA limit).
                  - The UK Government adds a **25% cash bonus** (up to £1,000/year).
                  - Can be used penalty-free for a first home (up to £450,000) or after age 60 for retirement.

                • **SIPP (Self-Invested Personal Pension)**:
                  - Contributions receive upfront income tax relief at your marginal rate (20% basic, up to 40%/45% for higher/additional earners).
                  - Funds are locked until minimum pension age (currently 55, rising to 57 in 2028).
                  - 25% tax-free lump sum at retirement, remaining income taxed as earnings.

                *Disclaimer: Tax treatment depends on individual circumstances and UK tax rules may change.*
                """.trimIndent()
            }
            lower.contains("compound") || lower.contains("growth") || lower.contains("interest") -> {
                """
                **The Power of Compound Growth:**

                Compound growth is the mathematical process where your returns earn their own returns over time.

                **A Simple Example:**
                If you invest £250 every month for 25 years:
                • Your personal contributions: **£75,000**
                • At a hypothetical 7% annual average return, your portfolio could grow to approximately **£202,500**.
                • That means **£127,500 (over 62%)** came purely from compound growth, not your bank deposits!

                **The Three Golden Rules of Compounding:**
                1. Start as early as you can—time is the multiplier.
                2. Reinvest all dividends.
                3. Maintain consistency with automated direct debits.

                *Disclaimer: Past performance is no guarantee of future returns. Hypothetical examples are not guaranteed.*
                """.trimIndent()
            }
            lower.contains("overlap") || lower.contains("us exposure") || lower.contains("concentrat") -> {
                """
                **Understanding Portfolio Overlap & US Exposure:**

                When building a portfolio, beginner investors often assume buying 4 or 5 different funds provides more safety.

                However:
                • The United States represents ~60% of total world stock market capitalisation.
                • If you hold a Global All-World ETF (e.g. VWRP), a US S&P 500 ETF (VUAG), and a Global Technology ETF, your largest holdings in all three will be Microsoft, Apple, NVIDIA, Amazon, and Alphabet.
                • This creates **hidden concentration risk**, where a downturn in US tech impacts almost your entire portfolio.

                **Educational Strategy**:
                Many investors use a 'Core and Satellite' structure: 80% in one broad global fund, and small deliberate satellite allocations for high-conviction tilts.
                """.trimIndent()
            }
            else -> {
                """
                Here is an educational overview regarding your question:

                When building long-term wealth in the UK:
                1. **Establish a Cash Buffer First**: Keep 3–6 months of living expenses in an accessible high-interest savings account or Cash ISA.
                2. **Utilise Tax Wrappers**: Maximise your £20,000 Stocks & Shares ISA allowance before considering a General Investment Account (GIA) to protect against Capital Gains Tax.
                3. **Focus on Broad Diversification**: Index funds and ETFs eliminate single-company collapse risk.
                4. **Harness Time in the Market**: A 10–20+ year horizon allows you to ride out normal market dips and capture long-term compounding.

                Would you like me to elaborate on:
                - How ETFs work vs individual shares?
                - Comparing Stocks & Shares ISA vs LISA vs SIPP?
                - Analysing your portfolio's diversification and ETF overlap?
                """.trimIndent()
            }
        }
    }
}
