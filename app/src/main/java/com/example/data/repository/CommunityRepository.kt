package com.example.data.repository

import com.example.data.database.CommentDao
import com.example.data.database.CommunityDao
import com.example.data.database.EventDao
import com.example.data.database.NewsDao
import com.example.data.model.CommunityComment
import com.example.data.model.CommunityPostEntity
import com.example.data.model.EBEventEntity
import com.example.data.model.MarketNewsEntity
import kotlinx.coroutines.flow.Flow

class CommunityRepository(
    private val communityDao: CommunityDao,
    private val eventDao: EventDao,
    private val commentDao: CommentDao,
    private val newsDao: NewsDao
) {
    val posts: Flow<List<CommunityPostEntity>> = communityDao.getAllPosts()
    val events: Flow<List<EBEventEntity>> = eventDao.getAllEvents()
    val news: Flow<List<MarketNewsEntity>> = newsDao.getAllNews()

    fun getCommentsForPost(postId: Int): Flow<List<CommunityComment>> {
        return commentDao.getCommentsForPost(postId)
    }

    suspend fun addComment(postId: Int, authorName: String, authorLevel: String, content: String) {
        commentDao.insertComment(
            CommunityComment(
                postId = postId,
                authorName = authorName,
                authorLevel = authorLevel,
                content = content,
                timeFormatted = "Just now"
            )
        )
    }

    suspend fun createPost(
        authorName: String,
        authorLevel: String,
        category: String,
        title: String,
        content: String
    ) {
        communityDao.insertPost(
            CommunityPostEntity(
                authorName = authorName,
                authorLevel = authorLevel,
                category = category,
                title = title,
                content = content,
                createdAtFormatted = "Just now"
            )
        )
    }

    suspend fun likePost(postId: Int) {
        communityDao.likePost(postId)
    }

    suspend fun toggleSavePost(postId: Int) {
        communityDao.toggleSavePost(postId)
    }

    suspend fun deletePost(postId: Int) {
        communityDao.deletePost(postId)
    }

    suspend fun toggleEventRegistration(eventId: Int, currentRegistered: Boolean) {
        eventDao.setRegistration(eventId, !currentRegistered)
    }
}
