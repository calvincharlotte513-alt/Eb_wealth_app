package com.example.data.database

import androidx.room.*
import com.example.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Query("SELECT * FROM user_profiles WHERE id = 1 LIMIT 1")
    fun getUserProfile(): Flow<UserProfile?>

    @Query("SELECT * FROM user_profiles WHERE id = 1 LIMIT 1")
    suspend fun getUserProfileOnce(): UserProfile?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateProfile(profile: UserProfile)

    @Query("UPDATE user_profiles SET xp = xp + :points WHERE id = 1")
    suspend fun addXp(points: Int)

    @Query("UPDATE user_profiles SET isPro = :isPro WHERE id = 1")
    suspend fun updateProStatus(isPro: Boolean)

    @Query("UPDATE user_profiles SET isOnboarded = :onboarded WHERE id = 1")
    suspend fun updateOnboarded(onboarded: Boolean)

    // Account Authentication Queries
    @Query("SELECT * FROM user_accounts WHERE LOWER(email) = LOWER(:email) LIMIT 1")
    suspend fun getAccountByEmail(email: String): UserAccountEntity?

    @Query("SELECT * FROM user_accounts WHERE LOWER(email) = LOWER(:email) AND passwordHash = :passwordHash LIMIT 1")
    suspend fun authenticate(email: String, passwordHash: String): UserAccountEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAccount(account: UserAccountEntity): Long

    @Query("SELECT COUNT(*) FROM user_accounts")
    suspend fun getAccountCount(): Int
}

@Dao
interface PortfolioDao {
    @Query("SELECT * FROM portfolio_holdings ORDER BY id DESC")
    fun getAllHoldings(): Flow<List<HoldingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHolding(holding: HoldingEntity)

    @Update
    suspend fun updateHolding(holding: HoldingEntity)

    @Delete
    suspend fun deleteHolding(holding: HoldingEntity)

    @Query("DELETE FROM portfolio_holdings WHERE id = :id")
    suspend fun deleteHoldingById(id: Int)

    @Query("UPDATE portfolio_holdings SET currentPrice = :newPrice WHERE ticker = :ticker")
    suspend fun updatePriceForTicker(ticker: String, newPrice: Double)
}

@Dao
interface NewsDao {
    @Query("SELECT * FROM market_news ORDER BY id DESC")
    fun getAllNews(): Flow<List<MarketNewsEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNews(newsList: List<MarketNewsEntity>)
}

@Dao
interface CommentDao {
    @Query("SELECT * FROM community_comments WHERE postId = :postId ORDER BY id ASC")
    fun getCommentsForPost(postId: Int): Flow<List<CommunityComment>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertComment(comment: CommunityComment)
}

@Dao
interface AcademyDao {
    @Query("SELECT * FROM lesson_progress")
    fun getAllProgress(): Flow<List<LessonProgressEntity>>

    @Query("SELECT * FROM lesson_progress WHERE lessonId = :lessonId LIMIT 1")
    suspend fun getProgressForLesson(lessonId: String): LessonProgressEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun recordLessonProgress(progress: LessonProgressEntity)
}

@Dao
interface CommunityDao {
    @Query("SELECT * FROM community_posts ORDER BY id DESC")
    fun getAllPosts(): Flow<List<CommunityPostEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPost(post: CommunityPostEntity)

    @Update
    suspend fun updatePost(post: CommunityPostEntity)

    @Query("DELETE FROM community_posts WHERE id = :postId")
    suspend fun deletePost(postId: Int)

    @Query("UPDATE community_posts SET likesCount = likesCount + 1, isLiked = 1 WHERE id = :postId")
    suspend fun likePost(postId: Int)

    @Query("UPDATE community_posts SET isSaved = CASE WHEN isSaved = 1 THEN 0 ELSE 1 END WHERE id = :postId")
    suspend fun toggleSavePost(postId: Int)
}

@Dao
interface EventDao {
    @Query("SELECT * FROM eb_events ORDER BY id ASC")
    fun getAllEvents(): Flow<List<EBEventEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvents(events: List<EBEventEntity>)

    @Query("UPDATE eb_events SET isRegistered = :registered, spacesRemaining = spacesRemaining + (CASE WHEN :registered = 1 THEN -1 ELSE 1 END) WHERE id = :eventId")
    suspend fun setRegistration(eventId: Int, registered: Boolean)
}

@Dao
interface ChatDao {
    @Query("SELECT * FROM chat_messages ORDER BY timestamp ASC")
    fun getAllMessages(): Flow<List<ChatMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessageEntity)

    @Query("DELETE FROM chat_messages")
    suspend fun clearChat()
}
