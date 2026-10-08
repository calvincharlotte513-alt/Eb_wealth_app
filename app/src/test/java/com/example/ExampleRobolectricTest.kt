package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.model.UserProfile
import com.example.data.repository.AcademyData
import com.example.data.repository.ETFOverlapEngine
import com.example.data.repository.ResearchData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

    @Test
    fun `read string from context verifies EB Wealth branding`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("EB Wealth", appName)
    }

    @Test
    fun `user level increases with XP thresholds`() {
        val starter = UserProfile(xp = 150)
        assertEquals(1, starter.levelNumber)
        assertEquals("Investor Starter", starter.levelTitle)

        val developing = UserProfile(xp = 350)
        assertEquals(2, developing.levelNumber)
        assertEquals("Developing Investor", developing.levelTitle)

        val confident = UserProfile(xp = 750)
        assertEquals(3, confident.levelNumber)
        assertEquals("Confident Investor", confident.levelTitle)

        val strategic = UserProfile(xp = 1500)
        assertEquals(4, strategic.levelNumber)
        assertEquals("Strategic Investor", strategic.levelTitle)

        val wealthBuilder = UserProfile(xp = 2500)
        assertEquals(5, wealthBuilder.levelNumber)
        assertEquals("EB Wealth Builder", wealthBuilder.levelTitle)
    }

    @Test
    fun `etf overlap engine detects duplicate holdings between VWRP and VUAG`() {
        val result = ETFOverlapEngine.analyzeOverlap(listOf("VWRP", "VUAG"))
        assertTrue("Expected overlapping companies", result.overlappingCompanies.isNotEmpty())

        val topCompanyNames = result.overlappingCompanies.map { it.companyName }
        assertTrue("Microsoft should be detected in both VWRP and VUAG", topCompanyNames.contains("Microsoft Corp"))
        assertTrue("Apple should be detected in both VWRP and VUAG", topCompanyNames.contains("Apple Inc"))
        assertTrue(result.educationalInsight.contains("OVERLAP DETECTED"))
    }

    @Test
    fun `academy curriculum contains complete six levels`() {
        assertEquals(6, AcademyData.levels.size)
        val allLessons = AcademyData.levels.flatMap { it.lessons }
        assertTrue(allLessons.size >= 10)
        allLessons.forEach { lesson ->
            assertTrue("Lesson ${lesson.id} must have quiz questions", lesson.quizQuestions.isNotEmpty())
        }
    }

    @Test
    fun `research repository provides complete 10-dimension scorecard`() {
        val vwrp = ResearchData.assets.find { it.ticker == "VWRP" }
        assertTrue(vwrp != null)
        assertEquals(10, vwrp!!.scorecard.dimensions.size)
        assertTrue(vwrp.scorecard.whatLooksInteresting.isNotEmpty())
        assertTrue(vwrp.scorecard.keyRisks.isNotEmpty())
        assertTrue(vwrp.scorecard.questionsInvestorsShouldAsk.isNotEmpty())
    }
}
