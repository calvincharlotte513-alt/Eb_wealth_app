package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "community_posts")
data class CommunityPostEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val authorName: String,
    val authorLevel: String,
    val category: String, // General, Beginners, ETFs, Stocks, Long-Term Investing, UK Investing, JISA, Wealth Building, Questions
    val title: String,
    val content: String,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val isLiked: Boolean = false,
    val isSaved: Boolean = false,
    val createdAtFormatted: String = "2 hours ago"
)

@Entity(tableName = "community_comments")
data class CommunityComment(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val postId: Int,
    val authorName: String,
    val authorLevel: String,
    val content: String,
    val timeFormatted: String = "Just now"
)
