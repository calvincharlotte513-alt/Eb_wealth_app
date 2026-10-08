package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.example.data.model.ScorecardRating
import com.example.data.repository.ResearchData
import com.example.ui.components.LegalDisclaimerCard
import com.example.ui.theme.*

@Composable
fun AssetDetailScreen(
    ticker: String,
    onBack: () -> Unit
) {
    val asset = ResearchData.assets.find { it.ticker == ticker } ?: ResearchData.assets.first()
    val scorecard = asset.scorecard

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                    Text(
                        text = "${asset.ticker} • ${asset.assetType}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                    Text(
                        text = asset.name,
                        fontSize = 12.sp,
                        color = Color(0xFF94A3B8),
                        maxLines = 1
                    )
                }
            }
        }

        // Summary Card (Bank Standard)
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
                        Column {
                            Text("CURRENT MARKET PRICE", fontSize = 11.sp, color = Color(0xFF94A3B8), letterSpacing = 0.5.sp)
                            Text("£${String.format("%.2f", asset.priceGbp)}", fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                        }
                        val isPos = asset.dayChangePercent >= 0
                        Surface(
                            color = if (isPos) Color(0x3310B981) else Color(0x33E11D48),
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, if (isPos) Color(0xFF10B981) else Color(0xFFE11D48))
                        ) {
                            Text(
                                text = "${if (isPos) "+" else ""}${String.format("%.2f", asset.dayChangePercent)}%",
                                color = if (isPos) Color(0xFF34D399) else Color(0xFFF43F5E),
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(asset.description, fontSize = 12.sp, color = Color(0xFFCBD5E1), lineHeight = 18.sp)
                }
            }
        }

        // EB 10-Dimension Scorecard Header
        item {
            Column {
                Text(
                    text = "EB STOCK SCORECARD",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFFBBF24),
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Fundamental Health Dimensions",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Objective educational evaluation of core financial pillars.",
                    fontSize = 12.sp,
                    color = Color(0xFF94A3B8)
                )
            }
        }

        // 10 Dimensions (Bank Standard)
        items(scorecard.dimensions) { dim ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(dim.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                        Text(dim.summary, fontSize = 12.sp, color = Color(0xFF94A3B8), lineHeight = 16.sp)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    ScorecardBadge(dim.rating)
                }
            }
        }

        // Qualitative Insights (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0xFF34D399).copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("What Looks Interesting", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF34D399))
                    Spacer(modifier = Modifier.height(8.dp))
                    scorecard.whatLooksInteresting.forEach { item ->
                        Row(modifier = Modifier.padding(vertical = 2.dp), verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(item, fontSize = 12.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0xFFFBBF24).copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("What Needs Further Investigation", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFFFBBF24))
                    Spacer(modifier = Modifier.height(8.dp))
                    scorecard.whatNeedsInvestigation.forEach { item ->
                        Row(modifier = Modifier.padding(vertical = 2.dp), verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFFFBBF24), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(item, fontSize = 12.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0xFFF43F5E).copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Key Risks to Consider", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFFF43F5E))
                    Spacer(modifier = Modifier.height(8.dp))
                    scorecard.keyRisks.forEach { item ->
                        Row(modifier = Modifier.padding(vertical = 2.dp), verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFF43F5E), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(item, fontSize = 12.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        item {
            LegalDisclaimerCard()
        }
    }
}

@Composable
private fun ScorecardBadge(rating: ScorecardRating) {
    val (bgColor, textColor) = when (rating) {
        ScorecardRating.STRONG -> Color(0x3310B981) to Color(0xFF34D399)
        ScorecardRating.MODERATE -> Color(0x33FBBF24) to Color(0xFFFBBF24)
        ScorecardRating.WEAK -> Color(0x33E11D48) to Color(0xFFF43F5E)
        ScorecardRating.UNKNOWN -> Color(0x22FFFFFF) to Color(0xFF94A3B8)
    }

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(6.dp),
        border = BorderStroke(1.dp, textColor.copy(alpha = 0.5f))
    ) {
        Text(
            text = rating.label,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
