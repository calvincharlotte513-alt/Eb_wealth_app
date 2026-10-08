package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ResearchAsset
import com.example.data.model.ScorecardRating
import com.example.ui.components.LegalDisclaimerCard
import com.example.ui.theme.*

@Composable
fun ResearchScreen(
    assets: List<ResearchAsset>,
    searchQuery: String,
    onSearchChanged: (String) -> Unit,
    onSelectAsset: (String) -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent)
    ) {
        // Top Search Header (Bank Standard)
        Surface(
            color = Color(0xD90A1628),
            border = BorderStroke(1.dp, Color(0x3300F0FF))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Market Intelligence & Research",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = Color.White
                        )
                        Text(
                            text = "London Stock Exchange (LSE) & Global ETFs",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchChanged,
                    placeholder = { Text("Search by ticker or fund (e.g. VWRP, VUAG, AZN)...", color = Color(0xFF94A3B8), fontSize = 13.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null, tint = Color(0xFF00F0FF))
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchChanged("") }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear", tint = Color(0xFF94A3B8))
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("research_search_field"),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = Color(0x2200F0FF),
                        unfocusedContainerColor = Color(0x1500F0FF),
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    ),
                    singleLine = true
                )
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Asset count & status
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Displaying ${assets.size} Analyzed Assets",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF94A3B8)
                    )
                    Text(
                        text = "FCA Compliant Metrics",
                        fontSize = 11.sp,
                        color = Color(0xFF38BDF8)
                    )
                }
            }

            // Asset Cards (Bank Standard)
            items(assets) { asset ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectAsset(asset.ticker) }
                        .testTag("research_card_${asset.ticker}"),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                    border = BorderStroke(1.dp, Color(0x2800F0FF))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        color = if (asset.assetType == "ETF") Color(0x3300F0FF) else Color(0x3310B981),
                                        shape = RoundedCornerShape(4.dp),
                                        border = BorderStroke(1.dp, if (asset.assetType == "ETF") Color(0x6600F0FF) else Color(0x6610B981))
                                    ) {
                                        Text(
                                            text = asset.assetType,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (asset.assetType == "ETF") Color(0xFF00F0FF) else Color(0xFF34D399),
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = asset.market,
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8)
                                    )
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                Text(
                                    text = asset.ticker,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                Text(
                                    text = asset.name,
                                    fontSize = 12.sp,
                                    color = Color(0xFF94A3B8),
                                    maxLines = 1
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "£${String.format("%.2f", asset.priceGbp)}",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                val isPos = asset.dayChangePercent >= 0
                                Text(
                                    text = "${if (isPos) "+" else ""}${String.format("%.2f", asset.dayChangePercent)}%",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isPos) Color(0xFF34D399) else Color(0xFFF43F5E)
                                )
                            }
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0x1FFFFFFF))

                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("P/E Ratio", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(asset.peRatio, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Dividend Yield", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(asset.dividendYield, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34D399))
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Market Cap", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(asset.marketCap, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8))
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Sector", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text(asset.sector, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFBBF24))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // EB Scorecard Pill
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0x22FFFFFF),
                            border = BorderStroke(1.dp, Color(0x33FFFFFF)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Default.Verified,
                                        contentDescription = null,
                                        tint = Color(0xFF34D399),
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "EB Health Scorecard",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                                Text(
                                    text = "View Factsheet →",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF00F0FF)
                                )
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
}
