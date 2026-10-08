package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@Composable
fun ProMembershipDialog(
    isPro: Boolean,
    onDismiss: () -> Unit,
    onTogglePro: (Boolean) -> Unit
) {
    var isAnnual by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = null,
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(GoldContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.WorkspacePremium,
                        contentDescription = null,
                        tint = OnGoldContainer,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "EB WEALTH PRO",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldAccent,
                    letterSpacing = 1.sp
                )

                Text(
                    text = "Unlock Your Complete Wealth Toolkit",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = DarkCharcoal,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Billing Frequency Selector
                Surface(
                    color = SoftGreyContainer,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { isAnnual = false },
                            shape = RoundedCornerShape(8.dp),
                            color = if (!isAnnual) RoyalBluePrimary else Color.Transparent
                        ) {
                            Text(
                                text = "Monthly (£9.99/mo)",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (!isAnnual) Color.White else DarkCharcoal,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }

                        Surface(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { isAnnual = true },
                            shape = RoundedCornerShape(8.dp),
                            color = if (isAnnual) RoyalBluePrimary else Color.Transparent
                        ) {
                            Text(
                                text = "Annual (£99/yr - Save 17%)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isAnnual) Color.White else DarkCharcoal,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    ProFeatureRow("Full 6-Level Academy & Advanced Quizzes")
                    ProFeatureRow("Unlimited EB AI Wealth Coach Queries")
                    ProFeatureRow("ETF Overlap Checker & Overlap Alerts")
                    ProFeatureRow("EB Stock Scorecards & Fundamental Metrics")
                    ProFeatureRow("Discounts & Early Access to EB Masterclasses")
                    ProFeatureRow("Private Investor Community & Discussions")
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "Stripe-ready subscription architecture. No lock-in, cancel anytime.",
                    fontSize = 11.sp,
                    color = TextMuted,
                    textAlign = TextAlign.Center
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onTogglePro(!isPro)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = GoldAccent),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("confirm_pro_subscription_button")
            ) {
                Text(
                    text = if (isPro) "Cancel Pro Subscription" else if (isAnnual) "Start Annual Pro (£99/yr)" else "Start Monthly Pro (£9.99/mo)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
        },
        dismissButton = {
            TextButton(
                onClick = onDismiss,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Close", color = TextMuted)
            }
        }
    )
}

@Composable
private fun ProFeatureRow(feature: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldGreen, modifier = Modifier.size(16.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(feature, fontSize = 12.sp, color = DarkCharcoal)
    }
}
