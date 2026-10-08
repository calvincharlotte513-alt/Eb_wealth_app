package com.example.data.repository

import android.content.Context
import android.util.Log
import com.example.R
import com.example.data.database.AppDatabase
import com.example.data.model.HoldingEntity
import com.example.data.model.UserProfile
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

sealed class SyncState {
    object Idle : SyncState()
    object Syncing : SyncState()
    data class Success(val message: String, val timestamp: String) : SyncState()
    data class Notice(val message: String) : SyncState()
    data class Error(val error: String) : SyncState()
}

class FirebaseSyncManager(
    private val context: Context,
    private val database: AppDatabase
) {
    private val tag = "FirebaseSyncManager"

    fun isFirebaseInitialized(): Boolean {
        return try {
            FirebaseApp.getApps(context).isNotEmpty()
        } catch (e: Exception) {
            false
        }
    }

    suspend fun syncLocalDataToFirestore(): SyncState = withContext(Dispatchers.IO) {
        if (!isFirebaseInitialized()) {
            return@withContext SyncState.Notice(
                "Local Room Database Active (Offline Mode). To connect real-time Firebase Cloud Firestore, place your google-services.json in the project root."
            )
        }

        try {
            val dbId = context.getString(R.string.firestore_database_id)
            val firestore = FirebaseFirestore.getInstance(FirebaseApp.getInstance(), dbId)
            val userProfile = database.userDao().getUserProfileOnce() ?: UserProfile()
            val userId = "user_${userProfile.email.replace(".", "_").replace("@", "_")}"

            // 1. Sync User Profile
            val userMap = hashMapOf(
                "firstName" to userProfile.firstName,
                "email" to userProfile.email,
                "experienceLevel" to userProfile.experienceLevel,
                "primaryGoal" to userProfile.primaryGoal,
                "timeHorizon" to userProfile.timeHorizon,
                "monthlyCapacity" to userProfile.monthlyCapacity,
                "riskProfile" to userProfile.riskProfile,
                "xp" to userProfile.xp,
                "isPro" to userProfile.isPro,
                "lastSyncedAt" to System.currentTimeMillis()
            )
            firestore.collection("users").document(userId)
                .set(userMap, SetOptions.merge())
                .await()

            // 2. Sync Portfolio Holdings
            val holdings = database.portfolioDao().getAllHoldings().firstOrNull() ?: emptyList()
            for (h in holdings) {
                val holdingMap = hashMapOf(
                    "ticker" to h.ticker,
                    "name" to h.name,
                    "assetType" to h.assetType,
                    "shares" to h.shares,
                    "avgPurchasePrice" to h.avgPurchasePrice,
                    "currentPrice" to h.currentPrice,
                    "accountType" to h.accountType,
                    "geography" to h.geography,
                    "sector" to h.sector
                )
                firestore.collection("users").document(userId)
                    .collection("holdings").document(h.ticker)
                    .set(holdingMap, SetOptions.merge())
                    .await()
            }

            // 3. Sync Community Posts
            val posts = database.communityDao().getAllPosts().firstOrNull() ?: emptyList()
            for (p in posts) {
                val postMap = hashMapOf(
                    "authorName" to p.authorName,
                    "authorLevel" to p.authorLevel,
                    "category" to p.category,
                    "title" to p.title,
                    "content" to p.content,
                    "likesCount" to p.likesCount,
                    "commentsCount" to p.commentsCount,
                    "createdAtFormatted" to p.createdAtFormatted
                )
                firestore.collection("community_posts").document("post_${p.id}")
                    .set(postMap, SetOptions.merge())
                    .await()
            }

            val timeStr = SimpleDateFormat("dd MMM, HH:mm:ss", Locale.UK).format(Date())
            SyncState.Success("Synced ${holdings.size} holdings & profile to Firebase Firestore", timeStr)
        } catch (e: Exception) {
            Log.e(tag, "Firebase Firestore sync error", e)
            SyncState.Error(e.message ?: "Failed to sync to Firebase Firestore")
        }
    }
}
