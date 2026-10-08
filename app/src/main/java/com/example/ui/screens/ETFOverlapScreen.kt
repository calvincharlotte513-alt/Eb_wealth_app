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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ETFOverlapAnalysisResult
import com.example.data.repository.ETFOverlapEngine
import com.example.ui.theme.*

@Composable
fun ETFOverlapScreen(
    selectedTickers: List<String>,
    overlapResult: ETFOverlapAnalysisResult,
    onToggleEtf: (String) -> Unit,
    onLearnMoreAboutOverlap: () -> Unit,
    onBack: () -> Unit
) {
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
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "ETF Overlap Checker",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                    Text(
                        text = "Identify hidden duplicate stock exposure across funds",
                        fontSize = 12.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        // ETF Selector Chips (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Select ETFs to compare:",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        ETFOverlapEngine.availableEtfs.forEach { etf ->
                            val isSelected = selectedTickers.contains(etf.ticker)
                            FilterChip(
                                selected = isSelected,
                                onClick = { onToggleEtf(etf.ticker) },
                                label = { Text(etf.ticker, fontWeight = FontWeight.Bold) },
                                leadingIcon = if (isSelected) {
                                    { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                } else null,
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(0xFF00F0FF),
                                    selectedLabelColor = Color(0xFF040B14),
                                    containerColor = Color(0x2200F0FF),
                                    labelColor = Color(0xFFCBD5E1)
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Comparing ${overlapResult.selectedEtfs.size} funds: ${overlapResult.selectedEtfs.joinToString { it.ticker }}",
                        fontSize = 12.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        // Overlap Detection Banner (Bank Standard)
        item {
            val hasOverlap = overlapResult.overlappingCompanies.isNotEmpty()
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xD90A1628)
                ),
                border = BorderStroke(
                    1.dp,
                    if (hasOverlap) Color(0xFFFBBF24).copy(alpha = 0.8f) else Color(0xFF34D399).copy(alpha = 0.8f)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            if (hasOverlap) Icons.Default.WarningAmber else Icons.Default.Verified,
                            contentDescription = null,
                            tint = if (hasOverlap) Color(0xFFFBBF24) else Color(0xFF34D399),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = if (hasOverlap) "DUPLICATION DETECTED" else "LOW DUPLICATION",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 15.sp,
                            color = if (hasOverlap) Color(0xFFFBBF24) else Color(0xFF34D399),
                            letterSpacing = 0.5.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = overlapResult.educationalInsight,
                        fontSize = 13.sp,
                        lineHeight = 19.sp,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Learn more about the ETF Overlap Trap in the Academy →",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF00F0FF),
                        modifier = Modifier.clickable { onLearnMoreAboutOverlap() }
                    )
                }
            }
        }

        // Overlapping holdings header
        item {
            Text(
                text = "Overlapping Company Holdings (${overlapResult.overlappingCompanies.size})",
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                color = Color.White
            )
        }

        // List of overlapping companies
        items(overlapResult.overlappingCompanies) { company ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = company.companyName,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Ticker: ${company.ticker} • Sector: ${company.sector}",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Surface(
                            color = Color(0x33FBBF24),
                            shape = RoundedCornerShape(4.dp),
                            border = BorderStroke(1.dp, Color(0x66FBBF24))
                        ) {
                            Text(
                                text = "${company.etfWeights.size} funds (${String.format("%.1f", company.combinedWeight)}%)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFFBBF24),
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
