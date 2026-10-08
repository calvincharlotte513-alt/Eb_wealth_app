package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserProfile
import com.example.ui.theme.*
import com.example.ui.viewmodel.ScreenDestination

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EBTopBar(
    userProfile: UserProfile?,
    currentDestination: ScreenDestination,
    onNavigate: (ScreenDestination) -> Unit,
    onOpenPro: () -> Unit
) {
    TopAppBar(
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onNavigate(ScreenDestination.Dashboard) }
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF00F0FF), Color(0xFF0284C7))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "EB",
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 15.sp
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "EB ",
                            fontWeight = FontWeight.Black,
                            fontSize = 17.sp,
                            color = Color(0xFF00F0FF),
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Wealth",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 17.sp,
                            color = Color(0xFFFBBF24),
                            letterSpacing = 0.5.sp
                        )
                        if (userProfile?.isPro == true) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                color = GoldAccent,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = "PRO",
                                    color = Color.White,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                                )
                            }
                        }
                    }
                    Text(
                        text = "Investment Education Platform",
                        fontSize = 10.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        },
        actions = {
            if (userProfile?.isPro != true) {
                FilledTonalButton(
                    onClick = onOpenPro,
                    colors = ButtonDefaults.filledTonalButtonColors(
                        containerColor = GoldContainer,
                        contentColor = OnGoldContainer
                    ),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier
                        .height(34.dp)
                        .testTag("upgrade_pro_top_button")
                ) {
                    Icon(
                        Icons.Default.WorkspacePremium,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = GoldAccent
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Upgrade", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // User Profile Avatar
            IconButton(
                onClick = { onNavigate(ScreenDestination.Profile) },
                modifier = Modifier
                    .size(36.dp)
                    .testTag("profile_avatar_top_button")
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF0284C7), Color(0xFF0F172A))
                            )
                        )
                        .border(1.dp, Color(0xFF00F0FF).copy(alpha = 0.6f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = userProfile?.firstName?.take(1) ?: "U",
                        color = Color(0xFF00F0FF),
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color(0xFF040B14).copy(alpha = 0.95f)
        )
    )
}

/**
 * World-Class Floating Cyber Frosted-Glass Bottom Navigation Bar
 * Exactly matching the requested 1791140611848.jpg design with 4 tabs:
 * [Home, Market, Learn, Portfolio]
 */
@Composable
fun EBBottomNav(
    currentDestination: ScreenDestination,
    onNavigate: (ScreenDestination) -> Unit
) {
    val isHome = currentDestination is ScreenDestination.Dashboard
    val isMarket = currentDestination is ScreenDestination.Research || currentDestination is ScreenDestination.AssetDetail
    val isLearn = currentDestination is ScreenDestination.Academy || currentDestination is ScreenDestination.LessonDetail
    val isPortfolio = currentDestination is ScreenDestination.Portfolio || currentDestination is ScreenDestination.ETFOverlap || currentDestination is ScreenDestination.Simulator

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 20.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .shadow(
                    elevation = 16.dp,
                    shape = RoundedCornerShape(34.dp),
                    spotColor = Color(0xFF00F0FF).copy(alpha = 0.35f)
                ),
            shape = RoundedCornerShape(34.dp),
            color = Color(0xDD071322),
            border = BorderStroke(
                width = 1.5.dp,
                brush = Brush.horizontalGradient(
                    listOf(
                        Color(0xFF00F0FF).copy(alpha = 0.85f),
                        Color(0xFF38BDF8).copy(alpha = 0.45f),
                        Color(0xFF818CF8).copy(alpha = 0.35f),
                        Color(0xFF2DD4BF).copy(alpha = 0.85f)
                    )
                )
            )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CyberNavItem(
                    label = "Home",
                    icon = Icons.Default.Home,
                    isSelected = isHome,
                    testTag = "nav_home",
                    onClick = { onNavigate(ScreenDestination.Dashboard) }
                )

                CyberNavItem(
                    label = "Market",
                    icon = Icons.Default.TrendingUp,
                    isSelected = isMarket,
                    testTag = "nav_market",
                    onClick = { onNavigate(ScreenDestination.Research) }
                )

                CyberNavItem(
                    label = "Learn",
                    icon = Icons.Default.Layers,
                    isSelected = isLearn,
                    testTag = "nav_learn",
                    onClick = { onNavigate(ScreenDestination.Academy) }
                )

                CyberNavItem(
                    label = "Portfolio",
                    icon = Icons.Default.PieChart,
                    isSelected = isPortfolio,
                    testTag = "nav_portfolio",
                    onClick = { onNavigate(ScreenDestination.Portfolio) }
                )
            }
        }
    }
}

@Composable
private fun CyberNavItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    testTag: String,
    onClick: () -> Unit
) {
    val iconTint by animateColorAsState(
        targetValue = if (isSelected) Color(0xFF00F0FF) else Color(0xFF94A3B8),
        animationSpec = tween(200),
        label = "iconTint"
    )

    val labelColor by animateColorAsState(
        targetValue = if (isSelected) Color.White else Color(0xFF64748B),
        animationSpec = tween(200),
        label = "labelColor"
    )

    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 6.dp)
            .testTag(testTag),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(34.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(
                    if (isSelected) Color(0x3300F0FF) else Color.Transparent
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = iconTint,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(modifier = Modifier.height(2.dp))

        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
            color = labelColor
        )
    }
}
