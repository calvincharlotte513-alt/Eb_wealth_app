package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "user_accounts")
data class UserAccountEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val firstName: String,
    val email: String,
    val passwordHash: String,
    val ageRange: String = "25–34",
    val country: String = "United Kingdom",
    val experienceLevel: String = "Beginner",
    val primaryGoal: String = "Build long-term wealth",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_profiles")
data class UserProfile(
    @PrimaryKey val id: Int = 1,
    val firstName: String = "Alex",
    val email: String = "alex.investor@example.co.uk",
    val ageRange: String = "25–34",
    val country: String = "United Kingdom",
    val experienceLevel: String = "Beginner",
    val primaryGoal: String = "Build long-term wealth",
    val timeHorizon: String = "20+ years",
    val monthlyCapacity: String = "£150–£500",
    val riskProfile: String = "Medium-High",
    val xp: Int = 340,
    val streakDays: Int = 4,
    val isPro: Boolean = false,
    val isOnboarded: Boolean = true,
    val isLoggedIn: Boolean = true,
    val isAdmin: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
) {
    val levelNumber: Int
        get() = when {
            xp >= 2000 -> 5
            xp >= 1000 -> 4
            xp >= 500 -> 3
            xp >= 200 -> 2
            else -> 1
        }

    val levelTitle: String
        get() = when (levelNumber) {
            1 -> "Investor Starter"
            2 -> "Developing Investor"
            3 -> "Confident Investor"
            4 -> "Strategic Investor"
            else -> "EB Wealth Builder"
        }

    val nextLevelThreshold: Int
        get() = when (levelNumber) {
            1 -> 200
            2 -> 500
            3 -> 1000
            4 -> 2000
            else -> 3000
        }

    val currentLevelBaseXp: Int
        get() = when (levelNumber) {
            1 -> 0
            2 -> 200
            3 -> 500
            4 -> 1000
            else -> 2000
        }

    val levelProgressFloat: Float
        get() {
            val span = (nextLevelThreshold - currentLevelBaseXp).coerceAtLeast(1)
            val currentInSpan = (xp - currentLevelBaseXp).coerceAtLeast(0)
            return (currentInSpan.toFloat() / span.toFloat()).coerceIn(0f, 1f)
        }
}
