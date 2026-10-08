package com.example.data.repository

import com.example.data.database.UserDao
import com.example.data.model.UserAccountEntity
import com.example.data.model.UserProfile
import kotlinx.coroutines.flow.Flow

class UserRepository(private val userDao: UserDao) {
    val userProfile: Flow<UserProfile?> = userDao.getUserProfile()

    suspend fun getProfileOnce(): UserProfile? = userDao.getUserProfileOnce()

    suspend fun saveProfile(profile: UserProfile) {
        userDao.insertOrUpdateProfile(profile)
    }

    suspend fun addXp(points: Int) {
        userDao.addXp(points)
    }

    suspend fun setProStatus(isPro: Boolean) {
        userDao.updateProStatus(isPro)
    }

    suspend fun setOnboarded(onboarded: Boolean) {
        userDao.updateOnboarded(onboarded)
    }

    suspend fun getAccountByEmail(email: String): UserAccountEntity? =
        userDao.getAccountByEmail(email.trim())

    suspend fun authenticate(email: String, password: String): UserAccountEntity? =
        userDao.authenticate(email.trim(), password)

    suspend fun createAccount(account: UserAccountEntity): Long =
        userDao.insertAccount(account)

    suspend fun getAccountCount(): Int =
        userDao.getAccountCount()
}
