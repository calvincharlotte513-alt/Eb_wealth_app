package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.components.EBBottomNav
import com.example.ui.components.EBTopBar
import com.example.ui.screens.*
import com.example.ui.theme.EBWealthTheme
import com.example.ui.theme.RoyalBluePrimary
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.ScreenDestination

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EBWealthTheme {
                EBWealthApp()
            }
        }
    }
}

@Composable
fun EBWealthApp(viewModel: MainViewModel = viewModel()) {
    val destination by viewModel.currentDestination.collectAsStateWithLifecycle()
    val userProfile by viewModel.userProfile.collectAsStateWithLifecycle()
    val portfolioSummary by viewModel.portfolioSummary.collectAsStateWithLifecycle()
    val holdings by viewModel.holdings.collectAsStateWithLifecycle()
    val isRefreshingPrices by viewModel.isRefreshingPrices.collectAsStateWithLifecycle()
    val lastRefreshTime by viewModel.lastPriceRefreshTime.collectAsStateWithLifecycle()
    val academyProgress by viewModel.academyProgress.collectAsStateWithLifecycle()
    val selectedOverlapTickers by viewModel.selectedEtfsForOverlap.collectAsStateWithLifecycle()
    val overlapResult by viewModel.overlapAnalysisResult.collectAsStateWithLifecycle()
    val searchQuery by viewModel.searchQuery.collectAsStateWithLifecycle()
    val researchAssets by viewModel.researchAssets.collectAsStateWithLifecycle()
    val initialInv by viewModel.initialInvestment.collectAsStateWithLifecycle()
    val monthlyInv by viewModel.monthlyContribution.collectAsStateWithLifecycle()
    val simYears by viewModel.investmentYears.collectAsStateWithLifecycle()
    val simRate by viewModel.annualReturnRate.collectAsStateWithLifecycle()
    val chatMessages by viewModel.chatMessages.collectAsStateWithLifecycle()
    val isAiThinking by viewModel.isAiThinking.collectAsStateWithLifecycle()
    val communityPosts by viewModel.communityPosts.collectAsStateWithLifecycle()
    val selectedPostIdForComments by viewModel.selectedPostIdForComments.collectAsStateWithLifecycle()
    val postComments by viewModel.currentPostComments.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()
    val marketNews by viewModel.marketNews.collectAsStateWithLifecycle()
    val showProDialog by viewModel.showProDialog.collectAsStateWithLifecycle()
    val authState by viewModel.authState.collectAsStateWithLifecycle()
    val syncState by viewModel.syncState.collectAsStateWithLifecycle()

    // Back handling for sub-screens
    BackHandler(enabled = destination !is ScreenDestination.Dashboard && destination !is ScreenDestination.Auth) {
        when (destination) {
            is ScreenDestination.LessonDetail -> viewModel.navigateTo(ScreenDestination.Academy)
            is ScreenDestination.AssetDetail -> viewModel.navigateTo(ScreenDestination.Research)
            is ScreenDestination.Onboarding -> viewModel.navigateTo(ScreenDestination.Dashboard)
            is ScreenDestination.News -> viewModel.navigateTo(ScreenDestination.Dashboard)
            else -> viewModel.navigateTo(ScreenDestination.Dashboard)
        }
    }

    val showTopAndBottomBars = destination is ScreenDestination.Dashboard ||
                              destination is ScreenDestination.Academy ||
                              destination is ScreenDestination.Portfolio ||
                              destination is ScreenDestination.Research ||
                              destination is ScreenDestination.AICoach ||
                              destination is ScreenDestination.Profile

    Box(modifier = Modifier.fillMaxSize()) {
        // Universal Cosmic Background across ALL pages
        Image(
            painter = painterResource(id = R.drawable.img_cosmic_bg),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Bank-Grade Dark Contrast Atmospheric Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        listOf(
                            Color(0x44040B14),
                            Color(0x6606101E),
                            Color(0x99040A12)
                        )
                    )
                )
        )

        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = Color.Transparent,
            topBar = {
                if (showTopAndBottomBars) {
                    EBTopBar(
                        userProfile = userProfile,
                        currentDestination = destination,
                        onNavigate = { viewModel.navigateTo(it) },
                        onOpenPro = { viewModel.openProDialog() }
                    )
                }
            },
            bottomBar = {
                if (showTopAndBottomBars) {
                    EBBottomNav(
                        currentDestination = destination,
                        onNavigate = { viewModel.navigateTo(it) }
                    )
                }
            },
            floatingActionButton = {
                if (destination is ScreenDestination.Dashboard) {
                    FloatingActionButton(
                        onClick = { viewModel.navigateTo(ScreenDestination.AICoach) },
                        containerColor = Color(0xFF00F0FF),
                        contentColor = Color(0xFF040B14),
                        modifier = Modifier.testTag("dashboard_ai_coach_fab")
                    ) {
                        Icon(Icons.Default.SmartToy, contentDescription = "Ask AI Wealth Coach")
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
            AnimatedContent(
                targetState = destination,
                transitionSpec = {
                    slideInHorizontally(
                        initialOffsetX = { fullWidth -> fullWidth / 4 },
                        animationSpec = spring(stiffness = Spring.StiffnessMediumLow)
                    ) + fadeIn(animationSpec = tween(220)) togetherWith
                    slideOutHorizontally(
                        targetOffsetX = { fullWidth -> -fullWidth / 4 },
                        animationSpec = spring(stiffness = Spring.StiffnessMediumLow)
                    ) + fadeOut(animationSpec = tween(180))
                },
                label = "screen_slide_transition"
            ) { dest ->
                when (dest) {
                    is ScreenDestination.Auth -> {
                        AuthScreen(
                            authState = authState,
                            onLogin = { email, password ->
                                viewModel.login(email, password)
                            },
                            onSignUp = { firstName, email, password, age, country ->
                                viewModel.signUp(firstName, email, password, age, country)
                            },
                            onGoogleSignIn = { email, name ->
                                viewModel.onGoogleSignInSuccess(email, name)
                            },
                            onClearError = { viewModel.resetAuthState() }
                        )
                    }
                    is ScreenDestination.Onboarding -> {
                        OnboardingScreen(
                            onFinishOnboarding = { exp, goal, horizon, cap, risk ->
                                viewModel.completeOnboarding(exp, goal, horizon, cap, risk)
                            },
                            onSkip = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.Dashboard -> {
                        DashboardScreen(
                            userProfile = userProfile,
                            portfolioSummary = portfolioSummary,
                            academyProgress = academyProgress,
                            onNavigate = { viewModel.navigateTo(it) },
                            onOpenPro = { viewModel.openProDialog() }
                        )
                    }
                    is ScreenDestination.Academy -> {
                        AcademyScreen(
                            academyProgress = academyProgress,
                            onSelectLesson = { lessonId ->
                                viewModel.navigateTo(ScreenDestination.LessonDetail(lessonId))
                            }
                        )
                    }
                    is ScreenDestination.LessonDetail -> {
                        LessonDetailScreen(
                            lessonId = dest.lessonId,
                            onBack = { viewModel.navigateTo(ScreenDestination.Academy) },
                            onCompleteLesson = { id, score, xp ->
                                viewModel.completeLessonAndQuiz(id, score, xp)
                            }
                        )
                    }
                    is ScreenDestination.Portfolio -> {
                        PortfolioScreen(
                            holdings = holdings,
                            portfolioSummary = portfolioSummary,
                            isRefreshingPrices = isRefreshingPrices,
                            lastRefreshTime = lastRefreshTime,
                            onRefreshPrices = { viewModel.refreshLivePrices() },
                            onAddHolding = { name, ticker, type, shares, avg, cur, acc, geo, sec ->
                                viewModel.addHolding(name, ticker, type, shares, avg, cur, acc, geo, sec)
                            },
                            onDeleteHolding = { holding ->
                                viewModel.deleteHolding(holding)
                            }
                        )
                    }
                    is ScreenDestination.ETFOverlap -> {
                        ETFOverlapScreen(
                            selectedTickers = selectedOverlapTickers,
                            overlapResult = overlapResult,
                            onToggleEtf = { viewModel.toggleEtfForOverlap(it) },
                            onLearnMoreAboutOverlap = {
                                viewModel.navigateTo(ScreenDestination.LessonDetail("portfolio_overlap"))
                            },
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.Research -> {
                        ResearchScreen(
                            assets = researchAssets,
                            searchQuery = searchQuery,
                            onSearchChanged = { viewModel.onSearchQueryChanged(it) },
                            onSelectAsset = { ticker ->
                                viewModel.navigateTo(ScreenDestination.AssetDetail(ticker))
                            },
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.AssetDetail -> {
                        AssetDetailScreen(
                            ticker = dest.ticker,
                            onBack = { viewModel.navigateTo(ScreenDestination.Research) }
                        )
                    }
                    is ScreenDestination.Simulator -> {
                        SimulatorScreen(
                            initialInvestment = initialInv,
                            monthlyContribution = monthlyInv,
                            years = simYears,
                            annualReturnRate = simRate,
                            onUpdateSimulator = { init, mon, yr, rate ->
                                viewModel.updateSimulator(init, mon, yr, rate)
                            },
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.AICoach -> {
                        AICoachScreen(
                            messages = chatMessages,
                            isThinking = isAiThinking,
                            onSendMessage = { viewModel.sendAiPrompt(it) },
                            onClearChat = { viewModel.clearAiChat() },
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.Community -> {
                        CommunityScreen(
                            posts = communityPosts,
                            selectedPostIdForComments = selectedPostIdForComments,
                            postComments = postComments,
                            onOpenComments = { viewModel.openCommentsForPost(it) },
                            onCloseComments = { viewModel.closeComments() },
                            onAddComment = { postId, text -> viewModel.addCommentToPost(postId, text) },
                            onCreatePost = { cat, title, content ->
                                viewModel.createCommunityPost(cat, title, content)
                            },
                            onLikePost = { viewModel.likePost(it) },
                            onToggleSave = { viewModel.toggleSavePost(it) },
                            onDeletePost = { viewModel.deletePost(it) },
                            isAdmin = userProfile?.isAdmin == true,
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.Events -> {
                        EventsScreen(
                            events = events,
                            onToggleRegistration = { eventId, reg ->
                                viewModel.toggleEventRegistration(eventId, reg)
                            },
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.News -> {
                        MarketNewsScreen(
                            newsList = marketNews,
                            onBack = { viewModel.navigateTo(ScreenDestination.Dashboard) }
                        )
                    }
                    is ScreenDestination.Profile -> {
                        ProfileScreen(
                            userProfile = userProfile,
                            syncState = syncState,
                            onSyncClick = { viewModel.triggerFirebaseSync() },
                            onOpenPro = { viewModel.openProDialog() },
                            onNavigate = {
                                if (it is ScreenDestination.Auth) {
                                    viewModel.logout()
                                } else {
                                    viewModel.navigateTo(it)
                                }
                            }
                        )
                    }
                    is ScreenDestination.AdminDashboard -> {
                        AdminDashboardScreen(
                            onBack = { viewModel.navigateTo(ScreenDestination.Profile) }
                        )
                    }
                }
            }
        }
    }
}

    if (showProDialog) {
        ProMembershipDialog(
            isPro = userProfile?.isPro == true,
            onDismiss = { viewModel.closeProDialog() },
            onTogglePro = { viewModel.toggleProSubscription(it) }
        )
    }
}
