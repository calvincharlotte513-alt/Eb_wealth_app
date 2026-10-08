package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserProfile
import com.example.data.repository.SyncState
import com.example.ui.components.LegalDisclaimerCard
import com.example.ui.theme.*
import com.example.ui.viewmodel.ScreenDestination

@Composable
fun ProfileScreen(
    userProfile: UserProfile?,
    syncState: SyncState = SyncState.Idle,
    onSyncClick: () -> Unit = {},
    onOpenPro: () -> Unit,
    onNavigate: (ScreenDestination) -> Unit
) {
    val profile = userProfile ?: UserProfile()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent)
            .testTag("profile_screen_column"),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Bank-Style Client Identification Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xD90A1628)
                ),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = Color(0x2210B981),
                            shape = RoundedCornerShape(6.dp),
                            border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.5f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    Icons.Default.VerifiedUser,
                                    contentDescription = null,
                                    tint = Color(0xFF34D399),
                                    modifier = Modifier.size(13.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "VERIFIED WEALTH CLIENT",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF34D399),
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }

                        Text(
                            text = "REF: EB-8849-GB",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(Color(0xFF00F0FF), Color(0xFF0284C7))
                                    )
                                )
                                .border(1.5.dp, Color(0xFF00F0FF), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = profile.firstName.take(1),
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 24.sp
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column {
                            Text(
                                text = profile.firstName,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 20.sp,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = profile.email,
                                fontSize = 12.sp,
                                color = Color(0xFF94A3B8)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "United Kingdom • GBP Base",
                                fontSize = 11.sp,
                                color = Color(0xFF38BDF8)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("TIER STATUS", fontSize = 10.sp, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                            Text(
                                text = if (profile.isPro) "EB Wealth Private Client" else "Standard Investor",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (profile.isPro) Color(0xFFFBBF24) else Color.White
                            )
                        }

                        Button(
                            onClick = onOpenPro,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (profile.isPro) Color(0x3310B981) else Color(0xFFFBBF24)
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(34.dp)
                        ) {
                            Text(
                                text = if (profile.isPro) "Manage Tier" else "Upgrade to Pro",
                                color = if (profile.isPro) Color(0xFF34D399) else Color(0xFF040B14),
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp
                            )
                        }
                    }
                }
            }
        }

        // UK Tax & Annual Allowance Summary (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "TAX YEAR 2024/2025 ALLOWANCES",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFBBF24),
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "HMRC Regulated",
                            fontSize = 10.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // ISA Allowance Progress Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Stocks & Shares ISA Limit", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.SemiBold)
                        Text("£8,450 / £20,000", fontSize = 12.sp, color = Color(0xFF00F0FF), fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LinearProgressIndicator(
                        progress = { 8450f / 20000f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = Color(0xFF00F0FF),
                        trackColor = Color(0x2800F0FF)
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "£11,550 tax-free allowance remaining until April 5",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8)
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider(color = Color(0x1FFFFFFF))
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Capital Gains Allowance", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            Text("£3,000.00 Limit", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Dividend Allowance", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            Text("£500.00 Tax-Free", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        }

        // Investor Mandate & Suitability Parameters
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "INVESTOR SUITABILITY MANDATE",
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = Color(0xFF38BDF8),
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Recalibrate →",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF00F0FF),
                            modifier = Modifier.clickable { onNavigate(ScreenDestination.Onboarding) }
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    BankDetailRow("Investment Experience", profile.experienceLevel)
                    BankDetailRow("Primary Financial Goal", profile.primaryGoal)
                    BankDetailRow("Investment Time Horizon", profile.timeHorizon)
                    BankDetailRow("Monthly Allocation Capacity", profile.monthlyCapacity)
                    BankDetailRow("Risk Tolerance Calibration", profile.riskProfile)
                    BankDetailRow("Investor Academy Status", "Tier ${profile.levelNumber} (${profile.levelTitle})")
                    BankDetailRow("Total Experience XP", "${profile.xp} XP")
                    BankDetailRow("Regulatory Jurisdiction", "United Kingdom (FCA / PRA)")
                }
            }
        }

        // Bank Security & Financial Protection
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Security,
                            contentDescription = null,
                            tint = Color(0xFF34D399),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "BANK-GRADE SECURITY & PROTECTION",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    BankSecurityRow("FSCS Protection", "Covered up to £85,000", Icons.Default.Shield)
                    BankSecurityRow("Biometrics & PIN", "Enabled (FaceID / Fingerprint)", Icons.Default.Fingerprint)
                    BankSecurityRow("Linked Bank Account", "Barclays Premier (••••4821)", Icons.Default.AccountBalance)
                    BankSecurityRow("Encryption Protocol", "AES-256 GCM Local Database", Icons.Default.Lock)
                }
            }
        }

        // Firebase Cloud Firestore Status & Backup
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CloudSync, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "FIREBASE CLOUD FIRESTORE",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                letterSpacing = 0.5.sp
                            )
                        }

                        Button(
                            onClick = onSyncClick,
                            enabled = syncState !is SyncState.Syncing,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            if (syncState is SyncState.Syncing) {
                                CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color(0xFF040B14), strokeWidth = 2.dp)
                            } else {
                                Text("Sync Now", color = Color(0xFF040B14), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = when (syncState) {
                            is SyncState.Success -> "Cloud Synced: ${(syncState as SyncState.Success).message} (${(syncState as SyncState.Success).timestamp})"
                            is SyncState.Error -> "Sync Error: ${(syncState as SyncState.Error).error}"
                            is SyncState.Notice -> (syncState as SyncState.Notice).message
                            is SyncState.Syncing -> "Synchronizing client portfolio & intelligence to Firestore..."
                            else -> "Cloud Database: Active (ai-studio-android-ebwealth)"
                        },
                        fontSize = 11.sp,
                        color = when (syncState) {
                            is SyncState.Success -> Color(0xFF34D399)
                            is SyncState.Error -> Color(0xFFF43F5E)
                            else -> Color(0xFF94A3B8)
                        },
                        lineHeight = 15.sp
                    )
                }
            }
        }

        // Action Menu Items (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column {
                    BankActionRow(
                        title = "Platform Overview & Tiers",
                        subtitle = "Transparent fee schedule and tier benefits",
                        icon = Icons.Default.Public,
                        onClick = { onOpenPro() }
                    )
                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    BankActionRow(
                        title = "Community Discussions",
                        subtitle = "Exchange strategy with fellow UK investors",
                        icon = Icons.Default.Forum,
                        onClick = { onNavigate(ScreenDestination.Community) }
                    )
                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    BankActionRow(
                        title = "Masterclasses & Live Webinars",
                        subtitle = "Register for upcoming educational sessions",
                        icon = Icons.Default.Event,
                        onClick = { onNavigate(ScreenDestination.Events) }
                    )
                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    BankActionRow(
                        title = "UK Market News & Interest Rates",
                        subtitle = "Bank of England monetary policy & updates",
                        icon = Icons.Default.Newspaper,
                        onClick = { onNavigate(ScreenDestination.News) }
                    )
                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    BankActionRow(
                        title = "Admin Command Centre",
                        subtitle = "Platform metrics, user management & moderation",
                        icon = Icons.Default.AdminPanelSettings,
                        onClick = { onNavigate(ScreenDestination.AdminDashboard) }
                    )
                    HorizontalDivider(color = Color(0x1FFFFFFF))

                    BankActionRow(
                        title = "Sign Out & Lock Vault",
                        subtitle = "Securely exit session and lock local vault",
                        icon = Icons.Default.ExitToApp,
                        isDestructive = true,
                        onClick = { onNavigate(ScreenDestination.Auth) }
                    )
                }
            }
        }

        item {
            LegalDisclaimerCard()
        }
    }
}

@Composable
private fun BankDetailRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, fontSize = 12.sp, color = Color(0xFF94A3B8))
        Text(value, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
private fun BankSecurityRow(title: String, detail: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0x2200F0FF)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(16.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            Text(detail, fontSize = 11.sp, color = Color(0xFF94A3B8))
        }
    }
}

@Composable
private fun BankActionRow(
    title: String,
    subtitle: String,
    icon: ImageVector,
    isDestructive: Boolean = false,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(if (isDestructive) Color(0x22E11D48) else Color(0x2200F0FF)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = if (isDestructive) Color(0xFFF43F5E) else Color(0xFF00F0FF),
                modifier = Modifier.size(18.dp)
            )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                color = if (isDestructive) Color(0xFFF43F5E) else Color.White
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                fontSize = 11.sp,
                color = Color(0xFF94A3B8)
            )
        }

        Icon(
            Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Color(0xFF64748B),
            modifier = Modifier.size(18.dp)
        )
    }
}
