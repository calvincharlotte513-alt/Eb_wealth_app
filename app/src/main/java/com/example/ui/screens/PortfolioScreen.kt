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
import com.example.data.model.HoldingEntity
import com.example.data.model.PortfolioSummary
import com.example.ui.theme.*

@Composable
fun PortfolioScreen(
    holdings: List<HoldingEntity>,
    portfolioSummary: PortfolioSummary,
    isRefreshingPrices: Boolean = false,
    lastRefreshTime: String = "Today, 10:00",
    onRefreshPrices: () -> Unit = {},
    onAddHolding: (name: String, ticker: String, type: String, shares: Double, avgPrice: Double, currentPrice: Double, account: String, geo: String, sector: String) -> Unit,
    onDeleteHolding: (HoldingEntity) -> Unit
) {
    var showAddDialog by remember { mutableStateOf(false) }
    var showRebalanceSimulator by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = Color.Transparent,
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Color(0xFF00F0FF),
                contentColor = Color(0xFF040B14),
                modifier = Modifier.testTag("add_holding_fab")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Holding")
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Transparent)
                .padding(innerPadding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Live Market Data Refresh Bar
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color(0x3310B981),
                            border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.5f))
                        ) {
                            Text(
                                text = "LSE LIVE FEED",
                                color = Color(0xFF34D399),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = lastRefreshTime,
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }

                    FilledTonalButton(
                        onClick = onRefreshPrices,
                        enabled = !isRefreshingPrices,
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = Color(0x3300F0FF),
                            contentColor = Color(0xFF00F0FF)
                        ),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        if (isRefreshingPrices) {
                            CircularProgressIndicator(modifier = Modifier.size(12.dp), strokeWidth = 2.dp, color = Color(0xFF00F0FF))
                        } else {
                            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp))
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Refresh Quotes", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            // Portfolio Summary Card (Bank Standard)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                    border = BorderStroke(1.dp, Color(0x3300F0FF))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "TOTAL PORTFOLIO VALUATION",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFBBF24),
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "£${String.format("%,.2f", portfolioSummary.totalValue)}",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(modifier = Modifier.fillMaxWidth()) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Total Cost Basis", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                Text("£${String.format("%,.2f", portfolioSummary.totalCost)}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Unrealized Return", fontSize = 11.sp, color = Color(0xFF94A3B8))
                                val isPos = portfolioSummary.totalGainLoss >= 0
                                Text(
                                    text = "${if (isPos) "+" else ""}£${String.format("%,.2f", portfolioSummary.totalGainLoss)} (${String.format("%.1f", portfolioSummary.totalGainLossPercentage)}%)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isPos) Color(0xFF34D399) else Color(0xFFF43F5E)
                                )
                            }
                        }
                    }
                }
            }

            // Allocation Breakdown Card (Bank Standard)
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
                            Text("Account & Geographic Allocation", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                            Text(
                                text = if (showRebalanceSimulator) "Hide Rebalance" else "Rebalance Tool →",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF00F0FF),
                                modifier = Modifier.clickable { showRebalanceSimulator = !showRebalanceSimulator }
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Account breakdown pills
                        Text("By UK Tax Vehicle:", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF94A3B8))
                        Spacer(modifier = Modifier.height(6.dp))
                        portfolioSummary.accountBreakdown.forEach { (account, value) ->
                            val pct = if (portfolioSummary.totalValue > 0) (value / portfolioSummary.totalValue) * 100 else 0.0
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(account, fontSize = 12.sp, color = Color.White)
                                Text("£${String.format("%,.0f", value)} (${String.format("%.1f", pct)}%)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF38BDF8))
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = Color(0x1FFFFFFF))
                        Spacer(modifier = Modifier.height(10.dp))

                        Text("By Geographic Exposure:", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF94A3B8))
                        Spacer(modifier = Modifier.height(6.dp))
                        portfolioSummary.geographicBreakdown.forEach { (geo, value) ->
                            val pct = if (portfolioSummary.totalValue > 0) (value / portfolioSummary.totalValue) * 100 else 0.0
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(geo, fontSize = 12.sp, color = Color.White)
                                Text("£${String.format("%,.0f", value)} (${String.format("%.1f", pct)}%)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFBBF24))
                            }
                        }

                        if (showRebalanceSimulator) {
                            Spacer(modifier = Modifier.height(14.dp))
                            HorizontalDivider(color = Color(0x1FFFFFFF))
                            Spacer(modifier = Modifier.height(12.dp))

                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Balance, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Tax-Smart Cash Flow Rebalancing", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Rebalance without triggering Capital Gains Tax by directing monthly contributions (£250/mo) into underweight assets.",
                                fontSize = 11.sp,
                                color = Color(0xFF94A3B8),
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            // Holdings List Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Holdings (${holdings.size})",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    TextButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color(0xFF00F0FF))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Asset", fontSize = 13.sp, color = Color(0xFF00F0FF), fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Holdings items (Bank Style)
            items(holdings) { holding ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
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
                                        color = if (holding.assetType == "ETF") Color(0x3300F0FF) else Color(0x3310B981),
                                        shape = RoundedCornerShape(4.dp),
                                        border = BorderStroke(1.dp, if (holding.assetType == "ETF") Color(0x6600F0FF) else Color(0x6610B981))
                                    ) {
                                        Text(
                                            text = holding.assetType,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (holding.assetType == "ETF") Color(0xFF00F0FF) else Color(0xFF34D399),
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Surface(
                                        color = Color(0x22FFFFFF),
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            text = holding.accountType,
                                            fontSize = 10.sp,
                                            color = Color(0xFFCBD5E1),
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                Text(
                                    text = holding.ticker,
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 16.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = holding.name,
                                    fontSize = 12.sp,
                                    color = Color(0xFF94A3B8),
                                    maxLines = 1
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "£${String.format("%,.2f", holding.currentValue)}",
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 16.sp,
                                    color = Color.White
                                )
                                val isPos = holding.gainLoss >= 0
                                Text(
                                    text = "${if (isPos) "+" else ""}£${String.format("%,.2f", holding.gainLoss)} (${String.format("%.1f", holding.gainLossPercentage)}%)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isPos) Color(0xFF34D399) else Color(0xFFF43F5E)
                                )
                            }
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0x1FFFFFFF))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${holding.shares} units @ avg £${String.format("%.2f", holding.avgPurchasePrice)} (Mkt: £${String.format("%.2f", holding.currentPrice)})",
                                fontSize = 11.sp,
                                color = Color(0xFF94A3B8)
                            )
                            IconButton(
                                onClick = { onDeleteHolding(holding) },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(
                                    Icons.Default.DeleteOutline,
                                    contentDescription = "Delete Holding",
                                    tint = Color(0xFFF43F5E),
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddHoldingDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { name, ticker, type, shares, avg, current, account, geo, sector ->
                onAddHolding(name, ticker, type, shares, avg, current, account, geo, sector)
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun AddHoldingDialog(
    onDismiss: () -> Unit,
    onConfirm: (name: String, ticker: String, type: String, shares: Double, avg: Double, current: Double, account: String, geo: String, sector: String) -> Unit
) {
    var name by remember { mutableStateOf("Vanguard S&P 500 UCITS ETF") }
    var ticker by remember { mutableStateOf("VUAG") }
    var assetType by remember { mutableStateOf("ETF") }
    var sharesStr by remember { mutableStateOf("15.0") }
    var avgPriceStr by remember { mutableStateOf("82.50") }
    var currentPriceStr by remember { mutableStateOf("86.15") }
    var accountType by remember { mutableStateOf("Stocks & Shares ISA") }
    var geography by remember { mutableStateOf("US") }
    var sector by remember { mutableStateOf("Diversified") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Add Portfolio Investment", fontWeight = FontWeight.Bold, color = Color.White)
        },
        containerColor = Color(0xFF0A1628),
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = ticker,
                    onValueChange = { ticker = it },
                    label = { Text("Ticker (e.g. VUAG, VWRP, SHEL)", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    )
                )
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Asset Name", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    )
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = sharesStr,
                        onValueChange = { sharesStr = it },
                        label = { Text("Units / Shares", color = Color(0xFF94A3B8)) },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF00F0FF),
                            unfocusedBorderColor = Color(0x3300F0FF)
                        )
                    )
                    OutlinedTextField(
                        value = avgPriceStr,
                        onValueChange = { avgPriceStr = it },
                        label = { Text("Avg Buy Price (£)", color = Color(0xFF94A3B8)) },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF00F0FF),
                            unfocusedBorderColor = Color(0x3300F0FF)
                        )
                    )
                }
                OutlinedTextField(
                    value = currentPriceStr,
                    onValueChange = { currentPriceStr = it },
                    label = { Text("Current Mkt Price (£)", color = Color(0xFF94A3B8)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    )
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val s = sharesStr.toDoubleOrNull() ?: 1.0
                    val a = avgPriceStr.toDoubleOrNull() ?: 50.0
                    val c = currentPriceStr.toDoubleOrNull() ?: a
                    onConfirm(name, ticker.uppercase(), assetType, s, a, c, accountType, geography, sector)
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF))
            ) {
                Text("Confirm", color = Color(0xFF040B14), fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = Color(0xFF94A3B8))
            }
        }
    )
}
