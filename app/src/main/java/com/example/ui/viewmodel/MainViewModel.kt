package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.database.AppDatabase
import com.example.data.model.*
import com.example.data.repository.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

sealed class ScreenDestination {
    object Auth : ScreenDestination()
    object Onboarding : ScreenDestination()
    object Dashboard : ScreenDestination()
    object Academy : ScreenDestination()
    data class LessonDetail(val lessonId: String) : ScreenDestination()
    object Portfolio : ScreenDestination()
    object ETFOverlap : ScreenDestination()
    object Research : ScreenDestination()
    data class AssetDetail(val ticker: String) : ScreenDestination()
    object Simulator : ScreenDestination()
    object AICoach : ScreenDestination()
    object Community : ScreenDestination()
    object Events : ScreenDestination()
    object News : ScreenDestination()
    object Profile : ScreenDestination()
    object AdminDashboard : ScreenDestination()
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val message: String) : AuthState()
    data class Error(val message: String) : AuthState()
}

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val database = AppDatabase.getDatabase(application, viewModelScope)
    private val userRepository = UserRepository(database.userDao())
    private val portfolioRepository = PortfolioRepository(database.portfolioDao())
    private val academyDao = database.academyDao()
    private val communityRepository = CommunityRepository(
        database.communityDao(),
        database.eventDao(),
        database.commentDao(),
        database.newsDao()
    )
    val aiCoachRepository = AICoachRepository(database.chatDao())
    private val marketDataService = MarketDataService(database.portfolioDao())
    private val firebaseSyncManager = FirebaseSyncManager(application, database)

    val isFirebaseConnected: Boolean = firebaseSyncManager.isFirebaseInitialized()

    private val _syncState = MutableStateFlow<SyncState>(SyncState.Idle)
    val syncState: StateFlow<SyncState> = _syncState.asStateFlow()

    fun triggerFirebaseSync() {
        viewModelScope.launch {
            _syncState.value = SyncState.Syncing
            val result = firebaseSyncManager.syncLocalDataToFirestore()
            _syncState.value = result
        }
    }

    // Navigation State - Defaults to Auth if not logged in
    private val _currentDestination = MutableStateFlow<ScreenDestination>(ScreenDestination.Auth)
    val currentDestination: StateFlow<ScreenDestination> = _currentDestination.asStateFlow()

    init {
        viewModelScope.launch {
            userRepository.userProfile.collect { profile ->
                if (profile != null && profile.isLoggedIn && profile.email.isNotBlank()) {
                    if (_currentDestination.value is ScreenDestination.Auth) {
                        _currentDestination.value = ScreenDestination.Dashboard
                    }
                } else {
                    if (_currentDestination.value !is ScreenDestination.Auth && _currentDestination.value !is ScreenDestination.Onboarding) {
                        _currentDestination.value = ScreenDestination.Auth
                    }
                }
            }
        }
    }

    fun navigateTo(destination: ScreenDestination) {
        _currentDestination.value = destination
    }

    // User Profile
    val userProfile: StateFlow<UserProfile?> = userRepository.userProfile
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Authentication State & Actions
    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun resetAuthState() {
        _authState.value = AuthState.Idle
    }

    fun login(email: String, password: String, onComplete: (Boolean) -> Unit = {}) {
        val trimmedEmail = email.trim()
        val trimmedPassword = password.trim()

        if (trimmedEmail.isEmpty() || !trimmedEmail.contains("@")) {
            _authState.value = AuthState.Error("Please enter a valid email address.")
            onComplete(false)
            return
        }

        if (trimmedPassword.isEmpty()) {
            _authState.value = AuthState.Error("Please enter your account password.")
            onComplete(false)
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val account = userRepository.authenticate(trimmedEmail, trimmedPassword)
                if (account != null) {
                    val current = userProfile.value ?: UserProfile()
                    val updated = current.copy(
                        firstName = account.firstName,
                        email = account.email,
                        ageRange = account.ageRange,
                        country = account.country,
                        isLoggedIn = true,
                        isOnboarded = true
                    )
                    userRepository.saveProfile(updated)
                    firebaseSyncManager.syncLocalDataToFirestore()
                    _authState.value = AuthState.Success("Welcome back, ${account.firstName}!")
                    _currentDestination.value = ScreenDestination.Dashboard
                    onComplete(true)
                } else {
                    _authState.value = AuthState.Error("Invalid email or password. Please verify credentials or create an account.")
                    onComplete(false)
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Error("Authentication failed: ${e.localizedMessage ?: "Unknown error"}")
                onComplete(false)
            }
        }
    }

    fun signUp(
        firstName: String,
        email: String,
        password: String,
        ageRange: String,
        country: String,
        onComplete: (Boolean) -> Unit = {}
    ) {
        val trimmedName = firstName.trim()
        val trimmedEmail = email.trim()
        val trimmedPassword = password.trim()

        if (trimmedName.length < 2) {
            _authState.value = AuthState.Error("First name must be at least 2 characters long.")
            onComplete(false)
            return
        }

        if (trimmedEmail.isEmpty() || !trimmedEmail.contains("@") || !trimmedEmail.contains(".")) {
            _authState.value = AuthState.Error("Please enter a valid email address (e.g. name@example.co.uk).")
            onComplete(false)
            return
        }

        if (trimmedPassword.length < 6) {
            _authState.value = AuthState.Error("Password must be at least 6 characters long.")
            onComplete(false)
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val existing = userRepository.getAccountByEmail(trimmedEmail)
                if (existing != null) {
                    _authState.value = AuthState.Error("An account with $trimmedEmail already exists. Please sign in instead.")
                    onComplete(false)
                    return@launch
                }

                val newAccount = UserAccountEntity(
                    firstName = trimmedName,
                    email = trimmedEmail,
                    passwordHash = trimmedPassword,
                    ageRange = ageRange,
                    country = country
                )
                userRepository.createAccount(newAccount)

                val current = userProfile.value ?: UserProfile()
                val updated = current.copy(
                    firstName = trimmedName,
                    email = trimmedEmail,
                    ageRange = ageRange,
                    country = country,
                    isLoggedIn = true,
                    isOnboarded = false,
                    xp = current.xp + 50
                )
                userRepository.saveProfile(updated)
                firebaseSyncManager.syncLocalDataToFirestore()

                _authState.value = AuthState.Success("Account successfully created!")
                _currentDestination.value = ScreenDestination.Onboarding
                onComplete(true)
            } catch (e: Exception) {
                _authState.value = AuthState.Error("Registration failed: ${e.localizedMessage ?: "Unknown error"}")
                onComplete(false)
            }
        }
    }

    fun onGoogleSignInSuccess(email: String, displayName: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                var account = userRepository.getAccountByEmail(email)
                if (account == null) {
                    val newAccount = UserAccountEntity(
                        firstName = displayName.ifBlank { "Investor" },
                        email = email,
                        passwordHash = "google_auth_${System.currentTimeMillis()}",
                        ageRange = "25–34",
                        country = "United Kingdom"
                    )
                    userRepository.createAccount(newAccount)
                }

                val current = userProfile.value ?: UserProfile()
                val updated = current.copy(
                    firstName = displayName.ifBlank { "Investor" },
                    email = email,
                    isLoggedIn = true,
                    isOnboarded = true
                )
                userRepository.saveProfile(updated)
                firebaseSyncManager.syncLocalDataToFirestore()
                _authState.value = AuthState.Success("Signed in with Google as $displayName")
                _currentDestination.value = ScreenDestination.Dashboard
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.localizedMessage ?: "Google sign-in sync failed")
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            val current = userProfile.value ?: UserProfile()
            userRepository.saveProfile(current.copy(isLoggedIn = false))
            _authState.value = AuthState.Idle
            _currentDestination.value = ScreenDestination.Auth
        }
    }

    // Portfolio
    val holdings: StateFlow<List<HoldingEntity>> = portfolioRepository.holdings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val portfolioSummary: StateFlow<PortfolioSummary> = portfolioRepository.portfolioSummary
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), PortfolioSummary(0.0, 0.0, 0.0, 0.0, 0))

    // Real-Time Live Price Refreshing
    private val _isRefreshingPrices = MutableStateFlow(false)
    val isRefreshingPrices: StateFlow<Boolean> = _isRefreshingPrices.asStateFlow()

    private val _lastPriceRefreshTime = MutableStateFlow("Today, " + SimpleDateFormat("HH:mm", Locale.UK).format(Date()))
    val lastPriceRefreshTime: StateFlow<String> = _lastPriceRefreshTime.asStateFlow()

    fun refreshLivePrices() {
        viewModelScope.launch {
            _isRefreshingPrices.value = true
            try {
                val tickers = holdings.value.map { it.ticker }
                marketDataService.refreshQuotesForHoldings(tickers)
                _lastPriceRefreshTime.value = "Updated " + SimpleDateFormat("HH:mm:ss", Locale.UK).format(Date())
            } finally {
                _isRefreshingPrices.value = false
            }
        }
    }

    // Academy Progress
    val academyProgress: StateFlow<Map<String, LessonProgressEntity>> = academyDao.getAllProgress()
        .map { list -> list.associateBy { it.lessonId } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyMap())

    // ETF Overlap State
    private val _selectedEtfsForOverlap = MutableStateFlow<List<String>>(listOf("VWRP", "VUAG"))
    val selectedEtfsForOverlap: StateFlow<List<String>> = _selectedEtfsForOverlap.asStateFlow()

    val overlapAnalysisResult: StateFlow<ETFOverlapAnalysisResult> = _selectedEtfsForOverlap
        .map { tickers -> ETFOverlapEngine.analyzeOverlap(tickers) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ETFOverlapEngine.analyzeOverlap(listOf("VWRP", "VUAG")))

    fun toggleEtfForOverlap(ticker: String) {
        val current = _selectedEtfsForOverlap.value.toMutableList()
        if (current.contains(ticker)) {
            if (current.size > 1) { // keep at least 1
                current.remove(ticker)
            }
        } else {
            current.add(ticker)
        }
        _selectedEtfsForOverlap.value = current
    }

    // Research & Stock Scorecards
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    val researchAssets: StateFlow<List<ResearchAsset>> = _searchQuery
        .map { query -> ResearchData.findByQuery(query) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ResearchData.assets)

    fun onSearchQueryChanged(q: String) {
        _searchQuery.value = q
    }

    // Simulator State
    private val _initialInvestment = MutableStateFlow(1000.0)
    val initialInvestment: StateFlow<Double> = _initialInvestment.asStateFlow()

    private val _monthlyContribution = MutableStateFlow(250.0)
    val monthlyContribution: StateFlow<Double> = _monthlyContribution.asStateFlow()

    private val _investmentYears = MutableStateFlow(20)
    val investmentYears: StateFlow<Int> = _investmentYears.asStateFlow()

    private val _annualReturnRate = MutableStateFlow(7.0)
    val annualReturnRate: StateFlow<Double> = _annualReturnRate.asStateFlow()

    fun updateSimulator(initial: Double, monthly: Double, years: Int, returnPct: Double) {
        _initialInvestment.value = initial
        _monthlyContribution.value = monthly
        _investmentYears.value = years
        _annualReturnRate.value = returnPct
    }

    // AI Coach Chat
    val chatMessages: StateFlow<List<ChatMessageEntity>> = aiCoachRepository.messages
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _isAiThinking = MutableStateFlow(false)
    val isAiThinking: StateFlow<Boolean> = _isAiThinking.asStateFlow()

    fun sendAiPrompt(prompt: String) {
        if (prompt.isBlank()) return
        viewModelScope.launch {
            _isAiThinking.value = true
            try {
                aiCoachRepository.sendMessage(prompt)
            } finally {
                _isAiThinking.value = false
            }
        }
    }

    fun clearAiChat() {
        viewModelScope.launch {
            aiCoachRepository.clearChatHistory()
        }
    }

    // Community
    val communityPosts: StateFlow<List<CommunityPostEntity>> = communityRepository.posts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val events: StateFlow<List<EBEventEntity>> = communityRepository.events
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val marketNews: StateFlow<List<MarketNewsEntity>> = communityRepository.news
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Active Comments on Post
    private val _selectedPostIdForComments = MutableStateFlow<Int?>(null)
    val selectedPostIdForComments: StateFlow<Int?> = _selectedPostIdForComments.asStateFlow()

    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    val currentPostComments: StateFlow<List<CommunityComment>> = _selectedPostIdForComments
        .flatMapLatest { postId ->
            if (postId != null) communityRepository.getCommentsForPost(postId) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun openCommentsForPost(postId: Int) {
        _selectedPostIdForComments.value = postId
    }

    fun closeComments() {
        _selectedPostIdForComments.value = null
    }

    fun addCommentToPost(postId: Int, text: String) {
        if (text.isBlank()) return
        viewModelScope.launch {
            val profile = userProfile.value
            val author = profile?.firstName ?: "Investor"
            val level = profile?.levelTitle ?: "Developing Investor"
            communityRepository.addComment(postId, author, level, text)
            userRepository.addXp(15) // XP for helpful comment
        }
    }

    fun createCommunityPost(category: String, title: String, content: String) {
        viewModelScope.launch {
            val profile = userProfile.value
            val author = profile?.firstName ?: "Investor"
            val level = profile?.levelTitle ?: "Developing Investor"
            communityRepository.createPost(author, level, category, title, content)
            userRepository.addXp(25) // XP reward for active community participation
        }
    }

    fun likePost(postId: Int) {
        viewModelScope.launch {
            communityRepository.likePost(postId)
        }
    }

    fun toggleSavePost(postId: Int) {
        viewModelScope.launch {
            communityRepository.toggleSavePost(postId)
        }
    }

    fun deletePost(postId: Int) {
        viewModelScope.launch {
            communityRepository.deletePost(postId)
        }
    }

    fun toggleEventRegistration(eventId: Int, currentRegistered: Boolean) {
        viewModelScope.launch {
            communityRepository.toggleEventRegistration(eventId, currentRegistered)
        }
    }

    // Portfolio Management
    fun addHolding(
        name: String,
        ticker: String,
        assetType: String,
        shares: Double,
        avgPrice: Double,
        currentPrice: Double,
        accountType: String,
        geography: String,
        sector: String
    ) {
        viewModelScope.launch {
            portfolioRepository.addHolding(
                HoldingEntity(
                    name = name,
                    ticker = ticker.uppercase(),
                    assetType = assetType,
                    shares = shares,
                    avgPurchasePrice = avgPrice,
                    currentPrice = currentPrice,
                    accountType = accountType,
                    geography = geography,
                    sector = sector
                )
            )
            userRepository.addXp(40) // XP reward for building portfolio
        }
    }

    fun deleteHolding(holding: HoldingEntity) {
        viewModelScope.launch {
            portfolioRepository.deleteHolding(holding)
        }
    }

    // Academy Actions
    fun completeLessonAndQuiz(lessonId: String, score: Int, xpEarned: Int) {
        viewModelScope.launch {
            academyDao.recordLessonProgress(
                LessonProgressEntity(
                    lessonId = lessonId,
                    completed = true,
                    quizScore = score
                )
            )
            userRepository.addXp(xpEarned)
        }
    }

    // Onboarding & Profile
    fun completeOnboarding(
        experience: String,
        goal: String,
        horizon: String,
        capacity: String,
        risk: String
    ) {
        viewModelScope.launch {
            val current = userProfile.value ?: UserProfile()
            userRepository.saveProfile(
                current.copy(
                    experienceLevel = experience,
                    primaryGoal = goal,
                    timeHorizon = horizon,
                    monthlyCapacity = capacity,
                    riskProfile = risk,
                    isOnboarded = true,
                    xp = current.xp + 100 // Welcome onboarding bonus
                )
            )
            _currentDestination.value = ScreenDestination.Dashboard
        }
    }

    fun toggleProSubscription(isPro: Boolean) {
        viewModelScope.launch {
            userRepository.setProStatus(isPro)
        }
    }

    // Subscription Dialog State
    private val _showProDialog = MutableStateFlow(false)
    val showProDialog: StateFlow<Boolean> = _showProDialog.asStateFlow()

    fun openProDialog() {
        _showProDialog.value = true
    }

    fun closeProDialog() {
        _showProDialog.value = false
    }
}
