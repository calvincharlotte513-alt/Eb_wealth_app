package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "market_news")
data class MarketNewsEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val category: String, // Markets, ETFs, Companies, UK Investing, Economy
    val headline: String,
    val dateString: String,
    val source: String,
    val summary: String,
    val readTime: String = "2 min read",
    val impactTag: String = "Educational Insight"
)
