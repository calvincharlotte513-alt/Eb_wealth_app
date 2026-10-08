package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@Composable
fun AdminDashboardScreen(
    onBack: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                    Text(
                        text = "EB Wealth Admin Console",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = DarkCharcoal
                    )
                    Text(
                        text = "Platform analytics, revenue & curriculum management",
                        fontSize = 12.sp,
                        color = TextMuted
                    )
                }
            }
        }

        // Key Business Metrics Grid
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(BorderSubtle))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Executive Platform Summary", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = DarkCharcoal)
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(modifier = Modifier.fillMaxWidth()) {
                        AdminMetricTile(Modifier.weight(1f), "Total Users", "4,820", "+14% MoM", EmeraldGreen)
                        Spacer(modifier = Modifier.width(8.dp))
                        AdminMetricTile(Modifier.weight(1f), "Pro Subscribers", "1,248", "£12,410 MRR", GoldAccent)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(modifier = Modifier.fillMaxWidth()) {
                        AdminMetricTile(Modifier.weight(1f), "Course Completion", "68.4%", "Disciplined", RoyalBluePrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        AdminMetricTile(Modifier.weight(1f), "AI Coach Queries", "32,940", "99.8% Safety", EmeraldGreenLight)
                    }
                }
            }
        }

        // Most Popular Curriculum & Research
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(BorderSubtle))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Top Performing Educational Content", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = DarkCharcoal)
                    Spacer(modifier = Modifier.height(10.dp))

                    AdminContentRow("Level 3: Stocks & Shares ISA Tax Fortress", "3,890 completions", "94% quiz pass")
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                    AdminContentRow("Level 4: The ETF Overlap Trap", "3,410 completions", "91% quiz pass")
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                    AdminContentRow("Level 1: Compound Growth Magic", "4,620 completions", "98% quiz pass")
                }
            }
        }

        // Research Traffic
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(BorderSubtle))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Most Searched Assets & Overlap Runs", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = DarkCharcoal)
                    Spacer(modifier = Modifier.height(10.dp))

                    AdminContentRow("VWRP vs VUAG Overlap Check", "14,820 checks", "Top combo")
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                    AdminContentRow("AstraZeneca PLC (AZN) Scorecard", "6,120 views", "FTSE 100")
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                    AdminContentRow("Legal & General Group (LGEN) Yield", "5,490 views", "High Dividend")
                }
            }
        }
    }
}

@Composable
private fun AdminMetricTile(
    modifier: Modifier,
    title: String,
    value: String,
    badge: String,
    color: Color
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        color = SoftGreyContainer
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(title, fontSize = 11.sp, color = TextMuted)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = DarkCharcoal)
            Spacer(modifier = Modifier.height(4.dp))
            Text(badge, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
private fun AdminContentRow(title: String, stat1: String, stat2: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = DarkCharcoal, modifier = Modifier.weight(1f))
        Spacer(modifier = Modifier.width(8.dp))
        Column(horizontalAlignment = Alignment.End) {
            Text(stat1, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = RoyalBluePrimary)
            Text(stat2, fontSize = 10.sp, color = TextMuted)
        }
    }
}
