package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.LessonProgressEntity
import com.example.data.model.PortfolioSummary
import com.example.data.model.UserProfile
import com.example.data.repository.ResearchData
import com.example.ui.components.LegalDisclaimerCard
import com.example.ui.components.MarketMoversCarousel
import com.example.ui.components.QuickActionCard
import com.example.ui.components.WealthGrowthChart
import com.example.ui.theme.*
import com.example.ui.viewmodel.ScreenDestination

@Composable
fun DashboardScreen(
    userProfile: UserProfile?,
    portfolioSummary: PortfolioSummary,
    academyProgress: Map<String, LessonProgressEntity>,
    onNavigate: (ScreenDestination) -> Unit,
    onOpenPro: () -> Unit
) {
    val firstName = userProfile?.firstName ?: "Investor"

    Box(modifier = Modifier.fillMaxSize()) {
        // Preferred Cosmic Command Center Background Image
        Image(
            painter = painterResource(id = R.drawable.img_cosmic_bg),
            contentDescription = "Cosmic Wealth Background",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Subtle gradient overlay for high contrast and readability
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xCC040B14),
                            Color(0xBB06101E),
                            Color(0xE0040A12)
                        )
                    )
                )
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .testTag("dashboard_lazy_column"),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Cosmic Header Matching 1791140611848.jpg
            item {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "EB ",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF00F0FF),
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Wealth",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFFBBF24),
                            letterSpacing = 1.sp
                        )
                    }
                    Text(
                        text = "Investment Education Platform",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFCBD5E1),
                        letterSpacing = 0.5.sp
                    )
                }
            }

            // Glowing Cosmic Search Bar Matching 1791140611848.jpg
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .clickable { onNavigate(ScreenDestination.Research) }
                        .testTag("cosmic_search_bar"),
                    shape = RoundedCornerShape(28.dp),
                    color = Color(0x3500F0FF),
                    border = BorderStroke(
                        width = 1.dp,
                        brush = Brush.horizontalGradient(
                            listOf(
                                Color(0xFF00F0FF).copy(alpha = 0.8f),
                                Color(0xFF38BDF8).copy(alpha = 0.4f),
                                Color(0xFF00F0FF).copy(alpha = 0.8f)
                            )
                        )
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Search UK stocks, ETFs, lessons...",
                            color = Color(0xFF94A3B8),
                            fontSize = 13.sp
                        )

                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(Color(0x3300F0FF))
                                .border(1.dp, Color(0xFF00F0FF).copy(alpha = 0.7f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = "Search",
                                tint = Color(0xFF00F0FF),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }

            // 4 Cosmic Command Portals directly matching 1791140611848.jpg
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        CosmicPortalCard(
                            title = "Market Galaxy",
                            subtitle = "LSE & Global Movers",
                            icon = Icons.Default.TrendingUp,
                            accentColor = Color(0xFF00F0FF),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.Research) }
                        )

                        CosmicPortalCard(
                            title = "Learning Nexus",
                            subtitle = "6-Level Academy",
                            icon = Icons.Default.Layers,
                            accentColor = Color(0xFF38BDF8),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.Academy) }
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        CosmicPortalCard(
                            title = "Portfolio Constellation",
                            subtitle = "Holdings & Rebalance",
                            icon = Icons.Default.PieChart,
                            accentColor = Color(0xFFFBBF24),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.Portfolio) }
                        )

                        CosmicPortalCard(
                            title = "Community Forum",
                            subtitle = "Discussions & Events",
                            icon = Icons.Default.Forum,
                            accentColor = Color(0xFF34D399),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.Community) }
                        )
                    }
                }
            }

            // Horizontal Market Movers Carousel
            item {
                MarketMoversCarousel(
                    assets = ResearchData.assets,
                    onSelectAsset = { ticker -> onNavigate(ScreenDestination.AssetDetail(ticker)) }
                )
            }

            // Interactive Compounding Trajectory Canvas Chart
            item {
                val monthly = if (portfolioSummary.monthlyEstimate > 0) portfolioSummary.monthlyEstimate else 250.0
                WealthGrowthChart(
                    monthlyContribution = monthly,
                    years = 25,
                    annualReturn = 0.07
                )
            }

            // Portfolio Live Snapshot (Glassmorphic)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xCC071322)),
                    border = BorderStroke(1.dp, Color(0xFF00F0FF).copy(alpha = 0.35f))
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("ESTIMATED PORTFOLIO VALUE", fontSize = 11.sp, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "£${String.format("%,.2f", portfolioSummary.totalValue)}",
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                            }

                            val isPositive = portfolioSummary.totalGainLoss >= 0
                            Surface(
                                color = if (isPositive) Color(0x2210B981) else Color(0x22E11D48),
                                shape = RoundedCornerShape(8.dp),
                                border = BorderStroke(1.dp, if (isPositive) EmeraldGreen else Color(0xFFE11D48))
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                                        contentDescription = null,
                                        tint = if (isPositive) EmeraldGreenLight else Color(0xFFF43F5E),
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "${if (isPositive) "+" else ""}£${String.format("%,.2f", portfolioSummary.totalGainLoss)} (${String.format("%.1f", portfolioSummary.totalGainLossPercentage)}%)",
                                        color = if (isPositive) EmeraldGreenLight else Color(0xFFF43F5E),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Invested", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(
                                    text = "£${String.format("%,.2f", portfolioSummary.totalCost)}",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color.White
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Monthly Contributions", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(
                                    text = "£${String.format("%,.0f", portfolioSummary.monthlyEstimate)}/mo",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF00F0FF)
                                )
                            }
                        }
                    }
                }
            }

            // Quick Analytical Actions
            item {
                Column {
                    Text(
                        text = "ANALYTICS & WEALTH TOOLS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFBBF24),
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        QuickActionCard(
                            title = "Overlap Tool",
                            subtitle = "Analyze duplicate ETF holdings",
                            icon = Icons.Default.CompareArrows,
                            iconColor = Color(0xFF00F0FF),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.ETFOverlap) }
                        )
                        QuickActionCard(
                            title = "Simulator",
                            subtitle = "Compound interest projection",
                            icon = Icons.Default.Timeline,
                            iconColor = EmeraldGreenLight,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.Simulator) }
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        QuickActionCard(
                            title = "AI Wealth Coach",
                            subtitle = "24/7 personal investment tutor",
                            icon = Icons.Default.SmartToy,
                            iconColor = Color(0xFFFBBF24),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.AICoach) }
                        )
                        QuickActionCard(
                            title = "Market News",
                            subtitle = "UK ISA allowances & interest rates",
                            icon = Icons.Default.Newspaper,
                            iconColor = Color(0xFF38BDF8),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate(ScreenDestination.News) }
                        )
                    }
                }
            }

            // Legal Disclaimer
            item {
                LegalDisclaimerCard()
            }
        }
    }
}

@Composable
private fun CosmicPortalCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        color = Color(0xCC071322),
        border = BorderStroke(
            1.dp,
            Brush.linearGradient(
                listOf(accentColor.copy(alpha = 0.7f), Color.Transparent)
            )
        )
    ) {
        Column(
            modifier = Modifier.padding(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(accentColor.copy(alpha = 0.2f))
                    .border(1.dp, accentColor.copy(alpha = 0.5f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = title,
                    tint = accentColor,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = title,
                fontSize = 13.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White
            )

            Text(
                text = subtitle,
                fontSize = 10.sp,
                color = Color(0xFF94A3B8)
            )
        }
    }
}
